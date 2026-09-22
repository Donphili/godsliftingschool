from fastapi import APIRouter, HTTPException, Depends, BackgroundTasks
from models.schemas import ResultCreate, ResultPaymentRequest
from utils.auth import require_admin, require_teacher_or_admin
from utils.notifications import send_sms, send_email
from database import db
import uuid
from datetime import datetime, timezone

router = APIRouter(prefix="/results", tags=["Results"])


@router.post("")
async def create_result(result: ResultCreate, current_user: dict = Depends(require_teacher_or_admin)):
    result_dict = result.model_dump()
    result_dict["id"] = str(uuid.uuid4())
    result_dict["created_at"] = datetime.now(timezone.utc).isoformat()
    result_dict["teacher_id"] = current_user["id"]

    for subject in result_dict["subjects"]:
        total = subject.get("ca_score", 0) + subject.get("exam_score", 0)
        subject["total"] = total
        if total >= 70:
            subject["grade"] = "A"
        elif total >= 60:
            subject["grade"] = "B"
        elif total >= 50:
            subject["grade"] = "C"
        elif total >= 40:
            subject["grade"] = "D"
        else:
            subject["grade"] = "F"

    await db.results.insert_one(result_dict)
    return {"message": "Result uploaded successfully", "id": result_dict["id"]}


@router.get("/student/{student_id}")
async def get_student_results(student_id: str):
    results = await db.results.find({"student_id": student_id}, {"_id": 0}).to_list(100)
    for result in results:
        access = await db.result_access.find_one({
            "student_id": student_id,
            "session": result["session"],
            "term": result["term"],
            "status": "approved"
        })
        result["download_unlocked"] = access is not None
    return results


@router.get("")
async def get_all_results(current_user: dict = Depends(require_teacher_or_admin)):
    results = await db.results.find({}, {"_id": 0}).to_list(1000)
    return results


@router.delete("/{result_id}")
async def delete_result(result_id: str, current_user: dict = Depends(require_admin)):
    result = await db.results.delete_one({"id": result_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Result not found")
    return {"message": "Result deleted successfully"}


@router.post("/request-access")
async def request_result_access(request: ResultPaymentRequest):
    result = await db.results.find_one({
        "student_id": request.student_id,
        "session": request.session,
        "term": request.term
    })
    if not result:
        raise HTTPException(status_code=404, detail="Result not found")

    existing = await db.result_access.find_one({
        "student_id": request.student_id,
        "session": request.session,
        "term": request.term
    })
    if existing:
        return {
            "message": "Access already requested",
            "status": existing.get("status", "pending"),
            "request_id": existing["id"]
        }

    access_dict = request.model_dump()
    access_dict["id"] = str(uuid.uuid4())
    access_dict["status"] = "pending"
    access_dict["created_at"] = datetime.now(timezone.utc).isoformat()

    await db.result_access.insert_one(access_dict)
    return {
        "message": "Payment submitted for verification. You will be notified once approved.",
        "request_id": access_dict["id"]
    }


@router.get("/access-requests")
async def get_result_access_requests(current_user: dict = Depends(require_admin)):
    requests_list = await db.result_access.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    return requests_list


@router.put("/access/{request_id}/approve")
async def approve_result_access(
    request_id: str,
    background_tasks: BackgroundTasks,
    current_user: dict = Depends(require_admin)
):
    access_request = await db.result_access.find_one({"id": request_id}, {"_id": 0})
    if not access_request:
        raise HTTPException(status_code=404, detail="Request not found")

    await db.result_access.update_one(
        {"id": request_id},
        {"$set": {"status": "approved", "approved_by": current_user["id"], "approved_at": datetime.now(timezone.utc).isoformat()}}
    )

    student = await db.students.find_one({"student_id": access_request["student_id"]}, {"_id": 0})
    if student:
        phone = student.get("parent_phone") or student.get("phone")
        email = student.get("parent_email") or student.get("email")

        if phone:
            sms_msg = f"Good news! Your payment for {access_request['term']} {access_request['session']} result has been verified. You can now download/print your result. - God's Lifting Int'l School"
            background_tasks.add_task(send_sms, phone, sms_msg[:160])

        if email:
            email_html = f"""
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background: #1E3A8A; color: white; padding: 20px; text-align: center;">
                    <h1 style="margin: 0;">God's Lifting International School</h1>
                </div>
                <div style="padding: 30px; background: #f9f9f9;">
                    <h2 style="color: #10B981;">Result Access Approved!</h2>
                    <p>Dear Parent/Guardian,</p>
                    <p>Your payment for the following result has been verified:</p>
                    <ul>
                        <li><strong>Student ID:</strong> {access_request['student_id']}</li>
                        <li><strong>Session:</strong> {access_request['session']}</li>
                        <li><strong>Term:</strong> {access_request['term']}</li>
                    </ul>
                    <p>You can now <strong>download and print</strong> the result from the student portal.</p>
                </div>
            </div>
            """
            background_tasks.add_task(send_email, email, "Result Access Approved - God's Lifting International School", email_html)

    return {"message": "Result access approved. Student has been notified."}


@router.put("/access/{request_id}/reject")
async def reject_result_access(request_id: str, current_user: dict = Depends(require_admin)):
    await db.result_access.update_one(
        {"id": request_id},
        {"$set": {"status": "rejected", "rejected_by": current_user["id"]}}
    )
    return {"message": "Result access rejected"}


@router.get("/check-access/{student_id}/{session}/{term}")
async def check_result_access(student_id: str, session: str, term: str):
    access = await db.result_access.find_one({
        "student_id": student_id,
        "session": session,
        "term": term
    }, {"_id": 0})

    if not access:
        return {"has_access": False, "status": "not_requested"}

    return {
        "has_access": access.get("status") == "approved",
        "status": access.get("status", "pending")
    }
