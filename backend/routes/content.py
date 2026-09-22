from fastapi import APIRouter, HTTPException, Depends
from models.schemas import NewsCreate, EventCreate, GalleryCreate
from utils.auth import require_admin
from database import db
import uuid
from datetime import datetime, timezone

router = APIRouter(tags=["Content"])


# ============== NEWS ==============

@router.post("/news")
async def create_news(news: NewsCreate, current_user: dict = Depends(require_admin)):
    news_dict = news.model_dump()
    news_dict["id"] = str(uuid.uuid4())
    news_dict["created_at"] = datetime.now(timezone.utc).isoformat()
    news_dict["author_id"] = current_user["id"]
    await db.news.insert_one(news_dict)
    return {"message": "News created successfully", "id": news_dict["id"]}


@router.get("/news")
async def get_news():
    news = await db.news.find({}, {"_id": 0}).sort("created_at", -1).to_list(100)
    return news


@router.get("/news/{news_id}")
async def get_single_news(news_id: str):
    news = await db.news.find_one({"id": news_id}, {"_id": 0})
    if not news:
        raise HTTPException(status_code=404, detail="News not found")
    return news


@router.put("/news/{news_id}")
async def update_news(news_id: str, news: NewsCreate, current_user: dict = Depends(require_admin)):
    result = await db.news.update_one({"id": news_id}, {"$set": news.model_dump()})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="News not found")
    return {"message": "News updated successfully"}


@router.delete("/news/{news_id}")
async def delete_news(news_id: str, current_user: dict = Depends(require_admin)):
    result = await db.news.delete_one({"id": news_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="News not found")
    return {"message": "News deleted successfully"}


# ============== EVENTS ==============

@router.post("/events")
async def create_event(event: EventCreate, current_user: dict = Depends(require_admin)):
    event_dict = event.model_dump()
    event_dict["id"] = str(uuid.uuid4())
    event_dict["created_at"] = datetime.now(timezone.utc).isoformat()
    await db.events.insert_one(event_dict)
    return {"message": "Event created successfully", "id": event_dict["id"]}


@router.get("/events")
async def get_events():
    events = await db.events.find({}, {"_id": 0}).sort("event_date", 1).to_list(100)
    return events


@router.get("/events/{event_id}")
async def get_single_event(event_id: str):
    event = await db.events.find_one({"id": event_id}, {"_id": 0})
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    return event


@router.put("/events/{event_id}")
async def update_event(event_id: str, event: EventCreate, current_user: dict = Depends(require_admin)):
    result = await db.events.update_one({"id": event_id}, {"$set": event.model_dump()})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Event not found")
    return {"message": "Event updated successfully"}


@router.delete("/events/{event_id}")
async def delete_event(event_id: str, current_user: dict = Depends(require_admin)):
    result = await db.events.delete_one({"id": event_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Event not found")
    return {"message": "Event deleted successfully"}


# ============== GALLERY ==============

@router.post("/gallery")
async def create_gallery_item(item: GalleryCreate, current_user: dict = Depends(require_admin)):
    item_dict = item.model_dump()
    item_dict["id"] = str(uuid.uuid4())
    item_dict["created_at"] = datetime.now(timezone.utc).isoformat()
    await db.gallery.insert_one(item_dict)
    return {"message": "Gallery item added successfully", "id": item_dict["id"]}


@router.get("/gallery")
async def get_gallery():
    items = await db.gallery.find({}, {"_id": 0}).sort("created_at", -1).to_list(100)
    return items


@router.delete("/gallery/{item_id}")
async def delete_gallery_item(item_id: str, current_user: dict = Depends(require_admin)):
    result = await db.gallery.delete_one({"id": item_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Gallery item not found")
    return {"message": "Gallery item deleted successfully"}
