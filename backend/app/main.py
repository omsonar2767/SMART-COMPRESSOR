from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import router as api_router

app = FastAPI(
    title="Smart Compressor API",
    description="Backend API for the Smart Compressor pipeline (chunking, BM25 ranking, compression).",
    version="1.0.0",
)

# ---------------------------------------------------------------------------
# CORS — this is what lets your frontend (served from a different origin,
# e.g. file:// or http://127.0.0.1:5500) talk to this backend without the
# browser blocking the request.
# ---------------------------------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],          # for local dev; restrict this in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# All endpoints defined in app/api/routes.py get mounted under /api
app.include_router(api_router, prefix="/api")


@app.get("/")
def root():
    return {"status": "ok", "message": "Smart Compressor API is running"}


@app.get("/health")
def health_check():
    return {"status": "healthy"}