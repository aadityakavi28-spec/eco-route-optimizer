"""
Pricing AI Service
Dynamic freight pricing using AI and demand forecasting
"""
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime, date, timedelta
import random
import math

app = FastAPI(
    title="Pricing AI Service",
    description="AI-powered dynamic freight pricing",
    version="1.0.0"
)

# ============================================
# Request/Response Models
# ============================================

class PricingRequest(BaseModel):
    origin_city: str
    destination_city: str
    distance_km: float
    weight_kg: float
    cargo_type: str = "standard"
    vehicle_type: str = "truck"
    priority: str = "medium"
    pickup_date: Optional[date] = None


class PricingResponse(BaseModel):
    base_rate: float
    fuel_surcharge: float
    demand_multiplier: float
    priority_surcharge: float
    total_rate: float
    rate_per_km: float
    rate_per_kg: float
    confidence: float
    breakdown: dict
    explanation: str


class RoutePricingHistory(BaseModel):
    route_key: str
    avg_rate: float
    min_rate: float
    max_rate: float
    sample_size: int


# ============================================
# Pricing Constants
# ============================================

# Base rates per km by cargo type (₹)
BASE_RATES = {
    "standard": 12.0,
    "fragile": 15.0,
    "hazardous": 25.0,
    "perishable": 18.0,
    "oversized": 20.0,
    "valuable": 30.0
}

# Fuel surcharge factors
FUEL_PRICE_PER_LITER = 85  # ₹/L diesel
TRUCK_FUEL_EFFICIENCY = 3.0  # km/L

# Priority multipliers
PRIORITY_MULTIPLIERS = {
    "low": 0.9,
    "medium": 1.0,
    "high": 1.25,
    "urgent": 1.5
}

# Demand patterns (time-based)
DEMAND_PATTERNS = {
    # Hour of day
    "hour": {
        "peak_morning": [8, 9, 10],
        "peak_evening": [17, 18, 19, 20],
        "night": [0, 1, 2, 3, 4, 5]
    },
    # Day of week
    "weekday": {
        "high": [0, 4, 5],  # Mon, Fri
        "medium": [1, 2, 3],  # Tue, Wed, Thu
        "low": [6]  # Sat
    },
    # Month/season
    "month": {
        "high": [9, 10, 11, 12],  # Festive season
        "medium": [3, 4, 5, 6],  # Pre-monsoon
        "low": [1, 2, 7, 8]  # Off-peak
    }
}

# Popular route demand boosts
ROUTE_DEMAND_BOOST = {
    "delhi-mumbai": 1.3,
    "mumbai-bangalore": 1.25,
    "delhi-bangalore": 1.2,
    "chennai-hyderabad": 1.15,
    "kolkata-delhi": 1.1
}


# ============================================
# AI Pricing Engine
# ============================================

class PricingEngine:
    """AI-powered pricing engine"""
    
    def __init__(self):
        self.model_version = "1.0.0"
        
    def calculate_price(self, request: PricingRequest) -> PricingResponse:
        """Calculate optimal freight price"""
        
        # 1. Calculate base rate
        base_rate = BASE_RATES.get(request.cargo_type, 12.0)
        
        # 2. Calculate fuel surcharge
        # Fuel cost per km = Price per liter / Efficiency
        fuel_cost_per_km = FUEL_PRICE_PER_LITER / TRUCK_FUEL_EFFICIENCY
        # Surcharge based on distance (longer trips = more fuel)
        fuel_surcharge = fuel_cost_per_km * (request.distance_km / 100)
        
        # 3. Calculate demand multiplier
        demand_multiplier = self._calculate_demand_multiplier(
            request.origin_city,
            request.destination_city,
            request.pickup_date
        )
        
        # 4. Priority surcharge
        priority_mult = PRIORITY_MULTIPLIERS.get(request.priority, 1.0)
        priority_surcharge = (base_rate * (priority_mult - 1)) * request.distance_km
        
        # 5. Weight-based adjustment
        weight_factor = min(request.weight_kg / 10000, 1.5)  # Cap at 1.5x
        
        # 6. Calculate total
        subtotal = (base_rate * request.distance_km * weight_factor + 
                   fuel_surcharge + priority_surcharge)
        
        total_rate = subtotal * demand_multiplier
        
        # Calculate per-unit rates
        rate_per_km = total_rate / request.distance_km if request.distance_km > 0 else 0
        rate_per_kg = total_rate / request.weight_kg if request.weight_kg > 0 else 0
        
        # Calculate confidence (based on data availability)
        confidence = self._calculate_confidence(request)
        
        # Generate explanation
        explanation = self._generate_explanation(
            request, demand_multiplier, fuel_surcharge, priority_surcharge
        )
        
        return PricingResponse(
            base_rate=round(base_rate, 2),
            fuel_surcharge=round(fuel_surcharge, 2),
            demand_multiplier=round(demand_multiplier, 2),
            priority_surcharge=round(priority_surcharge, 2),
            total_rate=round(total_rate, 2),
            rate_per_km=round(rate_per_km, 2),
            rate_per_kg=round(rate_per_kg, 4),
            confidence=round(confidence, 2),
            breakdown={
                "base": round(base_rate * request.distance_km * weight_factor, 2),
                "fuel_surcharge": round(fuel_surcharge, 2),
                "priority_surcharge": round(priority_surcharge, 2),
                "demand_adjustment": round(total_rate - subtotal, 2)
            },
            explanation=explanation
        )
    
    def _calculate_demand_multiplier(self, origin: str, dest: str, 
                                    pickup_date: Optional[date]) -> float:
        """Calculate demand-based multiplier"""
        
        multiplier = 1.0
        
        # Route-based boost
        route_key = f"{origin.lower()}-{dest.lower()}"
        for pattern, boost in ROUTE_DEMAND_BOOST.items():
            if pattern in route_key or route_key in pattern:
                multiplier *= boost
                break
        
        # Time-based patterns
        if pickup_date:
            now = pickup_date
            
            # Month/season factor
            month = now.month
            if month in [9, 10, 11, 12]:  # Festive
                multiplier *= 1.3
            elif month in [3, 4, 5, 6]:  # Pre-monsoon
                multiplier *= 1.1
            elif month in [7, 8]:  # Monsoon
                multiplier *= 0.95
            else:  # Off-peak
                multiplier *= 0.9
            
            # Day of week factor
            dow = now.weekday()
            if dow in [0, 4]:  # Mon, Fri
                multiplier *= 1.15
            elif dow == 6:  # Saturday
                multiplier *= 0.9
        
        # Cap the multiplier
        return max(0.7, min(2.0, multiplier))
    
    def _calculate_confidence(self, request: PricingRequest) -> float:
        """Calculate pricing confidence score"""
        
        confidence = 0.5  # Base confidence
        
        # Known route confidence boost
        route_key = f"{origin.lower()}-{dest.lower()}"
        for pattern in ROUTE_DEMAND_BOOST.keys():
            if pattern in route_key:
                confidence += 0.25
                break
        
        # Date certainty
        if request.pickup_date:
            days_ahead = (request.pickup_date - date.today()).days
            if 1 <= days_ahead <= 7:
                confidence += 0.15
            elif 7 < days_ahead <= 30:
                confidence += 0.1
        
        # Known cargo type
        if request.cargo_type in BASE_RATES:
            confidence += 0.1
        
        return min(confidence, 1.0)
    
    def _generate_explanation(self, request: PricingRequest, demand_mult: float,
                             fuel_surcharge: float, priority_surcharge: float) -> str:
        """Generate human-readable price explanation"""
        
        parts = []
        
        # Base price
        parts.append(f"Base rate: ₹{BASE_RATES.get(request.cargo_type, 12)}/km for {request.cargo_type} cargo")
        
        # Fuel surcharge
        if fuel_surcharge > 0:
            parts.append(f"Fuel surcharge: ₹{round(fuel_surcharge, 0)} (current diesel prices)")
        
        # Demand factor
        if demand_mult > 1.1:
            parts.append(f"High demand: {demand_mult}x multiplier due to route popularity")
        elif demand_mult < 0.9:
            parts.append(f"Low demand: {demand_mult}x discount available")
        
        # Priority
        if priority_surcharge > 0 and request.priority != "medium":
            parts.append(f"Priority: +{request.priority} delivery surcharge applied")
        
        return ". ".join(parts)


# ============================================
# API Endpoints
# ============================================

pricing_engine = PricingEngine()


@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "pricing-ai"}


@app.post("/calculate", response_model=PricingResponse)
def calculate_price(request: PricingRequest):
    """Calculate freight price"""
    return pricing_engine.calculate_price(request)


@app.post("/batch")
def calculate_batch(pricing_requests: List[PricingRequest]):
    """Calculate prices for multiple shipments"""
    results = []
    for req in pricing_requests:
        result = pricing_engine.calculate_price(req)
        results.append({
            "route": f"{req.origin_city} → {req.destination_city}",
            "pricing": result.dict()
        })
    return {"status": "success", "results": results}


@app.get("/history/{route_key}")
def get_pricing_history(route_key: str, days: int = 30):
    """Get historical pricing for a route"""
    
    # Generate mock historical data
    history = []
    base = 12.0  # Base rate
    
    for i in range(min(days, 30)):
        day = date.today() - timedelta(days=i)
        
        # Add some variance
        variance = random.uniform(-0.15, 0.25)
        rate = base * (1 + variance)
        
        history.append({
            "date": day.isoformat(),
            "rate_per_km": round(rate, 2),
            "demand_level": "high" if variance > 0.1 else "medium" if variance > -0.05 else "low"
        })
    
    return {
        "status": "success",
        "route_key": route_key,
        "history": history,
        "statistics": {
            "avg_rate": round(sum(h["rate_per_km"] for h in history) / len(history), 2),
            "min_rate": round(min(h["rate_per_km"] for h in history), 2),
            "max_rate": round(max(h["rate_per_km"] for h in history), 2)
        }
    }


@app.get("/rates/cargo-types")
def get_cargo_type_rates():
    """Get base rates for all cargo types"""
    return {
        "status": "success",
        "cargo_types": [
            {"type": k, "rate_per_km": v, "description": _get_cargo_description(k)}
            for k, v in BASE_RATES.items()
        ]
    }


def _get_cargo_description(cargo_type: str) -> str:
    descriptions = {
        "standard": "General cargo, non-hazardous",
        "fragile": "Breakable items requiring careful handling",
        "hazardous": "Dangerous goods requiring special permits",
        "perishable": "Temperature-sensitive goods (cold chain)",
        "oversized": "Extra-large cargo requiring special transport",
        "valuable": "High-value items requiring insurance"
    }
    return descriptions.get(cargo_type, "")


@app.get("/analytics/market-rates")
def get_market_rates():
    """Get current market rates overview"""
    
    popular_routes = [
        "Delhi-Mumbai",
        "Delhi-Bangalore", 
        "Mumbai-Bangalore",
        "Chennai-Hyderabad",
        "Kolkata-Delhi",
        "Pune-Mumbai",
        "Ahmedabad-Mumbai",
        "Chennai-Bangalore"
    ]
    
    routes_data = []
    for route in popular_routes:
        origin, dest = route.split("-")
        base = BASE_RATES["standard"]
        
        # Add route-specific boost
        route_key = f"{origin.lower()}-{dest.lower()}"
        boost = ROUTE_DEMAND_BOOST.get(route_key, 1.0)
        
        routes_data.append({
            "route": route,
            "current_rate": round(base * boost * random.uniform(0.9, 1.1), 2),
            "demand": "High" if boost > 1.2 else "Medium" if boost > 1.0 else "Low",
            "trucks_available": random.randint(50, 500)
        })
    
    return {
        "status": "success",
        "market_rates": routes_data,
        "last_updated": datetime.now().isoformat()
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8003)

