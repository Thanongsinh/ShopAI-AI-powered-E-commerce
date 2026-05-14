"""Content-based product similarity using TF-IDF over name/description/category."""

from __future__ import annotations

import threading
from dataclasses import dataclass

import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

from app.db import postgres
from app.db.cache import get_json, set_json


@dataclass
class _ContentModel:
    product_ids: list[int]
    index: dict[int, int]
    similarity: np.ndarray


_state: _ContentModel | None = None
_lock = threading.Lock()


def fit() -> dict[str, int]:
    global _state
    df = postgres.load_products()
    if df.empty:
        with _lock:
            _state = None
        return {"products": 0}

    df = df.fillna({"name": "", "description": "", "category_slug": ""})
    corpus = (
        df["name"].astype(str)
        + " "
        + df["description"].astype(str)
        + " "
        + df["category_slug"].astype(str)
    ).tolist()

    vec = TfidfVectorizer(min_df=1, ngram_range=(1, 2))
    tfidf = vec.fit_transform(corpus)
    sim = cosine_similarity(tfidf, dense_output=False)

    ids = [int(x) for x in df["id"].tolist()]
    with _lock:
        _state = _ContentModel(
            product_ids=ids,
            index={pid: i for i, pid in enumerate(ids)},
            similarity=sim.toarray().astype(np.float32),
        )
    return {"products": len(ids)}


def _ensure_fitted() -> _ContentModel | None:
    with _lock:
        if _state is not None:
            return _state
    fit()
    with _lock:
        return _state


def similar_to(product_id: int, limit: int = 8) -> list[int]:
    cache_key = f"shopai:similar:{product_id}:{limit}"
    cached = get_json(cache_key)
    if cached is not None:
        return cached

    state = _ensure_fitted()
    if state is None or product_id not in state.index:
        return []

    row = state.index[product_id]
    scores = state.similarity[row].copy()
    scores[row] = -np.inf  # exclude self
    ranked = np.argsort(-scores)[:limit]
    out = [state.product_ids[i] for i in ranked if np.isfinite(scores[i])]
    set_json(cache_key, out, ttl_seconds=3600)
    return out
