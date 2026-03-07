# 🌱 EcoRoute Optimizer

> **AI Operating System for Sustainable Logistics**

A full-stack AI-powered logistics optimization platform that reduces empty miles, lowers carbon emissions, connects shippers with available truck capacity, and uses advanced AI to predict demand and optimize freight operations.

![Version](https://img.shields.io/badge/version-2.0.0-blue)
![React](https://img.shields.io/badge/React-18-blue)
![Python](https://img.shields.io/badge/Python-3.8+-green)
![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-green)

## 🚀 Production-Ready Features

### Core Modules

| Module | Description |
|--------|-------------|
| **AI Route Engine** | Intelligent route optimization using Google Gemini AI + OR-Tools constraint programming |
| **Freight Marketplace** | Real-time matching of shippers and carriers with booking capabilities |
| **Carbon Intelligence** | AI-powered emissions calculation with reduction strategies |
| **Empty Miles Detection** | Automatic backhaul cargo and LTL pooling suggestions |
| **Freight Pricing AI** | Dynamic pricing prediction based on distance, demand, and capacity |
| **Demand Forecasting** | ML-powered logistics demand prediction for routes |
| **Digital Twin** | Network simulation for what-if scenario analysis |
| **AI Copilot** | Natural language assistant for logistics queries |
| **Weather Integration** | Real-time weather insights affecting route planning |

## 📋 Prerequisites

- **Node.js** v14+ and npm
- **Python** 3.8+ and pip
- **Google Gemini API Key** (for AI features)

## 🏃 Quick Start

### One-Command Startup

```bash
# Start both backend and frontend
cd backend && pip install -r requirements.txt && python main.py &
cd frontend && npm install && npm start
```

### Manual Setup

#### 1. Backend Setup

```bash
cd backend
pip install -r requirements.txt
```

Create `.env` file in `backend/`:
```env
GOOGLE_API_KEY=your_gemini_api_key_here
```

Start the server:
```bash
python main.py
```

Backend runs on `http://localhost:8000`

#### 2. Frontend Setup

```bash
cd frontend
npm install
npm start
```

Frontend opens at `http://localhost:3000`

## 🗂️ Project Structure

```
eco-route-optimizer/
├── frontend/                    # React 18 + Tailwind CSS
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Copilot.js          # AI Assistant
│   │   │   ├── DemandForecast.js  # Demand Prediction
│   │   │   ├── DigitalTwin.js     # Network Simulation
│   │   │   └── PricingCalculator.js
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── store/
│   │   │   └── index.js
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
│
├── backend/                     # FastAPI + Python
│   ├── core/
│   │   ├── config.py
│   │   ├── cache.py
│   │   ├── database.py
│   │   └── messaging.py
│   ├── services/
│   │   ├── freight_marketplace/
│   │   ├── route_optimizer/
│   │   ├── pricing_ai/
│   │   ├── demand_prediction/
│   │   ├── carbon_intelligence/
│   │   ├── empty_miles/
│   │   ├── digital_twin/
│   │   ├── weather/
│   │   └── copilot/
│   ├── main.py
│   ├── optimizer.py
│   ├── utils.py
│   └── requirements.txt
│
├── data/
│   ├── process_data.py
│   └── raw_logistics.csv
│
├── docker-compose.yml          # Docker deployment
├── nginx.conf                  # Reverse proxy
└── README.md
```

## 🔌 API Endpoints

### Core Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/trucks` | Fetch all truck listings |
| POST | `/api/trucks` | Add new truck listing |
| PUT | `/api/trucks/{id}` | Update truck status |
| DELETE | `/api/trucks/{id}` | Delete truck listing |
| GET | `/api/shipments` | Get all shipments |
| POST | `/api/shipments` | Create new shipment |
| POST | `/api/optimize` | Get optimized route |

### AI Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/predictions/demand` | Demand prediction |
| POST | `/api/predictions/route` | Route efficiency prediction |
| POST | `/api/predictions/carbon` | Carbon footprint prediction |
| GET | `/api/analytics/summary` | Overall analytics |
| GET | `/api/analytics/recent` | Recent optimizations |
| GET | `/api/vehicles` | Available vehicle types |
| GET | `/api/weather` | Weather insights |

### Documentation

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## 🎨 UI Screens

### 1. Landing Page
- Hero section with feature highlights
- Statistics showcase
- Call-to-action buttons
- Professional gradient design

### 2. Dashboard
- Real-time analytics cards
- Carbon footprint charts (Area chart)
- Fleet composition (Pie chart)
- Recent route optimizations table

### 3. Find Trucks (Marketplace)
- Search filters (origin, destination, weight, cargo type)
- Available trucks grid with details
- Capacity visualization
- Booking integration

### 4. List Fleet
- Post truck routes
- Set capacity and pricing
- Real-time database storage

### 5. AI Route Engine
- Multi-stop route input
- Interactive map (Leaflet)
- Multiple map layers (Standard, Satellite, Dark, Terrain)
- Vehicle recommendations
- CO₂ emissions calculation
- LTL pooling opportunities
- Backhaul suggestions

### 6. Pricing Calculator
- Distance-based pricing
- Cargo type multipliers
- Fuel surcharge calculation
- AI-generated price explanations

### 7. Demand Forecasting
- Route-based demand predictions
- Visual charts
- High/Medium/Low demand indicators
- Recommended truck counts

### 8. Digital Twin
- Network simulation
- What-if scenarios
- Truck/shipment/warehouse modeling
- Traffic simulation

### 9. AI Copilot
- Natural language queries
- Logistics advice
- Route explanations
- Cost optimization suggestions

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI Framework
- **Tailwind CSS** - Styling
- **React-Leaflet** - Maps
- **Recharts** - Charts
- **Lucide React** - Icons
- **Framer Motion** - Animations

### Backend
- **FastAPI** - Web Framework
- **Python OR-Tools** - Constraint Optimization
- **Google Gemini AI** - Generative AI
- **SQLite** - Database
- **Geopy** - Geocoding
- **Pandas** - Data Processing

### DevOps
- **Docker** - Containerization
- **Nginx** - Reverse Proxy

## 🧮 AI Algorithms

### Route Optimization
- **Vehicle Routing Problem (VRP)** with capacity constraints
- **Google OR-Tools** with constraint programming
- Time windows and delivery deadlines
- Multi-vehicle optimization

### Demand Prediction
- Time-based pattern analysis
- Location intelligence
- Cargo type weighting
- Seasonal adjustments

### Carbon Intelligence
- Vehicle-specific emission factors
- Load factor optimization
- Route merge suggestions
- Tree offset calculations

## 🐛 Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| Backend connection failed | Ensure FastAPI running on localhost:8000 |
| Geocoding issues | Check internet connection |
| Missing API key | Create `.env` with GOOGLE_API_KEY |
| Map not loading | Verify Leaflet CSS imports |
| Port already in use | Kill process on port or use different port |

### Debug Commands

```bash
# Check if port is in use
netstat -ano | findstr :3000

# Kill process on port
taskkill /PID <PID> /F

# Backend verbose logging
python -u main.py
```

## 📈 Performance

- **Route Optimization**: ~30 seconds for complex routes
- **API Response**: <100ms for cached data
- **Frontend Load**: ~2 seconds
- **Database**: SQLite with indexing

## 🔒 Security

- CORS enabled for development
- Environment variables for secrets
- Input validation with Pydantic
- SQL injection prevention (parameterized queries)

## 🚢 Deployment

### Docker Compose

```bash
docker-compose up --build
```

### Manual Production

```bash
# Backend
cd backend
pip install -r requirements.txt
gunicorn main:app -workers 4

# Frontend
cd frontend
npm run build
# Serve with nginx
```

## 📝 License

See [CITATIONS.md](./CITATIONS.md) for open-source licenses and attributions.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🏆 Credits

Built with ❤️ using:
- Google OR-Tools
- Google Gemini AI
- FastAPI
- React
- Tailwind CSS

---

**Built for sustainable logistics** 🚚🌍

*Reduce empty miles. Lower emissions. Optimize everything.*

