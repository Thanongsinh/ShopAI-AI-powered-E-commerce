"""Content-based similarity — STUB.

Real impl will use TF-IDF over product descriptions + cosine similarity.
"""


def similar_to(product_id: int, limit: int = 8) -> list[int]:
    pool = [1, 5, 7, 10, 4, 6, 11, 12, 2, 3, 8]
    return [pid for pid in pool if pid != product_id][:limit]
