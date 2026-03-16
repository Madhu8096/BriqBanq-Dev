"""
Redis infrastructure module.
Used for token blacklisting, rate limiting, and caching.
"""

from typing import Optional

import structlog
import redis.asyncio as aioredis
from redis.exceptions import ConnectionError, TimeoutError

from app.core.config import settings

logger = structlog.get_logger()


class RedisClient:
    """Async Redis client wrapper with graceful degradation."""

    def __init__(self):
        self._redis: Optional[aioredis.Redis] = None
        self._is_enabled: bool = True
        self._conn_error_logged: bool = False

    async def connect(self):
        """Initialize Redis connection and check connectivity."""
        try:
            self._redis = aioredis.from_url(
                settings.redis_url,
                encoding="utf-8",
                decode_responses=True,
                socket_connect_timeout=2,
            )
            # Verify connection
            await self._redis.ping()
            self._is_enabled = True
            logger.info("redis_connected")
        except (ConnectionError, TimeoutError, Exception) as e:
            self._is_enabled = False
            if not self._conn_error_logged:
                logger.warning("redis_connection_failed_falling_back", error=str(e))
                self._conn_error_logged = True

    async def disconnect(self):
        """Close Redis connection."""
        if self._redis:
            try:
                await self._redis.close()
            except Exception:
                pass

    async def get(self, key: str) -> Optional[str]:
        """Get a value by key with fallback."""
        if not self._is_enabled or not self._redis:
            return None
        try:
            return await self._redis.get(key)
        except (ConnectionError, TimeoutError) as e:
            self._handle_conn_failure(e)
            return None

    async def set(self, key: str, value: str, expire: Optional[int] = None) -> None:
        """Set a key-value pair with fallback."""
        if not self._is_enabled or not self._redis:
            return
        try:
            await self._redis.set(key, value, ex=expire)
        except (ConnectionError, TimeoutError) as e:
            self._handle_conn_failure(e)

    async def delete(self, key: str) -> None:
        """Delete a key with fallback."""
        if not self._is_enabled or not self._redis:
            return
        try:
            await self._redis.delete(key)
        except (ConnectionError, TimeoutError) as e:
            self._handle_conn_failure(e)

    async def exists(self, key: str) -> bool:
        """Check if a key exists with fallback."""
        if not self._is_enabled or not self._redis:
            return False
        try:
            return await self._redis.exists(key) > 0
        except (ConnectionError, TimeoutError) as e:
            self._handle_conn_failure(e)
            return False

    async def incr(self, key: str) -> int:
        """Increment a key with fallback."""
        if not self._is_enabled or not self._redis:
            return 0
        try:
            return await self._redis.incr(key)
        except (ConnectionError, TimeoutError) as e:
            self._handle_conn_failure(e)
            return 0

    async def expire(self, key: str, seconds: int) -> None:
        """Set expiry on a key with fallback."""
        if not self._is_enabled or not self._redis:
            return
        try:
            await self._redis.expire(key, seconds)
        except (ConnectionError, TimeoutError) as e:
            self._handle_conn_failure(e)

    def _handle_conn_failure(self, error: Exception):
        """Handle Redis connection failure by disabling client."""
        self._is_enabled = False
        if not self._conn_error_logged:
            logger.warning("redis_connection_lost_disabling_features", error=str(error))
            self._conn_error_logged = True


# Singleton Redis client
redis_client = RedisClient()
