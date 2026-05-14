from fastapi import APIRouter

from app.services import collaborative, content

router = APIRouter(prefix="/train", tags=["train"])


@router.post("")
def train():
    cf = collaborative.fit()
    cb = content.fit()
    return {
        "status": "trained",
        "collaborative": cf,
        "content": cb,
    }
