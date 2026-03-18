import asyncio
import httpx
import os
import sys

async def main():
    async with httpx.AsyncClient() as client:
        # Let's try to get a token using munigalam48@gmail.com
        login_resp = await client.post("http://localhost:8000/api/v1/identity/login", json={
            "email": "munigalam48@gmail.com",
            # Assuming default password is Password123! based on seed script conventions
            "password": "Password123!" 
        })
        if login_resp.status_code != 200:
            print(f"Login failed: {login_resp.status_code} {login_resp.text}")
            return
            
        token = login_resp.json().get("access_token")
        
        resp1 = await client.get("http://localhost:8000/api/v1/notifications/", headers={
            "Authorization": f"Bearer {token}"
        })
        print(f"Status (No Params): {resp1.status_code}")
        print(f"Body: {resp1.text}")

if __name__ == "__main__":
    asyncio.run(main())
