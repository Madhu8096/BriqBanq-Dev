import asyncio
import uuid
from datetime import datetime, timezone
from sqlalchemy import select
from app.infrastructure.database import init_db, get_db_session, Base, engine

# Import ALL models to ensure they are registered with Base.metadata before init_db()
from app.modules.identity.models import User
from app.modules.roles.models import UserRole
from app.modules.kyc.models import KYCRecord
from app.modules.admin.models import PlatformSetting
from app.modules.audit.models import AuditLog
from app.modules.cases.models import Case
from app.modules.deals.models import Deal
from app.modules.auctions.models import Auction
from app.modules.bids.models import Bid
from app.modules.documents.models import Document
from app.modules.wallet.models import Wallet, LedgerEntry
from app.modules.escrow.models import Escrow
from app.modules.contracts.models import Contract, ContractSignature
from app.modules.settlement.models import Settlement
from app.modules.notifications.models import Notification

from app.shared.enums import UserStatus, RoleType, RoleStatus
from app.core.security import hash_password

async def setup():
    print("Initializing database tables...")
    await init_db()
    
    async for db in get_db_session():
        # Check if admin already exists
        result = await db.execute(select(User).where(User.email == "admin@brickbanq.com"))
        admin = result.scalar_one_or_none()
        
        if not admin:
            print("Seeding admin user...")
            admin = User(
                email="admin@brickbanq.com",
                hashed_password=hash_password("Password123!"), # This will also validate complexity
                first_name="Platform",
                last_name="Admin",
                status=UserStatus.ACTIVE
            )
            db.add(admin)
            await db.flush()
            
            # Assign ADMIN role
            admin_role = UserRole(
                user_id=admin.id,
                role_type=RoleType.ADMIN,
                status=RoleStatus.APPROVED
            )
            db.add(admin_role)
            
            # Seed default platform settings
            from app.modules.admin.service import AdminService
            admin_service = AdminService(db)
            await admin_service.seed_default_settings()
            
            await db.commit()
            print(f"Admin user created with ID: {admin.id}")
        else:
            print("Admin user already exists.")
            
    print("Setup complete.")

if __name__ == "__main__":
    asyncio.run(setup())
