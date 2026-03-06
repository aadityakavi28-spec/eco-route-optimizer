# backend/main.py - Beast Mode Enhanced Version
import time
import sqlite3
import json
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

from optimizer import optimize_routes
from utils import (
    calculate_co2, 
    generate_real_distance_matrix, 
    get_coordinates, 
    get_route_geometry,
    select_transport_mode_with_ai,            
    analyze_cargo_opportunities,
    predict_demand,
    predict_route_efficiency,
    predict_carbon_footprint,
    get_weather_insights,
    VEHICLE_DB
)

app = FastAPI(
    title="EcoRoute API - Beast Mode",
    description="AI-Powered Logistics Optimization Platform",
    version="2.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- 1. DATABASE SETUP ---
def init_db():
    conn = sqlite3.connect('eco_route.db')
    c = conn.cursor()
    
    # Enhanced trucks table
    c.execute('''
        CREATE TABLE IF NOT EXISTS trucks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            carrier TEXT,
            route TEXT,
            capacity INTEGER,
            type TEXT,
            current_location TEXT,
            status TEXT DEFAULT 'available',
            price_per_km REAL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # New: Shipments table
    c.execute('''
        CREATE TABLE IF NOT EXISTS shipments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            origin TEXT,
            destination TEXT,
            weight INTEGER,
            cargo_type TEXT,
            status TEXT DEFAULT 'pending',
            price REAL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # New: Analytics table
    c.execute('''
        CREATE TABLE IF NOT EXISTS analytics (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            route TEXT,
            distance_km REAL,
            co2_kg REAL,
            cost_inr REAL,
            vehicle_type TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    c.execute("SELECT COUNT(*) FROM trucks")
    if c.fetchone()[0] == 0:
        trucks = [
            ("GreenLine Logistics", '["New Delhi", "Jaipur"]', 2000, "Standard", "Delhi", "available", 15.0),
            ("FreshFleet Express", '["Agra", "New Delhi", "Chandigarh"]', 800, "Perishable", "Agra", "available", 18.0),
            ("EcoMove Transport", '["Mumbai", "Pune", "Bangalore"]', 5000, "Standard", "Mumbai", "available", 12.0),
            ("Swift Cargo Solutions", '["Chennai", "Hyderabad", "Vijayawada"]', 3000, "Standard", "Chennai", "available", 14.0),
            ("GreenPath Logistics", '["Kolkata", "Patna", "Ranchi"]', 1500, "Hazardous", "Kolkata", "available", 20.0),
        ]
        for truck in trucks:
            c.execute("INSERT INTO trucks (carrier, route, capacity, type, current_location, status, price_per_km) VALUES (?, ?, ?, ?, ?, ?, ?)", truck)
    
    conn.commit()
    conn.close()

init_db()

# --- 2. DATA MODELS ---
class LocationRequest(BaseModel):
    locations: List[str]
    cargo_weight_kg: float
    cargo_type: str = "Standard"
    max_delivery_hours: int = 72

class TruckRequest(BaseModel):
    carrier: str
    route: List[str]
    capacity: int
    type: str
    current_location: Optional[str] = ""
    price_per_km: Optional[float] = 15.0

class ShipmentRequest(BaseModel):
    origin: str
    destination: str
    weight: int
    cargo_type: str = "Standard"
    price: Optional[float] = None

class PredictionRequest(BaseModel):
    location: str
    cargo_type: str = "standard"
    distance_km: Optional[float] = None

# --- 3. FREIGHT MARKETPLACE ENDPOINTS ---
@app.get("/api/trucks")
def get_trucks(status: Optional[str] = None):
    conn = sqlite3.connect('eco_route.db')
    c = conn.cursor()
    
    if status:
        c.execute("SELECT id, carrier, route, capacity, type, current_location, status, price_per_km, created_at FROM trucks WHERE status = ? ORDER BY id DESC", (status,))
    else:
        c.execute("SELECT id, carrier, route, capacity, type, current_location, status, price_per_km, created_at FROM trucks ORDER BY id DESC")
    
    rows = c.fetchall()
    conn.close()
    
    trucks = []
    for row in rows:
        trucks.append({
            "id": row[0],
            "carrier": row[1],
            "route": json.loads(row[2]),
            "capacity": row[3],
            "type": row[4],
            "current_location": row[5],
            "status": row[6],
            "price_per_km": row[7],
            "created_at": row[8]
        })
    return {"status": "success", "trucks": trucks, "count": len(trucks)}

@app.post("/api/trucks")
def add_truck(truck: TruckRequest):
    conn = sqlite3.connect('eco_route.db')
    c = conn.cursor()
    c.execute("INSERT INTO trucks (carrier, route, capacity, type, current_location, status, price_per_km) VALUES (?, ?, ?, ?, ?, ?, ?)",
              (truck.carrier, json.dumps(truck.route), truck.capacity, truck.type, 
               truck.current_location or "Unknown", "available", truck.price_per_km or 15.0))
    truck_id = c.lastrowid
    conn.commit()
    conn.close()
    return {"status": "success", "message": "Truck added to database", "truck_id": truck_id}

@app.put("/api/trucks/{truck_id}")
def update_truck_status(truck_id: int, status: str):
    conn = sqlite3.connect('eco_route.db')
    c = conn.cursor()
    c.execute("UPDATE trucks SET status = ? WHERE id = ?", (status, truck_id))
    conn.commit()
    conn.close()
    return {"status": "success", "message": f"Truck {truck_id} status updated to {status}"}

@app.delete("/api/trucks/{truck_id}")
def delete_truck(truck_id: int):
    conn = sqlite3.connect('eco_route.db')
    c = conn.cursor()
    c.execute("DELETE FROM trucks WHERE id = ?", (truck_id,))
    conn.commit()
    conn.close()
    return {"status": "success", "message": f"Truck {truck_id} deleted"}

# --- 4. SHIPMENTS ENDPOINTS ---
@app.get("/api/shipments")
def get_shipments(status: Optional[str] = None):
    conn = sqlite3.connect('eco_route.db')
    c = conn.cursor()
    
    if status:
        c.execute("SELECT id, origin, destination, weight, cargo_type, status, price, created_at FROM shipments WHERE status = ? ORDER BY id DESC", (status,))
    else:
        c.execute("SELECT id, origin, destination, weight, cargo_type, status, price, created_at FROM shipments ORDER BY id DESC")
    
    rows = c.fetchall()
    conn.close()
    
    shipments = []
    for row in rows:
        shipments.append({
            "id": row[0],
            "origin": row[1],
            "destination": row[2],
            "weight": row[3],
            "cargo_type": row[4],
            "status": row[5],
            "price": row[6],
            "created_at": row[7]
        })
    return {"status": "success", "shipments": shipments, "count": len(shipments)}

@app.post("/api/shipments")
def create_shipment(shipment: ShipmentRequest):
    conn = sqlite3.connect('eco_route.db')
    c = conn.cursor()
    
    # Auto-calculate price if not provided
    price = shipment.price
    if not price:
        # Simple pricing algorithm
        base_rate = {"Standard": 12, "Perishable": 18, "Hazardous": 25}.get(shipment.cargo_type, 12)
        price = base_rate * shipment.weight / 100  # per 100kg
    
    c.execute("INSERT INTO shipments (origin, destination, weight, cargo_type, status, price) VALUES (?, ?, ?, ?, ?, ?)",
              (shipment.origin, shipment.destination, shipment.weight, shipment.cargo_type, "pending", price))
    shipment_id = c.lastrowid
    conn.commit()
    conn.close()
    return {"status": "success", "message": "Shipment created", "shipment_id": shipment_id, "estimated_price": price}

# --- 5. AI ROUTING ENGINE ENDPOINTS ---
@app.get("/")
def read_root():
    return {
        "message": "🌱 EcoRoute API - Beast Mode", 
        "version": "2.0.0",
        "status": "running",
        "endpoints": {
            "trucks": "/api/trucks",
            "optimize": "/api/optimize",
            "predictions": "/api/predictions",
            "analytics": "/api/analytics",
            "vehicles": "/api/vehicles"
        }
    }

@app.post("/api/optimize")
def get_optimized_route(request: LocationRequest):
    coords = []
    valid_locs = []
    
    for loc in request.locations:
        c = get_coordinates(loc)
        if c:
            coords.append(c)
            valid_locs.append(loc)
        time.sleep(0.5) 

    if len(valid_locs) < 2:
        return {"status": "error", "message": "Insufficient valid locations found."}

    # 1. Estimate distance for AI
    estimated_distance = len(valid_locs) * 300 

    # 2. Ask the LLM to pick the transport mode
    v_id, v_details = select_transport_mode_with_ai(
        estimated_distance, 
        request.cargo_weight_kg, 
        request.max_delivery_hours,
        request.cargo_type
    )

    # 3. Generate matrix and solve the route
    matrix = generate_real_distance_matrix(coords)
    
    if not matrix:
        return {"status": "error", "message": "Could not generate distance matrix."}
    
    result = optimize_routes(matrix) 
    
    if result["status"] == "success":
        distance = round(result["total_distance_km"], 2)
        geometry = get_route_geometry(coords, result["optimized_route_indices"])
        
        # 4. Analyze cargo opportunities with enhanced returns
        pooling, backhaul, opportunity_summary = analyze_cargo_opportunities(
            valid_locs, 
            result["optimized_route_indices"], 
            v_details.get("max_weight", 15000), 
            request.cargo_weight_kg
        )
        
        # 5. Calculate costs and emissions
        trip_cost = distance * v_details.get("cost_per_km", 40)
        co2_emissions = round(distance * v_details.get("co2_factor", 0.35), 2)
        
        # 6. Get predictions
        route_efficiency = predict_route_efficiency(distance, len(valid_locs))
        carbon_footprint = predict_carbon_footprint(distance, v_id, request.cargo_weight_kg / v_details.get("max_weight", 15000))
        
        # 7. Get weather insights for first location
        weather = get_weather_insights(valid_locs[0])
        
        # 8. Save to analytics
        try:
            conn = sqlite3.connect('eco_route.db')
            c = conn.cursor()
            c.execute("INSERT INTO analytics (route, distance_km, co2_kg, cost_inr, vehicle_type) VALUES (?, ?, ?, ?, ?)",
                      (json.dumps(valid_locs), distance, co2_emissions, trip_cost, v_details.get("name", "Unknown")))
            conn.commit()
            conn.close()
        except:
            pass
        
        result.update({
            "total_distance_km": distance,
            "co2_emissions_kg": co2_emissions,
            "coordinates": coords,
            "valid_locations": valid_locs,
            "road_geometry": geometry,
            "vehicle_recommended": v_details.get("name", "Heavy Freight Truck"),
            "vehicle_type": v_id,
            "trip_cost_inr": round(trip_cost, 2),
            "pooling_opportunities": pooling,
            "backhaul_opportunity": backhaul,
            "opportunity_summary": opportunity_summary,
            "capacity_utilization_percent": round((request.cargo_weight_kg / v_details.get("max_weight", 15000)) * 100, 1),
            # New beast mode features
            "route_efficiency": route_efficiency,
            "carbon_footprint": carbon_footprint,
            "weather": weather,
            "ai_reasoning": v_details.get("reasoning", "Selected based on cargo requirements and constraints")
        })
        
    return result

# --- 6. PREDICTION ENDPOINTS ---
@app.get("/api/predictions/demand")
def get_demand_prediction(location: str, cargo_type: str = "standard"):
    """Get AI-powered demand prediction for a location"""
    prediction = predict_demand(location, cargo_type)
    return {"status": "success", "location": location, "prediction": prediction}

@app.post("/api/predictions/route")
def get_route_prediction(distance_km: float, stops: int):
    """Get route efficiency prediction"""
    prediction = predict_route_efficiency(distance_km, stops)
    return {"status": "success", "prediction": prediction}

@app.post("/api/predictions/carbon")
def get_carbon_prediction(distance_km: float, vehicle_type: str, load_factor: float = 0.8):
    """Get carbon footprint prediction"""
    prediction = predict_carbon_footprint(distance_km, vehicle_type, load_factor)
    return {"status": "success", "prediction": prediction}

# --- 7. ANALYTICS ENDPOINTS ---
@app.get("/api/analytics/summary")
def get_analytics_summary():
    """Get overall analytics summary"""
    conn = sqlite3.connect('eco_route.db')
    c = conn.cursor()
    
    c.execute("SELECT COUNT(*) FROM trucks")
    total_trucks = c.fetchone()[0]
    
    c.execute("SELECT COUNT(*) FROM shipments")
    total_shipments = c.fetchone()[0]
    
    c.execute("SELECT SUM(distance_km), SUM(co2_kg), SUM(cost_inr) FROM analytics")
    analytics = c.fetchone()
    
    conn.close()
    
    return {
        "status": "success",
        "summary": {
            "total_trucks": total_trucks,
            "total_shipments": total_shipments,
            "total_distance_km": round(analytics[0] or 0, 2),
            "total_co2_kg": round(analytics[1] or 0, 2),
            "total_cost_inr": round(analytics[2] or 0, 2),
            "avg_cost_per_km": round(analytics[2] / analytics[0], 2) if analytics[0] else 0,
            "carbon_saved_trees": round((analytics[1] or 0) / 21)
        }
    }

@app.get("/api/analytics/recent")
def get_recent_analytics(limit: int = 10):
    """Get recent route optimizations"""
    conn = sqlite3.connect('eco_route.db')
    c = conn.cursor()
    c.execute("SELECT route, distance_km, co2_kg, cost_inr, vehicle_type, created_at FROM analytics ORDER BY id DESC LIMIT ?", (limit,))
    rows = c.fetchall()
    conn.close()
    
    results = []
    for row in rows:
        results.append({
            "route": json.loads(row[0]),
            "distance_km": row[1],
            "co2_kg": row[2],
            "cost_inr": row[3],
            "vehicle_type": row[4],
            "created_at": row[5]
        })
    
    return {"status": "success", "recent_routes": results}

# --- 8. VEHICLES ENDPOINT ---
@app.get("/api/vehicles")
def get_vehicles():
    """Get all available vehicle types"""
    vehicles = []
    for v_id, v_details in VEHICLE_DB.items():
        vehicles.append({
            "id": v_id,
            "name": v_details["name"],
            "max_weight_kg": v_details["max_weight"],
            "cost_per_km": v_details["cost_per_km"],
            "co2_factor": v_details["co2_factor"],
            "speed_kmh": v_details["speed_kmh"]
        })
    return {"status": "success", "vehicles": vehicles}

# --- 9. WEATHER ENDPOINT ---
@app.get("/api/weather")
def get_weather(location: str):
    """Get weather insights for a location"""
    weather = get_weather_insights(location)
    return {"status": "success", "location": location, "weather": weather}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

