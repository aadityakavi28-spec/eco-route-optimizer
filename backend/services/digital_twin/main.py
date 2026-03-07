"""
Digital Twin Simulation Service
What-if scenario simulation for logistics network
"""
from fastapi import FastAPI
from pydantic import BaseModel
from typing import List, Dict
import random

app = FastAPI(
    title="Digital Twin Service",
    description="Logistics network simulation and what-if analysis",
    version="1.0.0"
)

# ============================================
# Models
# ============================================

class ScenarioRequest(BaseModel):
    scenario_name: str
    changes: List[Dict]


class SimulationResult(BaseModel):
    scenario_name: str
    baseline_metrics: Dict
    simulated_metrics: Dict
    impact: Dict


# ============================================
# API Endpoints
# ============================================

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "digital-twin"}


@app.post("/simulate")
def simulate_scenario(request: ScenarioRequest):
    """Run what-if simulation"""
    
    # Baseline metrics
    baseline = {
        "total_shipments": 1500,
        "on_time_delivery_rate": 0.85,
        "avg_cost_per_shipment": 25000,
        "total_co2_kg": 45000,
        "truck_utilization": 0.72,
        "empty_miles_km": 12500
    }
    
    # Apply scenario changes
    simulated = baseline.copy()
    
    for change in request.changes:
        change_type = change.get("type")
        value = change.get("value")
        
        if change_type == "fuel_price_increase":
            simulated["avg_cost_per_shipment"] *= (1 + value)
            simulated["total_co2_kg"] *= 1.05
            
        elif change_type == "demand_doubles":
            simulated["total_shipments"] *= value
            simulated["truck_utilization"] = min(0.95, simulated["truck_utilization"] * 1.2)
            
        elif change_type == "truck_breakdown":
            reduction = value * 0.1
            simulated["on_time_delivery_rate"] *= (1 - reduction)
            simulated["truck_utilization"] *= (1 + reduction * 0.5)
            
        elif change_type == "new_warehouse":
            simulated["avg_cost_per_shipment"] *= 0.9
            simulated["truck_utilization"] *= 1.1
    
    return SimulationResult(
        scenario_name=request.scenario_name,
        baseline_metrics=baseline,
        simulated_metrics=simulated,
        impact={
            "cost_change_pct": round((simulated["avg_cost_per_shipment"] - baseline["avg_cost_per_shipment"]) / baseline["avg_cost_per_shipment"] * 100, 1),
            "delivery_change_pct": round((simulated["on_time_delivery_rate"] - baseline["on_time_delivery_rate"]) / baseline["on_time_delivery_rate"] * 100, 1),
            "co2_change_pct": round((simulated["total_co2_kg"] - baseline["total_co2_kg"]) / baseline["total_co2_kg"] * 100, 1)
        }
    )


@app.get("/network-status")
def get_network_status():
    """Get current network digital twin status"""
    return {
        "status": "success",
        "network": {
            "active_trucks": 245,
            "active_shipments": 312,
            "warehouses": 15,
            "distribution_centers": 8
        },
        "performance": {
            "on_time_rate": 0.87,
            "avg_transit_time_hours": 18.5,
            "truck_utilization": 0.74
        }
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8007)

