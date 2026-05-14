from fastapi import APIRouter

router = APIRouter(prefix="/train", tags=["train"])


@router.post("")
def train():
    # TODO: rebuild user-item matrix from behaviors and re-fit TruncatedSVD
    return {"status": "queued", "note": "training stub — implement in Phase 3"}
