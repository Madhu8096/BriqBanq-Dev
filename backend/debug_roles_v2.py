import asyncio
from sqlalchemy import text
from app.infrastructure.database import engine

async def debug_roles():
    async with engine.connect() as conn:
        try:
            print("--- USERS ---")
            res = await conn.execute(text("SELECT id, email, first_name, status FROM users"))
            users = res.fetchall()
            for u in users:
                print(f"User: {u.id}, Email: {u.email}, Name: {u.first_name}, Status: {u.status}")
                
            print("\n--- USER ROLES (Detailed) ---")
            res = await conn.execute(text("SELECT user_id, role_type, status FROM user_roles"))
            roles = res.fetchall()
            for r in roles:
                print(f"UserID: {r.user_id}, Role: {r.role_type}, Status: {r.status}")
        except Exception as e:
            print(f"Error during check: {e}")

if __name__ == "__main__":
    asyncio.run(debug_roles())
