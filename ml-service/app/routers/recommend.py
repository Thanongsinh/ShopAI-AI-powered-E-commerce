from fastapi import APIRouter

from app.services import collaborative

router = APIRouter(prefix="/recommend", tags=["recommend"])


@router.get("/{user_id}")
def recommend(user_id: int, limit: int = 10):
    return {"user_id": user_id, "product_ids": collaborative.top_for_user(user_id, limit)}
