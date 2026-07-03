"""Past-paper question bank API.

Admin-uploaded questions used to enrich the worksheet builder. No auth is
enforced yet: the app currently runs in demo mode with an open admin surface.
If you need to lock this down, add a dependency on `require_admin` from
`auth.deps` to the mutation endpoints.
"""

from __future__ import annotations

import uuid
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional

from fastapi import APIRouter, HTTPException, Query, Request, Response, status
from pydantic import BaseModel, ConfigDict, Field


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
    limit: int = Query(500, ge=1, le=2000),
) -> List[Dict[str, Any]]:
    query: Dict[str, Any] = {}
    if subject:
        query["subject"] = subject
    if topic:
        query["topic"] = topic
    if answerType:
        query["answerType"] = answerType
    cursor = request.app.state.db.past_papers.find(query, {"_id": 0}).sort("addedAt", -1).limit(limit)
    return [doc async for doc in cursor]


@router.delete("/{pp_id}")
async def delete_past_paper(pp_id: str, request: Request) -> Response:
    result = await request.app.state.db.past_papers.delete_one({"id": pp_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Past-paper question not found")
    return Response(status_code=204)
