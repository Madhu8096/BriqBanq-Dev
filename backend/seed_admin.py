import asyncio
import uuid
import sys
import os
from passlib.context import CryptContext
from sqlalchemy import text
from sqlalchemy.ext.asyncio import create_async_engine

# Add current dir to path for app imports
sys.path.append(os.getcwd())

from app.core.config import settings

password_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

async def seed_admin():
    print(f"Connecting to: {settings.database_url}")
    
    # Create a fresh engine for the seed process
    local_engine = create_async_engine(settings.database_url)
    
    try:
        email = "admin@brickbanq.com"
        password = "AdminPassword123!"
        hashed_password = password_context.hash(password)
        user_id = uuid.uuid4()
        
        async with local_engine.begin() as conn:
            print(f"Checking if user {email} exists...")
            result = await conn.execute(
                text("SELECT id FROM users WHERE email = :email"),
                {"email": email}
            )
            row = result.fetchone()
            
            if not row:
                print(f"Creating user {email}...")
                await conn.execute(
                    text("""
                        INSERT INTO users (id, email, hashed_password, first_name, last_name, status, created_at, updated_at, version)
                        VALUES (:id, :email, :password, :first, :last, 'ACTIVE', NOW(), NOW(), 1)
                    """),
                    {
                        "id": user_id,
                        "email": email,
                        "password": hashed_password,
                        "first": "Admin",
                        "last": "User"
                    }
                )
                
                print("Requesting and approving ADMIN role...")
                role_id = uuid.uuid4()
                await conn.execute(
                    text("""
                        INSERT INTO user_roles (id, user_id, role_type, status, created_at, updated_at, version, approved_by)
                        VALUES (:id, :user_id, 'ADMIN', 'APPROVED', NOW(), NOW(), 1, :user_id)
                    """),
                    {
                        "id": role_id,
                        "user_id": user_id
                    }
                )
                print("Seeding successful.")
            else:
                print(f"Admin {email} exists. Updating password to ensure it matches...")
                await conn.execute(
                    text("UPDATE users SET hashed_password = :password, updated_at = NOW() WHERE email = :email"),
                    {"email": email, "password": hashed_password}
                )
                print("Password updated successfully.")
    except Exception as e:
        print(f"Seeding failed: {type(e).__name__}: {e}")
    finally:
        await local_engine.dispose()

if __name__ == "__main__":
    asyncio.run(seed_admin())
