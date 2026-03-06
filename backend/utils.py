import time
import ssl
import requests
from geopy.geocoders import Nominatim
import os
import json
from pathlib import Path
from dotenv import load_dotenv
from datetime import datetime, timedelta
import random
import math

env_path = Path(__file__).parent / ".env"
load_dotenv(dotenv_path=env_path)

api_key = os.environ.get("GOOGLE_API_KEY")

# Initialize AI Client with new google.genai package
client = None
if api_key:
    print("[OK] Found GOOGLE_API_KEY!")
    try:
        from google import genai
        client = genai.Client(api_key=api_key)
        print("[OK] AI Client initialized with google.genai")
    except Exception as e:
        print(f"[WARN] Could not initialize AI client: {e}")
        # Try legacy package as fallback
        try:
            import google.generativeai as genai
            client = genai.Client(api_key=api_key)
            print("[OK] AI Client initialized with legacy google.generativeai")
        except Exception as e2:
            print(f"[WARN] Legacy AI client also failed: {e2}")
            client = None
else:
    print(f"[WARN] GOOGLE_API_KEY not found in {env_path} - AI features will be limited")


# MAC SSL BYPASS
ssl._create_default_https_context = ssl._create_unverified_context
geolocator = Nominatim(user_agent="eco_route_beast_mode", timeout=15)

def calculate_co2(distance_km: float, vehicle_type: str = "diesel_truck") -> float:
    factors = {
        "electric_van": 0.05, 
        "electric_truck": 0.08,
        "diesel_van": 0.15, 
        "diesel_truck": 0.35,
        "hybrid_truck": 0.20,
        "cng_truck": 0.25,
        "lng_truck": 0.28,
        "rail_freight": 0.04,
        "air_cargo": 1.5
    }
    return round(distance_km * factors.get(vehicle_type, 0.2), 2)

def get_coordinates(location_name: str):
    # Extended demo cities for beast mode
    demo_cities = {
        "new delhi, india": (28.6139, 77.2090),
        "delhi, india": (28.6139, 77.2090),
        "agra, india": (27.1767, 78.0081),
        "jaipur, india": (26.9124, 75.7873),
        "chandigarh, india": (30.7333, 76.7794),
        "mumbai, india": (19.0760, 72.8777),
        "bangalore, india": (12.9716, 77.5946),
        "bengaluru, india": (12.9716, 77.5946),
        "chennai, india": (13.0827, 80.2707),
        "kolkata, india": (22.5726, 88.3639),
        "hyderabad, india": (17.3850, 78.4867),
        "pune, india": (18.5204, 73.8567),
        "ahmedabad, india": (23.0225, 72.5714),
        "lucknow, india": (26.8467, 80.9462),
        "kanpur, india": (26.4499, 80.3319),
        "surat, india": (21.1702, 72.8311),
        "kochi, india": (9.9312, 76.2673),
        "goa, india": (15.2993, 74.1240),
        "bhopal, india": (23.2599, 77.4126),
        "indore, india": (22.7196, 75.8577),
        "coimbatore, india": (11.0168, 76.9558),
        "madurai, india": (9.9252, 78.1198),
        "visakhapatnam, india": (17.6868, 83.2185),
        "vijayawada, india": (16.5062, 80.6480),
        "nagpur, india": (21.1458, 79.0882),
        "patna, india": (25.5941, 85.1376),
        " Ranchi, india": (23.3441, 85.3095),
    }
    
    clean_name = location_name.strip().lower()
    
    # 1. Check our guaranteed demo dictionary first
    if clean_name in demo_cities:
        print(f"✅ Using guaranteed demo coordinates for: {location_name}")
        return demo_cities[clean_name]
        
    # 2. If it's a new city, try the live API
    try:
        print(f"📡 Asking OpenStreetMap for: {location_name}")
        location = geolocator.geocode(location_name)
        if location:
            return (location.latitude, location.longitude)
        return None
    except Exception as e:
        print(f"❌ Geocoding failed for {location_name}: {e}")
        return None

def generate_real_distance_matrix(coords: list):
    """Uses OSRM Table API to get real driving distances."""
    if not coords or len(coords) < 2:
        return None
        
    coord_str = ";".join([f"{c[1]},{c[0]}" for c in coords])
    url = f"http://router.project-osrm.org/table/v1/driving/{coord_str}?annotations=distance"
    
    try:
        response = requests.get(url, timeout=10).json()
        if response.get("code") != "Ok":
            # Fallback to simple distance calculation
            return create_fallback_matrix(coords)
        
        # OSRM returns distances in meters, convert to integer km for OR-Tools
        matrix = [[int(d / 1000) for d in row] for row in response["distances"]]
        return matrix
    except Exception as e:
        print(f"OSRM API failed, using fallback: {e}")
        return create_fallback_matrix(coords)

def create_fallback_matrix(coords: list):
    """Fallback distance matrix using Haversine formula"""
    n = len(coords)
    matrix = [[0] * n for _ in range(n)]
    
    for i in range(n):
        for j in range(n):
            if i != j:
                dist = haversine_distance(coords[i], coords[j])
                matrix[i][j] = int(dist)
    
    return matrix

def haversine_distance(coord1, coord2):
    """Calculate distance between two coordinates in km"""
    R = 6371  # Earth radius in km
    
    lat1, lon1 = math.radians(coord1[0]), math.radians(coord1[1])
    lat2, lon2 = math.radians(coord2[0]), math.radians(coord2[1])
    
    dlat = lat2 - lat1
    dlon = lon2 - lon1
    
    a = math.sin(dlat/2)**2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon/2)**2
    c = 2 * math.asin(math.sqrt(a))
    
    return R * c

def get_route_geometry(coords: list, order: list):
    """Fetches real road path geometry for the optimized sequence."""
    if not coords or not order:
        return []
        
    ordered_coords = [coords[i] for i in order]
    coord_str = ";".join([f"{c[1]},{c[0]}" for c in ordered_coords])
    url = f"http://router.project-osrm.org/route/v1/driving/{coord_str}?overview=full&geometries=geojson"
    
    try:
        response = requests.get(url, timeout=10).json()
        if response.get("code") == "Ok":
            # Flip (lon, lat) to (lat, lon) for Leaflet
            return [[p[1], p[0]] for p in response["routes"][0]["geometry"]["coordinates"]]
    except:
        pass
    
    # Fallback: create straight line path
    return [[c[0], c[1]] for c in ordered_coords]

# --- ENHANCED LOGISTICS ENGINE ---

VEHICLE_DB = {
    "electric_van": {"max_weight": 1000, "cost_per_km": 15, "co2_factor": 0.05, "name": "EV Van (Eco)", "speed_kmh": 70},
    "electric_truck": {"max_weight": 8000, "cost_per_km": 35, "co2_factor": 0.08, "name": "Electric Truck", "speed_kmh": 60},
    "diesel_van": {"max_weight": 3500, "cost_per_km": 25, "co2_factor": 0.15, "name": "Delivery Van", "speed_kmh": 80},
    "diesel_truck": {"max_weight": 15000, "cost_per_km": 40, "co2_factor": 0.35, "name": "Heavy Freight Truck", "speed_kmh": 65},
    "hybrid_truck": {"max_weight": 20000, "cost_per_km": 45, "co2_factor": 0.20, "name": "Hybrid Truck", "speed_kmh": 70},
    "cng_truck": {"max_weight": 18000, "cost_per_km": 38, "co2_factor": 0.25, "name": "CNG Truck", "speed_kmh": 65},
    "rail_freight": {"max_weight": 50000, "cost_per_km": 15, "co2_factor": 0.04, "name": "Rail Freight", "speed_kmh": 50},
    "air_cargo": {"max_weight": 100000, "cost_per_km": 150, "co2_factor": 1.5, "name": "Air Cargo", "speed_kmh": 800},
}

# Extended mock databases for enhanced logistics
PENDING_LTL_CARGO = {
    "new delhi, india": {"item": "Electronics", "weight": 500, "revenue": 4500, "urgency": "high"},
    "jaipur, india": {"item": "Textiles", "weight": 800, "revenue": 6000, "urgency": "medium"},
    "agra, india": {"item": "Leather Goods", "weight": 300, "revenue": 2500, "urgency": "low"},
    "mumbai, india": {"item": "Pharmaceuticals", "weight": 200, "revenue": 8000, "urgency": "critical"},
    "bangalore, india": {"item": "IT Equipment", "weight": 400, "revenue": 5500, "urgency": "high"},
    "chennai, india": {"item": "Auto Parts", "weight": 600, "revenue": 4200, "urgency": "medium"},
    "kolkata, india": {"item": "Jute Products", "weight": 900, "revenue": 3800, "urgency": "low"},
    "hyderabad, india": {"item": "Pharmaceuticals", "weight": 350, "revenue": 7200, "urgency": "critical"},
    "pune, india": {"item": "Manufacturing Parts", "weight": 750, "revenue": 4800, "urgency": "medium"},
    "ahmedabad, india": {"item": "Textiles", "weight": 550, "revenue": 3600, "urgency": "low"},
}

BACKHAUL_CARGO = {
    "chandigarh, india": {"item": "Machinery Parts", "weight": 4000, "destination": "New Delhi", "revenue": 15000},
    "jaipur, india": {"item": "Handicrafts", "weight": 2000, "destination": "New Delhi", "revenue": 8500},
    "mumbai, india": {"item": "Import Goods", "weight": 5000, "destination": "Delhi", "revenue": 22000},
    "bangalore, india": {"item": "Electronics", "weight": 3000, "destination": "Chennai", "revenue": 12000},
    "kolkata, india": {"item": "Tea & Spices", "weight": 2500, "destination": "Mumbai", "revenue": 9500},
}

# Price per km estimation based on market data
BASE_PRICE_PER_KM = {
    "standard": 12,
    "express": 18,
    " refrigerated": 22,
    "hazardous": 28,
    "oversized": 35,
}

def predict_demand(location: str, cargo_type: str = "standard") -> dict:
    """AI-powered demand prediction for a location"""
    # Simulated prediction using time-based patterns
    hour = datetime.now().hour
    day = datetime.now().weekday()
    
    # Base demand scores
    base_demand = random.uniform(0.4, 0.9)
    
    # Peak hours boost
    if 8 <= hour <= 10 or 17 <= hour <= 20:
        base_demand *= 1.3
    
    # Weekend reduction
    if day >= 5:
        base_demand *= 0.7
    
    # Major cities get boost
    major_cities = ["mumbai", "delhi", "bangalore", "chennai", "kolkata", "hyderabad", "pune"]
    if any(city in location.lower() for city in major_cities):
        base_demand *= 1.2
    
    return {
        "demand_score": round(base_demand, 2),
        "recommended_price": round(BASE_PRICE_PER_KM.get(cargo_type, 12) * (1 + base_demand * 0.5), 2),
        "surge_multiplier": round(1 + (base_demand - 0.5) * 0.5, 2),
        "predicted_volume_tons": round(base_demand * random.uniform(50, 200), 1)
    }

def predict_route_efficiency(distance_km: float, stops: int, traffic_factor: float = 1.0) -> dict:
    """Predict route efficiency with AI insights"""
    base_efficiency = 0.85
    
    # More stops = less efficiency
    efficiency_drop = min(stops * 0.05, 0.3)
    
    # Traffic impact
    traffic_impact = (traffic_factor - 1) * 0.15
    
    final_efficiency = max(base_efficiency - efficiency_drop - traffic_impact, 0.5)
    
    return {
        "efficiency_score": round(final_efficiency * 100, 1),
        "estimated_delivery_hours": round((distance_km / 60) * traffic_factor * (1 + stops * 0.1), 1),
        "fuel_efficiency_mpg": round(6.5 / final_efficiency, 1),
        "cost_per_km_optimized": round(40 / final_efficiency, 2)
    }

def predict_carbon_footprint(distance_km: float, vehicle_type: str, load_factor: float = 0.8) -> dict:
    """Advanced carbon footprint prediction"""
    base_co2 = calculate_co2(distance_km, vehicle_type)
    
    # Load factor impact - underloaded vehicles produce more CO2 per kg
    if load_factor < 0.5:
        base_co2 *= 1.3
    elif load_factor < 0.7:
        base_co2 *= 1.1
    
    # Calculate offset needed (trees needed)
    trees_needed = round(base_co2 / 21)  # Average tree absorbs 21kg CO2/year
    
    # Carbon credit cost (approx $50 per ton CO2)
    carbon_credit_cost = round(base_co2 / 1000 * 50, 2)
    
    return {
        "co2_emissions_kg": base_co2,
        "co2_per_km": round(base_co2 / distance_km, 3) if distance_km > 0 else 0,
        "trees_needed_to_offset": trees_needed,
        "carbon_credit_cost_usd": carbon_credit_cost,
        "environmental_impact": "high" if base_co2 > 500 else "medium" if base_co2 > 200 else "low"
    }

def select_transport_mode_with_ai(total_distance_km: float, cargo_weight_kg: float, max_delivery_hours: int, cargo_type: str = "Standard"):
    """
    Uses the NEW Gemini SDK to dynamically calculate and select the best transport mode.
    Enhanced with more sophisticated logic.
    """
    # First, filter vehicles that can handle the weight
    eligible_vehicles = {k: v for k, v in VEHICLE_DB.items() if v["max_weight"] >= cargo_weight_kg}
    
    if not eligible_vehicles:
        # Default to heaviest if nothing fits
        return "air_cargo", VEHICLE_DB["air_cargo"]
    
    prompt = f"""
    You are an enterprise logistics AI assistant specialized in sustainable transport.
    A user needs to ship cargo with the following constraints:
    - Distance: {total_distance_km} km
    - Weight: {cargo_weight_kg} kg
    - Cargo Type: {cargo_type}
    - Time Limit: {max_delivery_hours} hours
    - Available Vehicles: {list(eligible_vehicles.keys())}

    Based on physics, standard transport speeds, minimizing carbon footprint, and cost efficiency,
    select the absolute best mode of transport.
    
    You MUST respond with ONLY a valid JSON object matching this exact format. Do not use markdown blocks:
    {{
        "name": "Vehicle Name",
        "speed_kmh": 80,
        "co2_factor": 0.120,
        "cost_per_km": 40,
        "max_weight": 24000,
        "reasoning": "Brief explanation of why this vehicle was selected"
    }}
    """
    
    try:
        if not client:
            raise ValueError("No API Key found.")
            
        # Try new SDK first, then fallback
        try:
            response = client.models.generate_content(
                model='gemini-2.0-flash',
                contents=prompt
            )
        except:
            # Try alternative model name
            response = client.models.generate_content(
                model='gemini-1.5-flash',
                contents=prompt
            )
        
        clean_text = response.text.strip().replace("```json", "").replace("```", "")
        v_details = json.loads(clean_text)
        print(f"[AI] Selected vehicle: {v_details.get('name', 'Unknown')}")
        return "ai_selected_vehicle", v_details
        
    except Exception as e:
        print(f"[WARN] AI Routing Failed (Using Fallback): {e}")
        # Enhanced fallback logic
        return enhanced_fallback_selection(total_distance_km, cargo_weight_kg, max_delivery_hours, eligible_vehicles)

def enhanced_fallback_selection(distance_km: float, weight_kg: float, time_hours: int, eligible_vehicles: dict):
    """Enhanced fallback vehicle selection algorithm"""
    
    # Calculate required speed
    required_speed = distance_km / time_hours if time_hours > 0 else 60
    
    # Score each vehicle
    best_score = -float('inf')
    best_vehicle = None
    best_details = None
    
    for v_id, v_details in eligible_vehicles.items():
        score = 0
        
        # Speed score (must meet time requirement)
        if v_details["speed_kmh"] >= required_speed:
            score += 30
        else:
            score -= 50  # Can't meet deadline
        
        # Cost efficiency
        score += (50 - v_details["cost_per_km"]) * 0.5
        
        # Environmental score (lower is better)
        score += (0.5 - v_details["co2_factor"]) * 100
        
        # Capacity buffer (don't max out)
        capacity_buffer = (v_details["max_weight"] - weight_kg) / v_details["max_weight"]
        score += capacity_buffer * 20
        
        if score > best_score:
            best_score = score
            best_vehicle = v_id
            best_details = v_details.copy()
            best_details["reasoning"] = f"Selected based on speed match, cost efficiency, and environmental impact"
    
    return best_vehicle, best_details

def analyze_cargo_opportunities(valid_locations, optimized_indices, vehicle_capacity, current_weight):
    """Scans the route for empty space and suggests pooling and return cargo - Enhanced version"""
    pooling_suggestions = []
    available_space = vehicle_capacity - current_weight
    
    # Priority sorting for pooling
    priority_order = {"critical": 0, "high": 1, "medium": 2, "low": 3}

    # 1. Check for Pooling (LTL) along the route
    pooling_candidates = []
    for idx in optimized_indices:
        city = valid_locations[idx].lower()
        if city in PENDING_LTL_CARGO:
            extra_cargo = PENDING_LTL_CARGO[city]
            if extra_cargo["weight"] <= available_space:
                pooling_candidates.append({
                    "city": valid_locations[idx],
                    "item": extra_cargo["item"],
                    "weight": extra_cargo["weight"],
                    "revenue_inr": extra_cargo["revenue"],
                    "urgency": extra_cargo.get("urgency", "medium"),
                    "priority": priority_order.get(extra_cargo.get("urgency", "medium"), 2)
                })
                available_space -= extra_cargo["weight"]
    
    # Sort by priority
    pooling_suggestions = sorted(pooling_candidates, key=lambda x: x["priority"])

    # 2. Check for Backhaul from the final dropoff
    backhaul = None
    last_city = valid_locations[optimized_indices[-1]].lower()
    if last_city in BACKHAUL_CARGO:
        b_cargo = BACKHAUL_CARGO[last_city]
        if b_cargo["weight"] <= vehicle_capacity:
            backhaul = {
                "from_city": valid_locations[optimized_indices[-1]],
                "to_city": b_cargo["destination"],
                "item": b_cargo["item"],
                "weight": b_cargo["weight"],
                "revenue_inr": b_cargo["revenue"],
                "empty_miles_saved_km": 200,  # Estimated
                "co2_saved_kg": 70
            }

    # Calculate total potential revenue
    total_pooling_revenue = sum(p["revenue_inr"] for p in pooling_suggestions)
    total_backhaul_revenue = backhaul["revenue_inr"] if backhaul else 0
    
    return pooling_suggestions, backhaul, {
        "total_additional_revenue": total_pooling_revenue + total_backhaul_revenue,
        "total_empty_miles_saved": backhaul.get("empty_miles_saved_km", 0) if backhaul else 0,
        "total_co2_saved": backhaul.get("co2_saved_kg", 0) if backhaul else 0
    }

def get_weather_insights(location: str) -> dict:
    """Get simulated weather insights for logistics planning"""
    # In production, this would call a weather API
    conditions = ["clear", "cloudy", "rainy", "foggy"]
    condition = random.choice(conditions)
    
    impact = {
        "clear": {"speed_impact": 1.0, "delay_risk": 0.05},
        "cloudy": {"speed_impact": 0.95, "delay_risk": 0.1},
        "rainy": {"speed_impact": 0.85, "delay_risk": 0.25},
        "foggy": {"speed_impact": 0.7, "delay_risk": 0.4}
    }
    
    return {
        "condition": condition,
        "temperature_celsius": random.randint(15, 40),
        "visibility_km": random.randint(2, 20),
        "speed_impact": impact[condition]["speed_impact"],
        "delay_risk": impact[condition]["delay_risk"],
        "advisory": f"Expect {impact[condition]['delay_risk']*100:.0f}% delays due to {condition} conditions"
    }

