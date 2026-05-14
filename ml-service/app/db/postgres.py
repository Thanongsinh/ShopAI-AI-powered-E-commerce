"""Postgres connection helpers for the ML service.

A small connection pool keeps each recommend/similar call cheap. Behaviour
extraction queries are kept simple — we read everything into pandas in
``collaborative`` and ``content``; horizontal scaling can introduce a more
incremental pipeline later.
"""

from __future__ import annotations

import os
from contextlib import contextmanager
from typing import Iterator

import pandas as pd
import psycopg2
import psycopg2.extras
from psycopg2 import pool


_pool: pool.SimpleConnectionPool | None = None


def get_pool() -> pool.SimpleConnectionPool:
    global _pool
    if _pool is None:
        dsn = os.environ.get(
            "DATABASE_URL",
            "postgres://postgres:postgres@localhost:5432/shopai_db?sslmode=disable",
        )
        _pool = pool.SimpleConnectionPool(1, 8, dsn)
    return _pool


@contextmanager
def connection() -> Iterator[psycopg2.extensions.connection]:
    p = get_pool()
    conn = p.getconn()
    try:
        yield conn
    finally:
        p.putconn(conn)


def load_behaviors() -> pd.DataFrame:
    """Return a DataFrame of (user_id, product_id, weight) for non-null user rows."""
    with connection() as conn, conn.cursor(cursor_factory=psycopg2.extras.DictCursor) as cur:
        cur.execute(
            """
            SELECT user_id, product_id, weight
            FROM behaviors
            WHERE user_id IS NOT NULL
            """,
        )
        rows = cur.fetchall()
    return pd.DataFrame(rows, columns=["user_id", "product_id", "weight"])


def load_products() -> pd.DataFrame:
    """Return a DataFrame of active products for content-based similarity."""
    with connection() as conn, conn.cursor(cursor_factory=psycopg2.extras.DictCursor) as cur:
        cur.execute(
            """
            SELECT id, name, description, category_slug, price
            FROM products
            WHERE status = 'active'
            """,
        )
        rows = cur.fetchall()
    return pd.DataFrame(
        rows, columns=["id", "name", "description", "category_slug", "price"],
    )
