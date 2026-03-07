"""
Freight Marketplace Service
Handles shipper-carrier matching, bookings, and freight listings
"""
from fastapi import FastAPI, HTTPException, Depends, Query
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import date, datetime
from uuid import UUID
import json

from ..models import (
    Shipment, TruckRoute, Booking, 
    ShipmentStatus, TruckStatus, BookingStatus
)

app = FastAPI(
    title="Freight Marketplace Service",
    description="Connect shippers with carriers for freight movement",
    version="1.0.0"
)

# ============================================
# Pydantic Models (Request/Response)
# ============================================

class ShipmentCreate(BaseModel):
    origin_city: str
    origin_address: str
    destination_city: str
    destination_address: str
    weight_kg: float
    cargo_type: str = "standard"
    pickup_date: date
    delivery_deadline: date
    priority: str = "medium"
    description: Optional[str] = None
    special_instructions: Optional[str] = None


class ShipmentResponse(BaseModel):
    id: str
    origin_city: str
    destination_city: str
    weight_kg: float
    cargo_type: str
    status: str
    pickup_date: date
    delivery_deadline: date
    quoted_price: Optional[float] = None
    created_at: datetime


class TruckRouteCreate(BaseModel):
    origin_city: str
    destination_city: str
    available_capacity_kg: float
    departure_date: date
    price_per_km: Optional[float] = None
    preferred_cargo_types: Optional[List[str]] = None


class TruckRouteResponse(BaseModel):
    id: str
    origin_city: str
    destination_city: str
    available_capacity_kg: float
    departure_date: date
    price_per_km: Optional[float] = None
    status: str


class BookingCreate(BaseModel):
    shipment_id: str
    truck_route_id: str
    price: float


class BookingResponse(BaseModel):
    id: str
    shipment_id: str
    truck_route_id: str
    price: float
    status: str
    created_at: datetime


# ============================================
# In-memory storage (replace with database)
# ============================================

# Shipments storage
shipments_db: List[dict] = []

# Truck routes storage  
truck_routes_db: List[dict] = []

# Bookings storage
bookings_db: List[dict] = []


# ============================================
# Shipment Endpoints
# ============================================

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "freight-marketplace"}


@app.post("/shipments", response_model=ShipmentResponse)
def create_shipment(shipment: ShipmentCreate):
    """Create a new shipment/cargo listing"""
    
    # Calculate estimated price (simple algorithm)
    base_rate = {
        "standard": 12, "fragile": 15, "hazardous": 25,
        "perishable": 18, "oversized": 20, "valuable": 30
    }.get(shipment.cargo_type, 12)
    
    # Estimate distance (simplified - in production use geocoding)
    estimated_distance = 500  # km (placeholder)
    estimated_price = base_rate * estimated_distance * (shipment.weight_kg / 1000)
    
    new_shipment = {
        "id": f"ship_{len(shipments_db) + 1}",
        "origin_city": shipment.origin_city,
        "origin_address": shipment.origin_address,
        "destination_city": shipment.destination_city,
        "destination_address": shipment.destination_address,
        "weight_kg": shipment.weight_kg,
        "cargo_type": shipment.cargo_type,
        "status": "pending",
        "pickup_date": shipment.pickup_date,
        "delivery_deadline": shipment.delivery_deadline,
        "priority": shipment.priority,
        "description": shipment.description,
        "special_instructions": shipment.special_instructions,
        "quoted_price": round(estimated_price, 2),
        "created_at": datetime.now().isoformat()
    }
    
    shipments_db.append(new_shipment)
    
    return ShipmentResponse(**new_shipment)


@app.get("/shipments", response_model=List[ShipmentResponse])
def list_shipments(
    status: Optional[str] = None,
    origin_city: Optional[str] = None,
    destination_city: Optional[str] = None,
    cargo_type: Optional[str] = None,
    limit: int = Query(20, le=100)
):
    """List shipments with optional filters"""
    
    results = shipments_db
    
    if status:
        results = [s for s in results if s["status"] == status]
    if origin_city:
        results = [s for s in results if origin_city.lower() in s["origin_city"].lower()]
    if destination_city:
        results = [s for s in results if destination_city.lower() in s["destination_city"].lower()]
    if cargo_type:
        results = [s for s in results if s["cargo_type"] == cargo_type]
    
    return [ShipmentResponse(**s) for s in results[:limit]]


@app.get("/shipments/{shipment_id}", response_model=ShipmentResponse)
def get_shipment(shipment_id: str):
    """Get shipment by ID"""
    for shipment in shipments_db:
        if shipment["id"] == shipment_id:
            return ShipmentResponse(**shipment)
    raise HTTPException(status_code=404, detail="Shipment not found")


@app.put("/shipments/{shipment_id}/status")
def update_shipment_status(shipment_id: str, status: str):
    """Update shipment status"""
    for shipment in shipments_db:
        if shipment["id"] == shipment_id:
            shipment["status"] = status
            return {"status": "success", "message": f"Shipment status updated to {status}"}
    raise HTTPException(status_code=404, detail="Shipment not found")


# ============================================
# Truck Route Endpoints
# ============================================

@app.post("/truck-routes", response_model=TruckRouteResponse)
def create_truck_route(route: TruckRouteCreate):
    """List a truck's planned route with available capacity"""
    
    new_route = {
        "id": f"route_{len(truck_routes_db) + 1}",
        "origin_city": route.origin_city,
        "destination_city": route.destination_city,
        "available_capacity_kg": route.available_capacity_kg,
        "departure_date": route.departure_date,
        "price_per_km": route.price_per_km or 15.0,
        "preferred_cargo_types": route.preferred_cargo_types or [],
        "status": "planned",
        "created_at": datetime.now().isoformat()
    }
    
    truck_routes_db.append(new_route)
    return TruckRouteResponse(**new_route)


@app.get("/truck-routes", response_model=List[TruckRouteResponse])
def list_truck_routes(
    origin_city: Optional[str] = None,
    destination_city: Optional[str] = None,
    min_capacity_kg: Optional[float] = None,
    departure_date: Optional[date] = None,
    limit: int = Query(20, le=100)
):
    """List available truck routes with capacity"""
    
    results = truck_routes_db
    
    if origin_city:
        results = [r for r in results if origin_city.lower() in r["origin_city"].lower()]
    if destination_city:
        results = [r for r in results if destination_city.lower() in r["destination_city"].lower()]
    if min_capacity_kg:
        results = [r for r in results if r["available_capacity_kg"] >= min_capacity_kg]
    if departure_date:
        results = [r for r in results if str(r["departure_date"]) == str(departure_date)]
    
    return [TruckRouteResponse(**r) for r in results[:limit]]


@app.get("/truck-routes/{route_id}", response_model=TruckRouteResponse)
def get_truck_route(route_id: str):
    """Get truck route by ID"""
    for route in truck_routes_db:
        if route["id"] == route_id:
            return TruckRouteResponse(**route)
    raise HTTPException(status_code=404, detail="Route not found")


@app.get("/truck-routes/match/{shipment_id}")
def match_shipment_to_routes(shipment_id: str):
    """Find matching truck routes for a shipment"""
    
    # Find the shipment
    shipment = None
    for s in shipments_db:
        if s["id"] == shipment_id:
            shipment = s
            break
    
    if not shipment:
        raise HTTPException(status_code=404, detail="Shipment not found")
    
    # Find matching routes
    matches = []
    for route in truck_routes_db:
        # Check if route covers the shipment path
        origin_match = shipment["origin_city"].lower() in route["origin_city"].lower()
        dest_match = shipment["destination_city"].lower() in route["destination_city"].lower()
        
        if origin_match and dest_match:
            if route["available_capacity_kg"] >= shipment["weight_kg"]:
                matches.append({
                    **route,
                    "match_score": calculate_match_score(shipment, route)
                })
    
    # Sort by match score
    matches.sort(key=lambda x: x["match_score"], reverse=True)
    
    return {
        "shipment_id": shipment_id,
        "matches": matches[:10]
    }


def calculate_match_score(shipment: dict, route: dict) -> float:
    """Calculate how well a route matches a shipment"""
    score = 0.0
    
    # Capacity match
    if route["available_capacity_kg"] >= shipment["weight_kg"]:
        score += 30
    
    # Direct route bonus
    if (shipment["origin_city"].lower() == route["origin_city"].lower() and 
        shipment["destination_city"].lower() == route["destination_city"].lower()):
        score += 50
    elif (shipment["origin_city"].lower() in route["origin_city"].lower() and 
          shipment["destination_city"].lower() in route["destination_city"].lower()):
        score += 25
    
    # Cargo type match
    if route["preferred_cargo_types"]:
        if shipment["cargo_type"] in route["preferred_cargo_types"]:
            score += 20
    
    return round(score, 2)


# ============================================
# Booking Endpoints
# ============================================

@app.post("/bookings", response_model=BookingResponse)
def create_booking(booking: BookingCreate):
    """Book a truck route for a shipment"""
    
    # Verify shipment exists
    shipment = None
    for s in shipments_db:
        if s["id"] == booking.shipment_id:
            shipment = s
            break
    
    if not shipment:
        raise HTTPException(status_code=404, detail="Shipment not found")
    
    # Verify route exists
    route = None
    for r in truck_routes_db:
        if r["id"] == booking.truck_route_id:
            route = r
            break
    
    if not route:
        raise HTTPException(status_code=404, detail="Truck route not found")
    
    # Check capacity
    if route["available_capacity_kg"] < shipment["weight_kg"]:
        raise HTTPException(status_code=400, detail="Insufficient capacity")
    
    # Create booking
    new_booking = {
        "id": f"booking_{len(bookings_db) + 1}",
        "shipment_id": booking.shipment_id,
        "truck_route_id": booking.truck_route_id,
        "price": booking.price,
        "status": "confirmed",
        "created_at": datetime.now().isoformat()
    }
    
    bookings_db.append(new_booking)
    
    # Update route capacity
    route["available_capacity_kg"] -= shipment["weight_kg"]
    
    # Update shipment status
    shipment["status"] = "booked"
    
    return BookingResponse(**new_booking)


@app.get("/bookings", response_model=List[BookingResponse])
def list_bookings(
    shipment_id: Optional[str] = None,
    truck_route_id: Optional[str] = None,
    status: Optional[str] = None
):
    """List bookings with filters"""
    
    results = bookings_db
    
    if shipment_id:
        results = [b for b in results if b["shipment_id"] == shipment_id]
    if truck_route_id:
        results = [b for b in results if b["truck_route_id"] == truck_route_id]
    if status:
        results = [b for b in results if b["status"] == status]
    
    return [BookingResponse(**b) for b in results]


@app.get("/bookings/{booking_id}", response_model=BookingResponse)
def get_booking(booking_id: str):
    """Get booking by ID"""
    for booking in bookings_db:
        if booking["id"] == booking_id:
            return BookingResponse(**booking)
    raise HTTPException(status_code=404, detail="Booking not found")


@app.put("/bookings/{booking_id}/status")
def update_booking_status(booking_id: str, status: str):
    """Update booking status"""
    for booking in bookings_db:
        if booking["id"] == booking_id:
            booking["status"] = status
            return {"status": "success", "message": f"Booking status updated to {status}"}
    raise HTTPException(status_code=404, detail="Booking not found")


# ============================================
# Analytics
# ============================================

@app.get("/analytics/summary")
def get_marketplace_summary():
    """Get marketplace analytics summary"""
    
    total_shipments = len(shipments_db)
    total_routes = len(truck_routes_db)
    total_bookings = len(bookings_db)
    
    # Calculate total value
    total_value = sum(b["price"] for b in bookings_db)
    
    # Status breakdowns
    shipment_status = {}
    for s in shipments_db:
        status = s["status"]
        shipment_status[status] = shipment_status.get(status, 0) + 1
    
    route_status = {}
    for r in truck_routes_db:
        status = r["status"]
        route_status[status] = route_status.get(status, 0) + 1
    
    return {
        "total_shipments": total_shipments,
        "total_routes": total_routes,
        "total_bookings": total_bookings,
        "total_value": round(total_value, 2),
        "shipment_status": shipment_status,
        "route_status": route_status,
        "avg_booking_value": round(total_value / total_bookings, 2) if total_bookings > 0 else 0
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)

