#!/usr/bin/env python3
"""
Backend API test suite for past-paper endpoints.
Tests all CRUD operations and validation rules.
"""

import os
import sys
import requests
from typing import Dict, Any, Optional

# Read backend URL from frontend .env
def get_backend_url() -> str:
    env_path = "/app/frontend/.env"
    with open(env_path, 'r') as f:
        for line in f:
            if line.startswith('REACT_APP_BACKEND_URL='):
                return line.split('=', 1)[1].strip()
    raise ValueError("REACT_APP_BACKEND_URL not found in /app/frontend/.env")

BASE_URL = get_backend_url()
API_BASE = f"{BASE_URL}/api"

# Test results tracking
test_results = []
created_ids = []  # Track created items for cleanup


def log_test(name: str, passed: bool, details: str = ""):
    """Log test result."""
    status = "✅ PASS" if passed else "❌ FAIL"
    test_results.append({
        "name": name,
        "passed": passed,
        "details": details
    })
    print(f"{status}: {name}")
    if details:
        print(f"  Details: {details}")


def test_root_endpoint():
    """Test 1: Verify pre-existing root endpoint still works."""
    try:
        response = requests.get(f"{API_BASE}/", timeout=10)
        expected = {"message": "Hello World"}
        
        if response.status_code == 200 and response.json() == expected:
            log_test("GET /api/ returns Hello World", True, f"Response: {response.json()}")
        else:
            log_test("GET /api/ returns Hello World", False, 
                    f"Status: {response.status_code}, Body: {response.text}")
    except Exception as e:
        log_test("GET /api/ returns Hello World", False, f"Exception: {str(e)}")


def test_list_past_papers_initial():
    """Test 2: GET /api/past-papers returns array and note count."""
    try:
        response = requests.get(f"{API_BASE}/past-papers", timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            if isinstance(data, list):
                count = len(data)
                log_test("GET /api/past-papers returns JSON array", True, 
                        f"Initial count: {count} items")
                return count
            else:
                log_test("GET /api/past-papers returns JSON array", False, 
                        f"Response is not an array: {type(data)}")
                return 0
        else:
            log_test("GET /api/past-papers returns JSON array", False, 
                    f"Status: {response.status_code}, Body: {response.text}")
            return 0
    except Exception as e:
        log_test("GET /api/past-papers returns JSON array", False, f"Exception: {str(e)}")
        return 0


def test_create_mcq():
    """Test 3: POST Multiple choice question."""
    payload = {
        "subject": "Physics",
        "topic": "Optics",
        "q": "Focal length of a convex lens is:",
        "answerType": "Multiple choice",
        "difficulty": "Easy",
        "options": ["Negative", "Positive", "Zero", "Infinite"],
        "a": 1,
        "year": 2022
    }
    
    try:
        response = requests.post(f"{API_BASE}/past-papers", json=payload, timeout=10)
        
        if response.status_code == 201:
            data = response.json()
            # Verify required fields
            if all(k in data for k in ["id", "addedAt", "source"]):
                if data["source"] == "past-paper" and data["subject"] == "Physics":
                    created_ids.append(data["id"])
                    log_test("POST MCQ past-paper", True, 
                            f"Created with id={data['id']}, addedAt={data['addedAt']}")
                    return data["id"]
                else:
                    log_test("POST MCQ past-paper", False, 
                            f"Invalid data: source={data.get('source')}, subject={data.get('subject')}")
            else:
                log_test("POST MCQ past-paper", False, 
                        f"Missing required fields. Got: {list(data.keys())}")
        else:
            log_test("POST MCQ past-paper", False, 
                    f"Status: {response.status_code}, Body: {response.text}")
    except Exception as e:
        log_test("POST MCQ past-paper", False, f"Exception: {str(e)}")
    
    return None


def test_create_typed_response():
    """Test 4: POST Typed response question."""
    payload = {
        "subject": "Mathematics",
        "topic": "Algebra",
        "q": "Solve 3x=15",
        "answerType": "Typed response",
        "difficulty": "Medium",
        "typedAnswer": "5",
        "typedAliases": ["x=5", "five"]
    }
    
    try:
        response = requests.post(f"{API_BASE}/past-papers", json=payload, timeout=10)
        
        if response.status_code == 201:
            data = response.json()
            if all(k in data for k in ["id", "addedAt", "source"]):
                if data["source"] == "past-paper" and data["answerType"] == "Typed response":
                    created_ids.append(data["id"])
                    log_test("POST Typed response past-paper", True, 
                            f"Created with id={data['id']}")
                    return data["id"]
                else:
                    log_test("POST Typed response past-paper", False, 
                            f"Invalid data: {data}")
            else:
                log_test("POST Typed response past-paper", False, 
                        f"Missing required fields")
        else:
            log_test("POST Typed response past-paper", False, 
                    f"Status: {response.status_code}, Body: {response.text}")
    except Exception as e:
        log_test("POST Typed response past-paper", False, f"Exception: {str(e)}")
    
    return None


def test_create_exam_style():
    """Test 5: POST Exam style question."""
    payload = {
        "subject": "Biology",
        "topic": "Cell Biology",
        "q": "Describe the structure and function of mitochondria.",
        "answerType": "Exam style",
        "difficulty": "Hard",
        "examAnswer": "Mitochondria are double-membrane organelles that produce ATP through cellular respiration.",
        "examKeywords": ["ATP", "double membrane", "respiration", "cristae"]
    }
    
    try:
        response = requests.post(f"{API_BASE}/past-papers", json=payload, timeout=10)
        
        if response.status_code == 201:
            data = response.json()
            if all(k in data for k in ["id", "addedAt", "source"]):
                if data["source"] == "past-paper" and data["answerType"] == "Exam style":
                    created_ids.append(data["id"])
                    log_test("POST Exam style past-paper", True, 
                            f"Created with id={data['id']}")
                    return data["id"]
                else:
                    log_test("POST Exam style past-paper", False, 
                            f"Invalid data: {data}")
            else:
                log_test("POST Exam style past-paper", False, 
                        f"Missing required fields")
        else:
            log_test("POST Exam style past-paper", False, 
                    f"Status: {response.status_code}, Body: {response.text}")
    except Exception as e:
        log_test("POST Exam style past-paper", False, f"Exception: {str(e)}")
    
    return None


def test_filter_by_subject():
    """Test 6: GET /api/past-papers?subject=Physics filter works."""
    try:
        response = requests.get(f"{API_BASE}/past-papers?subject=Physics", timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            if isinstance(data, list):
                # Check that all items have subject=Physics
                all_physics = all(item.get("subject") == "Physics" for item in data)
                if all_physics and len(data) > 0:
                    log_test("GET /api/past-papers?subject=Physics filter", True, 
                            f"Found {len(data)} Physics questions")
                elif len(data) == 0:
                    log_test("GET /api/past-papers?subject=Physics filter", True, 
                            "No Physics questions found (empty result is valid)")
                else:
                    log_test("GET /api/past-papers?subject=Physics filter", False, 
                            f"Filter not working correctly. Found non-Physics items.")
            else:
                log_test("GET /api/past-papers?subject=Physics filter", False, 
                        f"Response is not an array")
        else:
            log_test("GET /api/past-papers?subject=Physics filter", False, 
                    f"Status: {response.status_code}, Body: {response.text}")
    except Exception as e:
        log_test("GET /api/past-papers?subject=Physics filter", False, f"Exception: {str(e)}")


def test_filter_by_answer_type():
    """Test 7: GET /api/past-papers?answerType=Typed response filter works."""
    try:
        response = requests.get(f"{API_BASE}/past-papers?answerType=Typed response", timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            if isinstance(data, list):
                # Check that all items have answerType=Typed response
                all_typed = all(item.get("answerType") == "Typed response" for item in data)
                if all_typed and len(data) > 0:
                    log_test("GET /api/past-papers?answerType=Typed response filter", True, 
                            f"Found {len(data)} Typed response questions")
                elif len(data) == 0:
                    log_test("GET /api/past-papers?answerType=Typed response filter", True, 
                            "No Typed response questions found (empty result is valid)")
                else:
                    log_test("GET /api/past-papers?answerType=Typed response filter", False, 
                            f"Filter not working correctly")
            else:
                log_test("GET /api/past-papers?answerType=Typed response filter", False, 
                        f"Response is not an array")
        else:
            log_test("GET /api/past-papers?answerType=Typed response filter", False, 
                    f"Status: {response.status_code}, Body: {response.text}")
    except Exception as e:
        log_test("GET /api/past-papers?answerType=Typed response filter", False, 
                f"Exception: {str(e)}")


def test_invalid_mcq_missing_answer():
    """Test 8: Invalid MCQ (missing 'a') should return 422."""
    payload = {
        "subject": "Chemistry",
        "topic": "Acids",
        "q": "What is the pH of water?",
        "answerType": "Multiple choice",
        "difficulty": "Easy",
        "options": ["5", "7", "9", "11"]
        # Missing 'a' field
    }
    
    try:
        response = requests.post(f"{API_BASE}/past-papers", json=payload, timeout=10)
        
        if response.status_code == 422:
            log_test("Invalid MCQ (missing 'a') returns 422", True, 
                    f"Correctly rejected: {response.json().get('detail', '')}")
        else:
            log_test("Invalid MCQ (missing 'a') returns 422", False, 
                    f"Expected 422, got {response.status_code}")
    except Exception as e:
        log_test("Invalid MCQ (missing 'a') returns 422", False, f"Exception: {str(e)}")


def test_invalid_answer_type():
    """Test 9: Invalid answerType value should return 422."""
    payload = {
        "subject": "English",
        "topic": "Grammar",
        "q": "What is a noun?",
        "answerType": "Foo",  # Invalid
        "difficulty": "Easy"
    }
    
    try:
        response = requests.post(f"{API_BASE}/past-papers", json=payload, timeout=10)
        
        if response.status_code == 422:
            log_test("Invalid answerType returns 422", True, 
                    f"Correctly rejected: {response.json().get('detail', '')}")
        else:
            log_test("Invalid answerType returns 422", False, 
                    f"Expected 422, got {response.status_code}")
    except Exception as e:
        log_test("Invalid answerType returns 422", False, f"Exception: {str(e)}")


def test_delete_existing(item_id: Optional[str]):
    """Test 10: DELETE /api/past-papers/{id} returns 204."""
    if not item_id:
        log_test("DELETE existing past-paper", False, "No item ID provided (creation failed)")
        return
    
    try:
        response = requests.delete(f"{API_BASE}/past-papers/{item_id}", timeout=10)
        
        if response.status_code == 204:
            log_test("DELETE existing past-paper returns 204", True, 
                    f"Successfully deleted {item_id}")
            # Remove from tracking
            if item_id in created_ids:
                created_ids.remove(item_id)
        else:
            log_test("DELETE existing past-paper returns 204", False, 
                    f"Expected 204, got {response.status_code}, Body: {response.text}")
    except Exception as e:
        log_test("DELETE existing past-paper returns 204", False, f"Exception: {str(e)}")


def test_delete_nonexistent():
    """Test 11: DELETE /api/past-papers/does-not-exist returns 404."""
    try:
        response = requests.delete(f"{API_BASE}/past-papers/does-not-exist", timeout=10)
        
        if response.status_code == 404:
            log_test("DELETE non-existent past-paper returns 404", True, 
                    f"Correctly returned 404")
        else:
            log_test("DELETE non-existent past-paper returns 404", False, 
                    f"Expected 404, got {response.status_code}")
    except Exception as e:
        log_test("DELETE non-existent past-paper returns 404", False, f"Exception: {str(e)}")


def cleanup_created_items():
    """Clean up any remaining test items."""
    print("\n🧹 Cleaning up test data...")
    for item_id in created_ids[:]:
        try:
            response = requests.delete(f"{API_BASE}/past-papers/{item_id}", timeout=10)
            if response.status_code == 204:
                print(f"  Deleted {item_id}")
                created_ids.remove(item_id)
        except Exception as e:
            print(f"  Failed to delete {item_id}: {e}")


def print_summary():
    """Print test summary."""
    print("\n" + "="*70)
    print("TEST SUMMARY")
    print("="*70)
    
    passed = sum(1 for t in test_results if t["passed"])
    failed = sum(1 for t in test_results if not t["passed"])
    total = len(test_results)
    
    print(f"\nTotal: {total} tests")
    print(f"✅ Passed: {passed}")
    print(f"❌ Failed: {failed}")
    
    if failed > 0:
        print("\n❌ FAILED TESTS:")
        for t in test_results:
            if not t["passed"]:
                print(f"  - {t['name']}")
                if t["details"]:
                    print(f"    {t['details']}")
    
    print("\n" + "="*70)
    
    return failed == 0


def main():
    """Run all tests."""
    print("="*70)
    print("PAST-PAPER API TEST SUITE")
    print("="*70)
    print(f"Backend URL: {BASE_URL}")
    print(f"API Base: {API_BASE}")
    print("="*70 + "\n")
    
    # Run tests in order
    test_root_endpoint()
    initial_count = test_list_past_papers_initial()
    
    mcq_id = test_create_mcq()
    typed_id = test_create_typed_response()
    exam_id = test_create_exam_style()
    
    test_filter_by_subject()
    test_filter_by_answer_type()
    
    test_invalid_mcq_missing_answer()
    test_invalid_answer_type()
    
    test_delete_existing(mcq_id)
    test_delete_nonexistent()
    
    # Cleanup remaining items
    cleanup_created_items()
    
    # Print summary
    all_passed = print_summary()
    
    sys.exit(0 if all_passed else 1)


if __name__ == "__main__":
    main()
