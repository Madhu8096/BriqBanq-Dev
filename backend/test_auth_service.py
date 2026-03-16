import asyncio
import sys
import os

# Add current dir to path for app imports
sys.path.append(os.getcwd())

from app.infrastructure.database import async_session_factory
from app.modules.identity.service import UserService

async def check():
    async with async_session_factory() as db:
        service = UserService(db)
        try:
            tokens = await service.authenticate("borrower@brickbanq.com", "Borrower123!", "test-trace")
            print("Login successful!")
            print("Token roles:", tokens.access_token)
        except Exception as e:
            print(f"Login failed: {type(e).__name__} - {e}")
            import traceback
            traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(check())
