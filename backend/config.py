import os
from pathlib import Path
from dotenv import load_dotenv

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

JWT_SECRET = os.environ.get('JWT_SECRET', 'gods-lifting-school-secret-key-2024')
JWT_ALGORITHM = "HS256"
JWT_EXPIRATION_HOURS = 24

PAYSTACK_SECRET_KEY = os.environ.get('PAYSTACK_SECRET_KEY', '')
PAYSTACK_PUBLIC_KEY = os.environ.get('PAYSTACK_PUBLIC_KEY', '')

TERMII_API_KEY = os.environ.get('TERMII_API_KEY', '')
TERMII_SENDER_ID = os.environ.get('TERMII_SENDER_ID', 'GodsLifting')
TERMII_BASE_URL = "https://api.ng.termii.com/api"

RESEND_API_KEY = os.environ.get('RESEND_API_KEY', '')
SENDER_EMAIL = os.environ.get('SENDER_EMAIL', 'onboarding@resend.dev')

SCHOOL_BANK_NAME = os.environ.get('SCHOOL_BANK_NAME', 'First Bank of Nigeria')
SCHOOL_ACCOUNT_NUMBER = os.environ.get('SCHOOL_ACCOUNT_NUMBER', '0123456789')
SCHOOL_ACCOUNT_NAME = os.environ.get('SCHOOL_ACCOUNT_NAME', 'Gods Lifting International School')
