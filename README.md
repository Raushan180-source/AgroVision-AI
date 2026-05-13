# 🌿 AgroVision AI — Crop Health Monitoring System

<div align="center">

![AgroVision AI](https://img.shields.io/badge/AgroVision-AI-22c55e?style=for-the-badge&logo=leaf&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Python](https://img.shields.io/badge/Python-FastAPI-3776AB?style=for-the-badge&logo=python&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![TensorFlow](https://img.shields.io/badge/TensorFlow-Keras-FF6F00?style=for-the-badge&logo=tensorflow&logoColor=white)

**An AI-powered full-stack web application that helps farmers detect crop diseases, analyze soil health, get fertilizer recommendations, and improve agricultural productivity using Machine Learning.**

[Live Demo](#) • [Report Bug](#) • [Request Feature](#)

</div>

---

## 📸 Screenshots

| Landing Page | Dashboard | Disease Detection |
|---|---|---|
| ![Landing](#) | ![Dashboard](#) | ![Detection](#) |

| Soil Analysis | Crop Advisor | AI Chatbot |
|---|---|---|
| ![Soil](#) | ![Crops](#) | ![Chat](#) |

---

## ✨ Features

- 🔬 **AI Disease Detection** — CNN-powered leaf disease detection with 95%+ accuracy across 38 disease classes and 14 crop types
- 💊 **Treatment Recommendations** — Personalized pesticide, fertilizer, and prevention plans
- 🧪 **Soil & Nutrient Analysis** — NPK analysis, deficiency detection, and fertilizer recommendations
- 🌾 **Crop Advisor** — Best crop suggestions based on soil, temperature, humidity, rainfall, and season
- 🤖 **AI Farmer Chatbot** — Gemini AI-powered conversational assistant for farming queries
- 📊 **Smart Dashboard** — Analytics, scan history, charts, and weather integration
- 🌙 **Dark / Light Mode** — Full theme support
- 📱 **Mobile Responsive** — Works seamlessly on all devices
- 🔐 **Secure Auth** — JWT authentication with rate limiting and CSRF protection

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, Tailwind CSS, Framer Motion, Recharts |
| **Backend** | Node.js, Express.js, JWT Auth |
| **ML API** | Python, FastAPI, TensorFlow, Keras |
| **Database** | MongoDB Atlas |
| **AI Chatbot** | Google Gemini AI |
| **Image Storage** | Cloudinary |
| **Deployment** | Vercel (Frontend) + Render (Backend + ML) |

---

## 📁 Project Structure

```
AgroVision-AI/
├── frontend/                   # React + Tailwind CSS
│   ├── src/
│   │   ├── api/                # Axios API calls
│   │   ├── components/
│   │   │   ├── chat/           # AgroBot chatbot
│   │   │   ├── dashboard/      # Charts & analytics
│   │   │   ├── disease/        # Image uploader & results
│   │   │   ├── layout/         # Navbar & Layout
│   │   │   └── ui/             # Reusable UI components
│   │   ├── context/            # Auth & Theme context
│   │   ├── pages/              # All 10 pages
│   │   └── main.jsx
│   └── package.json
│
├── backend/                    # Node.js + Express REST API
│   ├── src/
│   │   ├── config/             # DB & Cloudinary config
│   │   ├── controllers/        # Business logic
│   │   ├── middleware/         # Auth, CSRF, Error handler
│   │   ├── models/             # Mongoose schemas
│   │   ├── routes/             # API routes
│   │   └── server.js
│   ├── .env
│   └── package.json
│
├── ml-model/                   # Python ML Service
│   ├── dataset/                # PlantVillage dataset (add manually)
│   ├── app.py                  # FastAPI server
│   ├── train.py                # CNN model training
│   ├── predict.py              # Prediction logic & disease metadata
│   ├── model.h5                # Trained model (generated after training)
│   └── requirements.txt
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18
- Python >= 3.9
- MongoDB Atlas account
- Cloudinary account
- Google Gemini API key

### 1. Clone the Repository

```bash
git clone https://github.com/Raushan180-source/AgroVision-AI.git
cd AgroVision-AI
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create `backend/.env`:

```env
MONGO_URI=mongodb+srv://<user>:<password>@cluster0.mongodb.net/Agrovision-AI
JWT_SECRET=your_strong_jwt_secret
JWT_EXPIRES_IN=7d
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
ML_API_URL=http://localhost:8000
PORT=5000
NODE_ENV=development
GEMINI_API_KEY=your_gemini_api_key
FRONTEND_URL=http://localhost:5173
```

```bash
npm run dev
# Server running on port 5000
```

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
# App running on http://localhost:5173
```

### 4. ML API Setup

```bash
cd ml-model
pip install -r requirements.txt
uvicorn app:app --reload --port 8000
# ML API running on http://localhost:8000
```

### 5. Train the Model (Optional)

Download the [PlantVillage Dataset](https://www.kaggle.com/datasets/emmarex/plantdisease) and place it in `ml-model/dataset/PlantVillage/`

```bash
cd ml-model
python train.py
# Saves model.h5 after training
```

> **Note:** Without `model.h5`, the ML API runs in **demo mode** and returns realistic mock predictions.

---

## 🌐 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/profile` | Get user profile |
| PUT | `/api/auth/profile` | Update profile |

### Predictions
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/predictions` | Save prediction |
| GET | `/api/predictions/history` | Get scan history |
| GET | `/api/predictions/stats` | Get statistics |

### Crops
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/crops/suggest` | Get crop recommendations |
| POST | `/api/crops/soil-analysis` | Analyze soil nutrients |

### Chat
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/chat` | Send message to AgroBot |

### ML API
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/predict` | Detect disease from image |
| GET | `/health` | Health check |
| GET | `/classes` | List all disease classes |

---

## 🧠 ML Model Details

- **Architecture** — MobileNetV2 (Transfer Learning) + Custom Dense layers
- **Dataset** — PlantVillage (54,000+ images)
- **Classes** — 38 disease classes across 14 crop types
- **Input Size** — 224 × 224 RGB
- **Training** — Two-phase: top layers first, then fine-tuning last 30 layers
- **Accuracy** — ~95% on validation set

### Supported Crops
`Tomato` `Potato` `Corn` `Wheat` `Rice` `Apple` `Grape` `Pepper` `Strawberry` `Peach` `Cherry` `Soybean` `Squash` `Raspberry`

---

## 🔐 Security Features

- JWT Bearer token authentication
- Rate limiting — 100 req/15min globally, 10 req/15min on auth routes
- CSRF protection via Origin header validation
- Input validation & sanitization on all endpoints
- Mass assignment protection (whitelist-only DB writes)
- Password hashing with bcrypt (12 rounds)
- `select: false` on password field in MongoDB
- Helmet.js security headers
- Mongoose ValidationError, CastError, duplicate key handling

---

## 🚀 Deployment

### Frontend → Vercel

```bash
cd frontend
npm run build
# Deploy dist/ folder to Vercel
# Set VITE_API_URL and VITE_ML_API_URL in Vercel env vars
```

### Backend → Render

1. Create new **Web Service** on [render.com](https://render.com)
2. Connect GitHub repo
3. Build command: `npm install`
4. Start command: `node src/server.js`
5. Add all `.env` variables in Render dashboard

### ML API → Render

1. Create new **Web Service**
2. Build command: `pip install -r requirements.txt`
3. Start command: `uvicorn app:app --host 0.0.0.0 --port 8000`

---

## 📦 Environment Variables Summary

| Variable | Service | Description |
|----------|---------|-------------|
| `MONGO_URI` | Backend | MongoDB Atlas connection string |
| `JWT_SECRET` | Backend | Strong random secret for JWT |
| `GEMINI_API_KEY` | Backend | Google Gemini AI API key |
| `CLOUDINARY_CLOUD_NAME` | Backend | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Backend | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Backend | Cloudinary API secret |
| `FRONTEND_URL` | Backend | Frontend URL for CORS |
| `VITE_API_URL` | Frontend | Backend API base URL |
| `VITE_ML_API_URL` | Frontend | ML API base URL |

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch — `git checkout -b feature/AmazingFeature`
3. Commit your changes — `git commit -m 'Add AmazingFeature'`
4. Push to branch — `git push origin feature/AmazingFeature`
5. Open a Pull Request

---

## 📄 License

MIT License — Free to use for educational and commercial purposes.

---

## 👨‍💻 Author

**Raushan Kumar** — AgroVision AI

[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Raushan180-source)

---

<div align="center">

**Built with ❤️ for farmers, powered by AI 🌿**

⭐ Star this repo if you found it helpful!

</div>
