# God's Lifting International School - Website PRD

## Original Problem Statement
Build a professional school website for "God's Lifting International School" with:
- Professional interface with Nigerian student imagery
- Online student result checking (printable/downloadable)
- Pay-to-unlock results: bank transfer > admin verification > access granted
- Online application form with document uploads
- Admin, Teacher, and Parent portals
- CMS for news, events, gallery
- SMS (Termii) and Email (Resend) notifications
- Future: Paystack payment integration

## Tech Stack
- **Frontend**: React.js + Tailwind CSS + Shadcn UI
- **Backend**: FastAPI (Python) - Modular architecture
- **Database**: MongoDB
- **Auth**: JWT tokens

## Architecture (Refactored Feb 2026)
```
/app/backend/
  server.py          # Main app entry, includes all routers
  database.py        # MongoDB connection
  config.py          # Environment variables
  models/schemas.py  # Pydantic models
  utils/auth.py      # JWT, password hashing, dependencies
  utils/notifications.py  # Termii SMS, Resend Email
  routes/
    auth.py          # Register, login, me
    students.py      # Student CRUD
    results.py       # Results + access requests
    teachers.py      # Teacher CRUD + portal endpoints
    content.py       # News, Events, Gallery
    applications.py  # Admission applications
    payments.py      # Payments, bank details
    contact.py       # Contact messages
    admin.py         # Stats, file upload
```

## What's Been Implemented

### Core Features (Complete)
- JWT-based authentication (login/register) with role-based access
- Admin dashboard with full CRUD (students, teachers, results, applications, news, events, gallery, messages, payments)
- **Teacher Portal**: Teachers can log in, view students in assigned classes, upload/manage results
- **Admin Teacher Management**: Create/delete teachers, assign classes and subjects
- Student/Parent portal (dashboard, result checking, payment info)
- Public pages: Home, About, Admission, Gallery, News, Events, Contact
- Manual bank transfer payment system
- Pay-to-unlock results flow (request access > admin approve > view/download)
- AI-generated Nigerian student images across all pages (premium school environments)
- Document upload for admissions (passport photo, birth certificate)
- Mobile responsive navbar with hamburger menu
- Backend refactored into modular route files

### Credentials
- **Admin**: godsliftinginternational23@gmail.com / GodsLifting2023!
- **Teacher**: teacher1@godslifting.com / Teacher2024! (Mrs. Adebola Williams, JSS 1 & JSS 2)

### Key API Endpoints
- `/api/auth/{register, login, me}` - Authentication
- `/api/students` - Student CRUD
- `/api/teachers` - Teacher CRUD (admin only)
- `/api/teachers/portal/{dashboard, students, results}` - Teacher portal
- `/api/results` - Result management
- `/api/results/request-access` - Student requests result access
- `/api/results/access/{id}/approve` - Admin approves access
- `/api/applications` - Admission applications
- `/api/contact` - Contact form
- `/api/gallery` - Gallery management
- `/api/news` - News management
- `/api/events` - Events management
- `/api/bank-details` - School bank info
- `/api/upload` - File upload
- `/api/stats` - Dashboard statistics

## Pending/Backlog Tasks

### P2 - Future (Requires Client API Keys)
- **Paystack Integration**: Live online payments
- **Termii SMS**: Notification alerts (code exists, needs API key)
- **Resend Email**: Email notifications (code exists, needs API key)

### P3 - Enhancements
- Result PDF generation improvements
- Additional mobile responsiveness fine-tuning for admin panels
- Teacher schedule/timetable feature

## Mocked/Inactive Integrations
- Termii SMS (code present, no API key)
- Resend Email (code present, no API key)
- Paystack payments (stubbed, not active)

## Custom Domain
User wants to use godsliftinginternational.com - needs to:
1. Purchase domain from a registrar (GoDaddy, Namecheap, etc.)
2. Deploy the app
3. Point DNS to the deployed server
