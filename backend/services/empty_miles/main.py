"""
Empty Miles Detection Service
Detect trucks traveling empty and suggest backhaul opportunities
"""
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional

app = FastAPI(
    title="Empty Miles Detection Service",
    description="Detect empty return trips and suggest backhaul cargo",
    version="1.0.0"
)

# ============================================
# Models
# ============================================

class TruckStatus(BaseModel):
    truck_id: str
    registration: str
    current_city: str
    destination_city: str
    available_capacity_kg: float
    current_load_kg: float = 0


class BackhaulSuggestion(BaseModel):
    truck_id: str
    from_city: str
    to_city: str
    cargo_item: str
    weight_kg: float
    revenue_inr: float
    empty_miles_saved_km: int
    co2_saved_kg: int


# ============================================
# Mock Data
# ============================================

TRUCKS_EN_ROUTE = [
    {"truck_id": "T001", "registration": "MH12AB1234", "current_city": "Mumbai", "destination_city": "Delhi", "capacity_kg": 15000, "load_kg": 12000},
    {"truck_id": "T002", "registration": "DL10CD5678", "current_city": "Bangalore", "destination_city": "Chennai", "capacity_kg": 10000, "load_kg": 8000},
    {"truck_id": "T003", "registration": "GJ01EF9012", "current_city": "Ahmedabad", "destination_city": "Mumbai", "capacity_kg": 20000, "load_kg": 15000},
]

BACKHAUL_OPPORTUNITIES = [
    {"from_city": "Delhi", "item": "Textiles", "weight": 5000, "destination": "Jaipur", "revenue": 15000},
    {"from_city": "Mumbai", "item": "Electronics", "weight": 3000, "destination": "Pune", "revenue": 12000},
    {"from_city": "Chennai", "item": "Auto Parts", "weight": 4000, "destination": "Bangalore", "revenue": 18000},
    {"from_city": "Bangalore", "item": "IT Equipment", "weight": 2500, "destination": "Hyderabad", "revenue": 10000},
]


# ============================================
# API Endpoints
# ============================================

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "empty-miles-detector"}


@app.get("/trucks-en-route")
def get_trucks_en_route():
    """Get trucks currently en route"""
    return {"status": "success", "trucks": TRUCKS_EN_ROUTE}


@app.get("/suggestions/{truck_id}")
def get_backhaul_suggestions(truck_id: str):
    """Get backhaul suggestions for a truck"""
    
    truck = next((t for t in TRUCKS_EN_ROUTE if t["truck_id"] == truck_id), None)
    if not truck:
        raise HTTPException(status_code=404, detail="Truck not found")
    
    suggestions = []
    
    # Find matching backhaul cargo at destination
    for opportunity in BACKHAUL_OPPORTUNITIES:
        if opportunity["from_city"].lower() == truck["destination_city"].lower():
            if opportunity["weight"] <= truck["capacity_kg"] - truck["load_kg"]:
                suggestions.append({
                    "truck_id": truck_id,
                    "from_city": opportunity["from_city"],
                    "to_city": opportunity["destination"],
                    "cargo_item": opportunity["item"],
                    "weight_kg": opportunity["weight"],
                    "revenue_inr": opportunity["revenue"],
                    "empty_miles_saved_km": 400,
                    "co2_saved_kg": 140
                })
    
    return {"status": "success", "truck": truck, "suggestions": suggestions}


@app.get("/all-opportunities")
def get_all_opportunities():
    """Get all empty miles opportunities across fleet"""
    
    opportunities = []
    
    for truck in TRUCKS_EN_ROUTE:
        available = truck["capacity_kg"] - truck["load_kg"]
        if available > 0:
            for opp in BACKHAUL_OPPORTUNITIES:
                if opp["from_city"].lower() == truck["destination_city"].lower():
                    if opp["weight"] <= available:
                        opportunities.append({
                            "truck_id": truck["truck_id"],
                            "registration": truck["registration"],
                            "current_route": f"{truck['current_city']} → {truck['destination_city']}",
                            "backhaul": f"{opp['from_city']} → {opp['destination']}",
                            "available_capacity_kg": available,
                            "potential_revenue": opp["revenue"],
                            "empty_miles_saved": 400,
                            "co2_saved": 140
                        })
    
    total_revenue = sum(o["potential_revenue"] for o in opportunities)
    total_miles_saved = sum(o["empty_miles_saved"] for o in opportunities)
    
    return {
        "status": "success",
        "opportunities": opportunities,
        "summary": {
            "total_opportunities": len(opportunities),
            "potential_revenue_inr": total_revenue,
            "empty_miles_saved_km": total_miles_saved,
            "co2_saved_kg": int(total_miles_saved * 0.35)
        }
    }


@app.get("/analytics")
def get_empty_miles_analytics():
    """Get empty miles analytics"""
    return {
        "status": "success",
        "metrics": {
            "total_trucks": len(TRUCKS_EN_ROUTE),
            "trucks_with_empty_capacity": 3,
            "total_empty_capacity_kg": 15000,
            "potential_revenue_lost": 55000,
            "empty_miles_this_month_km": 12500,
            "co2_wasted_kg": 4375
        },
        "by_route": [
            {"route": "Mumbai-Delhi", "empty_trips": 2, "wasted_km": 2800},
            {"route": "Bangalore-Chennai", "empty_trips": 1, "weight": 1200}
        ]
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8006)

