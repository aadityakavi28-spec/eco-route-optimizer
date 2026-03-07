# 🌿 ECO ROUTE OPTIMIZER – AI Operating System for Sustainable Logistics

## A Comprehensive Architecture Blueprint for Building an Enterprise-Grade AI Logistics Platform

---

## Executive Summary

This document outlines the complete system architecture for building "EcoRoute Optimizer" - an AI-powered logistics operating system designed to revolutionize freight movement across India and beyond. The platform integrates advanced machine learning, constraint optimization, real-time data processing, and a modern SaaS interface to create an intelligent logistics brain.

The current codebase provides a solid MVP foundation with:
- FastAPI backend with OR-Tools route optimization
- React frontend with interactive Leaflet maps
- Basic freight marketplace functionality
- AI-powered vehicle selection
- CO₂ emissions tracking
- LTL pooling and backhaul detection

This architecture document maps out how to scale this MVP into a full-featured enterprise platform.

---

## 1️⃣ COMPLETE SYSTEM ARCHITECTURE

### 1.1 High-Level Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           ECO ROUTE OPTIMIZER ARCHITECTURE                       │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │                           FRONTEND LAYER                                 │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐    │   │
│  │  │   Web App   │  │ Mobile App  │  │  Admin UI   │  │  Copilot    │    │   │
│  │  │   (React)   │  │  (React N.) │  │   (React)   │  │   (Chat)    │    │   │
│  │  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘    │   │
│  │         │                │                │                │             │   │
│  │         └────────────────┴────────────────┴────────────────┘             │   │
│  │                                    │                                        │   │
│  └────────────────────────────────────┼────────────────────────────────────────┘   │
│                                       │                                          │
│                                       ▼                                          │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │                          API GATEWAY / LOAD BALANCER                    │   │
│  │                        (Nginx / AWS API Gateway)                        │   │
│  └────────────────────────────────────┬────────────────────────────────────────┘   │
│                                       │                                          │
│                                       ▼                                          │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │                        MICROSERVICES ARCHITECTURE                       │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌─────────────┐  │   │
│  │  │   Freight    │  │    Route     │  │   Pricing    │  │  Demand     │  │   │
│  │  │ Marketplace  │  │ Optimizer    │  │     AI       │  │ Prediction  │  │   │
│  │  │   Service    │  │   Service    │  │   Service    │  │   Service   │  │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘  └─────────────┘  │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌─────────────┐  │   │ 
│  │  │   Carbon     │  │   Empty      │  │   Digital    │  │  Weather    │  │   │
│  │  │ Intelligence │  │    Miles     │  │    Twin      │  │   Service   │  │   │
│  │  │   Service    │  │  Detection   │  │  Simulation  │  │             │  │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘  └─────────────┘  │   │
│  └────────────────────────────────────┬────────────────────────────────────────┘   │
│                                       │                                          │
│                                       ▼                                          │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │                         DATA & MESSAGING LAYER                          │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐   │   │
│  │  │ PostgreSQL  │  │    Redis    │  │    Kafka    │  │   S3/Blob   │   │   │
│  │  │  (Primary)  │  │   (Cache)   │  │   (Events)  │  │  (Storage)  │   │   │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘   │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                                                                 │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │                         EXTERNAL INTEGRATIONS                           │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐    │   │
│  │  │   Google    │  │    OSRM    │  │   Weather  │  │    Maps     │    │   │
│  │  │   Gemini    │  │   /Valhalla │  │    APIs    │  │    APIs     │    │   │
│  │  │     AI      │  │   Routing   │  │            │  │            │    │   │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘    │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### 1.2 Service-Oriented Architecture Details

#### Core Microservices

| Service | Responsibility | Tech Stack | Port |
|---------|---------------|-----------|------|
| **Freight Marketplace** | Shipper-carrier matching, bookings | FastAPI + SQLAlchemy | 8001 |
| **Route Optimizer** | VRP solving, route computation | Python OR-Tools | 8002 |
| **Pricing AI** | Dynamic pricing, cost estimation | FastAPI + ML models | 8003 |
| **Demand Prediction** | Forecasting, trend analysis | FastAPI + scikit-learn | 8004 |
| **Carbon Intelligence** | Emissions calculation, reduction strategies | FastAPI + OR-Tools | 8005 |
| **Empty Miles Detector** | Backhaul suggestions, load pooling | FastAPI + Graph algorithms | 8006 |
| **Digital Twin** | Simulation, what-if analysis | FastAPI + NetworkX | 8007 |
| **Weather Service** | Real-time weather, route impact | FastAPI + Weather APIs | 8008 |
| **Copilot Service** | AI assistant, natural language | FastAPI + Gemini API | 8009 |

### 1.3 API Gateway Configuration

```yaml
# api-gateway/nginx.conf (Conceptual)
services:
  api-gateway:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
    environment:
      - NGINX_PROXY_READ_TIMEOUT=300
      - NGINX_PROXY_SEND_TIMEOUT=300

upstream freight_service {
    server freight-service:8001;
}

upstream optimizer_service {
    server optimizer-service:8002;
}

upstream pricing_service {
    server pricing-service:8003;
}

# Routing rules
location /api/marketplace/ {
    proxy_pass http://freight_service/;
}

location /api/optimize/ {
    proxy_pass http://optimizer_service/;
}

location /api/pricing/ {
    proxy_pass http://pricing_service/;
}
```

---

## 2️⃣ FOLDER STRUCTURE

### 2.1 Monorepo Structure (Current → Target)

```
eco-route-optimizer/
├── .git/
├── .gitignore
├── CITATIONS.md
├── README.md
├── ARCHITECTURE.md              # ← NEW: This document
├── TODO.md
├── docker-compose.yml           # ← NEW: Container orchestration
├── Dockerfile.frontend
├── Dockerfile.backend
├── nginx.conf                   # ← NEW: API Gateway config
│
├── backend/                     # ← EXPAND: Microservices
│   ├── main.py                  # ← REFACTOR: API Gateway entry
│   ├── requirements.txt
│   ├── .env.example
│   │
│   ├── services/                # ← NEW: Microservices directory
│   │   ├── __init__.py
│   │   ├── freight_marketplace/
│   │   │   ├── __init__.py
│   │   │   ├── main.py         # FastAPI app
│   │   │   ├── models.py       # Pydantic models
│   │   │   ├── routes.py       # API endpoints
│   │   │   ├── services.py     # Business logic
│   │   │   └── database.py     # SQLAlchemy setup
│   │   │
│   │   ├── route_optimizer/
│   │   │   ├── __init__.py
│   │   │   ├── main.py
│   │   │   ├── optimizer.py    # OR-Tools VRP
│   │   │   ├── routing_utils.py
│   │   │   └── constraints.py
│   │   │
│   │   ├── pricing_ai/
│   │   │   ├── __init__.py
│   │   │   ├── main.py
│   │   │   ├── ml_model.py     # Price prediction
│   │   │   └── factors.py      # Pricing factors
│   │   │
│   │   ├── demand_prediction/
│   │   │   ├── __init__.py
│   │   │   ├── main.py
│   │   │   ├── forecasting.py   # Time series models
│   │   │   └── features.py     # Feature engineering
│   │   │
│   │   ├── carbon_intelligence/
│   │   │   ├── __init__.py
│   │   │   ├── main.py
│   │   │   ├── calculator.py    # CO₂ calculations
│   │   │   └── strategies.py    # Reduction strategies
│   │   │
│   │   ├── empty_miles/
│   │   │   ├── __init__.py
│   │   │   ├── main.py
│   │   │   ├── detector.py      # Empty detection
│   │   │   └── backhaul.py      # Backhaul matching
│   │   │
│   │   ├── digital_twin/
│   │   │   ├── __init__.py
│   │   │   ├── main.py
│   │   │   ├── simulator.py     # Network simulation
│   │   │   └── scenarios.py     # What-if scenarios
│   │   │
│   │   ├── weather/
│   │   │   ├── __init__.py
│   │   │   ├── main.py
│   │   │   └── client.py        # Weather API client
│   │   │
│   │   └── copilot/
│   │       ├── __init__.py
│   │       ├── main.py
│   │       ├── chat.py          # Chat handler
│   │       └── prompts.py       # Prompt engineering
│   │
│   ├── core/                   # ← NEW: Shared utilities
│   │   ├── __init__.py
│   │   ├── config.py           # Configuration management
│   │   ├── database.py         # Database connection
│   │   ├── cache.py            # Redis cache
│   │   ├── messaging.py        # Kafka producer/consumer
│   │   ├── exceptions.py       # Custom exceptions
│   │   └── logging.py          # Structured logging
│   │
│   ├── ml/                     # ← NEW: ML models
│   │   ├── pricing_model.pkl
│   │   ├── demand_model.pkl
│   │   └── emissions_model.pkl
│   │
│   ├── data/                   # Data processing
│   │   ├── raw_logistics.csv
│   │   ├── process_data.py
│   │   └── migrations/         # Database migrations
│   │
│   └── tests/                 # ← NEW: Test suites
│       ├── __init__.py
│       ├── test_freight/
│       ├── test_optimizer/
│       ├── test_pricing/
│       └── test_integration/
│
├── frontend/                  # Expand for scalability
│   ├── public/
│   │   └── index.html
│   │
│   ├── src/
│   │   ├── index.js
│   │   ├── index.css
│   │   ├── App.js
│   │   │
│   │   ├── components/        # Shared components
│   │   │   ├── common/
│   │   │   │   ├── Button.js
│   │   │   │   ├── Card.js
│   │   │   │   ├── Input.js
│   │   │   │   ├── Modal.js
│   │   │   │   ├── Loading.js
│   │   │   │   └── ErrorBoundary.js
│   │   │   │
│   │   │   ├── layout/
│   │   │   │   ├── Navbar.js
│   │   │   │   ├── Sidebar.js
│   │   │   │   ├── Footer.js
│   │   │   │   └── Layout.js
│   │   │   │
│   │   │   └── maps/
│   │   │       ├── MapView.js
│   │   │       ├── RouteLayer.js
│   │   │       ├── TruckMarker.js
│   │   │       └── WarehouseMarker.js
│   │   │
│   │   ├── pages/             # Feature pages
│   │   │   ├── Dashboard.js
│   │   │   ├── ShipCargo.js
│   │   │   ├── ListFleet.js
│   │   │   ├── AIOptimizer.js
│   │   │   ├── Analytics.js
│   │   │   ├── PricingCalculator.js
│   │   │   ├── DemandForecast.js
│   │   │   ├── DigitalTwin.js
│   │   │   └── Copilot.js      # ← NEW: AI Chat
│   │   │
│   │   ├── hooks/             # Custom React hooks
│   │   │   ├── useTrucks.js
│   │   │   ├── useOptimization.js
│   │   │   ├── usePredictions.js
│   │   │   └── useSocket.js    # Real-time updates
│   │   │
│   │   ├── services/           # API communication
│   │   │   ├── api.js          # Axios instance
│   │   │   ├── freightApi.js
│   │   │   ├── optimizerApi.js
│   │   │   ├── pricingApi.js
│   │   │   └── copilotApi.js
│   │   │
│   │   ├── store/              # State management
│   │   │   ├── index.js        # Zustand store
│   │   │   ├── truckStore.js
│   │   │   ├── routeStore.js
│   │   │   └── userStore.js
│   │   │
│   │   ├── utils/              # Helper functions
│   │   │   ├── formatters.js
│   │   │   ├── validators.js
│   │   │   └── mapHelpers.js
│   │   │
│   │   └── types/              # TypeScript types (if using TS)
│   │       └── index.ts
│   │
│   ├── package.json
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── .eslintrc.js
│   └── .prettierrc
│
├── infrastructure/             # ← NEW: IaC
│   ├── kubernetes/
│   │   ├── backend-deployment.yaml
│   │   ├── frontend-deployment.yaml
│   │   ├── services.yaml
│   │   ├── ingress.yaml
│   │   └── configmaps.yaml
│   │
│   ├── terraform/
│   │   ├── main.tf
│   │   ├── ecs.tf
│   │   ├── rds.tf
│   │   ├── elasticache.tf
│   │   └── variables.tf
│   │
│   └── ansible/
│       ├── deploy.yml
│       └── configure.yml
│
└── docs/                       # Documentation
    ├── API.md
    ├── DEPLOYMENT.md
    ├── ARCHITECTURE.md         # Already created above
    └── PRESENTATION.md
```

---

## 3️⃣ DATABASE SCHEMA

### 3.1 PostgreSQL Schema Design

```sql
-- ============================================
-- ECO ROUTE OPTIMIZER - DATABASE SCHEMA
-- ============================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- ============================================
-- CORE TABLES
-- ============================================

-- Users & Authentication
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    company_name VARCHAR(255),
    phone VARCHAR(20),
    user_type ENUM('shipper', 'carrier', 'admin') NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE user_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(512) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- LOGISTICS ENTITIES
-- ============================================

-- Warehouses
CREATE TABLE warehouses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    pincode VARCHAR(10),
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    capacity_kg DECIMAL(12, 2),
    storage_type ENUM('open', 'covered', 'warehouse', 'cold_storage') DEFAULT 'covered',
    facilities TEXT[], -- Array: ['loading_dock', 'forklift', 'cctv']
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trucks / Vehicles
CREATE TABLE trucks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID REFERENCES users(id) ON DELETE CASCADE,
    registration_number VARCHAR(20) UNIQUE NOT NULL,
    vehicle_type ENUM('small_truck', 'large_truck', 'trailer', 'container', 'refrigerated', 'tanker') NOT NULL,
    make VARCHAR(50),
    model VARCHAR(50),
    year_of_manufacture INTEGER,
    capacity_kg DECIMAL(10, 2) NOT NULL,
    capacity_volume DECIMAL(10, 2),
    fuel_type ENUM('diesel', 'petrol', 'cng', 'lng', 'electric', 'hybrid') DEFAULT 'diesel',
    fuel_efficiency_kmpl DECIMAL(6, 2),
    emission_standard ENUM('bs1', 'bs2', 'bs3', 'bs4', 'bs5', 'bs6') DEFAULT 'bs6',
    current_location_lat DECIMAL(10, 8),
    current_location_lng DECIMAL(11, 8),
    current_city VARCHAR(100),
    status ENUM('_route', 'loadingavailable', 'en', 'unloading', 'maintenance', 'unavailable') DEFAULT 'available',
    insurance_expiry DATE,
    permit_expiry DATE,
    fitness_expiry DATE,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Drivers
CREATE TABLE drivers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    truck_id UUID REFERENCES trucks(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    license_number VARCHAR(20) UNIQUE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    license_expiry DATE NOT NULL,
    badge_number VARCHAR(20),
    photo_url TEXT,
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- SHIPMENTS & ORDERS
-- ============================================

-- Shipments (from shippers)
CREATE TABLE shipments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    shipper_id UUID REFERENCES users(id) ON DELETE CASCADE,
    
    origin_warehouse_id UUID REFERENCES warehouses(id),
    origin_address TEXT NOT NULL,
    origin_city VARCHAR(100) NOT NULL,
    origin_lat DECIMAL(10, 8),
    origin_lng DECIMAL(11, 8),
    
    destination_warehouse_id UUID REFERENCES warehouses(id),
    destination_address TEXT NOT NULL,
    destination_city VARCHAR(100) NOT NULL,
    destination_lat DECIMAL(10, 8),
    destination_lng DECIMAL(11, 8),
    
    weight_kg DECIMAL(10, 2) NOT NULL,
    volume_cbm DECIMAL(10, 2),
    cargo_type ENUM('standard', 'fragile', 'hazardous', 'perishable', 'oversized', 'valuable') NOT NULL,
    description TEXT,
    
    pickup_date DATE NOT NULL,
    delivery_deadline DATE NOT NULL,
    priority ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
    
    status ENUM('draft', 'pending', 'quoted', 'booked', 'in_transit', 'delivered', 'cancelled') DEFAULT 'draft',
    
    quoted_price DECIMAL(12, 2),
    final_price DECIMAL(12, 2),
    
    special_instructions TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Truck Routes (from carriers)
CREATE TABLE truck_routes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    truck_id UUID REFERENCES trucks(id) ON DELETE CASCADE,
    driver_id UUID REFERENCES drivers(id),
    
    origin_city VARCHAR(100) NOT NULL,
    origin_lat DECIMAL(10, 8),
    origin_lng DECIMAL(11, 8),
    
    destination_city VARCHAR(100) NOT NULL,
    destination_lat DECIMAL(10, 8),
    destination_lng DECIMAL(11, 8),
    
    available_capacity_kg DECIMAL(10, 2) NOT NULL,
    available_capacity_volume DECIMAL(10, 2),
    preferred_cargo_types TEXT[],
    
    departure_date DATE NOT NULL,
    estimated_arrival DATE,
    is_regular_route BOOLEAN DEFAULT FALSE,
    
    price_per_km DECIMAL(8, 2),
    minimum_charge DECIMAL(10, 2),
    
    status ENUM('planned', 'en_route', 'completed', 'cancelled') DEFAULT 'planned',
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bookings
CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    shipment_id UUID REFERENCES shipments(id) ON DELETE CASCADE,
    truck_route_id UUID REFERENCES truck_routes(id) ON DELETE CASCADE,
    
    carrier_id UUID REFERENCES users(id),
    shipper_id UUID REFERENCES users(id),
    
    price DECIMAL(12, 2) NOT NULL,
    status ENUM('pending', 'confirmed', 'in_transit', 'completed', 'cancelled', 'disputed') DEFAULT 'pending',
    
    confirmed_at TIMESTAMP WITH TIME ZONE,
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    
    proof_of_delivery_url TEXT,
    notes TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- OPTIMIZATION & ANALYTICS
-- ============================================

-- Route Optimizations
CREATE TABLE route_optimizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    
    locations JSONB NOT NULL, -- Array of {city, lat, lng}
    optimized_order INTEGER[],
    total_distance_km DECIMAL(10, 2),
    total_duration_hours DECIMAL(8, 2),
    
    vehicle_type VARCHAR(50),
    estimated_cost_inr DECIMAL(12, 2),
    estimated_fuel_liters DECIMAL(10, 2),
    co2_emissions_kg DECIMAL(10, 2),
    
    optimization_algorithm VARCHAR(50),
    solution_quality VARCHAR(20),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Carbon Tracking
CREATE TABLE carbon_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID REFERENCES bookings(id),
    
    distance_km DECIMAL(10, 2),
    vehicle_type VARCHAR(50),
    fuel_consumed_liters DECIMAL(10, 2),
    co2_emissions_kg DECIMAL(10, 2),
    co2_saved_kg DECIMAL(10, 2),
    
    emission_factor_used DECIMAL(8, 4),
    calculation_method VARCHAR(50),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Pricing History
CREATE TABLE pricing_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    route_key VARCHAR(100) NOT NULL, -- e.g., "delhi-mumbai"
    
    distance_km DECIMAL(10, 2),
    base_rate DECIMAL(8, 2),
    dynamic_rate DECIMAL(8, 2),
    demand_multiplier DECIMAL(4, 2),
    fuel_surcharge DECIMAL(8, 2),
    
    predicted_rate DECIMAL(8, 2),
    actual_rate DECIMAL(8, 2),
    
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Demand Predictions
CREATE TABLE demand_predictions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    route_key VARCHAR(100) NOT NULL,
    cargo_type VARCHAR(50),
    
    prediction_date DATE NOT NULL,
    predicted_demand_score DECIMAL(4, 2),
    predicted_volume_tons DECIMAL(10, 2),
    recommended_trucks INTEGER,
    
    confidence_level DECIMAL(4, 2),
    model_version VARCHAR(20),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- REAL-TIME TRACKING
-- ============================================

-- Vehicle Positions (Time-series)
CREATE TABLE vehicle_positions (
    id BIGSERIAL PRIMARY KEY,
    truck_id UUID REFERENCES trucks(id) ON DELETE CASCADE,
    
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    speed_kmh DECIMAL(6, 2),
    heading DECIMAL(5, 2),
    
    accuracy_m DECIMAL(6, 2),
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Route Events
CREATE TABLE route_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID REFERENCES bookings(id),
    truck_id UUID REFERENCES trucks(id),
    
    event_type ENUM('departed', 'arrived', 'loading_started', 'loading_completed', 
                    'unloading_started', 'unloading_completed', 'delay', 'issue', 'completed') NOT NULL,
    
    location_lat DECIMAL(10, 8),
    location_lng DECIMAL(11, 8),
    location_name VARCHAR(255),
    
    notes TEXT,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- AI & COPILOT
-- ============================================

-- Chat Sessions
CREATE TABLE chat_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    
    title VARCHAR(255),
    context JSONB, -- Store route/shipment context
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chat Messages
CREATE TABLE chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES chat_sessions(id) ON DELETE CASCADE,
    
    role ENUM('user', 'assistant', 'system') NOT NULL,
    content TEXT NOT NULL,
    metadata JSONB,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

CREATE INDEX idx_shipments_shipper ON shipments(shipper_id);
CREATE INDEX idx_shipments_status ON shipments(status);
CREATE INDEX idx_shipments_route ON shipments(origin_city, destination_city);
CREATE INDEX idx_shipments_dates ON shipments(pickup_date, delivery_deadline);

CREATE INDEX idx_truck_routes_truck ON truck_routes(truck_id);
CREATE INDEX idx_truck_routes_route ON truck_routes(origin_city, destination_city);
CREATE INDEX idx_truck_routes_dates ON truck_routes(departure_date);

CREATE INDEX idx_bookings_shipment ON bookings(shipment_id);
CREATE INDEX idx_bookings_carrier ON bookings(carrier_id);
CREATE INDEX idx_bookings_status ON bookings(status);

CREATE INDEX idx_vehicle_positions_truck_time ON vehicle_positions(truck_id, timestamp DESC);
CREATE INDEX idx_route_events_booking ON route_events(booking_id, timestamp);

CREATE INDEX idx_carbon_booking ON carbon_metrics(booking_id);
CREATE INDEX idx_pricing_route_date ON pricing_history(route_key, recorded_at);
CREATE INDEX idx_demand_prediction_date ON demand_predictions(prediction_date, route_key);

-- Geospatial Indexes (PostGIS)
CREATE INDEX idx_warehouses_location ON warehouses USING GIST(geom);
CREATE INDEX idx_trucks_location ON trucks USING GIST(ST_MakePoint(longitude, latitude));

-- ============================================
-- VIEWS FOR COMMON QUERIES
-- ============================================

-- Active shipments view
CREATE VIEW active_shipments AS
SELECT s.*, u.name as shipper_name, u.company_name as shipper_company
FROM shipments s
JOIN users u ON s.shipper_id = u.id
WHERE s.status IN ('pending', 'quoted', 'booked', 'in_transit');

-- Available trucks with routes
CREATE VIEW available_trucks_with_routes AS
SELECT t.*, tr.available_capacity_kg, tr.origin_city as route_origin, 
       tr.destination_city as route_destination, tr.departure_date
FROM trucks t
JOIN truck_routes tr ON t.id = tr.truck_id
WHERE t.status = 'available' AND tr.status = 'planned';

-- Analytics summary
CREATE VIEW analytics_summary AS
SELECT 
    COUNT(DISTINCT b.id) as total_bookings,
    COUNT(DISTINCT b.shipment_id) as total_shipments,
    SUM(b.price) as total_revenue,
    AVG(b.price) as avg_booking_value,
    COUNT(DISTINCT t.id) as active_trucks
FROM bookings b
LEFT JOIN truck_routes tr ON b.truck_route_id = tr.id
LEFT JOIN trucks t ON tr.truck_id = t.id
WHERE b.status IN ('confirmed', 'in_transit');

-- ============================================
-- TRIGGERS
-- ============================================

-- Update timestamp on row update
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trucks_updated_at BEFORE UPDATE ON trucks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER shipments_updated_at BEFORE UPDATE ON shipments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```

### 3.2 Redis Cache Strategy

```python
# backend/core/cache.py

from redis import Redis
from typing import Optional, Any
import json
from functools import wraps

redis_client = Redis(host='localhost', port=6379, db=0, decode_responses=True)

class CacheKeys:
    """Cache key patterns"""
    TRUCKS = "trucks:all"
    TRUCK_PREFIX = "trucks:{id}"
    SHIPMENTS = "shipments:all"
    SHIPMENT_PREFIX = "shipments:{id}"
    PRICING_PREFIX = "pricing:{route_key}"
    DEMAND_PREFIX = "demand:{route_key}:{date}"
    VEHICLE_POS_PREFIX = "position:{truck_id}"
    USER_PREFIX = "user:{id}"

def cache_result(key: str, ttl: int = 300):
    """Decorator to cache function results"""
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            # Try to get from cache
            cached = redis_client.get(key)
            if cached:
                return json.loads(cached)
            
            # Call function and cache result
            result = await func(*args, **kwargs)
            redis_client.setex(key, ttl, json.dumps(result))
            return result
        return wrapper
    return decorator

def invalidate_cache(pattern: str):
    """Invalidate cache keys matching pattern"""
    keys = redis_client.keys(pattern)
    if keys:
        redis_client.delete(*keys)

# Cache TTL definitions
CACHE_TTL = {
    'trucks': 60,           # 1 minute - frequently changing
    'shipments': 60,
    'pricing': 300,         # 5 minutes
    'demand_prediction': 3600,  # 1 hour
    'weather': 900,         # 15 minutes
    'analytics': 300,
    'vehicle_position': 30  # 30 seconds - real-time
}
```

### 3.3 Kafka Event Schema

```python
# backend/core/messaging.py

from kafka import KafkaProducer, KafkaConsumer
import json
from datetime import datetime

# Event Topics
class EventTopics:
    SHIPMENT_CREATED = "shipment.created"
    SHIPMENT_UPDATED = "shipment.updated"
    BOOKING_CONFIRMED = "booking.confirmed"
    TRUCK_LOCATION_UPDATE = "truck.location_update"
    ROUTE_OPTIMIZED = "route.optimized"
    PRICING_UPDATED = "pricing.updated"
    CARBON_CALCULATED = "carbon.calculated"

# Event Schema
class BaseEvent:
    def __init__(self, event_type: str, payload: dict):
        self.event_type = event_type
        self.payload = payload
        self.timestamp = datetime.utcnow().isoformat()
        self.version = "1.0"
    
    def to_dict(self):
        return {
            "event_type": self.event_type,
            "payload": self.payload,
            "timestamp": self.timestamp,
            "version": self.version
        }

# Event Producers
class EventProducer:
    def __init__(self, bootstrap_servers: list):
        self.producer = KafkaProducer(
            bootstrap_servers=bootstrap_servers,
            value_serializer=lambda v: json.dumps(v).encode('utf-8')
        )
    
    def emit_shipment_created(self, shipment_id: str, data: dict):
        event = BaseEvent(EventTopics.SHIPMENT_CREATED, {
            "shipment_id": shipment_id,
            **data
        })
        self.producer.send(EventTopics.SHIPMENT_CREATED, event.to_dict())
    
    def emit_truck_location(self, truck_id: str, lat: float, lng: float):
        event = BaseEvent(EventTopics.TRUCK_LOCATION_UPDATE, {
            "truck_id": truck_id,
            "latitude": lat,
            "longitude": lng
        })
        self.producer.send(EventTopics.TRUCK_LOCATION_UPDATE, event.to_dict())

# Event Consumers
class EventConsumer:
    def __init__(self, bootstrap_servers: list, group_id: str):
        self.consumer = KafkaConsumer(
            bootstrap_servers=bootstrap_servers,
            group_id=group_id,
            value_deserializer=lambda v: json.loads(v.decode('utf-8'))
        )
    
    def subscribe(self, topics: list):
        self.consumer.subscribe(topics)
    
    def consume_events(self):
        for message in self.consumer:
            yield message.value
```

---

## 4️⃣ KEY ALGORITHMS

### 4.1 Vehicle Routing Problem (VRP) with OR-Tools

```python
# backend/services/route_optimizer/optimizer.py

from ortools.constraint_solver import routing_enums_pb2
from ortools.constraint_solver import pywrapcp
import numpy as np
from typing import List, Dict, Tuple, Optional

class AdvancedRouteOptimizer:
    """
    Enterprise-grade VRP solver with multiple constraints
    """
    
    def __init__(self, distance_matrix: List[List[float]]):
        self.distance_matrix = distance_matrix
        self.num_locations = len(distance_matrix)
    
    def solve_vrp(
        self,
        num_vehicles: int = 1,
        demands: Optional[List[float]] = None,
        vehicle_capacities: Optional[List[float]] = None,
        time_windows: Optional[List[Tuple[float, float]]] = None,
        pickup_deliveries: Optional[List[Tuple[int, int]]] = None,
        max_distance_per_vehicle: Optional[float] = None,
        priority_weights: Optional[List[float]] = None
    ) -> Dict:
        """
        Solve VRP with multiple constraints
        
        Args:
            distance_matrix: NxN distance matrix
            num_vehicles: Number of available vehicles
            demands: Demand at each location
            vehicle_capacities: Capacity of each vehicle
            time_windows: (earliest, latest) time windows
            pickup_deliveries: List of (pickup_idx, delivery_idx) pairs
            max_distance_per_vehicle: Max distance per vehicle
            priority_weights: Priority weight for each location
        """
        
        data = self._create_data_model(
            num_vehicles, demands, vehicle_capacities, 
            time_windows, pickup_deliveries, max_distance_per_vehicle
        )
        
        manager = pywrapcp.RoutingIndexManager(
            self.num_locations,
            num_vehicles,
            data['depot']
        )
        
        routing = pywrapcp.RoutingModel(manager)
        
        # Register distance callback
        transit_callback_index = self._register_distance_callback(routing, manager)
        
        # Set arc cost
        routing.SetArcCostEvaluatorOfAllVehicles(transit_callback_index)
        
        # Add capacity constraint
        if demands and vehicle_capacities:
            self._add_capacity_constraint(routing, manager, demands, vehicle_capacities)
        
        # Add time windows
        if time_windows:
            self._add_time_windows(routing, manager, transit_callback_index, time_windows)
        
        # Add pickup-delivery constraints
        if pickup_deliveries:
            self._add_pickup_delivery_constraints(routing, manager, pickup_deliveries)
        
        # Set search parameters
        search_parameters = self._configure_search_parameters()
        
        # Solve
        solution = routing.SolveWithParameters(search_parameters)
        
        return self._extract_solution(routing, manager, solution)
    
    def _create_data_model(self, num_vehicles, demands, vehicle_capacities,
                           time_windows, pickup_deliveries, max_distance_per_vehicle):
        data = {
            'distance_matrix': self.distance_matrix,
            'num_vehicles': num_vehicles,
            'depot': 0,
            'demands': demands or [0] * self.num_locations,
            'vehicle_capacities': vehicle_capacities or [float('inf')] * num_vehicles,
            'vehicle_speed_kmh': 60,  # Average speed
            'max_delivery_hours': 72,
            'max_distance': max_distance_per_vehicle or float('inf')
        }
        return data
    
    def _register_distance_callback(self, routing, manager):
        def distance_callback(from_index, to_index):
            from_node = manager.IndexToNode(from_index)
            to_node = manager.IndexToNode(to_index)
            return int(self.distance_matrix[from_node][to_node])
        
        return routing.RegisterTransitCallback(distance_callback)
    
    def _add_capacity_constraint(self, routing, manager, demands, vehicle_capacities):
        def demand_callback(from_index):
            from_node = manager.IndexToNode(from_index)
            return int(demands[from_node])
        
        demand_index = routing.RegisterUnaryTransitCallback(demand_callback)
        routing.AddDimensionWithVehicleCapacity(
            demand_index,
            0,  # no slack
            vehicle_capacities,
            True,
            'Capacity'
        )
    
    def _add_time_windows(self, routing, manager, transit_callback, time_windows):
        def time_callback(from_index, to_index):
            from_node = manager.IndexToNode(from_index)
            to_node = manager.IndexToNode(to_index)
            distance = self.distance_matrix[from_node][to_node]
            return int(distance / 60 * 60)  # Convert to minutes
        
        time_index = routing.RegisterTransitCallback(time_callback)
        
        time_dimension = routing.AddDimension(
            time_index,
            30 * 60,  # slack
            12 * 60,  # max time per vehicle
            False,
            'Time'
        )
        
        for location_idx, (earliest, latest) in enumerate(time_windows):
            if location_idx == 0:  # Depot
                continue
            index = manager.NodeToIndex(location_idx)
            time_dimension.CumulVar(index).SetRange(earliest * 60, latest * 60)
    
    def _add_pickup_delivery_constraints(self, routing, manager, pickup_deliveries):
        for pickup, delivery in pickup_deliveries:
            pickup_index = manager.NodeToIndex(pickup)
            delivery_index = manager.NodeToIndex(delivery)
            routing.AddPickupAndDelivery(pickup_index, delivery_index)
            routing.solver().Add(
                routing.VehicleVar(pickup_index) == routing.VehicleVar(delivery_index)
            )
    
    def _configure_search_parameters(self):
        params = pywrapcp.DefaultRoutingSearchParameters()
        
        # First solution strategy
        params.first_solution_strategy = (
            routing_enums_pb2.FirstSolutionStrategy.PATH_CHEAPEST_ARC
        )
        
        # Local search metaheuristic
        params.local_search_metaheuristic = (
            routing_enums_pb2.LocalSearchMetaheuristic.GUIDED_LOCAL_SEARCH
        )
        
        # Time limit
        params.time_limit.seconds = 60
        
        # Logging
        params.log_search = False
        
        return params
    
    def _extract_solution(self, routing, manager, solution):
        if not solution:
            return {"status": "error", "message": "No solution found"}
        
        routes = []
        total_distance = 0
        
        for vehicle_id in range(routing.vehicles()):
            index = routing.Start(vehicle_id)
            route = []
            distance = 0
            
            while not routing.IsEnd(index):
                node = manager.IndexToNode(index)
                route.append(node)
                previous_index = index
                index = solution.Value(routing.NextVar(index))
                distance += routing.GetArcCostForVehicle(previous_index, index, vehicle_id)
            
            # Add return to depot
            route.append(manager.IndexToNode(index))
            
            if distance > 0:
                routes.append({
                    "vehicle_id": vehicle_id,
                    "route": route,
                    "distance_km": distance,
                    "stops": len(route) - 1
                })
                total_distance += distance
        
        return {
            "status": "success",
            "total_distance_km": total_distance,
            "routes": routes,
            "num_vehicles_used": len(routes),
            "solution_quality": "optimal" if solution else "heuristic"
        }
```

### 4.2 Demand Prediction Algorithm

```python
# backend/services/demand_prediction/forecasting.py

import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.preprocessing import StandardScaler, LabelEncoder
from datetime import datetime, timedelta
import pickle
from typing import Dict, List

class DemandPredictionEngine:
    """
    ML-powered demand forecasting for logistics routes
    """
    
    def __init__(self):
        self.demand_model = None
        self.scaler = StandardScaler()
        self.route_encoder = LabelEncoder()
        self.cargo_type_encoder = LabelEncoder()
        self.is_trained = False
        
    def prepare_features(self, route_key: str, cargo_type: str, 
                         date: datetime, distance_km: float) -> np.ndarray:
        """Prepare feature vector for prediction"""
        
        # Time-based features
        day_of_week = date.weekday()
        is_weekend = 1 if day_of_week >= 5 else 0
        is_month_start = 1 if date.day <= 5 else 0
        is_month_end = 1 if date.day >= 25 else 0
        quarter = (date.month - 1) // 3 + 1
        
        # Cyclical encoding for day of week
        day_sin = np.sin(2 * np.pi * day_of_week / 7)
        day_cos = np.cos(2 * np.pi * day_of_week / 7)
        
        # Month encoding
        month_sin = np.sin(2 * np.pi * date.month / 12)
        month_cos = np.cos(2 * np.pi * date.month / 12)
        
        # Route encoding
        route_encoded = self.route_encoder.transform([route_key])[0] if route_key in self.route_encoder.classes_ else -1
        cargo_encoded = self.cargo_type_encoder.transform([cargo_type])[0] if cargo_type in self.cargo_type_encoder.classes_ else -1
        
        features = np.array([
            route_encoded,
            cargo_encoded,
            distance_km,
            day_of_week,
            is_weekend,
            is_month_start,
            is_month_end,
            quarter,
            day_sin,
            day_cos,
            month_sin,
            month_cos,
            date.year,
            date.month,
            date.day
        ]).reshape(1, -1)
        
        return features
    
    def predict_demand(
        self, 
        route_key: str, 
        cargo_type: str = "standard",
        distance_km: float = 500,
        date: datetime = None
    ) -> Dict:
        """
        Predict demand for a route on a given date
        """
        if date is None:
            date = datetime.now()
        
        if not self.is_trained:
            # Return fallback prediction
            return self._fallback_prediction(route_key, date)
        
        features = self.prepare_features(route_key, cargo_type, date, distance_km)
        features_scaled = self.scaler.transform(features)
        
        # Get prediction
        demand_score = self.demand_model.predict(features_scaled)[0]
        demand_score = np.clip(demand_score, 0, 1)
        
        # Calculate additional metrics
        base_volume = 100  # tons
        seasonal_factor = self._get_seasonal_factor(date)
        demand_volume = base_volume * demand_score * seasonal_factor
        
        # Calculate recommended trucks
        avg_truck_capacity = 15  # tons
        recommended_trucks = int(np.ceil(demand_volume / avg_truck_capacity))
        
        # Calculate confidence based on model uncertainty
        predictions = []
        for estimator in self.demand_model.estimators_:
            predictions.append(estimator.predict(features_scaled)[0])
        std_dev = np.std(predictions)
        confidence = max(0, min(1, 1 - std_dev))
        
        return {
            "route_key": route_key,
            "cargo_type": cargo_type,
            "prediction_date": date.isoformat(),
            "demand_score": round(demand_score, 3),
            "demand_level": self._get_demand_level(demand_score),
            "predicted_volume_tons": round(demand_volume, 1),
            "recommended_trucks": recommended_trucks,
            "confidence_level": round(confidence, 2),
            "surge_multiplier": round(1 + demand_score * 0.5, 2),
            "pricing_advice": self._get_pricing_advice(demand_score)
        }
    
    def _get_seasonal_factor(self, date: datetime) -> float:
        """Calculate seasonal demand factor"""
        month = date.month
        
        # Festival season (Oct-Dec) - high demand
        if month in [10, 11, 12]:
            return 1.4
        # Pre-festival (Aug-Sep)
        elif month in [8, 9]:
            return 1.2
        # Summer (Apr-Jun) - lower demand
        elif month in [4, 5, 6]:
            return 0.8
        # Monsoon (Jul) - moderate
        elif month == 7:
            return 0.9
        # Rest (Jan-Mar)
        else:
            return 1.0
    
    def _get_demand_level(self, score: float) -> str:
        if score >= 0.8:
            return "CRITICAL"
        elif score >= 0.6:
            return "HIGH"
        elif score >= 0.4:
            return "MODERATE"
        elif score >= 0.2:
            return "LOW"
        else:
            return "VERY_LOW"
    
    def _get_pricing_advice(self, demand_score: float) -> str:
        if demand_score >= 0.8:
            return "Premium pricing recommended - high demand period"
        elif demand_score >= 0.6:
            return "Standard pricing with slight premium"
        elif demand_score >= 0.4:
            return "Standard competitive pricing"
        else:
            return "Consider promotional pricing to attract volume"
    
    def _fallback_prediction(self, route_key: str, date: datetime) -> Dict:
        """Fallback prediction when model is not trained"""
        # Simple heuristic-based prediction
        hour = date.hour
        day = date.weekday()
        
        base_score = 0.5
        
        # Peak hours
        if 8 <= hour <= 10 or 17 <= hour <= 20:
            base_score *= 1.2
        
        # Weekends
        if day >= 5:
            base_score *= 0.8
        
        # Major routes get boost
        major_routes = ["delhi-mumbai", "delhi-bangalore", "mumbai-bangalore", "chennai-hyderabad"]
        if route_key in major_routes:
            base_score *= 1.3
        
        return {
            "route_key": route_key,
            "prediction_date": date.isoformat(),
            "demand_score": round(min(base_score, 1), 2),
            "demand_level": self._get_demand_level(base_score),
            "predicted_volume_tons": round(base_score * 100, 1),
            "recommended_trucks": int(base_score * 10),
            "confidence_level": 0.5,
            "surge_multiplier": round(1 + base_score * 0.3, 2),
            "pricing_advice": "Use dynamic pricing based on real-time demand",
            "note": "Fallback prediction - model not trained"
        }
    
    def train(self, historical_data: pd.DataFrame):
        """
        Train the demand prediction model
        
        Expected columns:
        - route_key, cargo_type, date, distance_km, actual_demand (0-1)
        """
        # Prepare data
        features_list = []
        labels = []
        
        for _, row in historical_data.iterrows():
            date = pd.to_datetime(row['date'])
            features = self.prepare_features(
                row['route_key'],
                row['cargo_type'],
                date,
                row['distance_km']
            )
            features_list.append(features.flatten())
            labels.append(row['actual_demand'])
        
        X = np.array(features_list)
        y = np.array(labels)
        
        # Scale features
        X_scaled = self.scaler.fit_transform(X)
        
        # Train model
        self.demand_model = GradientBoostingRegressor(
            n_estimators=100,
            max_depth=5,
            learning_rate=0.1,
            random_state=42
        )
        self.demand_model.fit(X_scaled, y)
        
        self.is_trained = True
        
        return {
            "status": "success",
            "training_samples": len(X),
            "model_accuracy": self.demand_model.score(X_scaled, y)
        }
```

### 4.3 Carbon Intelligence Engine

```python
# backend/services/carbon_intelligence/strategies.py

from typing import Dict, List, Tuple
from dataclasses import dataclass
import math

@dataclass
class CarbonMetrics:
    """Carbon emission metrics"""
    co2_kg: float
    co2_per_km: float
    trees_needed: int
    carbon_credit_cost_usd: float
    environmental_impact: str

@dataclass
class ReductionStrategy:
    """Strategy to reduce carbon emissions"""
    strategy_name: str
    description: str
    potential_reduction_percent: float
    implementation_ease: str  # easy, medium, hard
    additional_revenue_opportunity: float  # INR

class CarbonIntelligenceEngine:
    """
    AI-powered carbon intelligence and reduction strategies
    """
    
    # Emission factors (kg CO2 per km)
    EMISSION_FACTORS = {
        "small_diesel_van": 0.15,
        "large_diesel_truck": 0.35,
        "diesel_tanker": 0.45,
        "refrigerated_truck": 0.50,
        "cng_truck": 0.25,
        "lng_truck": 0.28,
        "electric_van": 0.05,
        "electric_truck": 0.08,
        "hybrid_truck": 0.20,
        "rail_freight": 0.04,
        "waterway_barge": 0.03
    }
    
    # Average tree CO2 absorption per year (kg)
    TREE_ABSORPTION_KG = 21
    
    # Carbon credit price (USD per ton CO2)
    CARBON_CREDIT_PRICE = 50
    
    def calculate_emissions(
        self,
        distance_km: float,
        vehicle_type: str,
        load_kg: float,
        vehicle_capacity_kg: float
    ) -> CarbonMetrics:
        """Calculate carbon emissions for a trip"""
        
        # Get base emission factor
        base_factor = self.EMISSION_FACTORS.get(vehicle_type, 0.35)
        
        # Calculate load factor (0-1)
        load_factor = min(load_kg / vehicle_capacity_kg, 1.0)
        
        # Adjust emissions based on load factor
        # Underloaded vehicles are less efficient
        if load_factor < 0.3:
            adjusted_factor = base_factor * 1.4
        elif load_factor < 0.5:
            adjusted_factor = base_factor * 1.2
        elif load_factor < 0.7:
            adjusted_factor = base_factor * 1.05
        else:
            adjusted_factor = base_factor
        
        # Calculate total CO2
        co2_kg = distance_km * adjusted_factor
        co2_per_km = co2_kg / distance_km if distance_km > 0 else 0
        
        # Trees needed to offset
        trees_needed = int(math.ceil(co2_kg / self.TREE_ABSORPTION_KG))
        
        # Carbon credit cost
        carbon_credit_cost = (co2_kg / 1000) * self.CARBON_CREDIT_PRICE
        
        # Environmental impact assessment
        if co2_kg > 500:
            impact = "CRITICAL"
        elif co2_kg > 200:
            impact = "HIGH"
        elif co2_kg > 100:
            impact = "MODERATE"
        else:
            impact = "LOW"
        
        return CarbonMetrics(
            co2_kg=round(co2_kg, 2),
            co2_per_km=round(co2_per_km, 3),
            trees_needed=trees_needed,
            carbon_credit_cost_usd=round(carbon_credit_cost, 2),
            environmental_impact=impact
        )
    
    def analyze_reduction_strategies(
        self,
        current_distance_km: float,
        vehicle_type: str,
        load_kg: float,
        vehicle_capacity_kg: float,
        route_stops: List[str],
        available_backhaul_routes: List[Dict] = None
    ) -> Dict:
        """
        Analyze and recommend carbon reduction strategies
        """
        current_metrics = self.calculate_emissions(
            current_distance_km, vehicle_type, load_kg, vehicle_capacity_kg
        )
        
        strategies = []
        
        # Strategy 1: Route optimization
        if len(route_stops) > 2:
            strategies.append(ReductionStrategy(
                strategy_name="Route Consolidation",
                description="Consolidate multiple stops into optimal order to reduce total distance",
                potential_reduction_percent=15,
                implementation_ease="easy",
                additional_revenue_opportunity=0
            ))
        
        # Strategy 2: Load pooling
        if load_kg / vehicle_capacity_kg < 0.7:
            pooling_potential = (0.7 - load_kg / vehicle_capacity_kg) * 100
            strategies.append(ReductionStrategy(
                strategy_name="LTL Load Pooling",
                description=f"Partner with other shippers to fill {pooling_potential:.0f}% unused capacity",
                potential_reduction_percent=20,
                implementation_ease="medium",
                additional_revenue_opportunity=pooling_potential * 100  # Revenue from additional cargo
            ))
        
        # Strategy 3: Backhaul cargo
        if available_backhaul_routes:
            backhaul_savings = len(available_backhaul_routes) * 70  # kg CO2 saved per backhaul
            strategies.append(ReductionStrategy(
                strategy_name="Backhaul Optimization",
                description=f"Found {len(available_backhaul_routes)} return cargo opportunities",
                potential_reduction_percent=25,
                implementation_ease="easy",
                additional_revenue_opportunity=len(available_backhaul_routes) * 5000
            ))
        
        # Strategy 4: Vehicle type optimization
        if vehicle_type in ["diesel_truck", "diesel_tanker"]:
            strategies.append(ReductionStrategy(
                strategy_name="Vehicle Modal Shift",
                description="Switch to CNG/Electric vehicle for last-mile delivery",
                potential_reduction_percent=30,
                implementation_ease="hard",
                additional_revenue_opportunity=-2000  # Higher vehicle cost
            ))
        
        # Strategy 5: Intermodal shift
        if current_distance_km > 500:
            strategies.append(ReductionStrategy(
                strategy_name="Rail Intermodal",
                description="Use rail freight for long-haul segments (>500km)",
                potential_reduction_percent=40,
                implementation_ease="medium",
                additional_revenue_opportunity=5000  # Lower cost + carbon credits
            ))
        
        # Calculate total potential reduction
        total_reduction = sum(s.potential_reduction_percent for s in strategies)
        max_reduction = min(total_reduction, 60)  # Cap at 60%
        
        # Calculate projected emissions after optimization
        reduced_co2 = current_metrics.co2_kg * (1 - max_reduction / 100)
        
        # Sort strategies by effectiveness
        strategies.sort(key=lambda x: x.potential_reduction_percent, reverse=True)
        
        return {
            "current_emissions": {
                "co2_kg": current_metrics.co2_kg,
                "environmental_impact": current_metrics.environmental_impact,
                "trees_needed": current_metrics.trees_needed,
                "carbon_credit_cost_usd": current_metrics.carbon_credit_cost_usd
            },
            "after_optimization": {
                "projected_co2_kg": round(reduced_co2, 2),
                "co2_saved_kg": round(current_metrics.co2_kg - reduced_co2, 2),
                "reduction_percent": round(max_reduction, 1)
            },
            "strategies": [
                {
                    "name": s.strategy_name,
                    "description": s.description,
                    "potential_reduction": f"{s.potential_reduction_percent}%",
                    "ease": s.implementation_ease,
                    "revenue_impact": s.additional_revenue_opportunity
                }
                for s in strategies[:5]  # Top 5 strategies
            ],
            "recommendation": self._generate_recommendation(strategies, current_metrics)
        }
    
    def _generate_recommendation(
        self, 
        strategies: List[ReductionStrategy],
        current_metrics: CarbonMetrics
    ) -> str:
        """Generate human-readable recommendation"""
        if not strategies:
            return "Your route is already optimized for minimal emissions."
        
        top_strategy = strategies[0]
        
        recommendation = f"""
        🎯 Priority Action: {top_strategy.strategy_name}
        
        {top_strategy.description}
        
        Potential reduction: {top_strategy.potential_reduction_percent}%
        
        Current impact: {current_metrics.environmental_impact}
        
        Quick wins available: {len([s for s in strategies if s.implementation_ease == 'easy'])}
        
        Implement route consolidation and load pooling immediately for best results.
        """
        
        return recommendation.strip()
```

---

## 5️⃣ EXAMPLE API ENDPOINTS

### 5.1 Freight Marketplace API

```yaml
# API Documentation - Freight Marketplace Service

openapi: 3.0.0
info:
  title: EcoRoute Freight Marketplace API
  version: 2.0.0
  description: Connect shippers with carriers for freight movement

servers:
  - url: http://localhost:8001/api/v1
    description: Development server

# ============================================
# SHIPMENTS
# ============================================

/shipments:
  get:
    summary: List all shipments
    description: Get paginated list of shipments with filters
    parameters:
      - name: page
        in: query
        schema:
          type: integer
          default: 1
      - name: limit
        in: query
        schema:
          type: integer
          default: 20
      - name: status
        in: query
        schema:
          type: string
          enum: [draft, pending, quoted, booked, in_transit, delivered, cancelled]
      - name: origin_city
        in: query
        schema:
          type: string
      - name: destination_city
        in: query
        schema:
          type: string
      - name: cargo_type
        in: query
        schema:
          type: string
      - name: pickup_date_from
        in: query
        schema:
          type: string
          format: date
      - name: pickup_date_to
        in: query
        schema:
          type: string
          format: date
    responses:
      200:
        description: Successful response
        content:
          application/json:
            schema:
              type: object
              properties:
                status:
                  type: string
                data:
                  type: object
                  properties:
                    shipments:
                      type: array
                      items:
                        $ref: '#/components/schemas/Shipment'
                    pagination:
                      $ref: '#/components/schemas/Pagination'

  post:
    summary: Create new shipment
    requestBody:
      required: true
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/CreateShipmentRequest'
    responses:
      201:
        description: Shipment created successfully

/shipments/{shipment_id}:
  get:
    summary: Get shipment details
    parameters:
      - name: shipment_id
        in: path
        required: true
        schema:
          type: string
          format: uuid
    responses:
      200:
        description: Shipment details

  put:
    summary: Update shipment
    parameters:
      - name: shipment_id
        in: path
        required: true
        schema:
          type: string
          format: uuid
    requestBody:
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/UpdateShipmentRequest'
    responses:
      200:
        description: Shipment updated

  delete:
    summary: Cancel shipment
    parameters:
      - name: shipment_id
        in: path
        required: true
        schema:
          type: string
          format: uuid
    responses:
      204:
        description: Shipment cancelled

/shipments/{shipment_id}/quote:
  post:
    summary: Get quotes from carriers
    description: Submit shipment to get quotes from available carriers
    parameters:
      - name: shipment_id
        in: path
        required: true
        schema:
          type: string
          format: uuid
    responses:
      200:
        description: Quotes retrieved

/shipments/{shipment_id}/book:
  post:
    summary: Book a shipment
    description: Confirm booking with a carrier's quote
    requestBody:
      content:
        application/json:
          schema:
            type: object
            properties:
              quote_id:
                type: string
                format: uuid
    responses:
      201:
        description: Booking confirmed

# ============================================
# TRUCK ROUTES (CARRIER SIDE)
# ============================================

/truck-routes:
  get:
    summary: List available truck routes
    description: Get routes with available capacity
    parameters:
      - name: origin_city
        in: query
        schema:
          type: string
      - name: destination_city
        in: query
        schema:
          type: string
      - name: departure_date
        in: query
        schema:
          type: string
          format: date
      - name: min_capacity_kg
        in: query
        schema:
          type: number
      - name: vehicle_type
        in: query
        schema:
          type: string
    responses:
      200:
        description: Available routes

  post:
    summary: Create truck route
    description: List a truck's planned route with available capacity
    requestBody:
      required: true
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/CreateTruckRouteRequest'
    responses:
      201:
        description: Route created

/truck-routes/{route_id}:
  get:
    summary: Get route details
    responses:
      200:
        description: Route details

  put:
    summary: Update route
    responses:
      200:
        description: Route updated

  delete:
    summary: Cancel route
    responses:
      204:
        description: Route cancelled

# ============================================
# BOOKINGS
# ============================================

/bookings:
  get:
    summary: List bookings
    parameters:
      - name: user_id
        in: query
        schema:
          type: string
          format: uuid
      - name: status
        in: query
        schema:
          type: string
      - name: page
        in: query
        schema:
          type: integer
    responses:
      200:
        description: Bookings list

/bookings/{booking_id}:
  get:
    summary: Get booking details
    responses:
      200:
        description: Booking details

  put:
    summary: Update booking status
    requestBody:
      content:
        application/json:
          schema:
            type: object
            properties:
              status:
                type: string
                enum: [confirmed, in_transit, completed, cancelled]
    responses:
      200:
        description: Status updated

/bookings/{booking_id}/track:
  get:
    summary: Track booking in real-time
    responses:
      200:
        description: Current location and status

# ============================================
# SCHEMAS
# ============================================

components:
  schemas:
    Shipment:
      type: object
      properties:
        id:
          type: string
          format: uuid
        shipper:
          $ref: '#/components/schemas/UserSummary'
        origin:
          $ref: '#/components/schemas/Location'
        destination:
          $ref: '#/components/schemas/Location'
        cargo:
          type: object
          properties:
            weight_kg:
              type: number
            volume_cbm:
              type: number
            cargo_type:
              type: string
        pickup_date:
          type: string
          format: date
        delivery_deadline:
          type: string
          format: date
        status:
          type: string
        quoted_price:
          type: number
        created_at:
          type: string
          format: date-time

    CreateShipmentRequest:
      type: object
      required:
        - origin_address
        - origin_city
        - destination_address
        - destination_city
        - weight_kg
        - cargo_type
        - pickup_date
        - delivery_deadline
      properties:
        origin_address:
          type: string
        origin_city:
          type: string
        destination_address:
          type: string
        destination_city:
          type: string
        weight_kg:
          type: number
        volume_cbm:
          type: number
        cargo_type:
          type: string
          enum: [standard, fragile, hazardous, perishable, oversized, valuable]
        description:
          type: string
        pickup_date:
          type: string
          format: date
        delivery_deadline:
          type: string
          format: date
        priority:
          type: string
          enum: [low, medium, high, urgent]
          default: medium
        special_instructions:
          type: string

    CreateTruckRouteRequest
