"""Cold-start recommendations — popular items by aggregated behaviour weight."""

from __future__ import annotations

from app.db import postgres
from app.db.cache import get_json, set_json


CACHE_KEY = "shopai:popular"


def popular(limit: int = 10) -> list[int]:
    cached = get_json(f"{CACHE_KEY}:{limit}")
    if cached is not None:
        return cached

    df = postgres.load_behaviors()
    if df.empty:
        # No behaviours yet — return product IDs sorted by AI-flag (fallback to first N).
        prods = postgres.load_products()
        if prods.empty:
            return []
        out = [int(x) for x in prods["id"].head(limit).tolist()]
    else:
        agg = df.groupby("product_id")["weight"].sum().sort_values(ascending=False).head(limit)
        out = [int(x) for x in agg.index.tolist()]

    set_json(f"{CACHE_KEY}:{limit}", out, ttl_seconds=600)
    return out
