from fastapi import APIRouter

from app.services import content

router = APIRouter(prefix="/similar", tags=["similar"])


@router.get("/{product_id}")
def similar(product_id: int, limit: int = 8):
    return {"product_id": product_id, "product_ids": content.similar_to(product_id, limit)}
