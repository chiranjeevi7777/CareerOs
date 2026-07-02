"""
CareerOS Backend — Application Entry Point
==========================================

This file ONLY does three things:
  1. Creates the FastAPI app with middleware
  2. Mounts each domain module's router
  3. Registers the /health check

Business logic, schemas, and agents all live in backend/modules/<name>/.
"""
import logging
import traceback
from fastapi import FastAPI, HTTPException, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from .config import settings
from .shared.llm import get_llm_model

# Module routers
from .modules.copilot.router import router as copilot_router
from .modules.analytics.router import router as analytics_router
from .modules.networking.router import router as networking_router
from .modules.dsa.router import router as dsa_router
from .modules.interview.router import router as interview_router

from .shared.search import hybrid_search_items
from .models import (
    HybridSearchRequest, HybridSearchResponse,
)

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("careeros")

app = FastAPI(
    title="CareerOS AI Backend",
    description="Modular agentic AI backend for CareerOS, powered by FastAPI and PydanticAI.",
    version="2.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception on {request.url.path}: {exc}\n{traceback.format_exc()}")
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": "An internal server error occurred.", "error": str(exc)},
    )


# ── Mount module routers ───────────────────────────────────
app.include_router(copilot_router,    prefix="/api")
app.include_router(analytics_router,  prefix="/api")
app.include_router(networking_router, prefix="/api")
app.include_router(dsa_router,        prefix="/api")
app.include_router(interview_router,  prefix="/api")


# ── Health check ──────────────────────────────────────────
@app.get("/health", status_code=200, tags=["Health"])
async def health_check():
    provider, model_name = settings.get_provider_and_model()
    model = get_llm_model()
    is_mock = model.__class__.__name__ == "TestModel"
    return {
        "status": "healthy",
        "llm_provider": provider,
        "model_name": model_name,
        "api_keys_configured": {
            "gemini": bool(settings.gemini_api_key),
            "openai": bool(settings.openai_api_key),
            "anthropic": bool(settings.anthropic_api_key),
            "groq": bool(settings.groq_api_key),
        },
        "mode": "mock-fallback" if is_mock else "active-agent",
    }



@app.post("/api/hybrid-search", response_model=HybridSearchResponse, tags=["Search"])
async def hybrid_search(payload: HybridSearchRequest):
    logger.info(f"Hybrid search: '{payload.query}' across {len(payload.items)} items")
    results = hybrid_search_items(payload.query, payload.items, payload.limit)
    return HybridSearchResponse(results=results)
