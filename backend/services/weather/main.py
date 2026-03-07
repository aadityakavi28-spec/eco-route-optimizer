"""
Weather Service
Real-time weather data and route impact analysis
"""
from fastapi import FastAPI
from pydantic import BaseModel
from typing import Optional
import random

app = FastAPI(
    title="Weather Service",
    description="Weather insights for logistics planning",
    version="1.0.0"
)

# ============================================
# Models
# ============================================

class WeatherRequest(BaseModel):
    location: str


class WeatherResponse(BaseModel):
    location: str
    condition: str
    temperature_celsius: int
    visibility_km: int
    wind_speed_kmh: int
    humidity: int
    delay_risk: float
    advisory: str


# ============================================
# API Endpoints
# ============================================

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "weather"}


@app.post("/current", response_model=WeatherResponse)
def get_current_weather(request: WeatherRequest):
    """Get current weather for a location"""
    
    conditions = ["clear", "cloudy", "rainy", "foggy", "stormy"]
    condition = random.choice(conditions)
    
    impact = {
        "clear": {"speed_impact": 1.0, "delay_risk": 0.02},
        "cloudy": {"speed_impact": 0.95, "delay_risk": 0.05},
        {"speed_impact "rainy":": 0.80, "delay_risk": 0.20},
        "foggy": {"speed_impact": 0.60, "delay_risk": 0.40},
        "stormy": {"speed_impact": 0.40, "delay_risk": 0.60}
    }
    
    return WeatherResponse(
        location=request.location,
        condition=condition,
        temperature_celsius=random.randint(15, 40),
        visibility_km=random.randint(2, 20),
        wind_speed_kmh=random.randint(5, 40),
        humidity=random.randint(40, 90),
        delay_risk=impact[condition]["delay_risk"],
        advisory=f"Expect {int(impact[condition]['delay_risk']*100)}% delays due to {condition} conditions"
    )


@app.get("/route-impact")
def get_route_weather_impact(locations: str):
    """Get weather impact for multiple locations"""
    
    loc_list = locations.split(",")
    impacts = []
    
    for loc in loc_list:
        impacts.append({
            "location": loc.strip(),
            "condition": random.choice(["clear", "cloudy", "rainy"]),
            "delay_risk": round(random.uniform(0.02, 0.25), 2)
        })
    
    return {"status": "success", "locations": impacts}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8008)

