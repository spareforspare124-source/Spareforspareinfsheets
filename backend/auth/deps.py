"""FastAPI dependencies for auth and role gating."""
from bson import ObjectId
from bson.errors import InvalidId
from fastapi import HTTPException, Request

from .security import decode_token
import jwt


def _get_db(request: Request):
    return request.app.state.db


async def get_current_user(request: Request) -> dict:
    token = request.cookies.get("access_token")
    if not token:
        auth_header = request.headers.get("Authorization", "")
        if auth_header.startswith("Bearer "):
            token = auth_header[7:]
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = decode_token(token)
        if payload.get("type") != "access":
            raise HTTPException(status_code=401, detail="Invalid token type")
        db = _get_db(request)
        try:
            obj_id = ObjectId(payload["sub"])
        except (InvalidId, KeyError):
            raise HTTPException(status_code=401, detail="Invalid token")
        user = await db.users.find_one({"_id": obj_id})
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        user["_id"] = str(user["_id"])
        user.pop("password_hash", None)
        return user
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")


async def require_admin(request: Request) -> dict:
    user = await get_current_user(request)
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return user
