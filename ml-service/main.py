"""ShopAI ML service.

Endpoints:
  GET  /health
  GET  /popular          — cold-start ranking
  GET  /recommend/{uid}  — collaborative filtering (SVD) with Redis cache
  GET  /similar/{pid}    — content-based similarity (TF-IDF cosine)
  POST /train            — re-fit both models from current Postgres state
"""

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import recommend, similar, train
from app.services import cold_start, collaborative, content


@asynccontextmanager
async def lifespan(_app: FastAPI):
    # Best-effort warm-up so the first request isn't slow; errors are non-fatal
    # (DB might not be reachable in unit tests).
    try:
        collaborative.fit()
    except Exception:
        pass
    try:
        content.fit()
    except Exception:
        pass
    yield


app = FastAPI(title="ShopAI ML Service", version="0.2.0", lifespan=lifespan)

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
def popular(limit: int = 10):
    return {"product_ids": cold_start.popular(limit)}
