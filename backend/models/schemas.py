from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime


class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    phone: Optional[str] = None
    role: str = "parent"


class UserCreate(UserBase):
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(UserBase):
    id: str
    created_at: datetime


class StudentCreate(BaseModel):
    full_name: str
    email: EmailStr
    phone: str
    date_of_birth: str
    gender: str
    class_level: str
    parent_name: str
    parent_phone: str
    parent_email: EmailStr
    address: str


class StudentResponse(StudentCreate):
    id: str
    student_id: str
    admission_status: str
    created_at: datetime
    user_id: Optional[str] = None


class ResultCreate(BaseModel):
    student_id: str
    session: str
    term: str
    subjects: List[dict]


class ResultResponse(ResultCreate):
    id: str
    created_at: datetime
    teacher_id: str


class ResultPaymentRequest(BaseModel):
    student_id: str
    session: str
    term: str
    receipt_url: Optional[str] = None
    bank_reference: str
    amount_paid: int


class NewsCreate(BaseModel):
    title: str
    content: str
    image_url: Optional[str] = None
    category: str = "general"


class NewsResponse(NewsCreate):
    id: str
    created_at: datetime
    author_id: str


class EventCreate(BaseModel):
    title: str
    description: str
    event_date: str
    event_time: str
    location: str
    image_url: Optional[str] = None


class EventResponse(EventCreate):
    id: str
    created_at: datetime


class GalleryCreate(BaseModel):
    title: str
    image_url: str
    category: str = "general"


class GalleryResponse(GalleryCreate):
    id: str
    created_at: datetime


class ContactMessage(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    subject: str
    message: str


class PaymentInitiate(BaseModel):
    student_id: str
    amount: int
    description: str
    email: EmailStr


class ManualPaymentRecord(BaseModel):
    student_id: str
    amount: int
    description: str
    payment_date: str
    bank_reference: str


class ApplicationCreate(BaseModel):
    full_name: str
    email: EmailStr
    phone: str
    date_of_birth: str
    gender: str
    class_applying_for: str
    parent_name: str
    parent_phone: str
    parent_email: EmailStr
    address: str
    previous_school: Optional[str] = None
    birth_certificate_url: Optional[str] = None
    passport_photo_url: Optional[str] = None


class ApplicationResponse(ApplicationCreate):
    id: str
    application_number: str
    status: str
    created_at: datetime


class TeacherCreate(BaseModel):
    email: EmailStr
    full_name: str
    phone: Optional[str] = None
    password: str
    assigned_classes: List[str] = []
    subjects: List[str] = []
