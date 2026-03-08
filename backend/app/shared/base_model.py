"""
Base model mixin providing UUID primary keys, timestamps, and version columns.
Every domain model inherits from this.
"""

import uuid
from datetime import datetime, timezone

from sqlalchemy import Column, DateTime, Integer, String
from sqlalchemy.dialects.postgresql import UUID


class UUIDMixin:
    """UUID primary key mixin."""
    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        nullable=False,
    )


class TimestampMixin:
    """Created/updated timestamp mixin."""
    created_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )
    updated_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )


class ImmutableTimestampMixin:
    """Created-only timestamp for immutable records (audit_logs, ledger_entries)."""
    created_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )


class VersionMixin:
    """Optimistic locking via version column."""
    version = Column(
        Integer,
        default=1,
        nullable=False,
    )


class BaseEntityMixin(UUIDMixin, TimestampMixin, VersionMixin):
    """Standard mixin for mutable domain entities: UUID + timestamps + version."""
    pass


class ImmutableEntityMixin(UUIDMixin, ImmutableTimestampMixin):
    """Mixin for immutable records (no updated_at, no version): UUID + created_at only."""
    pass
