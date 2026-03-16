
import asyncio
import os
import sys
from sqlalchemy import text

# Add current dir to path for app imports
sys.path.append(os.getcwd())

from app.infrastructure.database import async_session_factory

async def verify():
    async with async_session_factory() as db:
        cases_count = await db.execute(text('SELECT count(*) FROM cases'))
        docs_count = await db.execute(text('SELECT count(*) FROM documents'))
        users_count = await db.execute(text('SELECT count(*) FROM users'))
        
        c = cases_count.scalar()
        d = docs_count.scalar()
        u = users_count.scalar()
        
        print(f"Verification Results:", flush=True)
        print(f"  Total Users: {u}", flush=True)
        print(f"  Total Cases: {c}", flush=True)
        print(f"  Total Documents: {d}", flush=True)
        
        if c >= 5:
            print("SUCCESS: At least 5 cases found.", flush=True)
        else:
            print("FAILURE: Less than 5 cases found.", flush=True)

if __name__ == "__main__":
    asyncio.run(verify())
