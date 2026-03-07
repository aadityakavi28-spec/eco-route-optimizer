"""
Carbon Intelligence Service
AI-powered carbon emission tracking and reduction strategies
"""
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
import math

app = FastAPI(
    title="Carbon Intelligence Service",
    description="Carbon emission calculation and reduction strategies",
    version="1.0.0"
)

# ============================================
# Models
# ============================================

class CarbonRequest(BaseModel):
    distance_km: float
    vehicle_type: str = "diesel_truck"
    weight_kg: float = 10000
    vehicle_capacity_kg: float = 15000


class CarbonResponse(BaseModel):
    co2_emissions_kg: float
    co2_per_km: float
    trees_needed: int
    carbon_credit_cost_usd: float
    environmental_impact: str


class ReductionRequest(BaseModel):
    current_distance_km: float
    vehicle_type: str
    load_kg: float
    vehicle_capacity_kg: float
    route_stops: List[str]


class ReductionResponse(BaseModel):
    current_emissions: dict
    after_optimization: dict
    strategies: List[dict]
    recommendation: str


# ============================================
# Emission Factors (kg CO2 per km)
# ============================================

EMISSION_FACTORS = {
    "electric_van": 0.05,
    "electric_truck": 0.08,
    "diesel_van": 0.15,
    "diesel_truck": 0.35,
    "diesel_tanker": 0.45,
    "refrigerated_truck": 0.50,
    "hybrid_truck": 0.20,
    "cng_truck": 0.25,
    "lng_truck": 0.28,
    "rail_freight": 0.04,
    "waterway_barge": 0.03,
    "air_cargo": 1.5
}

TREE_ABSORPTION_KG = 21  # kg CO2 per year
CARBON_CREDIT_PRICE = 50  # USD per ton


# ============================================
# API Endpoints
# ============================================

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "carbon-intelligence"}


@app.post("/calculate", response_model=CarbonResponse)
def calculate_emissions(request: CarbonRequest):
    """Calculate carbon emissions for a trip"""
    
    base_factor = EMISSION_FACTORS.get(request.vehicle_type, 0.35)
    
    # Load factor adjustment
    load_factor = min(request.weight_kg / request.vehicle_capacity_kg, 1.0)
    if load_factor < 0.3:
        adjusted_factor = base_factor * 1.4
    elif load_factor < 0.5:
        adjusted_factor = base_factor * 1.2
    elif load_factor < 0.7:
        adjusted_factor = base_factor * 1.05
    else:
        adjusted_factor = base_factor
    
    co2_kg = request.distance_km * adjusted_factor
    co2_per_km = co2_kg / request.distance_km if request.distance_km > 0 else 0
    
    trees_needed = math.ceil(co2_kg / TREE_ABSORPTION_KG)
    carbon_credit_cost = (co2_kg / 1000) * CARBON_CREDIT_PRICE
    
    if co2_kg > 500:
        impact = "CRITICAL"
    elif co2_kg > 200:
        impact = "HIGH"
    elif co2_kg > 100:
        impact = "MODERATE"
    else:
        impact = "LOW"
    
    return CarbonResponse(
        co2_emissions_kg=round(co2_kg, 2),
        co2_per_km=round(co2_per_km, 3),
        trees_needed=trees_needed,
        carbon_credit_cost_usd=round(carbon_credit_cost, 2),
        environmental_impact=impact
    )


@app.post("/reduce", response_model=ReductionResponse)
def analyze_reduction_strategies(request: ReductionRequest):
    """Analyze carbon reduction strategies"""
    
    # Calculate current emissions
    current = calculate_emissions(CarbonRequest(
        distance_km=request.current_distance_km,
        vehicle_type=request.vehicle_type,
        weight_kg=request.load_kg,
        vehicle_capacity_kg=request.vehicle_capacity_kg
    ))
    
    # Generate strategies
    strategies = []
    
    # Route optimization
    if len(request.route_stops) > 2:
        strategies.append({
            "name": "Route Consolidation",
            "description": "Optimize stop order to reduce distance by up to 15%",
            "potential_reduction": "15%",
            "ease": "easy",
            "impact": "high"
        })
    
    # Load pooling
    if request.load_kg / request.vehicle_capacity_kg < 0.7:
        strategies.append({
            "name": "LTL Load Pooling",
            "description": "Partner with other shippers to fill unused capacity",
            "potential_reduction": "20%",
            "ease": "medium",
            "impact": "high"
        })
    
    # Vehicle upgrade
    if request.vehicle_type == "diesel_truck":
        strategies.append({
            "name": "Vehicle Modal Shift",
            "description": "Consider CNG/Electric for last-mile delivery",
            "potential_reduction": "30%",
            "ease": "hard",
            "impact": "high"
        })
    
    # Rail intermodal
    if request.current_distance_km > 500:
        strategies.append({
            "name": "Rail Intermodal",
            "description": "Use rail freight for long-haul segments",
            "potential_reduction": "40%",
            "ease": "medium",
            "impact": "high"
        })
    
    # Calculate after optimization
    total_reduction = min(sum([0.15, 0.20, 0.30, 0.40][:len(strategies)]), 0.60)
    reduced_co2 = current.co2_emissions_kg * (1 - total_reduction)
    
    return ReductionResponse(
        current_emissions={
            "co2_kg": current.co2_emissions_kg,
            "impact": current.environmental_impact,
            "trees_needed": current.trees_needed
        },
        after_optimization={
            "projected_co2_kg": round(reduced_co2, 2),
            "co2_saved_kg": round(current.co2_emissions_kg - reduced_co2, 2),
            "reduction_percent": round(total_reduction * 100, 1)
        },
        strategies=strategies,
        recommendation=f"Implement route optimization and load pooling for immediate 35% reduction. Consider rail intermodal for long-haul for additional savings."
    )


@app.get("/impact-summary")
def get_carbon_impact_summary():
    """Get overall carbon impact summary"""
    return {
        "status": "success",
        "total_emissions_kg": 15420,
        "emissions_saved_kg": 3850,
        "trees_planted_equivalent": 183,
        "carbon_credits_purchased_usd": 450,
        "top_reducing_routes": [
            {"route": "Delhi-Mumbai", "saved_kg": 520},
            {"route": "Mumbai-Bangalore", "saved_kg": 480},
            {"route": "Chennai-Hyderabad", "saved_kg": 320}
        ]
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8005)

