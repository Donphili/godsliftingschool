"""
Backend API Tests for God's Lifting International School
Tests: Auth, Students, Results, Result Access, News, Events, Gallery, Applications, Payments
"""
import pytest
import requests
import os
import uuid

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://glift-admin-hub.preview.emergentagent.com').rstrip('/')

# Test credentials
ADMIN_EMAIL = "godsliftinginternational23@gmail.com"
ADMIN_PASSWORD = "GodsLifting2023!"
TEST_STUDENT_ID = "GLIS2026F62125"

class TestHealthAndBasics:
    """Health check and basic API tests"""
    
    def test_health_endpoint(self):
        response = requests.get(f"{BASE_URL}/api/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        print("✓ Health endpoint working")
    
    def test_root_endpoint(self):
        response = requests.get(f"{BASE_URL}/api/")
        assert response.status_code == 200
        data = response.json()
        assert "God's Lifting" in data["message"]
        print("✓ Root endpoint working")
    
    def test_bank_details_endpoint(self):
        response = requests.get(f"{BASE_URL}/api/bank-details")
        assert response.status_code == 200
        data = response.json()
        assert "bank_name" in data
        assert "account_number" in data
        assert "account_name" in data
        print(f"✓ Bank details: {data['bank_name']} - {data['account_number']}")


class TestAuthentication:
    """Authentication endpoint tests"""
    
    def test_admin_login_success(self):
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })
        assert response.status_code == 200
        data = response.json()
        assert "token" in data
        assert "user" in data
        assert data["user"]["role"] == "admin"
        print(f"✓ Admin login successful: {data['user']['email']}")
        return data["token"]
    
    def test_login_invalid_credentials(self):
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": "wrong@example.com",
            "password": "wrongpassword"
        })
        assert response.status_code == 401
        print("✓ Invalid credentials rejected correctly")
    
    def test_register_new_user(self):
        unique_email = f"test_{uuid.uuid4().hex[:8]}@example.com"
        response = requests.post(f"{BASE_URL}/api/auth/register", json={
            "email": unique_email,
            "full_name": "Test User",
            "password": "testpassword123",
            "phone": "08012345678"
        })
        assert response.status_code == 200
        data = response.json()
        assert "token" in data
        assert data["user"]["email"] == unique_email
        print(f"✓ User registration successful: {unique_email}")


class TestStudentManagement:
    """Student CRUD tests"""
    
    @pytest.fixture
    def admin_token(self):
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })
        return response.json()["token"]
    
    def test_get_students_list(self, admin_token):
        response = requests.get(f"{BASE_URL}/api/students", headers={
            "Authorization": f"Bearer {admin_token}"
        })
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"✓ Retrieved {len(data)} students")
    
    def test_create_student(self, admin_token):
        unique_suffix = uuid.uuid4().hex[:6]
        student_data = {
            "full_name": f"TEST_Student_{unique_suffix}",
            "email": f"test_student_{unique_suffix}@example.com",
            "phone": "08012345678",
            "date_of_birth": "2015-01-15",
            "gender": "Male",
            "class_level": "Basic 3",
            "parent_name": "Test Parent",
            "parent_phone": "08098765432",
            "parent_email": f"test_parent_{unique_suffix}@example.com",
            "address": "123 Test Street, Lagos"
        }
        
        response = requests.post(f"{BASE_URL}/api/students", json=student_data, headers={
            "Authorization": f"Bearer {admin_token}"
        })
        assert response.status_code == 200
        data = response.json()
        assert "student_id" in data
        assert data["full_name"] == student_data["full_name"]
        print(f"✓ Student created: {data['student_id']}")
        return data["student_id"]
    
    def test_get_student_by_student_id(self):
        response = requests.get(f"{BASE_URL}/api/students/by-student-id/{TEST_STUDENT_ID}")
        # May return 404 if test student doesn't exist
        assert response.status_code in [200, 404]
        if response.status_code == 200:
            data = response.json()
            assert data["student_id"] == TEST_STUDENT_ID
            print(f"✓ Found student: {data['full_name']}")
        else:
            print(f"✓ Student lookup endpoint working (student not found)")


class TestResultsManagement:
    """Results CRUD and access control tests"""
    
    @pytest.fixture
    def admin_token(self):
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })
        return response.json()["token"]
    
    def test_get_all_results(self, admin_token):
        response = requests.get(f"{BASE_URL}/api/results", headers={
            "Authorization": f"Bearer {admin_token}"
        })
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"✓ Retrieved {len(data)} results")
    
    def test_get_student_results(self):
        response = requests.get(f"{BASE_URL}/api/results/student/{TEST_STUDENT_ID}")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        for result in data:
            assert "download_unlocked" in result
        print(f"✓ Retrieved {len(data)} results for student {TEST_STUDENT_ID}")
        return data
    
    def test_check_result_access(self):
        # URL encode the session and term properly
        import urllib.parse
        session = urllib.parse.quote("2024/2025", safe='')
        term = urllib.parse.quote("First Term", safe='')
        response = requests.get(f"{BASE_URL}/api/results/check-access/{TEST_STUDENT_ID}/{session}/{term}")
        assert response.status_code == 200
        data = response.json()
        assert "has_access" in data
        assert "status" in data
        print(f"✓ Access check: has_access={data['has_access']}, status={data['status']}")
    
    def test_get_access_requests(self, admin_token):
        response = requests.get(f"{BASE_URL}/api/results/access-requests", headers={
            "Authorization": f"Bearer {admin_token}"
        })
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"✓ Retrieved {len(data)} access requests")


class TestResultAccessFlow:
    """Test the pay-to-unlock result flow"""
    
    @pytest.fixture
    def admin_token(self):
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })
        return response.json()["token"]
    
    def test_request_result_access(self, admin_token):
        # First create a student and result for testing
        unique_suffix = uuid.uuid4().hex[:6]
        
        # Create student
        student_data = {
            "full_name": f"TEST_PayStudent_{unique_suffix}",
            "email": f"test_pay_{unique_suffix}@example.com",
            "phone": "08012345678",
            "date_of_birth": "2015-01-15",
            "gender": "Female",
            "class_level": "Basic 4",
            "parent_name": "Test Parent",
            "parent_phone": "08098765432",
            "parent_email": f"test_parent_pay_{unique_suffix}@example.com",
            "address": "456 Test Avenue, Lagos"
        }
        
        student_response = requests.post(f"{BASE_URL}/api/students", json=student_data, headers={
            "Authorization": f"Bearer {admin_token}"
        })
        assert student_response.status_code == 200
        student_id = student_response.json()["student_id"]
        print(f"✓ Created test student: {student_id}")
        
        # Create result for student
        result_data = {
            "student_id": student_id,
            "session": "2024/2025",
            "term": "Second Term",
            "subjects": [
                {"name": "English Language", "ca_score": 30, "exam_score": 50},
                {"name": "Mathematics", "ca_score": 35, "exam_score": 55}
            ]
        }
        
        result_response = requests.post(f"{BASE_URL}/api/results", json=result_data, headers={
            "Authorization": f"Bearer {admin_token}"
        })
        assert result_response.status_code == 200
        print(f"✓ Created result for student")
        
        # Request access (simulate payment submission)
        access_request = {
            "student_id": student_id,
            "session": "2024/2025",
            "term": "Second Term",
            "bank_reference": f"TRF{unique_suffix}",
            "amount_paid": 2000,
            "receipt_url": ""
        }
        
        access_response = requests.post(f"{BASE_URL}/api/results/request-access", json=access_request)
        assert access_response.status_code == 200
        data = access_response.json()
        assert "request_id" in data or "message" in data
        print(f"✓ Access request submitted: {data.get('message', data.get('request_id'))}")
        
        return student_id, data.get("request_id")


class TestNewsAndEvents:
    """News and Events CRUD tests"""
    
    @pytest.fixture
    def admin_token(self):
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })
        return response.json()["token"]
    
    def test_get_news(self):
        response = requests.get(f"{BASE_URL}/api/news")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"✓ Retrieved {len(data)} news items")
    
    def test_create_news(self, admin_token):
        news_data = {
            "title": f"TEST_News_{uuid.uuid4().hex[:6]}",
            "content": "This is a test news article content.",
            "category": "general"
        }
        
        response = requests.post(f"{BASE_URL}/api/news", json=news_data, headers={
            "Authorization": f"Bearer {admin_token}"
        })
        assert response.status_code == 200
        data = response.json()
        assert "id" in data
        print(f"✓ News created: {data['id']}")
    
    def test_get_events(self):
        response = requests.get(f"{BASE_URL}/api/events")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"✓ Retrieved {len(data)} events")
    
    def test_create_event(self, admin_token):
        event_data = {
            "title": f"TEST_Event_{uuid.uuid4().hex[:6]}",
            "description": "This is a test event description.",
            "event_date": "2026-03-15",
            "event_time": "10:00 AM",
            "location": "School Hall"
        }
        
        response = requests.post(f"{BASE_URL}/api/events", json=event_data, headers={
            "Authorization": f"Bearer {admin_token}"
        })
        assert response.status_code == 200
        data = response.json()
        assert "id" in data
        print(f"✓ Event created: {data['id']}")


class TestGallery:
    """Gallery CRUD tests"""
    
    @pytest.fixture
    def admin_token(self):
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })
        return response.json()["token"]
    
    def test_get_gallery(self):
        response = requests.get(f"{BASE_URL}/api/gallery")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"✓ Retrieved {len(data)} gallery items")
    
    def test_create_gallery_item(self, admin_token):
        gallery_data = {
            "title": f"TEST_Gallery_{uuid.uuid4().hex[:6]}",
            "image_url": "https://example.com/test-image.jpg",
            "category": "campus"
        }
        
        response = requests.post(f"{BASE_URL}/api/gallery", json=gallery_data, headers={
            "Authorization": f"Bearer {admin_token}"
        })
        assert response.status_code == 200
        data = response.json()
        assert "id" in data
        print(f"✓ Gallery item created: {data['id']}")


class TestApplications:
    """Application submission and management tests"""
    
    @pytest.fixture
    def admin_token(self):
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })
        return response.json()["token"]
    
    def test_submit_application(self):
        unique_suffix = uuid.uuid4().hex[:6]
        app_data = {
            "full_name": f"TEST_Applicant_{unique_suffix}",
            "email": f"test_app_{unique_suffix}@example.com",
            "phone": "08012345678",
            "date_of_birth": "2018-05-20",
            "gender": "Male",
            "class_applying_for": "Basic 1",
            "parent_name": "Test Parent",
            "parent_phone": "08098765432",
            "parent_email": f"test_parent_app_{unique_suffix}@example.com",
            "address": "789 Test Road, Lagos"
        }
        
        response = requests.post(f"{BASE_URL}/api/applications", json=app_data)
        assert response.status_code == 200
        data = response.json()
        assert "application_number" in data
        print(f"✓ Application submitted: {data['application_number']}")
        return data["application_number"]
    
    def test_get_applications(self, admin_token):
        response = requests.get(f"{BASE_URL}/api/applications", headers={
            "Authorization": f"Bearer {admin_token}"
        })
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"✓ Retrieved {len(data)} applications")
    
    def test_check_application_status(self):
        # First submit an application
        unique_suffix = uuid.uuid4().hex[:6]
        app_data = {
            "full_name": f"TEST_StatusCheck_{unique_suffix}",
            "email": f"test_status_{unique_suffix}@example.com",
            "phone": "08012345678",
            "date_of_birth": "2017-03-10",
            "gender": "Female",
            "class_applying_for": "Pre-school",
            "parent_name": "Test Parent",
            "parent_phone": "08098765432",
            "parent_email": f"test_parent_status_{unique_suffix}@example.com",
            "address": "101 Test Lane, Lagos"
        }
        
        submit_response = requests.post(f"{BASE_URL}/api/applications", json=app_data)
        app_number = submit_response.json()["application_number"]
        
        # Check status
        response = requests.get(f"{BASE_URL}/api/applications/check/{app_number}")
        assert response.status_code == 200
        data = response.json()
        assert data["application_number"] == app_number
        assert data["status"] == "pending"
        print(f"✓ Application status check: {data['status']}")


class TestContact:
    """Contact form tests"""
    
    @pytest.fixture
    def admin_token(self):
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })
        return response.json()["token"]
    
    def test_submit_contact_message(self):
        message_data = {
            "name": "Test User",
            "email": "test@example.com",
            "phone": "08012345678",
            "subject": "Test Inquiry",
            "message": "This is a test message from automated testing."
        }
        
        response = requests.post(f"{BASE_URL}/api/contact", json=message_data)
        assert response.status_code == 200
        data = response.json()
        assert "message" in data
        print(f"✓ Contact message submitted")
    
    def test_get_contact_messages(self, admin_token):
        response = requests.get(f"{BASE_URL}/api/contact", headers={
            "Authorization": f"Bearer {admin_token}"
        })
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"✓ Retrieved {len(data)} contact messages")


class TestPayments:
    """Payment endpoint tests"""
    
    def test_initialize_payment(self):
        payment_data = {
            "student_id": TEST_STUDENT_ID,
            "amount": 500000,  # 5000 Naira in kobo
            "description": "School fees payment",
            "email": "test@example.com"
        }
        
        response = requests.post(f"{BASE_URL}/api/payments/initialize", json=payment_data)
        # Should return 200 with bank transfer details since Paystack is not configured
        assert response.status_code == 200
        data = response.json()
        assert "payment_method" in data or "bank_name" in data
        print(f"✓ Payment initialization: {data.get('payment_method', 'bank_transfer')}")


class TestAdminDashboard:
    """Admin dashboard stats tests"""
    
    @pytest.fixture
    def admin_token(self):
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })
        return response.json()["token"]
    
    def test_get_dashboard_stats(self, admin_token):
        response = requests.get(f"{BASE_URL}/api/stats", headers={
            "Authorization": f"Bearer {admin_token}"
        })
        assert response.status_code == 200
        data = response.json()
        assert "total_students" in data
        assert "total_applications" in data
        assert "pending_applications" in data
        print(f"✓ Dashboard stats: {data['total_students']} students, {data['total_applications']} applications")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
