import requests
import json

url = "http://localhost:8000/api/v1/identity/login"
payload = {
    "email": "admin@brickbanq.com",
    "password": "Password123!"
}

print(f"Testing login at {url}...")
try:
    response = requests.post(url, json=payload)
    print(f"Status Code: {response.status_code}")
    print(f"Response Body: {response.text}")
except Exception as e:
    print(f"Error: {e}")
