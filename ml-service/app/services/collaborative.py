"""SVD-based collaborative filtering.

Builds a user-item matrix from behaviour weights, factorises with
TruncatedSVD, and ranks items the user has not interacted with by the
reconstructed score. Results are cached per user in Redis (TTL 1h).
Model state is kept in process memory until ``fit()`` is called again.
"""

from __future__ import annotations

import threading
from dataclasses import dataclass
from typing import Iterable

import numpy as np
import pandas as pd
from sklearn.decomposition import TruncatedSVD

from app.db import postgres
from app.db.cache import get_json, set_json


@dataclass
class _Model:
    user_index: dict[int, int]      # user_id -> row
    item_index: dict[int, int]      # product_id -> col
    item_ids: list[int]
    matrix: np.ndarray              # users x items, sparse-dense weights
    reconstruction: np.ndarray      # users x items, predicted scores


_state: _Model | None = None
_lock = threading.Lock()


def fit(min_interactions: int = 1, n_components: int = 16) -> dict[str, int]:
    """Re-train the model from current behaviour rows. Returns counts for logging."""
    global _state
    df = postgres.load_behaviors()
    if df.empty:
        with _lock:
            _state = None
        return {"users": 0, "items": 0, "rows": 0}

    # Aggregate weights per (user, product) — sum is the implicit-feedback score.
    df = df.groupby(["user_id", "product_id"], as_index=False)["weight"].sum()

    user_ids = sorted(df["user_id"].unique().tolist())
    item_ids = sorted(df["product_id"].unique().tolist())
    user_index = {int(u): i for i, u in enumerate(user_ids)}
    item_index = {int(p): i for i, p in enumerate(item_ids)}

    matrix = np.zeros((len(user_ids), len(item_ids)), dtype=np.float32)
    for _, row in df.iterrows():
        matrix[user_index[int(row["user_id"])], item_index[int(row["product_id"])]] = row["weight"]

    n = min(n_components, max(1, min(matrix.shape) - 1))
    svd = TruncatedSVD(n_components=n, random_state=42)
    reduced = svd.fit_transform(matrix)
    reconstruction = reduced @ svd.components_

    with _lock:
        _state = _Model(
            user_index=user_index,
            item_index=item_index,
            item_ids=[int(x) for x in item_ids],
            matrix=matrix,
            reconstruction=reconstruction,
        )

    return {"users": len(user_ids), "items": len(item_ids), "rows": int(df.shape[0])}


def _ensure_fitted() -> _Model | None:
    with _lock:
        if _state is not None:
            return _state
    fit()
    with _lock:
        return _state


def top_for_user(user_id: int, limit: int = 10) -> list[int]:
    cache_key = f"shopai:recs:user:{user_id}:{limit}"
    cached = get_json(cache_key)
    if cached is not None:
        return cached

    state = _ensure_fitted()
    if state is None or user_id not in state.user_index:
        # Cold-start fallback: popular items
        fallback = _popular_items(limit)
        set_json(cache_key, fallback, ttl_seconds=600)
        return fallback

    row = state.user_index[user_id]
    scores = state.reconstruction[row].copy()
    # Suppress items the user already interacted with
    seen_mask = state.matrix[row] > 0
    scores[seen_mask] = -np.inf
    ranked = np.argsort(-scores)[: limit * 2]  # over-fetch to skip -inf safely
    out: list[int] = []
    for col in ranked:
        if np.isfinite(scores[col]):
            out.append(state.item_ids[col])
        if len(out) >= limit:
            break
    if not out:
        out = _popular_items(limit)

    set_json(cache_key, out, ttl_seconds=3600)
    return out


def _popular_items(limit: int) -> list[int]:
    """Sum interaction weights per item; return the top N."""
    df = postgres.load_behaviors()
    if df.empty:
        return []
    pop = (
        df.groupby("product_id")["weight"]
        .sum()
        .sort_values(ascending=False)
        .head(limit)
        .index.tolist()
    )
    return [int(x) for x in pop]


def invalidate_cache_for(user_ids: Iterable[int]) -> None:
    from app.db.cache import get_client

    try:
        client = get_client()
        for uid in user_ids:
            for k in client.scan_iter(f"shopai:recs:user:{uid}:*"):
                client.delete(k)
    except Exception:
        pass
