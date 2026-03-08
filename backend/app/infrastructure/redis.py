"""
Redis infrastructure module.
Used for token blacklisting, rate limiting, and caching.
"""

from typing import Optional

import redis.asyncio as aioredis

from app.core.config import settings


class RedisClient:
    """Async Redis client wrapper."""

    def __init__(self):
        self._redis: Optional[aioredis.Redis] = None

    async def connect(self):
        """Initialize Redis connection."""
        self._redis = aioredis.from_url(
            settings.redis_url,
            encoding="utf-8",
            decode_responses=True,
        )

    async def disconnect(self):
        """Close Redis connection."""
        if self._redis:
            await self._redis.close()

    async def get(self, key: str) -> Optional[str]:
        """Get a value by key."""
        if self._redis:
            return await self._redis.get(key)
        return None

    async def set(self, key: str, value: str, expire: Optional[int] = None) -> None:
        """Set a key-value pair with optional expiry in seconds."""
        if self._redis:
            await self._redis.set(key, value, ex=expire)

    async def delete(self, key: str) -> None:
        """Delete a key."""
        if self._redis:
            await self._redis.delete(key)

    async def exists(self, key: str) -> bool:
        """Check if a key exists."""
        if self._redis:
            return await self._redis.exists(key) > 0
        return False

    async def incr(self, key: str) -> int:
        """Increment a key."""
        if self._redis:
            return await self._redis.incr(key)
        return 0

    async def expire(self, key: str, seconds: int) -> None:
        """Set expiry on a key."""
        if self._redis:
            await self._redis.expire(key, seconds)


# Singleton Redis client
redis_client = RedisClient()
