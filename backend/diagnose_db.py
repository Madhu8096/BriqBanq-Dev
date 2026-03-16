
import asyncio
import os
import sys
from sqlalchemy import text, inspect
from sqlalchemy.ext.asyncio import create_async_engine

# Add current dir to path for app imports
sys.path.append(os.getcwd())

from app.core.config import settings

async def diagnose():
    print(f"Connecting to: {settings.database_url}")
    engine = create_async_engine(settings.database_url)
    
    async with engine.connect() as conn:
        def get_info(sync_conn):
            insp = inspect(sync_conn)
            tables = insp.get_table_names()
            print(f"Tables found: {tables}")
            for table in tables:
                res = sync_conn.execute(text(f"SELECT count(*) FROM {table}"))
                count = res.scalar()
                print(f"  Table '{table}': {count} records")
                
        await conn.run_sync(get_info)
    
    await engine.dispose()

if __name__ == "__main__":
    asyncio.run(diagnose())
