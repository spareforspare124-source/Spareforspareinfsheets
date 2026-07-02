from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

import os
import logging
import uuid
from datetime import datetime, timezone
from typing import List, Dict, Any

from fastapi import FastAPI, APIRouter
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field, ConfigDict

from auth.routes import router as auth_router
from auth.seed import create_indexes, seed_admin, write_test_credentials


# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Expose the DB on app state so route deps can pull it
app.state.db = db

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")

    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class StatusCheckCreate(BaseModel):
    client_name: str


@api_router.get("/")
async def root() -> Dict[str, str]:
    return {"message": "Hello World"}


@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate) -> StatusCheck:
    status_dict = input.model_dump()
    status_obj = StatusCheck(**status_dict)
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    _ = await db.status_checks.insert_one(doc)
    return status_obj


@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks() -> List[Dict[str, Any]]:
    status_checks: List[Dict[str, Any]] = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    return status_checks


# Mount auth routes under /api
api_router.include_router(auth_router)

# Include the router in the main app
app.include_router(api_router)


# CORS — allow specific frontend origins. Using regex to cover the preview domain pattern
# (the exact preview subdomain changes across sessions), plus localhost for dev.
_cors_env = os.environ.get('CORS_ORIGINS', '').strip()
_frontend_url = os.environ.get('FRONTEND_URL', '').strip()
_explicit = [o.strip() for o in _cors_env.split(',') if o.strip() and o.strip() != '*']
if _frontend_url and _frontend_url not in _explicit:
    _explicit.append(_frontend_url)
if not _explicit:
    _explicit = ["http://localhost:3000"]

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=_explicit,
    allow_origin_regex=r"https://.*\.preview\.emergentagent\.com",
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)


logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


@app.on_event("startup")
async def _startup() -> None:
    try:
        await create_indexes(db)
        await seed_admin(db)
        write_test_credentials(
            os.environ.get("ADMIN_EMAIL", "admin@infinitysheets.com"),
            os.environ.get("ADMIN_PASSWORD", "admin123"),
        )
        logger.info("Auth startup complete: indexes ready, admin seeded, test credentials written")
    except Exception as e:
        logger.exception("Auth startup failed: %s", e)


@app.on_event("shutdown")
async def shutdown_db_client() -> None:
    client.close()
