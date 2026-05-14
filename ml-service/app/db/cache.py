"""Redis cache wrapper used by recommendation routes."""

from __future__ import annotations

import json
import os
from typing import Any

import redis


_client: redis.Redis | None = None


def get_client() -> redis.Redis:
    global _client
    if _client is None:
        url = os.environ.get("REDIS_URL", "redis://localhost:6379")
        _client = redis.Redis.from_url(url, decode_responses=True)
    return _client


def get_json(key: str) -> Any | None:
    try:
        raw = get_client().get(key)
    except redis.RedisError:
        return None
    if raw is None:
        return None
    try:
        return json.loads(raw)
    except json.JSONDecodeError:
        return None


def set_json(key: str, value: Any, ttl_seconds: int = 3600) -> None:
    try:
        get_client().set(key, json.dumps(value), ex=ttl_seconds)
    except redis.RedisError:
        pass
