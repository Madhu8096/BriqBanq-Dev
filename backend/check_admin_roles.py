import asyncio
import asyncpg

async def run():
    conn = await asyncpg.connect("postgresql://brickbanq:brickbanq@localhost:5432/brickbanq")
    try:
        users = await conn.fetch("SELECT id, email FROM users WHERE email='admin@brickbanq.com'")
        for u in users:
            print(f"User: {u['email']} (ID: {u['id']})")
            roles = await conn.fetch("SELECT role_type, status FROM user_roles WHERE user_id=$1", u['id'])
            for r in roles:
                print(f"  Role: {r['role_type']} (Status: {r['status']})")
    finally:
        await conn.close()

if __name__ == "__main__":
    asyncio.run(run())
