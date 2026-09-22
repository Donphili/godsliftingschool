import logging
import asyncio
import requests
import resend
from datetime import datetime
from config import TERMII_API_KEY, TERMII_SENDER_ID, TERMII_BASE_URL, RESEND_API_KEY, SENDER_EMAIL

logger = logging.getLogger(__name__)

if RESEND_API_KEY:
    resend.api_key = RESEND_API_KEY


async def send_sms(phone_number: str, message: str):
    if not TERMII_API_KEY:
        logger.warning("Termii API key not configured, skipping SMS")
        return False

    if phone_number.startswith('0'):
        phone_number = '234' + phone_number[1:]
    elif phone_number.startswith('+234'):
        phone_number = phone_number.replace('+', '')

    payload = {
        "to": phone_number,
        "from": TERMII_SENDER_ID,
        "sms": message,
        "type": "plain",
        "channel": "generic",
        "api_key": TERMII_API_KEY,
    }

    try:
        response = requests.post(
            f"{TERMII_BASE_URL}/sms/send",
            headers={"Content-Type": "application/json"},
            json=payload,
            timeout=10
        )
        if response.status_code == 200:
            data = response.json()
            if data.get('code') == 'ok':
                logger.info(f"SMS sent successfully to {phone_number}")
                return True
        logger.error(f"SMS failed: {response.text}")
        return False
    except Exception as e:
        logger.error(f"SMS exception: {str(e)}")
        return False


async def send_email(to_email: str, subject: str, html_content: str):
    if not RESEND_API_KEY:
        logger.warning("Resend API key not configured, skipping email")
        return False

    params = {
        "from": SENDER_EMAIL,
        "to": [to_email],
        "subject": subject,
        "html": html_content
    }

    try:
        await asyncio.to_thread(resend.Emails.send, params)
        logger.info(f"Email sent to {to_email}")
        return True
    except Exception as e:
        logger.error(f"Email failed: {str(e)}")
        return False


async def send_admission_notification(application: dict, new_status: str):
    full_name = application.get('full_name', 'Applicant')
    email = application.get('parent_email') or application.get('email')
    phone = application.get('parent_phone') or application.get('phone')
    app_number = application.get('application_number', '')
    class_name = application.get('class_applying_for', '')

    if new_status == "approved":
        sms_msg = f"Congratulations! {full_name} has been admitted to God's Lifting Int'l School ({class_name}). App No: {app_number}. Visit school for next steps."
        email_subject = "Admission Approved - God's Lifting International School"
        email_html = f"""
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #1E3A8A; color: white; padding: 20px; text-align: center;">
                <h1 style="margin: 0;">God's Lifting International School</h1>
            </div>
            <div style="padding: 30px; background: #f9f9f9;">
                <h2 style="color: #1E3A8A;">Congratulations!</h2>
                <p>Dear Parent/Guardian,</p>
                <p>We are pleased to inform you that <strong>{full_name}</strong> has been
                <span style="color: #10B981; font-weight: bold;">APPROVED</span> for admission to
                <strong>{class_name}</strong> at God's Lifting International School.</p>
                <div style="background: white; padding: 15px; border-left: 4px solid #F59E0B; margin: 20px 0;">
                    <p style="margin: 0;"><strong>Application Number:</strong> {app_number}</p>
                </div>
                <h3>Next Steps:</h3>
                <ol>
                    <li>Visit the school to complete registration</li>
                    <li>Pay the required school fees</li>
                    <li>Submit original documents for verification</li>
                    <li>Collect student ID and uniform</li>
                </ol>
                <p><strong>School Address:</strong><br>
                10, Alhaji Memudu Balogun Street, Off Alake Lankoko Street,<br>
                Off Liasu Road, Egbe, Lagos</p>
                <p><strong>Contact:</strong> 08034494498, 09012077546</p>
            </div>
            <div style="background: #1E3A8A; color: white; padding: 15px; text-align: center; font-size: 12px;">
                <p>&copy; {datetime.now().year} God's Lifting International School</p>
            </div>
        </div>
        """
    elif new_status == "rejected":
        sms_msg = f"Dear Parent, we regret to inform you that {full_name}'s application to God's Lifting Int'l School was not successful. Contact: 08034494498"
        email_subject = "Application Update - God's Lifting International School"
        email_html = f"""
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #1E3A8A; color: white; padding: 20px; text-align: center;">
                <h1 style="margin: 0;">God's Lifting International School</h1>
            </div>
            <div style="padding: 30px; background: #f9f9f9;">
                <p>Dear Parent/Guardian,</p>
                <p>Thank you for considering God's Lifting International School for <strong>{full_name}</strong>'s education.</p>
                <p>After careful review, we regret to inform you that we are unable to offer admission at this time.</p>
                <p>We encourage you to apply again in the future.</p>
                <p>For any inquiries, please contact us at 08034494498 or 09012077546.</p>
            </div>
        </div>
        """
    else:
        return

    if phone:
        await send_sms(phone, sms_msg[:160])
    if email:
        await send_email(email, email_subject, email_html)
