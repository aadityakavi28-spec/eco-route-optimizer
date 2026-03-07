"""
Redis cache management for high-performance data retrieval
"""
from typing import Optional, Any
import json
import redis
import logging
from functools import wraps

from .config import settings

logger = logging.getLogger(__name__)

# Redis client
redis_client = redis.Redis(
    host=settings.REDIS_HOST,
    port=settings.REDIS_PORT,
    db=settings.REDIS_DB,
    decode_responses=True
)


class CacheKeys:
    """Cache key patterns for consistent naming"""
    TRUCKS = "trucks:all"
    TRUCK_PREFIX = "trucks:{id}"
    SHIPMENTS = "shipments:all"
    SHIPMENT_PREFIX = "shipments:{id}"
    PRICING_PREFIX = "pricing:{route_key}"
    DEMAND_PREFIX = "demand:{route_key}:{date}"
    VEHICLE_POS_PREFIX = "position:{truck_id}"
    USER_PREFIX = "user:{id}"
    ANALYTICS_PREFIX = "analytics:{type}"
    WEATHER_PREFIX = "weather:{location}"


# Cache TTL definitions (in seconds)
CACHE_TTL = {
    'trucks': 60,                    # 1 minute
    'shipments': 60,                 # 1 minute
    'pricing': 300,                   # 5 minutes
    'demand_prediction': 3600,        # 1 hour
    'weather': 900,                   # 15 minutes
    'analytics': 300,                 # 5 minutes
    'vehicle_position': 30,           # 30 seconds
    'route_optimization': 600,        # 10 minutes
}


def cache_result(key: str, ttl: int = 300):
    """
    Decorator to cache function results in Redis
    
    Args:
        key: Cache key (can include {arg} placeholders)
        ttl: Time to live in seconds
    """
    def decorator(func):
        @wraps(func)
        async def async_wrapper(*args, **kwargs):
            # Build cache key
            cache_key = key
            if args:
                # Replace {0}, {1}, etc. with positional args
                for i, arg in enumerate(args):
                    cache_key = cache_key.replace(f'{{{i}}}', str(arg))
            
            # Try to get from cache
            try:
                cached = redis_client.get(cache_key)
                if cached:
                    logger.debug(f"Cache hit: {cache_key}")
                    return json.loads(cached)
            except Exception as e:
                logger.warning(f"Cache read error: {e}")
            
            # Call function
            result = await func(*args, **kwargs)
            
            # Cache result
            try:
                redis_client.setex(cache_key, ttl, json.dumps(result, default=str))
                logger.debug(f"Cached: {cache_key}")
            except Exception as e:
                logger.warning(f"Cache write error: {e}")
            
            return result
        
        @wraps(func)
        def sync_wrapper(*args, **kwargs):
            # Build cache key
            cache_key = key
            if args:
                for i, arg in enumerate(args):
                    cache_key = cache_key.replace(f'{{{i}}}', str(arg))
            
            # Try to get from cache
            try:
                cached = redis_client.get(cache_key)
                if cached:
                    logger.debug(f"Cache hit: {cache_key}")
                    return json.loads(cached)
            except Exception as e:
                logger.warning(f"Cache read error: {e}")
            
            # Call function
            result = func(*args, **kwargs)
            
            # Cache result
            try:
                redis_client.setex(cache_key, ttl, json.dumps(result, default=str))
                logger.debug(f"Cached: {cache_key}")
            except Exception as e:
                logger.warning(f"Cache write error: {e}")
            
            return result
        
        # Return appropriate wrapper based on function type
        import asyncio
        if asyncio.iscoroutinefunction(func):
            return async_wrapper
        return sync_wrapper
    
    return decorator


def invalidate_cache(pattern: str) -> int:
    """
    Invalidate cache keys matching pattern
    
    Args:
        pattern: Pattern to match (e.g., "trucks:*")
    
    Returns:
        Number of keys deleted
    """
    try:
        keys = redis_client.keys(pattern)
        if keys:
            return redis_client.delete(*keys)
    except Exception as e:
        logger.warning(f"Cache invalidation error: {e}")
    return 0


def get_cached(key: str) -> Optional[Any]:
    """Get value from cache"""
    try:
        cached = redis_client.get(key)
        if cached:
            return json.loads(cached)
    except Exception as e:
        logger.warning(f"Cache read error: {e}")
    return None


def set_cached(key: str, value: Any, ttl: int = 300) -> bool:
    """Set value in cache"""
    try:
        redis_client.setex(key, ttl, json.dumps(value, default=str))
        return True
    except Exception as e:
        logger.warning(f"Cache write error: {e}")
        return False


class CacheWarmer:
    """Pre-load frequently accessed data into cache"""
    
    @staticmethod
    def warm_trucks():
        """Pre-cache truck listings"""
        # This would typically fetch from database
        # and populate cache
        pass
    
    @staticmethod
    def warm_shipments():
        """Pre-cache shipment listings"""
        pass
    
    @staticmethod
    def warm_pricing_routes():
        """Pre-cache pricing for popular routes"""
        popular_routes = [
            "delhi-mumbai",
            "delhi-bangalore", 
            "mumbai-bangalore",
            "chennai-hyderabad",
            "kolkata-delhi"
        ]
        # Pre-compute and cache pricing
        pass

