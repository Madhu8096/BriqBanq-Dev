import requests
import json

url = "http://localhost:8000/api/v1/identity/login"
payload = {"email": "admin@brickbanq.com", "password": "Password123!"}

print(f"Testing login at {url}...")
try:
    response = requests.post(url, json=payload)
    print(f"Status Code: {response.status_code}")
    print(f"Response Body: {response.json() if response.status_code == 200 else response.text}")
    
    if response.status_code == 200:
        token = response.json()['access_token']
        print("\nLogin successful. Testing /me endpoint...")
        me_url = "http://localhost:8000/api/v1/identity/me"
        headers = {"Authorization": f"Bearer {token}"}
        me_response = requests.get(me_url, headers=headers)
        print(f"Status Code: {me_response.status_code}")
        print(f"Response Body: {me_response.text}")
except Exception as e:
    print(f"Error: {e}")
