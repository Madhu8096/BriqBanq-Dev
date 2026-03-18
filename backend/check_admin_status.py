import asyncio
from sqlalchemy import text
from app.infrastructure.database import engine

async def check_admin():
    async with engine.connect() as conn:
        res = await conn.execute(text("SELECT email, length(hashed_password) as hash_len FROM users WHERE email = 'admin@brickbanq.com'"))
        row = res.fetchone()
        print(f"DEBUG_CHECK: {row}")

if __name__ == "__main__":
    asyncio.run(check_admin())
