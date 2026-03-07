"""
Database connection and session management
"""
from sqlalchemy import create_engine, event
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from typing import Generator
import logging

from .config import settings

logger = logging.getLogger(__name__)

# Create engine
engine = create_engine(
    settings.DATABASE_URL,
    pool_pre_ping=True,
    pool_size=10,
    max_overflow=20,
    echo=settings.DEBUG
)

# Create session factory
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

# Base class for models
Base = declarative_base()


def get_db() -> Generator[Session, None, None]:
    """Get database session"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    """Initialize database tables"""
    Base.metadata.create_all(bind=engine)
    logger.info("Database initialized")


# ============================================
# PostgreSQL-specific database models
# ============================================

from sqlalchemy import Column, String, Integer, Float, Boolean, DateTime, Text, Enum, ForeignKey, ARRAY
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.sql import func
import uuid


class User(Base):
    """User model for authentication"""
    __tablename__ = "users"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    name = Column(String(255), nullable=False)
    company_name = Column(String(255))
    phone = Column(String(20))
    user_type = Column(Enum('shipper', 'carrier', 'admin'), nullable=False)
    is_verified = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())


class Warehouse(Base):
    """Warehouse/Storage facility model"""
    __tablename__ = "warehouses"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False)
    address = Column(Text, nullable=False)
    city = Column(String(100), nullable=False, index=True)
    state = Column(String(100))
    pincode = Column(String(10))
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    capacity_kg = Column(Float)
    storage_type = Column(Enum('open', 'covered', 'warehouse', 'cold_storage'), default='covered')
    facilities = Column(ARRAY(Text))
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class Truck(Base):
    """Truck/Vehicle model"""
    __tablename__ = "trucks"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    owner_id = Column(UUID(as_uuid=True), ForeignKey('users.id'))
    registration_number = Column(String(20), unique=True, nullable=False)
    vehicle_type = Column(Enum('small_truck', 'large_truck', 'trailer', 'container', 'refrigerated', 'tanker'), nullable=False)
    make = Column(String(50))
    model = Column(String(50))
    year_of_manufacture = Column(Integer)
    capacity_kg = Column(Float, nullable=False)
    capacity_volume = Column(Float)
    fuel_type = Column(Enum('diesel', 'petrol', 'cng', 'lng', 'electric', 'hybrid'), default='diesel')
    fuel_efficiency_kmpl = Column(Float)
    emission_standard = Column(Enum('bs1', 'bs2', 'bs3', 'bs4', 'bs5', 'bs6'), default='bs6')
    current_latitude = Column(Float)
    current_longitude = Column(Float)
    current_city = Column(String(100), index=True)
    status = Column(Enum('available', 'loading', 'en_route', 'unloading', 'maintenance', 'unavailable'), default='available')
    insurance_expiry = Column(Date)
    permit_expiry = Column(Date)
    fitness_expiry = Column(Date)
    is_verified = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())


class Driver(Base):
    """Driver model"""
    __tablename__ = "drivers"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    truck_id = Column(UUID(as_uuid=True), ForeignKey('trucks.id'))
    name = Column(String(255), nullable=False)
    license_number = Column(String(20), unique=True, nullable=False)
    phone = Column(String(20), nullable=False)
    email = Column(String(255))
    license_expiry = Column(Date, nullable=False)
    badge_number = Column(String(20))
    photo_url = Column(Text)
    is_available = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class Shipment(Base):
    """Shipment/Cargo order model"""
    __tablename__ = "shipments"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    shipper_id = Column(UUID(as_uuid=True), ForeignKey('users.id'), index=True)
    
    origin_warehouse_id = Column(UUID(as_uuid=True), ForeignKey('warehouses.id'))
    origin_address = Column(Text, nullable=False)
    origin_city = Column(String(100), nullable=False, index=True)
    origin_lat = Column(Float)
    origin_lng = Column(Float)
    
    destination_warehouse_id = Column(UUID(as_uuid=True), ForeignKey('warehouses.id'))
    destination_address = Column(Text, nullable=False)
    destination_city = Column(String(100), nullable=False, index=True)
    destination_lat = Column(Float)
    destination_lng = Column(Float)
    
    weight_kg = Column(Float, nullable=False)
    volume_cbm = Column(Float)
    cargo_type = Column(Enum('standard', 'fragile', 'hazardous', 'perishable', 'oversized', 'valuable'), nullable=False)
    description = Column(Text)
    
    pickup_date = Column(Date, nullable=False, index=True)
    delivery_deadline = Column(Date, nullable=False, index=True)
    priority = Column(Enum('low', 'medium', 'high', 'urgent'), default='medium')
    
    status = Column(Enum('draft', 'pending', 'quoted', 'booked', 'in_transit', 'delivered', 'cancelled'), 
                    default='draft', index=True)
    
    quoted_price = Column(Float)
    final_price = Column(Float)
    special_instructions = Column(Text)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())


class TruckRoute(Base):
    """Truck route/planned trip model"""
    __tablename__ = "truck_routes"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    truck_id = Column(UUID(as_uuid=True), ForeignKey('trucks.id'), index=True)
    driver_id = Column(UUID(as_uuid=True), ForeignKey('drivers.id'))
    
    origin_city = Column(String(100), nullable=False, index=True)
    origin_lat = Column(Float)
    origin_lng = Column(Float)
    
    destination_city = Column(String(100), nullable=False, index=True)
    destination_lat = Column(Float)
    destination_lng = Column(Float)
    
    available_capacity_kg = Column(Float, nullable=False)
    available_capacity_volume = Column(Float)
    preferred_cargo_types = Column(ARRAY(Text))
    
    departure_date = Column(Date, nullable=False, index=True)
    estimated_arrival = Column(Date)
    is_regular_route = Column(Boolean, default=False)
    
    price_per_km = Column(Float)
    minimum_charge = Column(Float)
    
    status = Column(Enum('planned', 'en_route', 'completed', 'cancelled'), default='planned')
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class Booking(Base):
    """Booking/Transaction model"""
    __tablename__ = "bookings"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    shipment_id = Column(UUID(as_uuid=True), ForeignKey('shipments.id'), index=True)
    truck_route_id = Column(UUID(as_uuid=True), ForeignKey('truck_routes.id'), index=True)
    
    carrier_id = Column(UUID(as_uuid=True), ForeignKey('users.id'))
    shipper_id = Column(UUID(as_uuid=True), ForeignKey('users.id'))
    
    price = Column(Float, nullable=False)
    status = Column(Enum('pending', 'confirmed', 'in_transit', 'completed', 'cancelled', 'disputed'), 
                    default='pending', index=True)
    
    confirmed_at = Column(DateTime(timezone=True))
    started_at = Column(DateTime(timezone=True))
    completed_at = Column(DateTime(timezone=True))
    
    proof_of_delivery_url = Column(Text)
    notes = Column(Text)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class RouteOptimization(Base):
    """Route optimization history"""
    __tablename__ = "route_optimizations"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey('users.id'))
    
    locations = Column(JSONB, nullable=False)
    optimized_order = Column(ARRAY(Integer))
    total_distance_km = Column(Float)
    total_duration_hours = Column(Float)
    
    vehicle_type = Column(String(50))
    estimated_cost_inr = Column(Float)
    estimated_fuel_liters = Column(Float)
    co2_emissions_kg = Column(Float)
    
    optimization_algorithm = Column(String(50))
    solution_quality = Column(String(20))
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class CarbonMetric(Base):
    """Carbon emission tracking"""
    __tablename__ = "carbon_metrics"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    booking_id = Column(UUID(as_uuid=True), ForeignKey('bookings.id'), index=True)
    
    distance_km = Column(Float)
    vehicle_type = Column(String(50))
    fuel_consumed_liters = Column(Float)
    co2_emissions_kg = Column(Float)
    co2_saved_kg = Column(Float)
    
    emission_factor_used = Column(Float)
    calculation_method = Column(String(50))
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class PricingHistory(Base):
    """Pricing history for analytics"""
    __tablename__ = "pricing_history"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    route_key = Column(String(100), nullable=False, index=True)
    
    distance_km = Column(Float)
    base_rate = Column(Float)
    dynamic_rate = Column(Float)
    demand_multiplier = Column(Float)
    fuel_surcharge = Column(Float)
    
    predicted_rate = Column(Float)
    actual_rate = Column(Float)
    
    recorded_at = Column(DateTime(timezone=True), server_default=func.now())


class DemandPrediction(Base):
    """Demand prediction storage"""
    __tablename__ = "demand_predictions"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    route_key = Column(String(100), nullable=False, index=True)
    cargo_type = Column(String(50))
    
    prediction_date = Column(Date, nullable=False, index=True)
    predicted_demand_score = Column(Float)
    predicted_volume_tons = Column(Float)
    recommended_trucks = Column(Integer)
    
    confidence_level = Column(Float)
    model_version = Column(String(20))
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class VehiclePosition(Base):
    """Real-time vehicle position tracking"""
    __tablename__ = "vehicle_positions"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    truck_id = Column(UUID(as_uuid=True), ForeignKey('trucks.id'), index=True)
    
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    speed_kmh = Column(Float)
    heading = Column(Float)
    
    accuracy_m = Column(Float)
    timestamp = Column(DateTime(timezone=True), nullable=False, index=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class ChatSession(Base):
    """AI Copilot chat sessions"""
    __tablename__ = "chat_sessions"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey('users.id'))
    
    title = Column(String(255))
    context = Column(JSONB)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())


class ChatMessage(Base):
    """AI Copilot messages"""
    __tablename__ = "chat_messages"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    session_id = Column(UUID(as_uuid=True), ForeignKey('chat_sessions.id', ondelete='CASCADE'))
    
    role = Column(Enum('user', 'assistant', 'system'), nullable=False)
    content = Column(Text, nullable=False)
    metadata = Column(JSONB)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())

