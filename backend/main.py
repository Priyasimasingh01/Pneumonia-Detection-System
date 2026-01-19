from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import numpy as np
from io import BytesIO
from PIL import Image
import tensorflow as tf
import os

# Initialize App
app = FastAPI()

# CORS Configuration - Allow requests from your React Frontend
origins = [
    "http://localhost",
    "http://localhost:3000",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuration based on your Notebook
MODEL_PATH = "my_model.h5"  # Ensure this file is in the same directory
CLASS_NAMES = ['NORMAL', 'PNEUMONIA']
TARGET_SIZE = (256, 256)

# Load Model
# We load it globally so it's ready when the server starts
try:
    model = tf.keras.models.load_model(MODEL_PATH)
    print(f"Model loaded successfully from {MODEL_PATH}")
except Exception as e:
    print(f"Error loading model: {e}")
    model = None

@app.get("/ping")
async def ping():
    return {"message": "Server is running"}

def read_file_as_image(data) -> np.ndarray:
    try:
        # Open image and ensure it is RGB (matches dataset_from_directory default)
        image = Image.open(BytesIO(data)).convert("RGB")
        # Resize to the input shape used during training
        image = image.resize(TARGET_SIZE)
        return np.array(image)
    except Exception as e:
        raise HTTPException(status_code=400, detail="Invalid image file")

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    if model is None:
        raise HTTPException(status_code=500, detail="Model not loaded")

    # Read and preprocess the image
    image_bytes = await file.read()
    image = read_file_as_image(image_bytes)
    
    # Create a batch of 1 (1, 256, 256, 3)
    img_batch = np.expand_dims(image, 0)

    # Make prediction
    predictions = model.predict(img_batch)
    
    # Your notebook uses a binary classification setup (likely sigmoid or softmax)
    # If the output shape is (1, 1) or (1,), it is sigmoid.
    # If the output shape is (1, 2), it is softmax.
    
    prediction_result = {}
    
    if predictions.shape[-1] > 1:
        # Softmax case (2 output neurons)
        predicted_class_index = np.argmax(predictions[0])
        confidence = float(np.max(predictions[0]))
        predicted_class = CLASS_NAMES[predicted_class_index]
    else:
        # Sigmoid case (1 output neuron)
        score = float(predictions[0][0])
        # Assuming class 0 is NORMAL and class 1 is PNEUMONIA
        if score > 0.5:
            predicted_class = CLASS_NAMES[1]
            confidence = score
        else:
            predicted_class = CLASS_NAMES[0]
            confidence = 1.0 - score

    return {
        "class": predicted_class,
        "confidence": round(confidence * 100, 2),
        "filename": file.filename
    }

if __name__ == "__main__":
    uvicorn.run(app, host="localhost", port=8000)