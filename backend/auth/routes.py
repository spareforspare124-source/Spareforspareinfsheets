"""Auth endpoints: register, login, logout, me, refresh."""
from datetime import datetime, timezone, timedelta
from typing import Dict, Any

from bson import ObjectId
from fastapi import APIRouter, HTTPException, Request, Response, Depends

from .deps import get_current_user
from .models import LoginInput, RegisterInput, UserOut
from .security import (
    create_access_token,
    create_refresh_token,
    decode_token,
    hash_password,
    verify_password,
)

router = APIRouter(prefix="/auth")

ACCESS_MAX_AGE = 60 * 60  # 60 min
REFRESH_MAX_AGE = 60 * 60 * 24 * 7  # 7 days
LOCKOUT_ATTEMPTS = 5
LOCKOUT_MINUTES = 15


def _set_auth_cookies(response: Response, access_token: str, refresh_token: str) -> None:
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        secure=True,
        samesite="none",
        max_age=ACCESS_MAX_AGE,
        path="/",
    )
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        secure=True,
        samesite="none",
        max_age=REFRESH_MAX_AGE,
        path="/",
    )


def _user_dict(doc: Dict[str, Any]) -> Dict[str, Any]:
    return {
        "id": str(doc["_id"]),
        "email": doc.get("email"),
        "name": doc.get("name"),
        "role": doc.get("role", "user"),
        "created_at": doc.get("created_at"),
    }


async def _is_locked_out(db, identifier: str) -> bool:
    rec = await db.login_attempts.find_one({"identifier": identifier})
    if not rec:
        return False
    if rec.get("locked_until") and rec["locked_until"] > datetime.now(timezone.utc):
        return True
    return False


async def _record_failure(db, identifier: str) -> None:
    now = datetime.now(timezone.utc)
    rec = await db.login_attempts.find_one({"identifier": identifier})
    attempts = (rec.get("attempts", 0) if rec else 0) + 1
    update: Dict[str, Any] = {"attempts": attempts, "last_attempt": now}
    if attempts >= LOCKOUT_ATTEMPTS:
        update["locked_until"] = now + timedelta(minutes=LOCKOUT_MINUTES)
    await db.login_attempts.update_one({"identifier": identifier}, {"$set": update}, upsert=True)


async def _clear_failures(db, identifier: str) -> None:
    await db.login_attempts.delete_one({"identifier": identifier})


@router.post("/register", response_model=UserOut)
async def register(payload: RegisterInput, request: Request, response: Response) -> Dict[str, Any]:
    db = request.app.state.db
    email = payload.email.lower().strip()
    existing = await db.users.find_one({"email": email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    now = datetime.now(timezone.utc)
    doc = {
        "email": email,
        "password_hash": hash_password(payload.password),
        "name": (payload.name or email.split("@")[0]).strip(),
        "role": "user",
        "created_at": now,
    }
    result = await db.users.insert_one(doc)
    user_id = str(result.inserted_id)
    access = create_access_token(user_id, email)
    refresh = create_refresh_token(user_id)
    _set_auth_cookies(response, access, refresh)
    doc["_id"] = result.inserted_id
    return _user_dict(doc)


@router.post("/login", response_model=UserOut)
async def login(payload: LoginInput, request: Request, response: Response) -> Dict[str, Any]:
    db = request.app.state.db
    email = payload.email.lower().strip()
    ip = request.client.host if request.client else "unknown"
    identifier = f"{ip}:{email}"

    if await _is_locked_out(db, identifier):
        raise HTTPException(status_code=429, detail="Too many attempts. Try again in 15 minutes.")

    user = await db.users.find_one({"email": email})
    if not user or not verify_password(payload.password, user["password_hash"]):
        await _record_failure(db, identifier)
        raise HTTPException(status_code=401, detail="Invalid email or password")

    await _clear_failures(db, identifier)
    user_id = str(user["_id"])
    access = create_access_token(user_id, email)
    refresh = create_refresh_token(user_id)
    _set_auth_cookies(response, access, refresh)
    return _user_dict(user)


@router.post("/logout")
async def logout(response: Response) -> Dict[str, str]:
    response.delete_cookie("access_token", path="/", samesite="none", secure=True)
    response.delete_cookie("refresh_token", path="/", samesite="none", secure=True)
    return {"status": "logged_out"}


@router.get("/me", response_model=UserOut)
async def me(current_user: dict = Depends(get_current_user)) -> Dict[str, Any]:
    return {
        "id": current_user["_id"],
        "email": current_user.get("email"),
        "name": current_user.get("name"),
        "role": current_user.get("role", "user"),
        "created_at": current_user.get("created_at"),
    }


@router.post("/refresh")
async def refresh(request: Request, response: Response) -> Dict[str, str]:
    token = request.cookies.get("refresh_token")
    if not token:
        raise HTTPException(status_code=401, detail="No refresh token")
    try:
        payload = decode_token(token)
        if payload.get("type") != "refresh":
            raise HTTPException(status_code=401, detail="Invalid token type")
        db = request.app.state.db
        user = await db.users.find_one({"_id": ObjectId(payload["sub"])})
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        access = create_access_token(str(user["_id"]), user["email"])
        response.set_cookie(
            key="access_token",
            value=access,
            httponly=True,
            secure=True,
            samesite="none",
            max_age=ACCESS_MAX_AGE,
            path="/",
        )
        return {"status": "refreshed"}
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid refresh token")
