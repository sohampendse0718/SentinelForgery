"""
main.py — FastAPI Application Entry-point
Tathya.io · Image Forgery Detection Module
"""

from __future__ import annotations

import asyncio
import os
from typing import Any

from dotenv import load_dotenv
from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from image_engine import extract_metadata, generate_ela_heatmap, scan_with_ai

# ──────────────────────────────────────────────────────────────────────────────
# ENVIRONMENT
# ──────────────────────────────────────────────────────────────────────────────

load_dotenv()
HF_TOKEN: str | None = os.getenv("HUGGING_FACE_TOKEN")

# ──────────────────────────────────────────────────────────────────────────────
# APP INITIALISATION
# ──────────────────────────────────────────────────────────────────────────────

app = FastAPI(
    title="Tathya.io — Image Forensics API",
    description=(
        "Production-ready API for image forgery detection using "
        "ELA heatmaps, EXIF metadata analysis, and AI-powered classification."
    ),
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],          # Tighten to specific origin in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ──────────────────────────────────────────────────────────────────────────────
# RESPONSE SCHEMA
# ──────────────────────────────────────────────────────────────────────────────


class AIAnalysis(BaseModel):
    label: str
    confidence_score: float
    note: str | None = None
    raw_label: str | None = None


class ImageAnalysisResponse(BaseModel):
    status: str
    filename: str
    content_type: str
    metadata: dict[str, Any]
    ela_heatmap_base64: str
    ai_analysis: AIAnalysis


# ──────────────────────────────────────────────────────────────────────────────
# ROUTES
# ──────────────────────────────────────────────────────────────────────────────


@app.get("/", tags=["Health"])
async def health_check() -> dict[str, str]:
    return {
        "service": "Tathya.io Image Forensics API",
        "status": "operational",
        "version": "1.0.0",
    }


@app.post(
    "/api/analyze/image",
    response_model=ImageAnalysisResponse,
    tags=["Forensics"],
    summary="Analyse an image for forgery indicators",
    description=(
        "Accepts a multipart image upload. Concurrently runs:\n\n"
        "- **ELA Heatmap** — Error Level Analysis for compression artifact detection\n"
        "- **EXIF Metadata** — Forensic tag extraction (device, GPS, software)\n"
        "- **AI Scan** — HuggingFace Vision Transformer forgery classification"
    ),
)
async def analyze_image(
    file: UploadFile = File(..., description="Image to analyse (JPEG, PNG, WEBP, TIFF)"),
) -> ImageAnalysisResponse:
    # ── Read upload into memory once ─────────────────────────────────────────
    image_bytes: bytes = await file.read()

    if not image_bytes:
        raise HTTPException(status_code=400, detail="Uploaded file is empty.")

    if len(image_bytes) > 20 * 1024 * 1024:  # 20 MB guard
        raise HTTPException(
            status_code=413,
            detail="File exceeds the 20 MB size limit.",
        )

    # ── Run sync heavy-ops in thread pool; AI scan is truly async ────────────
    loop = asyncio.get_event_loop()

    try:
        metadata_task = loop.run_in_executor(None, extract_metadata, image_bytes)
        ela_task = loop.run_in_executor(None, generate_ela_heatmap, image_bytes)
        ai_task = scan_with_ai(image_bytes, HF_TOKEN)

        metadata, ela_heatmap, ai_result = await asyncio.gather(
            metadata_task,
            ela_task,
            ai_task,
            return_exceptions=True,
        )

    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"Analysis pipeline error: {str(exc)}",
        )

    # ── Handle partial failures gracefully ────────────────────────────────────
    if isinstance(metadata, Exception):
        metadata = {"error": str(metadata)}

    if isinstance(ela_heatmap, Exception):
        ela_heatmap = ""          # Frontend renders a placeholder on empty string

    if isinstance(ai_result, Exception):
        ai_result = {
            "label": "AI Scan Unavailable",
            "confidence_score": 0.0,
            "note": str(ai_result),
        }

    return ImageAnalysisResponse(
        status="success",
        filename=file.filename or "unknown",
        content_type=file.content_type or "application/octet-stream",
        metadata=metadata,
        ela_heatmap_base64=ela_heatmap,
        ai_analysis=AIAnalysis(**ai_result),
    )
