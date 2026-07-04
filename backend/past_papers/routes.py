"""Past-paper question bank API.

Admin-uploaded questions used to enrich the worksheet builder. No auth is
enforced yet: the app currently runs in demo mode with an open admin surface.
If you need to lock this down, add a dependency on `require_admin` from
`auth.deps` to the mutation endpoints.
"""

from __future__ import annotations

import json
import os
import re
import tempfile
import uuid
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional

from dotenv import load_dotenv
from fastapi import APIRouter, File, HTTPException, Query, Request, Response, UploadFile, status
from pydantic import BaseModel, ConfigDict, Field

from .topics import normalize_topic

load_dotenv()


router = APIRouter(prefix="/past-papers", tags=["past-papers"])


ANSWER_TYPES = {"Multiple choice", "Typed response", "Exam style"}
DIFFICULTIES = {"Easy", "Medium", "Exam level", "Hard"}


class PastPaperIn(BaseModel):
    """Payload accepted from the admin UI."""

    model_config = ConfigDict(extra="ignore")

    subject: str
    topic: str
    difficulty: str = "Medium"
    answerType: str = "Multiple choice"
    q: str
    year: Optional[int] = None
    board: Optional[str] = None
    marks: Optional[int] = None
    link: Optional[str] = None  # optional URL reference (source paper, syllabus, video, etc.)
    addedBy: Optional[str] = None  # admin account identifier ("demo", email, etc.)
    # MCQ
    options: Optional[List[str]] = None
    a: Optional[int] = None
    # Typed
    typedAnswer: Optional[str] = None
    typedAliases: Optional[List[str]] = None
    # Exam-style
    examAnswer: Optional[str] = None
    examKeywords: Optional[List[str]] = None


class PastPaper(PastPaperIn):
    id: str = Field(default_factory=lambda: f"pp_{uuid.uuid4().hex[:12]}")
    addedAt: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    source: str = "past-paper"


def _validate(payload: PastPaperIn) -> None:
    if payload.answerType not in ANSWER_TYPES:
        raise HTTPException(status_code=422, detail=f"answerType must be one of {sorted(ANSWER_TYPES)}")
    if payload.difficulty not in DIFFICULTIES:
        raise HTTPException(status_code=422, detail=f"difficulty must be one of {sorted(DIFFICULTIES)}")
    if not payload.subject.strip():
        raise HTTPException(status_code=422, detail="subject is required")
    if not payload.topic.strip():
        raise HTTPException(status_code=422, detail="topic is required")
    if not payload.q.strip():
        raise HTTPException(status_code=422, detail="question text is required")
    if payload.answerType == "Multiple choice":
        opts = payload.options or []
        if len([o for o in opts if o and o.strip()]) < 2:
            raise HTTPException(status_code=422, detail="MCQ needs at least two non-empty options")
        if payload.a is None or payload.a < 0 or payload.a >= len(opts):
            raise HTTPException(status_code=422, detail="`a` must be a valid index into `options`")
        if not (opts[payload.a] or "").strip():
            raise HTTPException(status_code=422, detail="the correct option must have text")
    elif payload.answerType == "Typed response":
        if not (payload.typedAnswer or "").strip():
            raise HTTPException(status_code=422, detail="typedAnswer is required for typed response")
    elif payload.answerType == "Exam style":
        if not (payload.examAnswer or "").strip():
            raise HTTPException(status_code=422, detail="examAnswer is required for exam-style")


@router.post("", response_model=PastPaper, status_code=status.HTTP_201_CREATED)
async def create_past_paper(payload: PastPaperIn, request: Request) -> PastPaper:
    _validate(payload)
    doc = PastPaper(**payload.model_dump()).model_dump()
    await request.app.state.db.past_papers.insert_one({**doc, "_id": doc["id"]})
    return PastPaper(**doc)


@router.get("", response_model=List[PastPaper])
async def list_past_papers(
    request: Request,
    subject: Optional[str] = Query(None),
    topic: Optional[str] = Query(None),
    answerType: Optional[str] = Query(None),
    board: Optional[str] = Query(None),
    addedBy: Optional[str] = Query(None),
    limit: int = Query(500, ge=1, le=2000),
) -> List[Dict[str, Any]]:
    query: Dict[str, Any] = {}
    if subject:
        query["subject"] = subject
    if topic:
        query["topic"] = topic
    if answerType:
        query["answerType"] = answerType
    if board:
        query["board"] = board
    if addedBy:
        query["addedBy"] = addedBy
    cursor = request.app.state.db.past_papers.find(query, {"_id": 0}).sort("addedAt", -1).limit(limit)
    return [doc async for doc in cursor]


@router.delete("/{pp_id}")
async def delete_past_paper(pp_id: str, request: Request) -> Response:
    result = await request.app.state.db.past_papers.delete_one({"id": pp_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Past-paper question not found")
    return Response(status_code=204)


# ---------------------------------------------------------------------------
# Bulk PDF extraction using an LLM (Gemini via emergentintegrations)
# ---------------------------------------------------------------------------

_EXTRACTION_SYSTEM_PROMPT = """You are an expert exam-paper parser. You extract structured questions from a past-paper PDF.

Return ONLY a raw JSON object, no prose, no code fences, matching this exact schema:
{
  "questions": [
    {
      "q": "string, the question text as it appears (drop question numbers like 'Q1.')",
      "answerType": "Multiple choice" | "Typed response" | "Exam style",
      "difficulty": "Easy" | "Medium" | "Exam level" | "Hard",
      "marks": integer or null,
      "topic": "string, a short topic label for this question or null",
      "options": ["A", "B", "C", "D"] | null,   // only for Multiple choice
      "a": 0 | null,                            // zero-based correct index, only for Multiple choice
      "typedAnswer": "string or null",          // only for Typed response
      "examAnswer": "string or null",           // only for Exam style
      "examKeywords": ["kw1","kw2"] | null      // only for Exam style
    }
  ]
}

Guidelines:
- If a question is worth multiple marks or asks for explanation, tag it "Exam style".
- If it expects a short symbolic / numeric / single-word answer, tag it "Typed response".
- If the paper provides multiple options (A B C D), tag it "Multiple choice" and set the correct index if available.
- Only include questions that are clearly complete. Skip diagrams-only questions and instructions.
- Never invent options or answers you can't see. Set unknown fields to null.
- Do not include markdown or commentary."""


def _extract_json_object(text: str) -> Dict[str, Any]:
    """Best-effort extraction of a JSON object from an LLM response."""
    if not text:
        raise HTTPException(status_code=502, detail="LLM returned an empty response")
    # Strip common wrappers
    stripped = text.strip()
    stripped = re.sub(r"^```(?:json)?", "", stripped).strip()
    stripped = re.sub(r"```$", "", stripped).strip()
    try:
        return json.loads(stripped)
    except json.JSONDecodeError:
        pass
    # Fall back to finding the first {...} block.
    match = re.search(r"\{[\s\S]*\}", stripped)
    if not match:
        raise HTTPException(status_code=502, detail="Could not parse JSON from LLM output")
    try:
        return json.loads(match.group(0))
    except json.JSONDecodeError as exc:
        raise HTTPException(status_code=502, detail=f"LLM produced invalid JSON: {exc}") from exc


_ALLOWED_ANSWER_TYPES = ANSWER_TYPES
_ALLOWED_DIFFICULTIES = DIFFICULTIES


def _sanitize_extracted(raw: Dict[str, Any], defaults: Dict[str, Any]) -> List[Dict[str, Any]]:
    items = raw.get("questions") if isinstance(raw, dict) else None
    if not isinstance(items, list):
        raise HTTPException(status_code=502, detail="LLM output missing 'questions' array")
    subject_default = defaults.get("subject", "") or ""
    out: List[Dict[str, Any]] = []
    for item in items:
        if not isinstance(item, dict):
            continue
        q_text = (item.get("q") or "").strip()
        if not q_text:
            continue
        answer_type = item.get("answerType") if item.get("answerType") in _ALLOWED_ANSWER_TYPES else "Multiple choice"
        difficulty = item.get("difficulty") if item.get("difficulty") in _ALLOWED_DIFFICULTIES else defaults.get("difficulty", "Medium")
        subject = subject_default or (item.get("subject") or "")
        # Snap LLM-proposed topic to the closest canonical topic for the subject.
        raw_topic = (item.get("topic") or "").strip() or defaults.get("topic")
        normalized_topic = normalize_topic(subject, raw_topic) or raw_topic or (defaults.get("topic") or "")
        cleaned: Dict[str, Any] = {
            "q": q_text,
            "answerType": answer_type,
            "difficulty": difficulty,
            "subject": subject,
            "topic": normalized_topic or "",
            "year": defaults.get("year"),
            "board": defaults.get("board"),
            "marks": item.get("marks") if isinstance(item.get("marks"), int) else None,
            "link": defaults.get("link"),
            "addedBy": defaults.get("addedBy"),
        }
        if answer_type == "Multiple choice":
            opts = item.get("options") or []
            if isinstance(opts, list):
                cleaned["options"] = [str(o) for o in opts]
                a = item.get("a")
                cleaned["a"] = a if isinstance(a, int) and 0 <= a < len(cleaned["options"]) else 0
        elif answer_type == "Typed response":
            cleaned["typedAnswer"] = (item.get("typedAnswer") or "").strip() or None
            cleaned["typedAliases"] = []
        elif answer_type == "Exam style":
            cleaned["examAnswer"] = (item.get("examAnswer") or "").strip() or None
            kws = item.get("examKeywords") or []
            cleaned["examKeywords"] = [str(k).strip() for k in kws if str(k).strip()] if isinstance(kws, list) else []
        out.append(cleaned)
    return out


@router.post("/extract")
async def extract_past_papers_from_pdf(
    request: Request,
    file: UploadFile = File(...),
    subject: str = Query(""),
    topic: str = Query(""),
    year: Optional[int] = Query(None),
    board: Optional[str] = Query(None),
    difficulty: str = Query("Medium"),
    link: Optional[str] = Query(None),
    addedBy: Optional[str] = Query(None),
    autosave: bool = Query(False),
) -> Dict[str, Any]:
    """Accept a PDF past paper, run it through an LLM, and return a list of
    extracted question dicts. When `autosave=true`, the extracted questions are
    also persisted to the database immediately (skipping the admin review step).
    """
    if not file.filename or not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=422, detail="Only PDF uploads are supported")

    api_key = os.environ.get("EMERGENT_LLM_KEY")
    if not api_key:
        raise HTTPException(status_code=503, detail="LLM key not configured on the server")

    # Persist upload to a temp file — the emergentintegrations Gemini client reads
    # from a file path.
    contents = await file.read()
    if not contents:
        raise HTTPException(status_code=422, detail="Uploaded PDF is empty")

    try:
        # Import locally so a missing library doesn't take down the whole router.
        from emergentintegrations.llm.chat import LlmChat, UserMessage, FileContentWithMimeType
    except Exception as exc:  # pragma: no cover
        raise HTTPException(status_code=503, detail=f"LLM library unavailable: {exc}") from exc

    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tf:
        tf.write(contents)
        tmp_path = tf.name

    try:
        chat = (
            LlmChat(
                api_key=api_key,
                session_id=f"pp-extract-{uuid.uuid4().hex[:12]}",
                system_message=_EXTRACTION_SYSTEM_PROMPT,
            )
            .with_model("gemini", "gemini-2.5-flash")
        )
        pdf_file = FileContentWithMimeType(file_path=tmp_path, mime_type="application/pdf")
        user_prompt = (
            "Extract every clearly-complete past-paper question from the attached PDF and "
            "return the JSON described in the system prompt. If the paper looks like it belongs "
            f"to the subject '{subject or 'unknown'}', tag topics accordingly. Return JSON only."
        )
        response_text = await chat.send_message(UserMessage(text=user_prompt, file_contents=[pdf_file]))
        parsed = _extract_json_object(response_text or "")
        defaults = {
            "subject": subject,
            "topic": topic,
            "year": year,
            "board": board,
            "difficulty": difficulty if difficulty in _ALLOWED_DIFFICULTIES else "Medium",
            "link": link,
            "addedBy": addedBy or "demo",
        }
        questions = _sanitize_extracted(parsed, defaults)

        saved: List[Dict[str, Any]] = []
        if autosave and questions:
            db = request.app.state.db
            for q in questions:
                # Skip drafts that clearly won't pass MCQ/typed/exam requirements.
                if q["answerType"] == "Multiple choice" and (not q.get("options") or not any((o or "").strip() for o in q["options"])):
                    continue
                if q["answerType"] == "Typed response" and not q.get("typedAnswer"):
                    continue
                if q["answerType"] == "Exam style" and not q.get("examAnswer"):
                    # Backfill examAnswer with the question text so the admin still has something to edit.
                    q["examAnswer"] = q.get("examAnswer") or q["q"]
                doc = PastPaper(**q).model_dump()
                await db.past_papers.insert_one({**doc, "_id": doc["id"]})
                saved.append(doc)

        return {
            "questions": questions,
            "count": len(questions),
            "saved": saved,
            "savedCount": len(saved),
            "autosaved": bool(autosave),
        }
    finally:
        try:
            os.unlink(tmp_path)
        except OSError:
            pass
