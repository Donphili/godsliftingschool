from fastapi import APIRouter, HTTPException, Depends, Request
from models.schemas import PaymentInitiate, ManualPaymentRecord
from utils.auth import require_admin, get_current_user
from database import db
from config import PAYSTACK_SECRET_KEY, SCHOOL_BANK_NAME, SCHOOL_ACCOUNT_NUMBER, SCHOOL_ACCOUNT_NAME
import uuid
import hmac
import hashlib
import httpx
import json
from datetime import datetime, timezone

router = APIRouter(prefix="/payments", tags=["Payments"])


@router.post("/initialize")
async def initialize_payment(payment: PaymentInitiate):
    if not PAYSTACK_SECRET_KEY:
        return {
            "message": "Online payment not available. Please use bank transfer.",
            "payment_method": "bank_transfer",
            "bank_name": SCHOOL_BANK_NAME,
            "account_number": SCHOOL_ACCOUNT_NUMBER,
            "account_name": SCHOOL_ACCOUNT_NAME,
            "amount": payment.amount / 100,
            "reference": f"PAY{datetime.now().strftime('%Y%m%d%H%M%S')}{str(uuid.uuid4())[:6].upper()}"
        }

    payment_dict = payment.model_dump()
    payment_dict["id"] = str(uuid.uuid4())
    payment_dict["reference"] = f"PAY{datetime.now().strftime('%Y%m%d%H%M%S')}{str(uuid.uuid4())[:6].upper()}"
    payment_dict["status"] = "pending"
    payment_dict["created_at"] = datetime.now(timezone.utc).isoformat()

    async with httpx.AsyncClient() as client:
        response = await client.post(
            "https://api.paystack.co/transaction/initialize",
            headers={
                "Authorization": f"Bearer {PAYSTACK_SECRET_KEY}",
                "Content-Type": "application/json"
            },
            json={
                "email": payment.email,
                "amount": payment.amount,
                "reference": payment_dict["reference"],
                "metadata": {
                    "student_id": payment.student_id,
                    "description": payment.description
                }
            }
        )
        if response.status_code != 200:
            raise HTTPException(status_code=400, detail="Failed to initialize payment")
        paystack_response = response.json()

    payment_dict["authorization_url"] = paystack_response["data"]["authorization_url"]
    await db.payments.insert_one(payment_dict)

    return {
        "message": "Payment initialized",
        "payment_method": "paystack",
        "authorization_url": paystack_response["data"]["authorization_url"],
        "reference": payment_dict["reference"]
    }


@router.post("/manual")
async def record_manual_payment(payment: ManualPaymentRecord, current_user: dict = Depends(require_admin)):
    payment_dict = payment.model_dump()
    payment_dict["id"] = str(uuid.uuid4())
    payment_dict["reference"] = f"MAN{datetime.now().strftime('%Y%m%d%H%M%S')}{str(uuid.uuid4())[:6].upper()}"
    payment_dict["status"] = "completed"
    payment_dict["payment_type"] = "bank_transfer"
    payment_dict["created_at"] = datetime.now(timezone.utc).isoformat()
    payment_dict["verified_by"] = current_user["id"]

    await db.payments.insert_one(payment_dict)
    return {"message": "Payment recorded successfully", "reference": payment_dict["reference"]}


@router.get("/verify/{reference}")
async def verify_payment(reference: str):
    if not PAYSTACK_SECRET_KEY:
        raise HTTPException(status_code=400, detail="Payment verification not available")

    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"https://api.paystack.co/transaction/verify/{reference}",
            headers={"Authorization": f"Bearer {PAYSTACK_SECRET_KEY}"}
        )
        if response.status_code != 200:
            raise HTTPException(status_code=400, detail="Verification failed")
        data = response.json()

        if data["data"]["status"] == "success":
            await db.payments.update_one(
                {"reference": reference},
                {"$set": {"status": "completed", "verified_at": datetime.now(timezone.utc).isoformat()}}
            )
            return {"message": "Payment verified successfully", "status": "success"}
        else:
            return {"message": "Payment not successful", "status": data["data"]["status"]}


@router.get("/student/{student_id}")
async def get_student_payments(student_id: str, current_user: dict = Depends(get_current_user)):
    payments = await db.payments.find({"student_id": student_id}, {"_id": 0}).to_list(100)
    return payments


@router.get("")
async def get_all_payments(current_user: dict = Depends(require_admin)):
    payments = await db.payments.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    return payments


@router.post("/webhook")
async def paystack_webhook(request: Request):
    body = await request.body()
    signature = request.headers.get("x-paystack-signature", "")

    if PAYSTACK_SECRET_KEY:
        hash_obj = hmac.new(PAYSTACK_SECRET_KEY.encode('utf-8'), body, hashlib.sha512)
        if hash_obj.hexdigest() != signature:
            raise HTTPException(status_code=401, detail="Invalid signature")

    event_data = json.loads(body)

    if event_data.get("event") == "charge.success":
        reference = event_data["data"]["reference"]
        await db.payments.update_one(
            {"reference": reference},
            {"$set": {"status": "completed", "webhook_verified": True}}
        )

    return {"status": "success"}
