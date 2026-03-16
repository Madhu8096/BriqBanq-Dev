import urllib.request
import urllib.error
import json
import base64

url = "http://localhost:8000/api/v1/identity/login"
payload = json.dumps({"email": "borrower@brickbanq.com", "password": "Borrower123!"}).encode('utf-8')
headers = {"Content-Type": "application/json"}

try:
    req = urllib.request.Request(url, data=payload, headers=headers)
    response = urllib.request.urlopen(req)
    data = json.loads(response.read().decode())
    token = data["access_token"]
    print("Token fetched")
    
    parts = token.split('.')
    if len(parts) == 3:
        # pad base64
        padded = parts[1] + '=' * (4 - len(parts[1]) % 4)
        print("Payload:", base64.urlsafe_b64decode(padded).decode('utf-8'))
except urllib.error.HTTPError as e:
    print(f"HTTP Error {e.code}: {e.read().decode('utf-8', errors='ignore')}")
except Exception as e:
    print("Error:", str(e))
