import asyncio
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import os
from pathlib import Path
from dotenv import load_dotenv

from image_engine import extract_metadata, generate_ela_heatmap, scan_with_ai

# Load environment variables from .env explicitly
env_path = Path(__file__).parent / ".env"
load_dotenv(dotenv_path=env_path)

app = FastAPI(title="Tathya.io Forensics API")

# Allow all origins for local dev with Next.js
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/analyze")
async def analyze_image(file: UploadFile = File(...)):
    """
    Executes metadata extraction, ELA generation, and AI scanning.
    """
    # Read image bytes asynchronously
    image_bytes = await file.read()
    
    # 1. Metadata Extraction (fast enough to run on main thread)
    metadata = extract_metadata(image_bytes)
    
    # 2. Generate ELA Heatmap (blocking CV operations offloaded to thread)
    ela_base64 = await asyncio.to_thread(generate_ela_heatmap, image_bytes)
    
    # 3. AI Scan (blocking requests call offloaded to thread)
    ai_result = await asyncio.to_thread(scan_with_ai, image_bytes)
    return {
        "status": "success",
        "metadata": metadata,
        "ela_heatmap": ela_base64,
        "ai_analysis": ai_result
    }
# uvicorn force-reload tick 2