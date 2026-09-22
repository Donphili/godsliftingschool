from fastapi import APIRouter, HTTPException, Depends
from models.schemas import StudentCreate, StudentResponse
from utils.auth import require_admin, require_teacher_or_admin, get_current_user
from database import db
import uuid
from datetime import datetime, timezone

router = APIRouter(prefix="/students", tags=["Students"])


@router.post("", response_model=StudentResponse)
async def create_student(student: StudentCreate, current_user: dict = Depends(require_admin)):
    student_dict = student.model_dump()
    student_dict["id"] = str(uuid.uuid4())
    student_dict["student_id"] = f"GLIS{datetime.now().year}{str(uuid.uuid4())[:6].upper()}"
    student_dict["admission_status"] = "admitted"
    student_dict["created_at"] = datetime.now(timezone.utc).isoformat()
    student_dict["user_id"] = None

    await db.students.insert_one(student_dict)
    student_dict["created_at"] = datetime.fromisoformat(student_dict["created_at"])
    return student_dict


@router.get("")
async def get_students(current_user: dict = Depends(require_teacher_or_admin)):
    students = await db.students.find({}, {"_id": 0}).to_list(1000)
    return students


@router.get("/{student_id}")
async def get_student(student_id: str, current_user: dict = Depends(get_current_user)):
    student = await db.students.find_one({"id": student_id}, {"_id": 0})
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    return student


@router.get("/by-student-id/{student_id}")
async def get_student_by_sid(student_id: str):
    student = await db.students.find_one({"student_id": student_id}, {"_id": 0})
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    return student


@router.delete("/{student_id}")
async def delete_student(student_id: str, current_user: dict = Depends(require_admin)):
    result = await db.students.delete_one({"id": student_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Student not found")
    return {"message": "Student deleted successfully"}
