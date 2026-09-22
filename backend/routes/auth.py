from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from models.schemas import UserCreate, UserLogin
from utils.auth import hash_password, verify_password, create_token, get_current_user
from database import db
import uuid
from datetime import datetime, timezone

router = APIRouter(prefix="/auth", tags=["Authentication"])


class ChangePassword(BaseModel):
    current_password: str
    new_password: str


class UpdateProfile(BaseModel):
    full_name: str
    phone: str = ""


@router.post("/register")
async def register(user: UserCreate):
    existing = await db.users.find_one({"email": user.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    user_dict = user.model_dump()
    user_dict["id"] = str(uuid.uuid4())
    user_dict["password"] = hash_password(user.password)
    user_dict["created_at"] = datetime.now(timezone.utc).isoformat()

    await db.users.insert_one(user_dict)

    token = create_token(user_dict["id"], user_dict["role"])
    return {
        "message": "Registration successful",
        "token": token,
        "user": {
            "id": user_dict["id"],
            "email": user_dict["email"],
            "full_name": user_dict["full_name"],
            "role": user_dict["role"]
        }
    }


@router.post("/login")
async def login(credentials: UserLogin):
    user = await db.users.find_one({"email": credentials.email}, {"_id": 0})
    if not user or not verify_password(credentials.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_token(user["id"], user["role"])
    return {
        "message": "Login successful",
        "token": token,
        "user": {
            "id": user["id"],
            "email": user["email"],
            "full_name": user["full_name"],
            "role": user["role"]
        }
    }


@router.get("/me")
async def get_me(current_user: dict = Depends(get_current_user)):
    return {
        "id": current_user["id"],
        "email": current_user["email"],
        "full_name": current_user["full_name"],
        "role": current_user["role"],
        "phone": current_user.get("phone")
    }


@router.put("/change-password")
async def change_password(data: ChangePassword, current_user: dict = Depends(get_current_user)):
    if not verify_password(data.current_password, current_user["password"]):
        raise HTTPException(status_code=400, detail="Current password is incorrect")
    if len(data.new_password) < 6:
        raise HTTPException(status_code=400, detail="New password must be at least 6 characters")
    await db.users.update_one(
        {"id": current_user["id"]},
        {"$set": {"password": hash_password(data.new_password)}}
    )
    return {"message": "Password changed successfully"}


@router.put("/update-profile")
async def update_profile(data: UpdateProfile, current_user: dict = Depends(get_current_user)):
    await db.users.update_one(
        {"id": current_user["id"]},
        {"$set": {"full_name": data.full_name, "phone": data.phone}}
    )
    return {"message": "Profile updated successfully"}
