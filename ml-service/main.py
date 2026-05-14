"""ShopAI ML Service — FastAPI skeleton.

Real collaborative filtering (TruncatedSVD) is TODO. Endpoints currently
return mock product ID lists so the backend integration path is unblocked.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import recommend, similar, train

app = FastAPI(title="ShopAI ML Service", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(recommend.router)
app.include_router(similar.router)
app.include_router(train.router)


@app.get("/health")
def health():
    return {"status": "ok", "service": "ml-service"}


@app.get("/popular")
def popular():
    return {"product_ids": [1, 2, 4, 6, 7, 10, 11]}
