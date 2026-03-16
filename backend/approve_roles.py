import asyncio
import asyncpg

async def run():
    conn = await asyncpg.connect("postgresql://brickbanq:brickbanq@localhost:5432/brickbanq")
    try:
        updated = await conn.execute("UPDATE user_roles SET status='APPROVED' WHERE status='PENDING' OR status IS NULL")
        print(f"Updated roles: {updated}")
    finally:
        await conn.close()

if __name__ == "__main__":
    asyncio.run(run())
