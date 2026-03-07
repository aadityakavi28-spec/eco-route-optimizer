"""
AI Copilot Service
Natural language assistant for logistics operations
"""
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import os
import json

app = FastAPI(
    title="AI Copilot Service",
    description="Natural language AI assistant for logistics",
    version="1.0.0"
)

# ============================================
# Models
# ============================================

class ChatMessage(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    message: str
    context: Optional[dict] = None
    history: Optional[List[ChatMessage]] = []


class ChatResponse(BaseModel):
    response: str
    suggestions: List[str]
    actions: List[dict]


# ============================================
# Knowledge Base
# ============================================

LOGISTICS_KNOWLEDGE = {
    "route_expensive": "Your route may be expensive due to: 1) Long distance, 2) Low truck utilization, 3) Peak season demand. Consider consolidating loads or using rail for long-haul.",
    "reduce_emissions": "To reduce emissions: 1) Optimize routes, 2) Use load pooling, 3) Consider electric/CNG vehicles, 4) Improve truck utilization, 5) Use intermodal transport.",
    "best_trucks": "For your cargo: Use 15-ton capacity trucks for standard freight, refrigerated for perishable, and specialized vehicles for hazardous materials.",
    "backhaul": "Backhaul opportunities are found by matching return trips with cargo. Check the Empty Miles Detection module for specific suggestions.",
    "demand_forecast": "High demand routes: Delhi-Mumbai, Mumbai-Bangalore, Chennai-Hyderabad. Book early during festive seasons (Oct-Dec)."
}


# ============================================
# API Endpoints
# ============================================

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "ai-copilot"}


@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """Chat with AI Copilot"""
    
    message = request.message.lower()
    
    # Determine intent
    intent = _classify_intent(message)
    
    # Generate response based on intent
    response_text = _generate_response(intent, message, request.context)
    
    # Generate suggestions
    suggestions = _get_suggestions(intent)
    
    # Generate actions
    actions = _get_actions(intent)
    
    return ChatResponse(
        response=response_text,
        suggestions=suggestions,
        actions=actions
    )


def _classify_intent(message: str) -> str:
    """Classify user message intent"""
    
    if any(word in message for word in ["expensive", "cost", "price", "why expensive"]):
        return "route_expensive"
    elif any(word in message for word in ["emission", "carbon", "co2", "reduce", "green"]):
        return "reduce_emissions"
    elif any(word in message for word in ["truck", "vehicle", "which", "best"]):
        return "best_trucks"
    elif any(word in message for word in ["backhaul", "empty", "return"]):
        return "backhaul"
    elif any(word in message for word in ["demand", "forecast", "predict", "future"]):
        return "demand_forecast"
    elif any(word in message for word in ["route", "optimize", "path"]):
        return "route_optimization"
    elif any(word in message for word in ["book", "shipment", "create"]):
        return "create_shipment"
    else:
        return "general"


def _generate_response(intent: str, message: str, context: Optional[dict]) -> str:
    """Generate response based on intent"""
    
    responses = {
        "route_expensive": """Your route cost is higher than average due to several factors:

1. **Distance Factor**: Longer routes naturally cost more
2. **Truck Utilization**: Low load factor increases cost per kg
3. **Market Demand**: Current high demand on this route

**Recommendations:**
• Consolidate multiple shipments for the same route
• Consider backhaul opportunities to reduce empty miles
• Use larger vehicles to improve utilization
• Book during off-peak periods for better rates""",
        
        "reduce_emissions": """Here are strategies to reduce your carbon footprint:

**Quick Wins:**
1. **Route Optimization**: AI can reduce distance by 10-15%
2. **Load Pooling**: Combine LTL shipments to fill truck capacity
3. **Backhaul**: Eliminate empty return trips

**Medium-term:**
4. **Vehicle Selection**: Use CNG/Electric for last-mile
5. **Rail Intermodal**: Use rail for 500km+ routes

**Impact:**
Following these can reduce emissions by 25-40%""",
        
        "best_trucks": """Recommended vehicles based on cargo:

**Standard Freight (<5 tons):** 7-ton pickup truck
• Cost: ₹12-15/km

**Medium Freight (5-15 tons):** 10-15 ton truck
• Cost: ₹18-25/km

**Heavy Freight (15+ tons):** 20-ton trailer
• Cost: ₹30-40/km

**Specialized:**
• Refrigerated: +50% cost
• Hazardous: +100% cost with permits""",
        
        "backhaul": """Backhaul opportunities reduce empty miles:

**Current Opportunities:**
• Delhi→Jaipur: Return cargo available
• Mumbai→Pune: Electronics, 3 tons
• Bangalore→Chennai: Auto parts, 4 tons

**Benefits:**
• Additional revenue: ₹10,000-20,000 per trip
• CO2 savings: 70-140 kg per trip
• Better truck utilization""",
        
        "demand_forecast": """Demand Forecast for Next 7 Days:

**High Demand Routes:**
• Delhi-Mumbai: 85% capacity
• Mumbai-Bangalore: 80% capacity

**Recommendations:**
• Book trucks 3-5 days in advance
• Consider early morning departures
• Premium pricing expected during weekends""",
        
        "route_optimization": """I can help optimize your routes!

**Send me:**
• List of delivery stops
• Cargo weight
• Time constraints

**I'll calculate:**
• Optimal sequence
• Estimated cost
• Travel time
• Emission impact""",
        
        "create_shipment": """I'll help you create a shipment.

**Required Information:**
1. Origin city
2. Destination city
3. Cargo weight (kg)
4. Cargo type (standard/perishable/hazardous)
5. Pickup date

**Optional:**
• Special instructions
• Priority level"""
    }
    
    return responses.get(intent, "I'm here to help with your logistics operations. Ask me about routes, pricing, emissions, or demand forecasting!")


def _get_suggestions(intent: str) -> List[str]:
    """Get suggested follow-up questions"""
    
    suggestions_map = {
        "route_expensive": [
            "How can I reduce my route costs?",
            "What is my truck utilization?",
            "Show me backhaul opportunities"
        ],
        "reduce_emissions": [
            "Calculate my carbon footprint",
            "Show emission reduction strategies",
            "Compare vehicle types"
        ],
        "best_trucks": [
            "Compare vehicle costs",
            "What vehicles are available?",
            "Calculate required capacity"
        ],
        "backhaul": [
            "Find backhaul for my truck",
            "Show all opportunities",
            "Calculate savings"
        ],
        "demand_forecast": [
            "What's demand on Delhi-Mumbai?",
            "Show route trends",
            "When should I book?"
        ]
    }
    
    return suggestions_map.get(intent, [
        "How can I optimize my routes?",
        "What's my carbon footprint?",
        "Find available trucks"
    ])


def _get_actions(intent: str) -> List[dict]:
    """Get suggested actions"""
    
    actions_map = {
        "route_expensive": [
            {"type": "navigate", "target": "/optimizer", "label": "Optimize Route"},
            {"type": "navigate", "target": "/analytics", "label": "View Cost Analysis"}
        ],
        "reduce_emissions": [
            {"type": "navigate", "target": "/carbon", "label": "View Carbon Dashboard"},
            {"type": "action", "target": "calculate_emissions", "label": "Calculate Emissions"}
        ],
        "best_trucks": [
            {"type": "navigate", "target": "/fleet", "label": "View Available Trucks"},
            {"type": "action", "target": "compare_vehicles", "label": "Compare Vehicles"}
        ],
        "backhaul": [
            {"type": "navigate", "target": "/empty-miles", "label": "View Backhaul"}
        ],
        "demand_forecast": [
            {"type": "navigate", "target": "/demand", "label": "View Demand Forecast"}
        ]
    }
    
    return actions_map.get(intent, [])


@app.get("/suggestions/{topic}")
def get_topic_suggestions(topic: str):
    """Get suggestions for a specific topic"""
    
    return {
        "status": "success",
        "topic": topic,
        "suggestions": _get_suggestions(topic)
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8009)

