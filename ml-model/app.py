from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
import numpy as np
import json
import os
from PIL import Image
import io

app = Flask(__name__)
CORS(app)  # React integration ke time CORS error se bachane ke liye

# ── Disease Metadata Database ─────────────────────────────────────────────────
DISEASE_INFO = {
    'Apple___Apple_scab': {
        'display': 'Apple Scab', 'crop': 'Apple', 'status': 'infected',
        'description': 'Fungal disease caused by Venturia inaequalis affecting leaves and fruits.',
        'recommendations': {
            'pesticides': ['Captan 50% WP', 'Mancozeb 75% WP', 'Myclobutanil'],
            'fertilizers': ['Balanced NPK 15-15-15', 'Calcium nitrate', 'Potassium sulfate'],
            'prevention': ['Rake and destroy fallen leaves', 'Apply dormant sprays', 'Plant resistant varieties'],
        },
        'nutrientTips': ['Ensure adequate potassium for disease resistance', 'Avoid excess nitrogen'],
    },
    'Apple___Black_rot': {
        'display': 'Black Rot', 'crop': 'Apple', 'status': 'infected',
        'description': 'Fungal disease causing dark lesions on leaves, fruit, and bark.',
        'recommendations': {
            'pesticides': ['Captan', 'Thiophanate-methyl', 'Ziram'],
            'fertilizers': ['Calcium-rich fertilizer', 'Balanced NPK'],
            'prevention': ['Prune infected branches', 'Remove mummified fruits', 'Improve air circulation'],
        },
        'nutrientTips': ['Calcium strengthens cell walls and reduces infection risk'],
    },
    'Apple___healthy': {
        'display': 'Healthy', 'crop': 'Apple', 'status': 'healthy',
        'description': 'Your apple plant appears healthy with no visible disease symptoms.',
        'recommendations': None,
        'nutrientTips': ['Maintain regular fertilization schedule', 'Monitor for early signs of disease'],
    },
    'Corn_(maize)___Common_rust_': {
        'display': 'Common Rust', 'crop': 'Corn', 'status': 'infected',
        'description': 'Fungal disease caused by Puccinia sorghi forming rust-colored pustules.',
        'recommendations': {
            'pesticides': ['Propiconazole', 'Azoxystrobin', 'Trifloxystrobin'],
            'fertilizers': ['Potassium-rich fertilizer', 'Balanced NPK 20-10-10'],
            'prevention': ['Plant resistant hybrids', 'Apply fungicide at early stages', 'Ensure proper spacing'],
        },
        'nutrientTips': ['Potassium improves disease resistance in corn'],
    },
    'Corn_(maize)___healthy': {
        'display': 'Healthy', 'crop': 'Corn', 'status': 'healthy',
        'description': 'Your corn plant is healthy with no disease detected.',
        'recommendations': None,
        'nutrientTips': ['Continue balanced NPK fertilization', 'Ensure adequate irrigation'],
    },
    'Tomato___Early_blight': {
        'display': 'Early Blight', 'crop': 'Tomato', 'status': 'infected',
        'description': 'Fungal disease caused by Alternaria solani affecting leaves, stems, and fruits.',
        'recommendations': {
            'pesticides': ['Chlorothalonil 75% WP', 'Mancozeb 75% WP', 'Copper Oxychloride 50% WP'],
            'fertilizers': ['Potassium-rich fertilizer (K2O)', 'Calcium nitrate', 'Balanced NPK 19-19-19'],
            'prevention': ['Remove infected leaves immediately', 'Avoid overhead irrigation', 'Rotate crops every season', 'Maintain proper plant spacing'],
        },
        'nutrientTips': ['Apply potassium to strengthen cell walls', 'Ensure adequate calcium', 'Avoid excess nitrogen'],
    },
    'Tomato___Late_blight': {
        'display': 'Late Blight', 'crop': 'Tomato', 'status': 'infected',
        'description': 'Caused by Phytophthora infestans — highly destructive water mold.',
        'recommendations': {
            'pesticides': ['Metalaxyl + Mancozeb', 'Cymoxanil + Mancozeb', 'Dimethomorph'],
            'fertilizers': ['Calcium nitrate', 'Potassium sulfate', 'Phosphorus-rich fertilizer'],
            'prevention': ['Destroy infected plants', 'Avoid wet foliage', 'Use certified disease-free seeds'],
        },
        'nutrientTips': ['Phosphorus promotes root health and disease resistance'],
    },
    'Tomato___healthy': {
        'display': 'Healthy', 'crop': 'Tomato', 'status': 'healthy',
        'description': 'Your tomato plant is healthy. Keep up the good work!',
        'recommendations': None,
        'nutrientTips': ['Maintain calcium levels to prevent blossom end rot', 'Regular potassium application improves fruit quality'],
    },
    'Wheat___Leaf_rust': {
        'display': 'Leaf Rust', 'crop': 'Wheat', 'status': 'infected',
        'description': 'Caused by Puccinia triticina — orange-brown pustules on leaves.',
        'recommendations': {
            'pesticides': ['Propiconazole 25% EC', 'Tebuconazole', 'Triadimefon'],
            'fertilizers': ['Balanced NPK', 'Potassium sulfate', 'Zinc sulfate'],
            'prevention': ['Plant resistant varieties', 'Apply fungicide at flag leaf stage', 'Monitor regularly'],
        },
        'nutrientTips': ['Adequate potassium reduces rust severity', 'Avoid excess nitrogen'],
    },
    'Wheat___healthy': {
        'display': 'Healthy', 'crop': 'Wheat', 'status': 'healthy',
        'description': 'Your wheat crop is healthy with no disease detected.',
        'recommendations': None,
        'nutrientTips': ['Apply nitrogen in split doses for better yield', 'Ensure adequate zinc for grain filling'],
    },
    'Potato___Late_blight': {
        'display': 'Late Blight', 'crop': 'Potato', 'status': 'infected',
        'description': 'Caused by Phytophthora infestans — water mold affecting leaves and tubers.',
        'recommendations': {
            'pesticides': ['Metalaxyl', 'Cymoxanil', 'Chlorothalonil'],
            'fertilizers': ['Potassium sulfate', 'Calcium nitrate', 'Phosphorus fertilizer'],
            'prevention': ['Use certified seed potatoes', 'Destroy infected haulms', 'Avoid overhead irrigation'],
        },
        'nutrientTips': ['Potassium improves tuber quality and disease resistance'],
    },
    'Potato___healthy': {
        'display': 'Healthy', 'crop': 'Potato', 'status': 'healthy',
        'description': 'Your potato plant is healthy.',
        'recommendations': None,
        'nutrientTips': ['Potassium is critical for tuber development', 'Ensure adequate phosphorus for root growth'],
    },
}

DEFAULT_INFO = {
    'display': 'Unknown Disease', 'crop': 'Unknown', 'status': 'infected',
    'description': 'Disease detected. Please consult a local agricultural expert for confirmation.',
    'recommendations': {
        'pesticides': ['Consult local agronomist for specific pesticide'],
        'fertilizers': ['Apply balanced NPK fertilizer', 'Add organic matter'],
        'prevention': ['Remove infected plant parts', 'Improve air circulation', 'Avoid overhead watering'],
    },
    'nutrientTips': ['Maintain balanced soil nutrition', 'Regular soil testing recommended'],
}

# ── Load Model & Indices Globally ───────────────────────────────────────────
MODEL_PATH = "model.h5"
LABELS_PATH = "class_indices.json"

print("--> Loading Trained TensorFlow Model...")
model = tf.keras.models.load_model(MODEL_PATH)
print("--> Model loaded successfully!")

def load_labels_map():
    try:
        with open(LABELS_PATH) as f:
            indices = json.load(f)
        return {int(v): k for k, v in indices.items()}
    except Exception as e:
        print(f"Error loading class indices: {str(e)}")
        return {}

labels_map = load_labels_map()

# ── Core Image Preprocessing ─────────────────────────────────────────────────
def preprocess_image(image_bytes: bytes, img_size=(224, 224)) -> np.ndarray:
    img = Image.open(io.BytesIO(image_bytes)).convert('RGB')
    img = img.resize(img_size, Image.LANCZOS)
    arr = np.array(img, dtype=np.float32) / 255.0
    return np.expand_dims(arr, axis=0)

# ── API Routes ────────────────────────────────────────────────────────────────
@app.route("/predict", methods=["POST"])
def predict():
    if "image" not in request.files:
        return jsonify({"status": "error", "message": "No image file uploaded"}), 400
        
    file = request.files["image"]
    if file.filename == "":
        return jsonify({"status": "error", "message": "Empty file name"}), 400

    try:
        img_bytes = file.read()
        processed_img = preprocess_image(img_bytes)

        # Inference
        predictions = model.predict(processed_img)
        predicted_class_idx = np.argmax(predictions[0])
        confidence = float(predictions[0][predicted_class_idx]) * 100
        
        class_name = labels_map.get(predicted_class_idx, "Unknown")
        
        # Metadata dictionary map matching
        disease_data = DISEASE_INFO.get(class_name, {
            **DEFAULT_INFO, 
            'display': class_name.replace('_', ' ')
        })

        return jsonify({
            "status": "success",
            "confidence": f"{confidence:.2f}%",
            "class_name": class_name,
            "details": disease_data
        })

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route("/health", methods=["GET"])
def health_check():
    return jsonify({"status": "healthy", "model_loaded": model is not None})

# ── Start Server ──────────────────────────────────────────────────────────────
if __name__ == "__main__":
    print("--> Starting AgroVision AI Server on port 5000...")
    app.run(host="0.0.0.0", port=5000, debug=True, use_reloader=False)