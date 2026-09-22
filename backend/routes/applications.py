from fastapi import APIRouter, HTTPException, Depends, BackgroundTasks
from models.schemas import ApplicationCreate
from utils.auth import require_admin
from utils.notifications import send_admission_notification
from database import db
import uuid
from datetime import datetime, timezone

router = APIRouter(prefix="/applications", tags=["Applications"])


@router.post("")
async def submit_application(application: ApplicationCreate):
    app_dict = application.model_dump()
    app_dict["id"] = str(uuid.uuid4())
    app_dict["application_number"] = f"APP{datetime.now().year}{str(uuid.uuid4())[:6].upper()}"
    app_dict["status"] = "pending"
    app_dict["created_at"] = datetime.now(timezone.utc).isoformat()

    await db.applications.insert_one(app_dict)
    return {
        "message": "Application submitted successfully",
        "application_number": app_dict["application_number"]
    }


@router.get("")
async def get_applications(current_user: dict = Depends(require_admin)):
    applications = await db.applications.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    return applications


@router.get("/{app_id}")
async def get_application(app_id: str, current_user: dict = Depends(require_admin)):
    application = await db.applications.find_one({"id": app_id}, {"_id": 0})
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    return application


@router.put("/{app_id}/status")
async def update_application_status(
    app_id: str,
    status: str,
    background_tasks: BackgroundTasks,
    current_user: dict = Depends(require_admin)
):
    if status not in ["pending", "approved", "rejected"]:
        raise HTTPException(status_code=400, detail="Invalid status")

    application = await db.applications.find_one({"id": app_id}, {"_id": 0})
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")

    await db.applications.update_one({"id": app_id}, {"$set": {"status": status}})

    if status in ["approved", "rejected"]:
        background_tasks.add_task(send_admission_notification, application, status)

    return {"message": f"Application status updated to {status}"}


@router.get("/check/{application_number}")
async def check_application_status(application_number: str):
    application = await db.applications.find_one(
        {"application_number": application_number},
        {"_id": 0, "application_number": 1, "status": 1, "full_name": 1, "class_applying_for": 1}
    )
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    return application
