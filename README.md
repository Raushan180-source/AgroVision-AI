# 🌿 AgroVision AI — Crop Health Monitoring System

An AI-powered full-stack web application that helps farmers analyze crop health, detect diseases, identify nutrient deficiencies, and improve agricultural productivity.

## 🚀 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React + Tailwind CSS |
| Backend | Node.js + Express |
| ML API | Python FastAPI + TensorFlow/Keras |
| Database | MongoDB |
| Image Storage | Cloudinary |
| Deployment | Vercel (Frontend) + Render (Backend + ML) |

## 📁 Project Structure

```
AgroVision-AI/
├── frontend/          # React application
├── backend/           # Node.js + Express API
├── ml-model/          # Python ML service
│   ├── dataset/       # Training data
│   ├── train.py       # Model training script
│   ├── predict.py     # Prediction logic
│   ├── app.py         # FastAPI server
│   ├── model.h5       # Trained CNN model
│   └── requirements.txt
└── README.md
```

## ✨ Features

- 🔬 **AI Crop Disease Detection** — CNN-based leaf disease detection with confidence scores
- 💊 **Treatment Recommendations** — Pesticides, fertilizers, and prevention methods
- 🌱 **Soil & Nutrient Analysis** — NPK analysis and deficiency detection
- 🌾 **Crop Suggestion System** — Best crop recommendations based on soil/weather
- 🤖 **AI Farmer Chatbot** — Conversational assistant for agriculture queries
- 📊 **Smart Dashboard** — Analytics, history, and weather integration
- 🌙 **Dark/Light Mode** — Full theme support
- 📱 **Mobile Responsive** — Works on all devices

## 🛠️ Setup & Installation

### Prerequisites
- Node.js >= 18
- Python >= 3.9
- MongoDB
- Cloudinary account

### 1. Clone & Install

```bash
# Frontend
cd frontend && npm install

# Backend
cd backend && npm install

# ML Model
cd ml-model && pip install -r requirements.txt
```

### 2. Environment Variables

**backend/.env**
```
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/agrovision
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
ML_API_URL=http://localhost:8000
```

**frontend/.env**
```
VITE_API_URL=http://localhost:5000/api
VITE_ML_API_URL=http://localhost:8000
```

### 3. Run Development Servers

```bash
# Terminal 1 - ML API
cd ml-model && uvicorn app:app --reload --port 8000

# Terminal 2 - Backend
cd backend && npm run dev

# Terminal 3 - Frontend
cd frontend && npm run dev
```

## 🚀 Deployment

- **Frontend**: Deploy to Vercel — connect GitHub repo, set env vars
- **Backend + ML**: Deploy to Render — create web services, set env vars

## 📊 ML Model

The CNN model is trained on the PlantVillage dataset with 38 disease classes across 14 crop types.

```bash
# Train the model
cd ml-model && python train.py
```

## 📄 License

MIT License — Free to use for educational and commercial purposes.
