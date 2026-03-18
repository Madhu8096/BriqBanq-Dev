import asyncio
import os
import sys

# Add current dir to path
sys.path.append(os.getcwd())

from app.infrastructure.database import async_session_factory
from app.modules.notifications.service import NotificationService
import uuid
from sqlalchemy import select
from app.modules.identity.models import User

async def main():
    async with async_session_factory() as db:
        user = await db.scalar(select(User).where(User.email == "borrower@brickbanq.com"))
        if not user:
            print("No borrower")
            return
            
        print("Borrower:", user.id)
        
        service = NotificationService(db)
        notifs = await service.get_user_notifications(user.id)
        
        print("Notifs:", notifs)

if __name__ == "__main__":
    asyncio.run(main())
