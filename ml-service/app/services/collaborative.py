"""Collaborative filtering (SVD) — STUB.

Real impl will:
1. Pull behaviors from PostgreSQL via app.db.postgres
2. Build user-item matrix (pandas DataFrame, value = action weight)
3. Fit sklearn.decomposition.TruncatedSVD
4. Predict top-N items the user has not seen yet
5. Cache in Redis (TTL 1h)
"""


def top_for_user(user_id: int, limit: int = 10) -> list[int]:
    # TODO: replace with SVD prediction
    return [1, 2, 4, 6, 7, 10, 11][:limit]
