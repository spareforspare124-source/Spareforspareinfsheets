"""Startup helpers: seed admin, create indexes, write test_credentials.md."""
import os
from datetime import datetime, timezone
from pathlib import Path

from .security import hash_password, verify_password


async def create_indexes(db) -> None:
    await db.users.create_index("email", unique=True)
    await db.login_attempts.create_index("identifier")
    await db.password_reset_tokens.create_index("expires_at", expireAfterSeconds=0)


async def seed_admin(db) -> None:
    admin_email = os.environ.get("ADMIN_EMAIL", "admin@infinitysheets.com").lower().strip()
    admin_password = os.environ.get("ADMIN_PASSWORD", "admin123")
    existing = await db.users.find_one({"email": admin_email})
    if existing is None:
        await db.users.insert_one(
            {
                "email": admin_email,
                "password_hash": hash_password(admin_password),
                "name": "Admin",
                "role": "admin",
                "created_at": datetime.now(timezone.utc),
            }
        )
    else:
        needs_update = False
        # Refresh hash if password changed in env
        if not verify_password(admin_password, existing["password_hash"]):
            needs_update = True
        # Ensure role stays admin
        if existing.get("role") != "admin":
            needs_update = True
        if needs_update:
            await db.users.update_one(
                {"email": admin_email},
                {
                    "$set": {
                        "password_hash": hash_password(admin_password),
                        "role": "admin",
                    }
                },
            )


def write_test_credentials(admin_email: str, admin_password: str) -> None:
    memory_dir = Path("/app/memory")
    memory_dir.mkdir(parents=True, exist_ok=True)
    content = f"""# Test Credentials

## Admin (pre-seeded on backend startup)
- **email**: {admin_email}
- **password**: {admin_password}
- **role**: admin

## Auth endpoints
- POST /api/auth/register     → register new user (returns UserOut, sets cookies)
- POST /api/auth/login        → login (returns UserOut, sets cookies)
- POST /api/auth/logout       → clears auth cookies
- GET  /api/auth/me           → current user (requires access_token cookie or Bearer)
- POST /api/auth/refresh      → refresh access token from refresh_token cookie

## Notes
- Cookies are httpOnly, Secure, SameSite=None (required because frontend and backend live on different Kubernetes hosts).
- Frontend calls MUST use `credentials: 'include'` (fetch) or `withCredentials: true` (axios).
- Brute-force protection: 5 failed attempts per IP+email → 15 minute lockout.
"""
    (memory_dir / "test_credentials.md").write_text(content, encoding="utf-8")
