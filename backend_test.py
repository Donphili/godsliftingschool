import requests
import sys
import json
from datetime import datetime

class SchoolAPITester:
    def __init__(self, base_url="https://glift-admin-hub.preview.emergentagent.com/api"):
        self.base_url = base_url
        self.token = None
        self.admin_token = None
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []

    def log_test(self, name, success, details=""):
        """Log test result"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
        
        result = {
            "test": name,
            "success": success,
            "details": details,
            "timestamp": datetime.now().isoformat()
        }
        self.test_results.append(result)
        
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} - {name}: {details}")

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        test_headers = {'Content-Type': 'application/json'}
        
        if headers:
            test_headers.update(headers)
        
        if self.token and 'Authorization' not in test_headers:
            test_headers['Authorization'] = f'Bearer {self.token}'

        try:
            if method == 'GET':
                response = requests.get(url, headers=test_headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=test_headers, timeout=10)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=test_headers, timeout=10)
            elif method == 'DELETE':
                response = requests.delete(url, headers=test_headers, timeout=10)

            success = response.status_code == expected_status
            details = f"Status: {response.status_code}"
            
            if not success:
                details += f" (Expected {expected_status})"
                try:
                    error_data = response.json()
                    if 'detail' in error_data:
                        details += f" - {error_data['detail']}"
                except:
                    details += f" - {response.text[:100]}"
            
            self.log_test(name, success, details)
            
            return success, response.json() if success and response.content else {}

        except Exception as e:
            self.log_test(name, False, f"Error: {str(e)}")
            return False, {}

    def test_health_endpoints(self):
        """Test basic health endpoints"""
        print("\n🔍 Testing Health Endpoints...")
        
        self.run_test("API Root", "GET", "", 200)
        self.run_test("Health Check", "GET", "health", 200)

    def test_auth_flow(self):
        """Test authentication endpoints"""
        print("\n🔍 Testing Authentication...")
        
        # Test registration
        test_user = {
            "email": f"test_parent_{datetime.now().strftime('%H%M%S')}@example.com",
            "password": "TestPass123!",
            "full_name": "Test Parent",
            "phone": "08012345678",
            "role": "parent"
        }
        
        success, response = self.run_test(
            "User Registration",
            "POST",
            "auth/register",
            200,
            data=test_user
        )
        
        if success and 'token' in response:
            self.token = response['token']
            
            # Test login with same credentials
            login_data = {
                "email": test_user["email"],
                "password": test_user["password"]
            }
            
            success, login_response = self.run_test(
                "User Login",
                "POST",
                "auth/login",
                200,
                data=login_data
            )
            
            if success and 'token' in login_response:
                self.token = login_response['token']
                
                # Test get current user
                self.run_test("Get Current User", "GET", "auth/me", 200)
        
        # Test admin registration
        admin_user = {
            "email": f"admin_{datetime.now().strftime('%H%M%S')}@school.com",
            "password": "AdminPass123!",
            "full_name": "Test Admin",
            "phone": "08087654321",
            "role": "admin"
        }
        
        success, admin_response = self.run_test(
            "Admin Registration",
            "POST",
            "auth/register",
            200,
            data=admin_user
        )
        
        if success and 'token' in admin_response:
            self.admin_token = admin_response['token']

    def test_public_endpoints(self):
        """Test public endpoints that don't require authentication"""
        print("\n🔍 Testing Public Endpoints...")
        
        # Test news endpoints
        self.run_test("Get News", "GET", "news", 200)
        
        # Test events endpoints
        self.run_test("Get Events", "GET", "events", 200)
        
        # Test gallery endpoints
        self.run_test("Get Gallery", "GET", "gallery", 200)
        
        # Test contact form submission
        contact_data = {
            "name": "Test Contact",
            "email": "test@example.com",
            "phone": "08012345678",
            "subject": "Test Message",
            "message": "This is a test message from automated testing."
        }
        
        self.run_test(
            "Submit Contact Form",
            "POST",
            "contact",
            200,
            data=contact_data
        )

    def test_application_flow(self):
        """Test admission application endpoints"""
        print("\n🔍 Testing Application Flow...")
        
        # Test application submission
        application_data = {
            "full_name": "Test Student",
            "email": "student@example.com",
            "phone": "08012345678",
            "date_of_birth": "2010-01-01",
            "gender": "male",
            "class_applying_for": "Basic 1",
            "parent_name": "Test Parent",
            "parent_phone": "08087654321",
            "parent_email": "parent@example.com",
            "address": "123 Test Street, Lagos",
            "previous_school": "Previous School"
        }
        
        success, response = self.run_test(
            "Submit Application",
            "POST",
            "applications",
            200,
            data=application_data
        )
        
        if success and 'application_number' in response:
            app_number = response['application_number']
            
            # Test application status check
            self.run_test(
                "Check Application Status",
                "GET",
                f"applications/check/{app_number}",
                200
            )

    def test_admin_endpoints(self):
        """Test admin-only endpoints"""
        print("\n🔍 Testing Admin Endpoints...")
        
        if not self.admin_token:
            print("❌ No admin token available, skipping admin tests")
            return
        
        # Temporarily switch to admin token
        original_token = self.token
        self.token = self.admin_token
        
        # Test dashboard stats
        self.run_test("Get Dashboard Stats", "GET", "stats", 200)
        
        # Test get applications (admin only)
        self.run_test("Get All Applications", "GET", "applications", 200)
        
        # Test get contact messages (admin only)
        self.run_test("Get Contact Messages", "GET", "contact", 200)
        
        # Test create news
        news_data = {
            "title": "Test News Article",
            "content": "This is a test news article content.",
            "category": "general"
        }
        
        success, news_response = self.run_test(
            "Create News",
            "POST",
            "news",
            200,
            data=news_data
        )
        
        # Test create event
        event_data = {
            "title": "Test Event",
            "description": "This is a test event description.",
            "event_date": "2024-12-31",
            "event_time": "10:00",
            "location": "School Hall"
        }
        
        self.run_test(
            "Create Event",
            "POST",
            "events",
            200,
            data=event_data
        )
        
        # Test create gallery item
        gallery_data = {
            "title": "Test Gallery Item",
            "image_url": "https://example.com/test-image.jpg",
            "category": "general"
        }
        
        self.run_test(
            "Create Gallery Item",
            "POST",
            "gallery",
            200,
            data=gallery_data
        )
        
        # Restore original token
        self.token = original_token

    def test_payment_endpoints(self):
        """Test payment-related endpoints"""
        print("\n🔍 Testing Payment Endpoints...")
        
        # Test payment initialization (should fail without Paystack keys)
        payment_data = {
            "student_id": "test-student-id",
            "amount": 50000,  # 500 NGN in kobo
            "description": "Test payment",
            "email": "test@example.com"
        }
        
        # This should return 500 since Paystack is not configured
        self.run_test(
            "Initialize Payment (No Config)",
            "POST",
            "payments/initialize",
            500,
            data=payment_data
        )

    def test_student_endpoints(self):
        """Test student-related endpoints"""
        print("\n🔍 Testing Student Endpoints...")
        
        if not self.admin_token:
            print("❌ No admin token available, skipping student tests")
            return
        
        # Temporarily switch to admin token
        original_token = self.token
        self.token = self.admin_token
        
        # Test get students (requires admin/teacher)
        self.run_test("Get Students", "GET", "students", 200)
        
        # Test create student
        student_data = {
            "full_name": "Test Student API",
            "email": "teststudent@example.com",
            "phone": "08012345678",
            "date_of_birth": "2010-01-01",
            "gender": "female",
            "class_level": "Basic 2",
            "parent_name": "Test Parent API",
            "parent_phone": "08087654321",
            "parent_email": "testparent@example.com",
            "address": "123 API Test Street, Lagos"
        }
        
        success, student_response = self.run_test(
            "Create Student",
            "POST",
            "students",
            200,
            data=student_data
        )
        
        if success and 'id' in student_response:
            student_id = student_response['id']
            
            # Test get single student
            self.run_test(
                "Get Single Student",
                "GET",
                f"students/{student_id}",
                200
            )
        
        # Restore original token
        self.token = original_token

    def run_all_tests(self):
        """Run all test suites"""
        print("🚀 Starting God's Lifting International School API Tests")
        print(f"📍 Testing against: {self.base_url}")
        print("=" * 60)
        
        # Run test suites
        self.test_health_endpoints()
        self.test_auth_flow()
        self.test_public_endpoints()
        self.test_application_flow()
        self.test_admin_endpoints()
        self.test_payment_endpoints()
        self.test_student_endpoints()
        
        # Print summary
        print("\n" + "=" * 60)
        print("📊 TEST SUMMARY")
        print("=" * 60)
        print(f"Total Tests: {self.tests_run}")
        print(f"Passed: {self.tests_passed}")
        print(f"Failed: {self.tests_run - self.tests_passed}")
        print(f"Success Rate: {(self.tests_passed/self.tests_run*100):.1f}%")
        
        # Show failed tests
        failed_tests = [t for t in self.test_results if not t['success']]
        if failed_tests:
            print(f"\n❌ FAILED TESTS ({len(failed_tests)}):")
            for test in failed_tests:
                print(f"  • {test['test']}: {test['details']}")
        
        return self.tests_passed == self.tests_run

def main():
    tester = SchoolAPITester()
    success = tester.run_all_tests()
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())