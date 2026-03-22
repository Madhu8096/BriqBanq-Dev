import asyncio
import uuid
import sys
import os
import bcrypt
from sqlalchemy import text
from sqlalchemy.ext.asyncio import create_async_engine

# Add current dir to path for app imports
sys.path.append(os.getcwd())

from app.core.config import settings

async def seed_admin():
    print(f"Connecting to: {settings.database_url}")
    
    # Create a fresh engine for the seed process
    local_engine = create_async_engine(settings.database_url)
    
    try:
        email = "admin@brickbanq.com"
        password = "AdminPassword123!"
        # Use bcrypt directly to avoid passlib 72-byte bug
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
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
                user_id = row[0]
                print(f"Admin {email} exists (ID: {user_id}). Updating password to ensure it matches...")
                await conn.execute(
                    text("UPDATE users SET hashed_password = :password, updated_at = NOW() WHERE email = :email"),
                    {"email": email, "password": hashed_password}
                )
                print("Password updated successfully.")
                
                print("Checking for ADMIN role...")
                role_result = await conn.execute(
                    text("SELECT id, status FROM user_roles WHERE user_id = :user_id AND role_type = 'ADMIN'"),
                    {"user_id": user_id}
                )
                role_row = role_result.fetchone()
                
                if not role_row:
                    print("ADMIN role missing. Adding and approving...")
                    role_id = uuid.uuid4()
                    await conn.execute(
                        text("""
                            INSERT INTO user_roles (id, user_id, role_type, status, created_at, updated_at, version, approved_by)
                            VALUES (:id, :user_id, 'ADMIN', 'APPROVED', NOW(), NOW(), 1, :user_id)
                        """),
                        {"id": role_id, "user_id": user_id}
                    )
                    print("ADMIN role added.")
                elif role_row[1] != 'APPROVED':
                    print(f"ADMIN role exists but status is {role_row[1]}. Approving...")
                    await conn.execute(
                        text("UPDATE user_roles SET status = 'APPROVED', updated_at = NOW() WHERE id = :id"),
                        {"id": role_row[0]}
                    )
                    print("ADMIN role approved.")
                else:
                    print("ADMIN role already exists and is approved.")
    except Exception as e:
        print(f"Seeding failed: {type(e).__name__}: {e}")
    finally:
        await local_engine.dispose()

if __name__ == "__main__":
    asyncio.run(seed_admin())
