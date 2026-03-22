import asyncio
from sqlalchemy import text, inspect
from app.infrastructure.database import engine, Base

async def debug_db():
    async with engine.connect() as conn:
        try:
            print("--- TABLES ---")
            def get_tables(connection):
                return inspect(connection).get_table_names()
            
            tables = await conn.run_sync(get_tables)
            print(f"Tables found: {tables}")
            
            if "users" in tables:
                print("\n--- USERS ---")
                res = await conn.execute(text("SELECT id, email, first_name, status FROM users"))
                for u in res:
                    print(f"User: {u[0]}, Email: {u[1]}, Name: {u[2]}, Status: {u[3]}")
                    
            if "user_roles" in tables:
                print("\n--- USER ROLES ---")
                res = await conn.execute(text("SELECT user_id, role_type, status FROM user_roles"))
                for r in res:
                    print(f"UserID: {r[0]}, Role: {r[1]}, Status: {r[2]}")
                    
        except Exception as e:
            print(f"Error during check: {e}")
            import traceback
            traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(debug_db())
