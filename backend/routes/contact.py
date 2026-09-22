from fastapi import APIRouter, Depends
from models.schemas import ContactMessage
from utils.auth import require_admin
from database import db
import uuid
from datetime import datetime, timezone

router = APIRouter(prefix="/contact", tags=["Contact"])


@router.post("")
async def submit_contact(message: ContactMessage):
    msg_dict = message.model_dump()
    msg_dict["id"] = str(uuid.uuid4())
    msg_dict["created_at"] = datetime.now(timezone.utc).isoformat()
    msg_dict["read"] = False

    await db.contact_messages.insert_one(msg_dict)
    return {"message": "Message sent successfully"}


@router.get("")
async def get_contact_messages(current_user: dict = Depends(require_admin)):
    messages = await db.contact_messages.find({}, {"_id": 0}).sort("created_at", -1).to_list(100)
    return messages


@router.put("/{message_id}/read")
async def mark_message_read(message_id: str, current_user: dict = Depends(require_admin)):
    await db.contact_messages.update_one({"id": message_id}, {"$set": {"read": True}})
    return {"message": "Message marked as read"}
