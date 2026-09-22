from fastapi import APIRouter, HTTPException, Depends
from models.schemas import TeacherCreate, ResultCreate
from utils.auth import require_admin, require_teacher, get_current_user, hash_password
from database import db
import uuid
from datetime import datetime, timezone

router = APIRouter(prefix="/teachers", tags=["Teachers"])


@router.post("")
async def create_teacher(teacher: TeacherCreate, current_user: dict = Depends(require_admin)):
    """Admin creates a teacher account"""
    existing = await db.users.find_one({"email": teacher.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    user_dict = {
        "id": str(uuid.uuid4()),
        "email": teacher.email,
        "full_name": teacher.full_name,
        "phone": teacher.phone,
        "role": "teacher",
        "password": hash_password(teacher.password),
        "assigned_classes": teacher.assigned_classes,
        "subjects": teacher.subjects,
        "created_at": datetime.now(timezone.utc).isoformat()
    }

    await db.users.insert_one(user_dict)
    return {
        "message": "Teacher created successfully",
        "teacher_id": user_dict["id"],
        "email": user_dict["email"]
    }


@router.get("")
async def get_teachers(current_user: dict = Depends(require_admin)):
    """Admin gets all teachers"""
    teachers = await db.users.find({"role": "teacher"}, {"_id": 0, "password": 0}).to_list(100)
    return teachers


@router.get("/{teacher_id}")
async def get_teacher(teacher_id: str, current_user: dict = Depends(require_admin)):
    teacher = await db.users.find_one({"id": teacher_id, "role": "teacher"}, {"_id": 0, "password": 0})
    if not teacher:
        raise HTTPException(status_code=404, detail="Teacher not found")
    return teacher


@router.put("/{teacher_id}")
async def update_teacher(teacher_id: str, teacher: TeacherCreate, current_user: dict = Depends(require_admin)):
    update_data = {
        "full_name": teacher.full_name,
        "email": teacher.email,
        "phone": teacher.phone,
        "assigned_classes": teacher.assigned_classes,
        "subjects": teacher.subjects
    }
    result = await db.users.update_one({"id": teacher_id, "role": "teacher"}, {"$set": update_data})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Teacher not found")
    return {"message": "Teacher updated successfully"}


@router.delete("/{teacher_id}")
async def delete_teacher(teacher_id: str, current_user: dict = Depends(require_admin)):
    result = await db.users.delete_one({"id": teacher_id, "role": "teacher"})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Teacher not found")
    return {"message": "Teacher deleted successfully"}


# ============== TEACHER PORTAL ENDPOINTS ==============

@router.get("/portal/dashboard")
async def teacher_dashboard(current_user: dict = Depends(require_teacher)):
    """Get teacher's dashboard data"""
    assigned_classes = current_user.get("assigned_classes", [])

    students_count = await db.students.count_documents({"class_level": {"$in": assigned_classes}}) if assigned_classes else 0
    results_count = await db.results.count_documents({"teacher_id": current_user["id"]})

    return {
        "teacher": {
            "id": current_user["id"],
            "full_name": current_user["full_name"],
            "email": current_user["email"],
            "assigned_classes": assigned_classes,
            "subjects": current_user.get("subjects", [])
        },
        "stats": {
            "total_students": students_count,
            "total_results_uploaded": results_count,
            "assigned_classes_count": len(assigned_classes)
        }
    }


@router.get("/portal/students")
async def teacher_students(current_user: dict = Depends(require_teacher)):
    """Get students in teacher's assigned classes"""
    assigned_classes = current_user.get("assigned_classes", [])
    if not assigned_classes:
        return []
    students = await db.students.find(
        {"class_level": {"$in": assigned_classes}},
        {"_id": 0}
    ).to_list(500)
    return students


@router.get("/portal/results")
async def teacher_results(current_user: dict = Depends(require_teacher)):
    """Get results uploaded by this teacher"""
    results = await db.results.find(
        {"teacher_id": current_user["id"]},
        {"_id": 0}
    ).to_list(500)
    return results


@router.post("/portal/results")
async def teacher_upload_result(result: ResultCreate, current_user: dict = Depends(require_teacher)):
    """Teacher uploads a result for a student in their class"""
    assigned_classes = current_user.get("assigned_classes", [])
    student = await db.students.find_one({"student_id": result.student_id}, {"_id": 0})
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    if assigned_classes and student.get("class_level") not in assigned_classes:
        raise HTTPException(status_code=403, detail="Student is not in your assigned class")

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


@router.delete("/portal/results/{result_id}")
async def teacher_delete_result(result_id: str, current_user: dict = Depends(require_teacher)):
    """Teacher deletes their own result"""
    result = await db.results.find_one({"id": result_id, "teacher_id": current_user["id"]})
    if not result:
        raise HTTPException(status_code=404, detail="Result not found or not yours to delete")
    await db.results.delete_one({"id": result_id})
    return {"message": "Result deleted successfully"}
