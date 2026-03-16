import asyncio
import asyncpg
import json

async def test_backend():
    try:
        conn = await asyncpg.connect('postgresql://brickbanq:brickbanq@localhost:5432/brickbanq')
        
        # Get a case ID
        case = await conn.fetchrow('SELECT id, borrower_id FROM cases LIMIT 1')
        if not case:
            print("No cases found in database.")
            await conn.close()
            return

        case_id = case['id']
        borrower_id = case['borrower_id']
        print(f"Testing with Case ID: {case_id}")

        # Check borrower name from identity table
        borrower = await conn.fetchrow('SELECT first_name, last_name FROM users WHERE id = $1', borrower_id)
        if borrower:
            print(f"Expected Borrower Name: {borrower['first_name']} {borrower['last_name']}")
        else:
            print("Borrower not found in users table.")

        await conn.close()
    except Exception as e:
        print(f"Error during test: {e}")

if __name__ == "__main__":
    asyncio.run(test_backend())
