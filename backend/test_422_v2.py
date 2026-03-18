import asyncio
import sys
import os
import uuid
import httpx

sys.path.append(os.getcwd())

from app.core.security import create_access_token
from app.infrastructure.database import async_session_factory
from app.modules.identity.models import User
from sqlalchemy import select

async def get_borrower_token():
    async with async_session_factory() as session:
        result = await session.execute(select(User).where(User.email == "borrower@brickbanq.com"))
        user = result.scalar_one_or_none()
        if not user:
            print("Borrower not found!")
            return None
        token = create_access_token(
            subject=str(user.id),
            roles=[r.role_type.value for r in user.roles]
        )
        return token

async def main():
    token = await get_borrower_token()
    if not token:
        return
        
    print(f"Got token for borrower: {token[:20]}...")
    
    async with httpx.AsyncClient() as client:
        resp = await client.get("http://localhost:8000/api/v1/notifications/", headers={
            "Authorization": f"Bearer {token}"
        })
        print("Status (No Params):", resp.status_code)
        print("Response:", resp.json() if resp.status_code < 500 else resp.text)
        
        # What if we pass empty object for params?
        resp2 = await client.get("http://localhost:8000/api/v1/notifications/?", headers={
            "Authorization": f"Bearer {token}"
        })
        print("Status (Empty Query):", resp2.status_code)

if __name__ == "__main__":
    asyncio.run(main())
