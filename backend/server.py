from fastapi import FastAPI, APIRouter
from starlette.middleware.cors import CORSMiddleware
import os
import logging
from pathlib import Path
from dotenv import load_dotenv

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

from database import db, client
from utils.auth import hash_password
from routes.auth import router as auth_router
from routes.students import router as students_router
from routes.results import router as results_router
from routes.content import router as content_router
from routes.applications import router as applications_router
from routes.payments import router as payments_router
from routes.contact import router as contact_router
from routes.admin import router as admin_router
from routes.teachers import router as teachers_router

import uuid
from datetime import datetime, timezone

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

app = FastAPI(title="God's Lifting International School API")

api_router = APIRouter(prefix="/api")

# Include all route modules
api_router.include_router(auth_router)
api_router.include_router(students_router)
api_router.include_router(results_router)
api_router.include_router(content_router)
api_router.include_router(applications_router)
api_router.include_router(payments_router)
api_router.include_router(contact_router)
api_router.include_router(admin_router)
api_router.include_router(teachers_router)


@api_router.get("/")
async def root():
    return {"message": "God's Lifting International School API", "status": "running"}


@api_router.get("/health")
async def health_check():
    return {"status": "healthy"}


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def seed_admin():
    existing = await db.users.find_one({"email": "godsliftinginternational23@gmail.com"})
    if not existing:
        admin_user = {
            "id": str(uuid.uuid4()),
            "email": "godsliftinginternational23@gmail.com",
            "full_name": "School Admin",
            "phone": "08034494498",
            "role": "admin",
            "password": hash_password("GodsLifting2023!"),
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        await db.users.insert_one(admin_user)
        logger.info("Default admin account created")


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
