import os
import io
import base64
import cv2
import numpy as np
import exifread
import requests
from PIL import Image, ImageEnhance

def extract_metadata(image_bytes: bytes) -> dict:
    """
    Extracts forensic EXIF tags using ExifRead.
    Returns tags like Software, DateTime, GPS, Make, Model.
    """
    tags = exifread.process_file(io.BytesIO(image_bytes))
    metadata = {}
    
    # Desired tags for forensic analysis
    target_keys = [
        "Image Software", 
        "Image DateTime", 
        "GPS GPSLatitude", 
        "GPS GPSLongitude", 
        "Image Make", 
        "Image Model"
    ]
    
    for key in target_keys:
        if key in tags:
            # Shorten the key for the JSON response (e.g., 'Image Software' -> 'Software')
            display_key = key.split()[1] if len(key.split()) > 1 else key
            metadata[display_key] = str(tags[key])
            
    return metadata

def generate_ela_heatmap(image_bytes: bytes) -> str:
    """
    Performs Error Level Analysis.
    Resaves image at 90% quality, calculates cv2.absdiff against original,
    boosts brightness (x15), and returns a Base64 string.
    """
    try:
        # Load original image
        original = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        
        # Resave at 90% quality
        temp_io = io.BytesIO()
        original.save(temp_io, "JPEG", quality=90)
        temp_io.seek(0)
        compressed = Image.open(temp_io).convert("RGB")
        
        # Convert to numpy arrays (OpenCV format BGR)
        original_cv = cv2.cvtColor(np.array(original), cv2.COLOR_RGB2BGR)
        compressed_cv = cv2.cvtColor(np.array(compressed), cv2.COLOR_RGB2BGR)
        
        # Calculate absolute difference
        diff = cv2.absdiff(original_cv, compressed_cv)
        
        # Convert back to PIL Image (RGB)
        diff_pil = Image.fromarray(cv2.cvtColor(diff, cv2.COLOR_BGR2RGB))
        
        # Boost brightness x15
        enhancer = ImageEnhance.Brightness(diff_pil)
        ela_image = enhancer.enhance(15.0)
        
        # Encode to Base64
        out_io = io.BytesIO()
        ela_image.save(out_io, format="JPEG")
        b64_string = base64.b64encode(out_io.getvalue()).decode("utf-8")
        
        return f"data:image/jpeg;base64,{b64_string}"
    except Exception as e:
        print(f"Error generating ELA: {e}")
        return ""

import tensorflow as tf
from huggingface_hub import hf_hub_download

_LOCAL_MODEL = None

def load_local_keras_model():
    global _LOCAL_MODEL
    if _LOCAL_MODEL is None:
        try:
            print("Downloading/Loading Keras model from Hugging Face...")
            model_path = hf_hub_download(
                repo_id="kumaran-0188/image_forgery_detector",
                filename="forgery_model_fixed.keras",
                token=os.getenv("HF_TOKEN")
            )
            _LOCAL_MODEL = tf.keras.models.load_model(model_path)
            print("Model loaded successfully!")
        except Exception as e:
            print(f"Error initializing local Keras model: {e}")
            raise e
    return _LOCAL_MODEL

def scan_with_ai(image_bytes: bytes) -> dict:
    """
    Locally runs inference using the downloaded Keras model from Hugging Face.
    """
    try:
        model = load_local_keras_model()
        
        # Open and resize image to standard 224x224 (assuming MobileNetV2 architecture)
        original = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        img_array = np.array(original)
        img_resized = cv2.resize(img_array, (224, 224))
        
        # Preprocess using MobileNetV2 scaling
        # (If it's just /255.0 this function still performs decent normalization)
        img_input = tf.keras.applications.mobilenet_v2.preprocess_input(img_resized.astype(np.float32))
        img_batch = np.expand_dims(img_input, axis=0)
        
        # Run local prediction
        predictions = model.predict(img_batch, verbose=0)
        print("Raw Prediction Output:", predictions)
        
        real_score = 0.0
        if hasattr(predictions, "shape"):
            if predictions.shape[-1] == 1:
                # Binary sigmoid output (typically 1 for REAL or 1 for FAKE, we assume 1=REAL based on user prompt)
                real_score = float(predictions[0][0])
            elif predictions.shape[-1] >= 2:
                # Softmax output, index 1 = REAL
                real_score = float(predictions[0][1])
        
        if real_score > 0.65:
            return {"label": "REAL", "confidence_score": round(real_score, 4)}
        else:
            return {"label": "FAKE", "confidence_score": round(real_score, 4)}
            
    except Exception as e:
        print(f"AI Scan Error: {e}")
        import traceback
        traceback.print_exc()
        return {"label": "ERROR", "confidence_score": 0.0, "message": str(e)}
