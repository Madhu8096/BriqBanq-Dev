import asyncio
import httpx
import os
import sys

async def main():
    async with httpx.AsyncClient() as client:
        # 1. Login
        login_resp = await client.post("http://localhost:8000/api/v1/identity/login", json={
            "email": "sarah.borrower@example.com",
            "password": "Password123!"
        })
        if login_resp.status_code != 200:
            print(f"Login failed: {login_resp.status_code} {login_resp.json()}")
            return
            
        token = login_resp.json().get("access_token")
        
        # 2. Get notifications
        resp = await client.get("http://localhost:8000/api/v1/notifications/", headers={
            "Authorization": f"Bearer {token}"
        })
        
        print(f"Status: {resp.status_code}")
        print(f"Body: {resp.json()}")

if __name__ == "__main__":
    asyncio.run(main())
