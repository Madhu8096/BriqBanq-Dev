import asyncio
import asyncpg

async def run():
    # Use password from .env: brickbanq
    conn = await asyncpg.connect("postgresql://brickbanq:brickbanq@localhost:5432/brickbanq")
    try:
        print("--- USERS ---")
        users = await conn.fetch("SELECT id, email, first_name, status FROM users")
        for u in users:
            print(f"ID: {u['id']}, Email: {u['email']}, Name: {u['first_name']}, Status: {u['status']}")
            
        print("\n--- USER ROLES ---")
        roles = await conn.fetch("SELECT user_id, role_type, status FROM user_roles")
        for r in roles:
            print(f"UserID: {r['user_id']}, Role: {r['role_type']}, Status: {r['status']}")
    finally:
        await conn.close()

if __name__ == "__main__":
    asyncio.run(run())
