
import asyncio
import os
import sys
from sqlalchemy import text
from sqlalchemy.ext.asyncio import create_async_engine

# Add current dir to path for app imports
sys.path.append(os.getcwd())

from app.core.config import settings

async def check_enum():
    print(f"Connecting to: {settings.database_url}")
    engine = create_async_engine(settings.database_url)
    
    async with engine.connect() as conn:
        result = await conn.execute(text("SELECT enumlabel FROM pg_enum JOIN pg_type ON pg_enum.enumtypid = pg_type.oid WHERE pg_type.typname = 'case_status';"))
        labels = [row[0] for row in result]
        print(f"Current 'case_status' enum values: {labels}")
        
        result_deal = await conn.execute(text("SELECT enumlabel FROM pg_enum JOIN pg_type ON pg_enum.enumtypid = pg_type.oid WHERE pg_type.typname = 'deal_status';"))
        labels_deal = [row[0] for row in result_deal]
        print(f"Current 'deal_status' enum values: {labels_deal}")
    
    await engine.dispose()

if __name__ == "__main__":
    asyncio.run(check_enum())
