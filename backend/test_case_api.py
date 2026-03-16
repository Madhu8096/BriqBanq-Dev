import asyncio
import sys
import os
import json
import urllib.request
import urllib.parse
from urllib.error import HTTPError

# Add current dir to path for app imports
sys.path.append(os.getcwd())

from app.infrastructure.database import async_session_factory
from app.modules.identity.service import UserService

async def test_endpoint():
    async with async_session_factory() as db:
        service = UserService(db)
        try:
            tokens = await service.authenticate("borrower@brickbanq.com", "Borrower123!", "test-trace")
            print("Login successful! Token acquired.")
            token = tokens.access_token
        except Exception as e:
            print(f"Login failed: {e}")
            return

    # Now test the endpoint
    url = "http://localhost:8000/api/v1/cases/"
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    payload = {
        "title": "Test Case via HTTP",
        "description": "testing auth",
        "property_address": "123 Test St",
        "property_type": "House",
        "estimated_value": 500000,
        "outstanding_debt": 400000
    }
    data = json.dumps(payload).encode('utf-8')
    req = urllib.request.Request(url, data=data, headers=headers, method='POST')
    try:
        print("Sending POST /api/v1/cases/...")
        response = urllib.request.urlopen(req)
        print(f"Status Code: {response.getcode()}")
        print(f"Response Body: {response.read().decode('utf-8')}")
    except HTTPError as e:
        print(f"HTTP Error: {e.code}")
        print(f"Response Body: {e.read().decode('utf-8')}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    asyncio.run(test_endpoint())
