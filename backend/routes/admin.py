from fastapi import APIRouter, HTTPException, Depends, UploadFile, File
from utils.auth import require_admin
from utils.notifications import send_sms, send_email
from database import db
from config import SCHOOL_BANK_NAME, SCHOOL_ACCOUNT_NUMBER, SCHOOL_ACCOUNT_NAME
import uuid
import base64
from datetime import datetime, timezone

router = APIRouter(tags=["Admin"])


@router.get("/bank-details")
async def get_bank_details():
    return {
        "bank_name": SCHOOL_BANK_NAME,
        "account_number": SCHOOL_ACCOUNT_NUMBER,
        "account_name": SCHOOL_ACCOUNT_NAME,
        "instructions": "Please use your Student ID as payment reference. After payment, submit the bank teller/receipt to the school office or upload proof of payment."
    }


@router.get("/stats")
async def get_dashboard_stats(current_user: dict = Depends(require_admin)):
    students_count = await db.students.count_documents({})
    applications_count = await db.applications.count_documents({})
    pending_applications = await db.applications.count_documents({"status": "pending"})
    payments_total = await db.payments.count_documents({"status": "completed"})
    unread_messages = await db.contact_messages.count_documents({"read": False})
    teachers_count = await db.users.count_documents({"role": "teacher"})

    return {
        "total_students": students_count,
        "total_applications": applications_count,
        "pending_applications": pending_applications,
        "completed_payments": payments_total,
        "unread_messages": unread_messages,
        "total_teachers": teachers_count
    }


@router.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        encoded = base64.b64encode(contents).decode('utf-8')
        file_id = str(uuid.uuid4())

        file_doc = {
            "id": file_id,
            "filename": file.filename,
            "content_type": file.content_type,
            "data": encoded,
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        await db.files.insert_one(file_doc)

        return {
            "message": "File uploaded successfully",
            "file_id": file_id,
            "filename": file.filename
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/files/{file_id}")
async def get_file(file_id: str):
    file_doc = await db.files.find_one({"id": file_id}, {"_id": 0})
    if not file_doc:
        raise HTTPException(status_code=404, detail="File not found")
    return file_doc


@router.post("/test/sms")
async def test_sms(phone: str, message: str, current_user: dict = Depends(require_admin)):
    result = await send_sms(phone, message)
    return {"success": result, "message": "SMS test completed"}


@router.post("/test/email")
async def test_email(to: str, subject: str, body: str, current_user: dict = Depends(require_admin)):
    result = await send_email(to, subject, f"<p>{body}</p>")
    return {"success": result, "message": "Email test completed"}
