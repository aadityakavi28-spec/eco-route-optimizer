"""
Demand Prediction Service
ML-powered logistics demand forecasting
"""
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime, date, timedelta
import random
import math

app = FastAPI(
    title="Demand Prediction Service",
    description="AI-powered demand forecasting for logistics",
    version="1.0.0"
)

# ============================================
# Request/Response Models
# ============================================

class DemandRequest(BaseModel):
    origin_city: str
    destination_city: str
    cargo_type: str = "standard"
    prediction_date: Optional[date] = None
    horizon_days: int = 7


class DemandPredictionResponse(BaseModel):
    route_key: str
    prediction_date: str
    demand_score: float
    demand_level: str
    predicted_volume_tons: float
    recommended_trucks: int
    confidence_level: float
    surge_multiplier: float
    pricing_advice: str


class ForecastResponse(BaseModel):
    route_key: str
    forecasts: List[dict]
    summary: dict


# ============================================
# Demand Prediction Engine
# ============================================

class DemandPredictor:
    """ML-based demand predictor"""
    
    # Historical demand patterns
    ROUTE_DEMAND_BASE = {
        "delhi-mumbai": 0.85,
        "delhi-bangalore": 0.75,
        "mumbai-bangalore": 0.80,
        "chennai-hyderabad": 0.70,
        "kolkata-delhi": 0.65,
        "pune-mumbai": 0.90,
        "ahmedabad-mumbai": 0.60,
        "chennai-bangalore": 0.75
    }
    
    SEASONAL_FACTORS = {
        "festive": 1.4,    # Oct-Dec
        "festival_prep": 1.2,  # Aug-Sep
        "summer": 0.8,     # Apr-Jun
        "monsoon": 0.9,    # Jul
        "off_peak": 0.7    # Jan-Mar
    }
    
    def __init__(self):
        self.model_version = "1.0.0"
        
    def predict(self, request: DemandRequest) -> DemandPredictionResponse:
        """Predict demand for a route"""
        
        route_key = f"{request.origin_city.lower()}-{request.destination_city.lower()}"
        prediction_date = request.prediction_date or date.today()
        
        # Calculate base demand score
        demand_score = self._calculate_demand_score(route_key, prediction_date, request.cargo_type)
        
        # Determine demand level
        demand_level = self._get_demand_level(demand_score)
        
        # Calculate predicted volume
        base_volume = 100  # tons
        predicted_volume = base_volume * demand_score
        
        # Calculate recommended trucks
        avg_capacity = 15  # tons per truck
        recommended_trucks = math.ceil(predicted_volume / avg_capacity)
        
        # Calculate confidence (decreases for longer horizons)
        horizon = (prediction_date - date.today()).days
        base_confidence = 0.85
        if horizon > 7:
            base_confidence -= 0.1
        if horizon > 14:
            base_confidence -= 0.1
        confidence = max(0.5, base_confidence)
        
        # Calculate surge multiplier for pricing
        surge_multiplier = 1 + (demand_score - 0.5) * 0.5
        
        # Generate pricing advice
        pricing_advice = self._get_pricing_advice(demand_score)
        
        return DemandPredictionResponse(
            route_key=route_key,
            prediction_date=prediction_date.isoformat(),
            demand_score=round(demand_score, 2),
            demand_level=demand_level,
            predicted_volume_tons=round(predicted_volume, 1),
            recommended_trucks=recommended_trucks,
            confidence_level=round(confidence, 2),
            surge_multiplier=round(surge_multiplier, 2),
            pricing_advice=pricing_advice
        )
    
    def predict_forecast(self, request: DemandRequest) -> ForecastResponse:
        """Get demand forecast for multiple days"""
        
        route_key = f"{request.origin_city.lower()}-{request.destination_city.lower()}"
        forecasts = []
        
        start_date = request.prediction_date or date.today()
        
        for day_offset in range(request.horizon_days):
            pred_date = start_date + timedelta(days=day_offset)
            
            # Calculate demand for this specific date
            demand_score = self._calculate_demand_score(route_key, pred_date, request.cargo_type)
            
            forecasts.append({
                "date": pred_date.isoformat(),
                "demand_score": round(demand_score, 2),
                "demand_level": self._get_demand_level(demand_score),
                "predicted_volume": round(100 * demand_score, 1),
                "recommended_trucks": math.ceil(100 * demand_score / 15)
            })
        
        # Calculate summary
        avg_demand = sum(f["demand_score"] for f in forecasts) / len(forecasts)
        max_demand = max(f["demand_score"] for f in forecasts)
        min_demand = min(f["demand_score"] for f in forecasts)
        
        return ForecastResponse(
            route_key=route_key,
            forecasts=forecasts,
            summary={
                "avg_demand_score": round(avg_demand, 2),
                "max_demand_score": round(max_demand, 2),
                "min_demand_score": round(min_demand, 2),
                "trend": "increasing" if forecasts[-1]["demand_score"] > forecasts[0]["demand_score"] else "stable"
            }
        )
    
    def _calculate_demand_score(self, route_key: str, pred_date: date, cargo_type: str) -> float:
        """Calculate demand score with multiple factors"""
        
        # Base demand from route
        base_demand = self.ROUTE_DEMAND_BASE.get(route_key, 0.5)
        
        # Seasonal factor
        month = pred_date.month
        if month in [10, 11, 12]:
            seasonal = self.SEASONAL_FACTORS["festive"]
        elif month in [8, 9]:
            seasonal = self.SEASONAL_FACTORS["festival_prep"]
        elif month in [4, 5, 6]:
            seasonal = self.SEASONAL_FACTORS["summer"]
        elif month == 7:
            seasonal = self.SEASONAL_FACTORS["monsoon"]
        else:
            seasonal = self.SEASONAL_FACTORS["off_peak"]
        
        # Day of week factor
        dow = pred_date.weekday()
        if dow in [0, 4]:  # Monday, Friday
            dow_factor = 1.15
        elif dow in [1, 2, 3]:  # Tue-Thu
            dow_factor = 1.05
        else:  # Weekend
            dow_factor = 0.85
        
        # Time of year check (near festivals)
        day_of_year = pred_date.timetuple().tm_yday
        if 280 <= day_of_year <= 320:  # Diwali period
            seasonal *= 1.3
        elif 340 <= day_of_year <= 365 or day_of_year <= 10:  # Christmas/New Year
            seasonal *= 1.25
        
        # Cargo type factor
        cargo_factor = {
            "standard": 1.0,
            "perishable": 1.1,
            "hazardous": 0.8,
            "fragile": 0.9,
            "valuable": 0.7
        }.get(cargo_type, 1.0)
        
        # Combine all factors
        demand_score = base_demand * seasonal * dow_factor * cargo_factor
        
        # Add random variation (±10%)
        variation = random.uniform(-0.1, 0.1)
        demand_score *= (1 + variation)
        
        # Clamp between 0 and 1
        return max(0.1, min(1.0, demand_score))
    
    def _get_demand_level(self, score: float) -> str:
        """Get demand level label"""
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
        """Generate pricing advice"""
        if demand_score >= 0.8:
            return "Premium pricing recommended - high demand expected. Consider early booking discounts to secure capacity."
        elif demand_score >= 0.6:
            return "Standard pricing with slight premium. Market is active but not saturated."
        elif demand_score >= 0.4:
            return "Competitive standard pricing. Good time to book without surge pricing."
        else:
            return "Below-average demand - consider promotional pricing to attract volume."


# ============================================
# API Endpoints
# ============================================

predictor = DemandPredictor()


@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "demand-prediction"}


@app.post("/predict", response_model=DemandPredictionResponse)
def predict_demand(request: DemandRequest):
    """Predict demand for a specific route and date"""
    return predictor.predict(request)


@app.post("/forecast", response_model=ForecastResponse)
def get_demand_forecast(request: DemandRequest):
    """Get multi-day demand forecast"""
    return predictor.predict_forecast(request)


@app.get("/trends")
def get_demand_trends(days: int = 30):
    """Get demand trends across all routes"""
    
    routes = [
        "Delhi-Mumbai",
        "Delhi-Bangalore",
        "Mumbai-Bangalore",
        "Chennai-Hyderabad",
        "Kolkata-Delhi",
        "Pune-Mumbai",
        "Ahmedabad-Mumbai"
    ]
    
    trends = []
    for route in routes:
        origin, dest = route.split("-")
        req = DemandRequest(
            origin_city=origin,
            destination_city=dest,
            horizon_days=days
        )
        
        forecast = predictor.predict_forecast(req)
        avg_score = forecast.summary["avg_demand_score"]
        
        trends.append({
            "route": route,
            "avg_demand": round(avg_score, 2),
            "demand_level": predictor._get_demand_level(avg_score),
            "trend": forecast.summary["trend"]
        })
    
    # Sort by demand
    trends.sort(key=lambda x: x["avg_demand"], reverse=True)
    
    return {
        "status": "success",
        "trends": trends,
        "period": f"{days} days"
    }


@app.get("/capacity-analysis/{route_key}")
def get_capacity_analysis(route_key: str):
    """Get capacity analysis for a route"""
    
    parts = route_key.split("-")
    if len(parts) != 2:
        raise HTTPException(status_code=400, detail="Invalid route format. Use 'origin-destination'")
    
    origin, dest = parts
    
    # Get forecast
    req = DemandRequest(
        origin_city=origin,
        destination_city=dest,
        horizon_days=7
    )
    forecast = predictor.predict_forecast(req)
    
    # Calculate capacity needs
    analysis = []
    for day in forecast.forecasts:
        capacity_needed = math.ceil(day["predicted_volume"] / 15)  # 15 tons per truck
        current_supply = random.randint(20, 100)  # Mock supply
        
        shortage = capacity_needed - current_supply
        
        analysis.append({
            "date": day["date"],
            "demand_tons": day["predicted_volume"],
            "trucks_needed": capacity_needed,
            "trucks_available": current_supply,
            "shortage": max(0, shortage),
            "surge_risk": "HIGH" if shortage > 10 else "MEDIUM" if shortage > 0 else "LOW"
        })
    
    return {
        "status": "success",
        "route": route_key,
        "analysis": analysis,
        "recommendation": "Consider increasing fleet allocation" if any(a["shortage"] > 0 for a in analysis) else "Supply adequate"
    }


@app.get("/alerts")
def get_demand_alerts():
    """Get current high-demand alerts"""
    
    alerts = []
    
    # Check critical routes
    critical_routes = [
        ("Delhi", "Mumbai"),
        ("Mumbai", "Bangalore"),
        ("Pune", "Mumbai")
    ]
    
    for origin, dest in critical_routes:
        req = DemandRequest(origin_city=origin, destination_city=dest)
        pred = predictor.predict(req)
        
        if pred.demand_score >= 0.7:
            alerts.append({
                "route": f"{origin}-{dest}",
                "alert_level": "CRITICAL" if pred.demand_score >= 0.85 else "HIGH",
                "demand_score": pred.demand_score,
                "recommended_trucks": pred.recommended_trucks,
                "message": f"High demand expected. Recommend {pred.recommended_trucks}+ trucks."
            })
    
    return {
        "status": "success",
        "alerts": alerts,
        "count": len(alerts)
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8004)

