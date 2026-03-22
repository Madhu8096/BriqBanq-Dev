import asyncio
from sqlalchemy import text
from app.infrastructure.database import engine

async def debug_roles():
    async with engine.connect() as conn:
        print("--- USERS ---")
        res = await conn.execute(text("SELECT id, email, first_name, status FROM users"))
        users = res.fetchall()
        for u in users:
            print(u)
            
        print("\n--- USER ROLES ---")
        res = await conn.execute(text("SELECT user_id, role_type, status FROM user_roles"))
        roles = res.fetchall()
        for r in roles:
            print(r)

if __name__ == "__main__":
    asyncio.run(debug_roles())
