
import asyncio
import asyncpg

async def run():
    conn = await asyncpg.connect("postgresql://brickbanq:brickbanq@localhost:5432/brickbanq")
    try:
        cases_count = await conn.fetchval("SELECT count(*) FROM cases")
        docs_count = await conn.fetchval("SELECT count(*) FROM documents")
        users_count = await conn.fetchval("SELECT count(*) FROM users")
        
        print(f"RAW DB CHECK:")
        print(f"  Users: {users_count}")
        print(f"  Cases: {cases_count}")
        print(f"  Docs: {docs_count}")
        
        # Also check settlement just in case
        settlements_count = await conn.fetchval("SELECT count(*) FROM settlements")
        print(f"  Settlements: {settlements_count}")
    except Exception as e:
        print(f"Error: {e}")
    finally:
        await conn.close()

if __name__ == "__main__":
    asyncio.run(run())
