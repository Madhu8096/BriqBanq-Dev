import asyncio
import asyncpg

async def run():
    conn = await asyncpg.connect("postgresql://brickbanq:brickbanq@localhost:5432/brickbanq")
    try:
        users = await conn.fetch("SELECT id, email, first_name, last_name FROM users")
        for u in users:
            print(f"User: {u['first_name']} {u['last_name']} ({u['email']}) [ID: {u['id']}]")
            roles = await conn.fetch("SELECT role_type, status FROM user_roles WHERE user_id=$1", u['id'])
            for role in roles:
                print(f"  - Role: {role['role_type']}, Status: {role['status']}")
    finally:
        await conn.close()

if __name__ == "__main__":
    asyncio.run(run())
