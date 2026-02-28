# 🌱 EcoRoute Optimizer

A full-stack AI-powered logistics optimization platform that reduces empty miles, lowers carbon emissions, and connects shippers with available truck capacity in real-time.

## 🎯 Features

- **AI Route Engine**: Intelligent route optimization using Google Gemini AI + OR-Tools
- **Live Freight Marketplace**: Real-time matching of shippers and carriers
- **Carbon Impact Tracking**: Calculate and monitor CO₂ emissions per route
- **LTL Pooling & Backhaul Detection**: Automatically identify opportunities to reduce empty miles
- **Interactive Map Visualization**: Real-time route display with Leaflet

## 📋 Prerequisites

- Node.js v14+ and npm
- Python 3.8+ and pip
- Google Gemini API Key

## 🚀 Quick Start

### Backend Setup

```bash
cd backend
pip install -r requirements.txt
```

Create `.env` file in the `backend/` directory:
```
GOOGLE_API_KEY=your_api_key_here
```

Start the server:
```bash
python main.py
```

Server runs on `http://localhost:8000`

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

Frontend opens at `http://localhost:3000`

## 📁 Project Structure

```
eco-route-optimizer/
├── frontend/                 # React + Tailwind CSS
│   ├── src/
│   ├── public/
│   └── package.json
├── backend/                  # FastAPI + OR-Tools
│   ├── main.py
│   ├── optimizer.py
│   ├── utils.py
│   └── requirements.txt
├── data/                     # Data processing
└── README.md
```

## 🔌 API Endpoints

- `GET /api/trucks` - Fetch all truck listings
- `POST /api/trucks` - Add new truck listing
- `POST /api/optimize` - Get optimized route

## 🌍 Modules

### 1. Ship Cargo
Search for available truck capacity and book shipments

### 2. List Fleet
Post your truck routes and available capacity

### 3. AI Optimizer
Input delivery stops and get AI-optimized routes with:
- Optimal vehicle selection
- CO₂ emissions estimate
- LTL pooling opportunities
- Cost calculation in INR

## 📦 Tech Stack

**Frontend:**
- React 18
- Tailwind CSS
- React-Leaflet
- Lucide-react

**Backend:**
- FastAPI
- Python OR-Tools
- Google Generative AI (Gemini)
- SQLite

## 🐛 Troubleshooting

- **Backend connection failed**: Ensure FastAPI is running on localhost:8000
- **Geocoding issues**: Check internet connection
- **Missing API key**: Create `.env` file with GOOGLE_API_KEY
- **Map not loading**: Verify Leaflet CSS imports

## 📝 License

See CITATIONS.md for open-source licenses and attributions.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push and create a Pull Request

---

**Built for sustainable logistics** 🚚🌍