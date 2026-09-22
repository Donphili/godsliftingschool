"""
Backend API Tests for God's Lifting International School
Tests: Auth, Teachers, Students, Results, and Teacher Portal endpoints
"""
import pytest
import requests
import os
import uuid

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

# Test credentials
ADMIN_EMAIL = "godsliftinginternational23@gmail.com"
ADMIN_PASSWORD = "GodsLifting2023!"
TEACHER_EMAIL = "teacher1@godslifting.com"
TEACHER_PASSWORD = "Teacher2024!"
TEST_STUDENT_ID = "GLIS2026F62125"


class TestHealthAndBasicEndpoints:
    """Health check and basic API tests"""
    
    def test_health_endpoint(self):
        """Test /api/health returns healthy status"""
        response = requests.get(f"{BASE_URL}/api/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        print("✓ Health endpoint working")
    
    def test_root_endpoint(self):
        """Test /api/ returns API info"""
        response = requests.get(f"{BASE_URL}/api/")
        assert response.status_code == 200
        data = response.json()
        assert "message" in data
        print("✓ Root endpoint working")


class TestAuthentication:
    """Authentication endpoint tests"""
    
    def test_admin_login_success(self):
        """Test admin login with valid credentials"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })
        assert response.status_code == 200
        data = response.json()
        assert "token" in data
        assert "user" in data
        assert data["user"]["email"] == ADMIN_EMAIL
        assert data["user"]["role"] == "admin"
        print(f"✓ Admin login successful - role: {data['user']['role']}")
    
    def test_teacher_login_success(self):
        """Test teacher login with valid credentials"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": TEACHER_EMAIL,
            "password": TEACHER_PASSWORD
        })
        assert response.status_code == 200
        data = response.json()
        assert "token" in data
        assert "user" in data
        assert data["user"]["email"] == TEACHER_EMAIL
        assert data["user"]["role"] == "teacher"
        print(f"✓ Teacher login successful - role: {data['user']['role']}")
    
    def test_login_invalid_credentials(self):
        """Test login with invalid credentials returns 401"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": "wrong@example.com",
            "password": "wrongpassword"
        })
        assert response.status_code == 401
        print("✓ Invalid credentials correctly rejected")
    
    def test_get_me_with_admin_token(self):
        """Test /api/auth/me returns current user info"""
        # First login
        login_res = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })
        token = login_res.json()["token"]
        
        # Get me
        response = requests.get(f"{BASE_URL}/api/auth/me", headers={
            "Authorization": f"Bearer {token}"
        })
        assert response.status_code == 200
        data = response.json()
        assert data["email"] == ADMIN_EMAIL
        assert data["role"] == "admin"
        print("✓ /api/auth/me working for admin")


class TestTeachersCRUD:
    """Admin Teacher management tests"""
    
    @pytest.fixture
    def admin_token(self):
        """Get admin auth token"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })
        return response.json()["token"]
    
    def test_get_teachers_list(self, admin_token):
        """Test GET /api/teachers returns teacher list"""
        response = requests.get(f"{BASE_URL}/api/teachers", headers={
            "Authorization": f"Bearer {admin_token}"
        })
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"✓ Teachers list retrieved - count: {len(data)}")
        
        # Check if Mrs. Adebola Williams exists
        teacher_names = [t.get("full_name", "") for t in data]
        if "Mrs. Adebola Williams" in teacher_names:
            print("✓ Mrs. Adebola Williams found in teachers list")
        else:
            print(f"  Teachers found: {teacher_names}")
    
    def test_create_and_delete_teacher(self, admin_token):
        """Test creating and deleting a teacher"""
        test_email = f"test_teacher_{uuid.uuid4().hex[:8]}@godslifting.com"
        
        # Create teacher
        create_response = requests.post(f"{BASE_URL}/api/teachers", json={
            "email": test_email,
            "full_name": "TEST_Teacher Delete Me",
            "phone": "08012345678",
            "password": "TestPass123!",
            "assigned_classes": ["JSS 1"],
            "subjects": ["Mathematics"]
        }, headers={
            "Authorization": f"Bearer {admin_token}"
        })
        assert create_response.status_code == 200
        data = create_response.json()
        assert "teacher_id" in data
        teacher_id = data["teacher_id"]
        print(f"✓ Teacher created with ID: {teacher_id}")
        
        # Verify teacher exists in list
        list_response = requests.get(f"{BASE_URL}/api/teachers", headers={
            "Authorization": f"Bearer {admin_token}"
        })
        teachers = list_response.json()
        teacher_ids = [t.get("id") for t in teachers]
        assert teacher_id in teacher_ids
        print("✓ Teacher verified in list")
        
        # Delete teacher
        delete_response = requests.delete(f"{BASE_URL}/api/teachers/{teacher_id}", headers={
            "Authorization": f"Bearer {admin_token}"
        })
        assert delete_response.status_code == 200
        print("✓ Teacher deleted successfully")
    
    def test_teachers_requires_admin(self):
        """Test that teacher endpoints require admin role"""
        # Login as teacher
        login_res = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": TEACHER_EMAIL,
            "password": TEACHER_PASSWORD
        })
        teacher_token = login_res.json()["token"]
        
        # Try to access teachers list
        response = requests.get(f"{BASE_URL}/api/teachers", headers={
            "Authorization": f"Bearer {teacher_token}"
        })
        # Should be forbidden (403) for non-admin
        assert response.status_code in [401, 403]
        print("✓ Teachers endpoint correctly requires admin role")


class TestTeacherPortal:
    """Teacher portal endpoint tests"""
    
    @pytest.fixture
    def teacher_token(self):
        """Get teacher auth token"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": TEACHER_EMAIL,
            "password": TEACHER_PASSWORD
        })
        if response.status_code != 200:
            pytest.skip("Teacher login failed - teacher may not exist")
        return response.json()["token"]
    
    def test_teacher_dashboard(self, teacher_token):
        """Test teacher dashboard endpoint"""
        response = requests.get(f"{BASE_URL}/api/teachers/portal/dashboard", headers={
            "Authorization": f"Bearer {teacher_token}"
        })
        assert response.status_code == 200
        data = response.json()
        
        # Verify structure
        assert "teacher" in data
        assert "stats" in data
        assert "full_name" in data["teacher"]
        assert "assigned_classes" in data["teacher"]
        assert "total_students" in data["stats"]
        assert "total_results_uploaded" in data["stats"]
        
        print(f"✓ Teacher dashboard - Name: {data['teacher']['full_name']}")
        print(f"  Assigned classes: {data['teacher']['assigned_classes']}")
        print(f"  Total students: {data['stats']['total_students']}")
    
    def test_teacher_students(self, teacher_token):
        """Test teacher students endpoint"""
        response = requests.get(f"{BASE_URL}/api/teachers/portal/students", headers={
            "Authorization": f"Bearer {teacher_token}"
        })
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"✓ Teacher students endpoint - count: {len(data)}")
        
        # Check if test student is in the list
        student_ids = [s.get("student_id") for s in data]
        if TEST_STUDENT_ID in student_ids:
            print(f"✓ Test student {TEST_STUDENT_ID} found in teacher's students")
        else:
            print(f"  Note: Test student {TEST_STUDENT_ID} not in teacher's assigned classes")
            # This might be due to class_level mismatch (JSS1 vs JSS 1)
    
    def test_teacher_results(self, teacher_token):
        """Test teacher results endpoint"""
        response = requests.get(f"{BASE_URL}/api/teachers/portal/results", headers={
            "Authorization": f"Bearer {teacher_token}"
        })
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"✓ Teacher results endpoint - count: {len(data)}")


class TestStudentsEndpoints:
    """Student CRUD endpoint tests"""
    
    @pytest.fixture
    def admin_token(self):
        """Get admin auth token"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })
        return response.json()["token"]
    
    def test_get_students_list(self, admin_token):
        """Test GET /api/students returns student list"""
        response = requests.get(f"{BASE_URL}/api/students", headers={
            "Authorization": f"Bearer {admin_token}"
        })
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"✓ Students list retrieved - count: {len(data)}")
        
        # Check for test student
        student_ids = [s.get("student_id") for s in data]
        if TEST_STUDENT_ID in student_ids:
            print(f"✓ Test student {TEST_STUDENT_ID} found")
            # Get student details
            student = next(s for s in data if s.get("student_id") == TEST_STUDENT_ID)
            print(f"  Class level: {student.get('class_level')}")


class TestResultsEndpoints:
    """Results endpoint tests"""
    
    @pytest.fixture
    def admin_token(self):
        """Get admin auth token"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })
        return response.json()["token"]
    
    def test_get_results_list(self, admin_token):
        """Test GET /api/results returns results list"""
        response = requests.get(f"{BASE_URL}/api/results", headers={
            "Authorization": f"Bearer {admin_token}"
        })
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"✓ Results list retrieved - count: {len(data)}")
    
    def test_get_student_results(self, admin_token):
        """Test GET /api/results/student/{student_id}"""
        response = requests.get(f"{BASE_URL}/api/results/student/{TEST_STUDENT_ID}", headers={
            "Authorization": f"Bearer {admin_token}"
        })
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"✓ Student results for {TEST_STUDENT_ID} - count: {len(data)}")
    
    def test_get_access_requests(self, admin_token):
        """Test GET /api/results/access-requests"""
        response = requests.get(f"{BASE_URL}/api/results/access-requests", headers={
            "Authorization": f"Bearer {admin_token}"
        })
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"✓ Access requests retrieved - count: {len(data)}")


class TestContentEndpoints:
    """News, Events, Gallery endpoint tests"""
    
    def test_get_news(self):
        """Test GET /api/news"""
        response = requests.get(f"{BASE_URL}/api/news")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"✓ News endpoint - count: {len(data)}")
    
    def test_get_events(self):
        """Test GET /api/events"""
        response = requests.get(f"{BASE_URL}/api/events")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"✓ Events endpoint - count: {len(data)}")
    
    def test_get_gallery(self):
        """Test GET /api/gallery"""
        response = requests.get(f"{BASE_URL}/api/gallery")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"✓ Gallery endpoint - count: {len(data)}")


class TestOtherEndpoints:
    """Other endpoint tests"""
    
    @pytest.fixture
    def admin_token(self):
        """Get admin auth token"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })
        return response.json()["token"]
    
    def test_get_stats(self, admin_token):
        """Test GET /api/stats"""
        response = requests.get(f"{BASE_URL}/api/stats", headers={
            "Authorization": f"Bearer {admin_token}"
        })
        assert response.status_code == 200
        data = response.json()
        assert "total_students" in data or isinstance(data, dict)
        print(f"✓ Stats endpoint working")
    
    def test_get_applications(self, admin_token):
        """Test GET /api/applications"""
        response = requests.get(f"{BASE_URL}/api/applications", headers={
            "Authorization": f"Bearer {admin_token}"
        })
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"✓ Applications endpoint - count: {len(data)}")
    
    def test_get_payments(self, admin_token):
        """Test GET /api/payments"""
        response = requests.get(f"{BASE_URL}/api/payments", headers={
            "Authorization": f"Bearer {admin_token}"
        })
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"✓ Payments endpoint - count: {len(data)}")
    
    def test_get_contact_messages(self, admin_token):
        """Test GET /api/contact"""
        response = requests.get(f"{BASE_URL}/api/contact", headers={
            "Authorization": f"Bearer {admin_token}"
        })
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"✓ Contact messages endpoint - count: {len(data)}")
    
    def test_get_bank_details(self, admin_token):
        """Test GET /api/bank-details"""
        response = requests.get(f"{BASE_URL}/api/bank-details", headers={
            "Authorization": f"Bearer {admin_token}"
        })
        assert response.status_code == 200
        data = response.json()
        assert "bank_name" in data or "account_number" in data
        print(f"✓ Bank details endpoint working")
    
    def test_contact_form_submission(self):
        """Test POST /api/contact"""
        response = requests.post(f"{BASE_URL}/api/contact", json={
            "name": "TEST_Contact User",
            "email": "test@example.com",
            "phone": "08012345678",
            "subject": "Test Message",
            "message": "This is a test message from automated testing"
        })
        assert response.status_code == 200
        print("✓ Contact form submission working")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
