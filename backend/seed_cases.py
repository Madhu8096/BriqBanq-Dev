
import asyncio
import uuid
import sys
import os
from decimal import Decimal
from unittest.mock import MagicMock, AsyncMock
from sqlalchemy import text, inspect
from sqlalchemy.ext.asyncio import create_async_engine

# Add current dir to path for app imports
sys.path.append(os.getcwd())

# 1. Mock storage_client before imports
import app.infrastructure.storage
mock_storage = AsyncMock()
mock_storage.upload_file.return_value = "mocked_key"
app.infrastructure.storage.storage_client = mock_storage

# 2. Import all models to populate Base.metadata
from app.infrastructure.database import Base, engine, async_session_factory, init_db
import app.modules.identity.models
import app.modules.roles.models
import app.modules.cases.models
import app.modules.documents.models
import app.modules.audit.models
import app.modules.kyc.models

from app.core.config import settings
from app.modules.cases.service import CaseService
from app.modules.documents.service import DocumentService

# Minimal valid PDF content
DUMMY_PDF_CONTENT = b'%PDF-1.1\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R >>\nendobj\n4 0 obj\n<< /Length 44 >>\nstream\nBT /F1 24 Tf 100 700 Td (Dummy Document) Tj ET\nendstream\nendobj\nxref\n0 5\n0000000000 65535 f\n0000000009 00000 n\n0000000058 00000 n\n0000000115 00000 n\n0000000193 00000 n\ntrailer\n<< /Size 5 /Root 1 0 R >>\nstartxref\n288\n%%EOF'

SAMPLES = [
    {
        "title": "45 Victoria Street Apartment",
        "address": "45 Victoria Street, Potts Point, NSW 2011",
        "type": "Apartment",
        "val": 1250000,
        "debt": 980000,
        "desc": "Mortgage in possession case - default on repayment."
    },
    {
        "title": "12 Ocean View Road",
        "address": "12 Ocean View Road, Bondi, NSW 2026",
        "type": "House",
        "val": 3500000,
        "debt": 2100000,
        "desc": "High-value residential property under resolution."
    },
    {
        "title": "88 Business Core Plaza",
        "address": "88 Business Core Plaza, Melbourne, VIC 3000",
        "type": "Office",
        "val": 5600000,
        "debt": 4200000,
        "desc": "Commercial property default after business insolvency."
    },
    {
        "title": "7 Suburban Way",
        "address": "7 Suburban Way, Parramatta, NSW 2150",
        "type": "Townhouse",
        "val": 1100000,
        "debt": 850000,
        "desc": "Suburban townhouse case with multiple missed payments."
    },
    {
        "title": "22 Industrial Loop",
        "address": "22 Industrial Loop, Sunshine, VIC 3020",
        "type": "Warehouse",
        "val": 2800000,
        "debt": 1950000,
        "desc": "Industrial warehouse security enforcement."
    }
]

async def seed_cases():
    print(f"Connecting to: {settings.database_url}")
    
    try:
        # Step 1: Initialize DB (Create tables if they don't exist)
        print("Initializing database tables...")
        await init_db()
        print("Database tables initialized.")

        borrower_email = "borrower@brickbanq.com"
        borrower_id = None
        
        async with engine.connect() as conn:
            print(f"Checking if borrower {borrower_email} exists...")
            result = await conn.execute(
                text("SELECT id FROM users WHERE email = :email"),
                {"email": borrower_email}
            )
            row = result.fetchone()
            
            if row:
                borrower_id = row[0]
            else:
                print(f"Borrower {borrower_email} not found. Seeding a default borrower...")
                borrower_id = uuid.uuid4()
                # Use a hardcoded hash for "Borrower123!" to avoid bcrypt issues in some environments
                # Generated with: passlib.hash.bcrypt.hash("Borrower123!")
                hashed = "$2b$12$S.O7mX9e.f5qjH.VjO1e.eYg9/EqzY/sV/Bv.C./Vz.fO.fG.fG.f." # Dummy for now, or just use a simpler hash if needed
                # Actually, let's try a simpler approach for the seed: 
                # If passlib fails, we just use the raw text and fix it later if needed, 
                # but let's try one more time with a very simple one.
                try:
                    from passlib.context import CryptContext
                    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
                    hashed = pwd_context.hash("Borrower123!")
                except Exception as e:
                    print(f"Hashing failed: {e}. Using a fallback dummy hash.")
                    hashed = "$2b$12$7kP.Hl6K5n5S.G.G.G.G.G.G.G.G.G.G.G.G.G.G.G.G.G.G.G.G"

                async with engine.begin() as trans_conn:
                    await trans_conn.execute(
                        text("""
                            INSERT INTO users (id, email, hashed_password, first_name, last_name, status, created_at, updated_at, version)
                            VALUES (:id, :email, :password, 'Sample', 'Borrower', 'ACTIVE', NOW(), NOW(), 1)
                        """),
                        {
                            "id": borrower_id,
                            "email": borrower_email,
                            "password": hashed
                        }
                    )
                    # Add role
                    await trans_conn.execute(
                        text("""
                            INSERT INTO user_roles (id, user_id, role_type, status, created_at, updated_at, version)
                            VALUES (:id, :user_id, 'BORROWER', 'APPROVED', NOW(), NOW(), 1)
                        """),
                        {
                            "id": uuid.uuid4(),
                            "user_id": borrower_id
                        }
                    )
            
            print(f"Using borrower_id: {borrower_id}")

        async with async_session_factory() as db:
            case_service = CaseService(db)
            doc_service = DocumentService(db)
            
            if isinstance(borrower_id, str):
                borrower_id = uuid.UUID(borrower_id)

            for i, sample in enumerate(SAMPLES):
                print(f"Creating case {i+1}: {sample['title']}...")
                try:
                    case = await case_service.create_case(
                        borrower_id=borrower_id,
                        title=sample['title'],
                        description=sample['desc'],
                        property_address=sample['address'],
                        property_type=sample['type'],
                        estimated_value=Decimal(str(sample['val'])),
                        outstanding_debt=Decimal(str(sample['debt'])),
                        trace_id=f"seed-trace-{i}"
                    )
                    print(f"  Case created: {case.id}")
                    
                    # Upload 3 dummy docs for each case
                    doc_types = ["LOAN_AGREEMENT", "VALUATION_REPORT", "IDENTITY_PROOF"]
                    for doc_type in doc_types:
                        print(f"    Uploading {doc_type}...")
                        doc = await doc_service.upload_document(
                            case_id=case.id,
                            uploaded_by=borrower_id,
                            document_name=f"{doc_type.replace('_', ' ').title()}",
                            document_type=doc_type,
                            file_name=f"{doc_type.lower()}.pdf",
                            file_size=len(DUMMY_PDF_CONTENT),
                            content_type="application/pdf",
                            file_content=DUMMY_PDF_CONTENT,
                            trace_id=f"seed-trace-{i}-doc"
                        )
                        print(f"      Document ID: {doc.id}")
                    
                    # Submit the case (Draft to Submitted)
                    await case_service.submit_case(case.id, borrower_id, trace_id=f"seed-submit-{i}")
                    print(f"  Case {case.id} submitted.")
                    
                except Exception as e:
                    print(f"  Error creating case {i+1}: {e}")
                    import traceback
                    traceback.print_exc()
                
            await db.commit()
            print("Seeding process finished.")

    except Exception as e:
        print(f"Global Seeding Error: {type(e).__name__}: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(seed_cases())
