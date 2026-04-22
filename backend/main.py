import os
from image_engine import extract_metadata, generate_ela_heatmap, scan_with_ai
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from supabase import create_client, Client
from dotenv import load_dotenv
from pathlib import Path
from fastapi import FastAPI, UploadFile, File

# 1. Force load the .env from the current folder
env_path = Path(__file__).parent / ".env"
load_dotenv(dotenv_path=env_path)

# 2. Get the variables
url = os.environ.get("SUPABASE_URL")
key = os.environ.get("SUPABASE_KEY")

# 3. Print status to your terminal for debugging
print("--- Sentinel Backend Initializing ---")
print(f"Checking .env at: {env_path}")
print(f"SUPABASE_URL found: {'Yes' if url else 'MISSING'}")
print(f"SUPABASE_KEY found: {'Yes' if key else 'MISSING'}")
print("---------------------------------------")

if not url or not key:
    print("CRITICAL ERROR: Credentials not found in .env file!")
    # We don't raise an error here so the server can at least 
    # start and show us the debug prints above.
    supabase = None 
else:
    supabase: Client = create_client(url, key)

app = FastAPI(title="Sentinel Forgery AI")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"status": "Online", "database_connected": supabase is not None}

@app.post("/api/analyze")
async def analyze_image(file: UploadFile = File(...)):
    print(f"--- INCOMING FILE: {file.filename} ---")
    
    try:
        # 1. Read the raw image bytes from the upload
        image_bytes = await file.read()
        
        # 2. Run the forensic engines
        print(">> Extracting metadata...")
        metadata = extract_metadata(image_bytes)
        
        print(">> Generating ELA heatmap...")
        ela_heatmap = generate_ela_heatmap(image_bytes)
        
        print(">> Running AI scan...")
        hf_token = os.getenv("HUGGING_FACE_TOKEN", "")
        ai_result = await scan_with_ai(image_bytes, hf_token)
        
        # 3. Package the results into the exact JSON React is expecting
        return {
            "status": "success",
            "filename": file.filename,
            "metadata": metadata,
            "ela_heatmap": ela_heatmap,
            "ai_analysis": ai_result
        }
        
    except Exception as e:
        print(f"ERROR: {str(e)}")
        return {"status": "error", "message": str(e)}   