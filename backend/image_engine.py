"""
image_engine.py — Core Image Forensics Engine for Tathya.io
Principal author: Sentinel Forgery AI Backend
"""

from __future__ import annotations

import asyncio
import base64
import io
import tempfile
import os
from typing import Any

import cv2
import exifread
import httpx
import numpy as np
from PIL import Image


# ──────────────────────────────────────────────────────────────────────────────
# FORENSIC CONSTANTS
# ──────────────────────────────────────────────────────────────────────────────

ELA_QUALITY: int = 90
ELA_BRIGHTNESS_SCALAR: int = 15

HF_API_URL: str = (
    "https://api-inference.huggingface.co/models/"
    "Organika/sdxl-detector"
)

RELEVANT_EXIF_TAGS: frozenset[str] = frozenset(
    {
        "Image Make",
        "Image Model",
        "Image Software",
        "Image DateTime",
        "Image Artist",
        "Image Copyright",
        "EXIF DateTimeOriginal",
        "EXIF DateTimeDigitized",
        "EXIF ExifImageWidth",
        "EXIF ExifImageLength",
        "GPS GPSLatitude",
        "GPS GPSLongitude",
        "GPS GPSAltitude",
        "GPS GPSLatitudeRef",
        "GPS GPSLongitudeRef",
        "Image XResolution",
        "Image YResolution",
        "Image Orientation",
        "EXIF Flash",
        "EXIF FocalLength",
        "EXIF ISOSpeedRatings",
        "EXIF ExposureTime",
        "EXIF FNumber",
    }
)


# ──────────────────────────────────────────────────────────────────────────────
# 1. METADATA EXTRACTION
# ──────────────────────────────────────────────────────────────────────────────


def extract_metadata(image_bytes: bytes) -> dict[str, Any]:
    """
    Parse forensically relevant EXIF tags from raw image bytes using ExifRead.
    Returns a clean dict; missing/unreadable tags are silently skipped.
    """
    try:
        stream = io.BytesIO(image_bytes)
        tags: dict[str, Any] = exifread.process_file(stream, details=False)

        result: dict[str, str] = {}
        for tag_name, value in tags.items():
            if tag_name in RELEVANT_EXIF_TAGS:
                try:
                    result[tag_name] = str(value)
                except Exception:
                    pass  # Skip tags that can't be serialized

        return result if result else {"info": "No EXIF metadata found in this image."}

    except Exception as exc:
        return {"error": f"Metadata extraction failed: {str(exc)}"}


# ──────────────────────────────────────────────────────────────────────────────
# 2. ERROR LEVEL ANALYSIS (ELA) HEATMAP
# ──────────────────────────────────────────────────────────────────────────────


def generate_ela_heatmap(image_bytes: bytes) -> str:
    """
    Perform Error Level Analysis on raw image bytes.

    Steps:
      1. Decode original image via OpenCV.
      2. Re-encode at ELA_QUALITY % JPEG compression into a memory buffer.
      3. Compute absolute pixel-wise difference between original and re-encoded.
      4. Convert to grayscale and amplify by ELA_BRIGHTNESS_SCALAR.
      5. Apply COLORMAP_JET for vivid heatmap visualisation.
      6. Return the heatmap as a Base64-encoded JPEG data-URI string.

    Raises ValueError on unreadable image data.
    """
    try:
        # ── Decode original ──────────────────────────────────────────────────
        np_arr = np.frombuffer(image_bytes, np.uint8)
        original = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

        if original is None:
            raise ValueError("OpenCV could not decode the supplied image bytes.")

        # ── Re-encode at ELA_QUALITY ─────────────────────────────────────────
        encode_param = [int(cv2.IMWRITE_JPEG_QUALITY), ELA_QUALITY]
        _, compressed_buf = cv2.imencode(".jpg", original, encode_param)
        compressed = cv2.imdecode(compressed_buf, cv2.IMREAD_COLOR)

        if compressed is None:
            raise ValueError("OpenCV re-encoding for ELA failed.")

        # ── Absolute difference ──────────────────────────────────────────────
        diff = cv2.absdiff(original, compressed)

        # ── Greyscale + amplify ───────────────────────────────────────────────
        diff_gray = cv2.cvtColor(diff, cv2.COLOR_BGR2GRAY)
        amplified = cv2.convertScaleAbs(diff_gray, alpha=ELA_BRIGHTNESS_SCALAR)

        # ── Colormap heatmap ─────────────────────────────────────────────────
        heatmap = cv2.applyColorMap(amplified, cv2.COLORMAP_JET)

        # ── Encode to Base64 ─────────────────────────────────────────────────
        _, buffer = cv2.imencode(".jpg", heatmap, encode_param)
        b64 = base64.b64encode(buffer.tobytes()).decode("utf-8")
        return f"data:image/jpeg;base64,{b64}"

    except Exception as exc:
        raise ValueError(f"ELA heatmap generation failed: {str(exc)}") from exc


# ──────────────────────────────────────────────────────────────────────────────
# 3. AI SCAN via HUGGING FACE
# ──────────────────────────────────────────────────────────────────────────────


async def scan_with_ai(
    image_bytes: bytes,
    hf_token: str | None = None,
) -> dict[str, Any]:
    """
    Async: send image bytes to a Hugging Face Vision Transformer inference
    endpoint for AI-based forgery detection.

    Handles:
      - Missing / invalid token  → graceful fallback
      - HTTP 401 Unauthorized    → graceful fallback
      - Network timeouts         → graceful fallback
    """
    fallback_response: dict[str, Any] = {
        "label": "AI Scan Unavailable",
        "confidence_score": 0.0,
        "note": "Provide a valid HUGGING_FACE_TOKEN to enable AI analysis.",
    }

    if not hf_token or hf_token.strip() == "":
        return fallback_response

    headers = {"Authorization": f"Bearer {hf_token.strip()}"}

    try:
        async with httpx.AsyncClient(timeout=20.0) as client:
            response = await client.post(
                HF_API_URL,
                content=image_bytes,
                headers=headers,
            )

        if response.status_code == 401:
            return {
                **fallback_response,
                "note": "HuggingFace token is invalid or expired (401 Unauthorized).",
            }

        if response.status_code == 503:
            return {
                **fallback_response,
                "note": "HuggingFace model is loading. Please retry in ~20 seconds.",
            }

        response.raise_for_status()
        raw: list[dict[str, Any]] = response.json()

        if not raw or not isinstance(raw, list):
            return fallback_response

        # The model returns a list sorted by score desc — pick top prediction
        top: dict[str, Any] = raw[0]
        label: str = top.get("label", "unknown").lower()
        score: float = round(float(top.get("score", 0.0)), 4)

        # Normalise label vocabulary
        normalised_label = (
            "manipulated"
            if any(kw in label for kw in ("fake", "manipulat", "generated", "ai", "sdxl"))
            else "authentic"
        )

        return {
            "label": normalised_label,
            "confidence_score": score,
            "raw_label": top.get("label"),
        }

    except httpx.TimeoutException:
        return {
            **fallback_response,
            "note": "HuggingFace API request timed out after 20 s.",
        }
    except Exception as exc:
        return {
            **fallback_response,
            "note": f"AI scan encountered an error: {str(exc)}",
        }
