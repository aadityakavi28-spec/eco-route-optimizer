"""
Configuration management for EcoRoute Optimizer
"""
import os
from typing import Optional
from pydantic import BaseModel
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings"""
    # API
    API_V1_PREFIX: str = "/api/v1"
    
    # Database
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL", 
        "postgresql://ecoroute:ecoroute123@localhost:5432/ecoroute"
    )
    
    # Redis
    REDIS_HOST: str = os.getenv("REDIS_HOST", "localhost")
    REDIS_PORT: int = int(os.getenv("REDIS_PORT", "6379"))
    REDIS_DB: int = int(os.getenv("REDIS_DB", "0"))
    
    # Kafka
    KAFKA_BOOTSTRAP_SERVERS: str = os.getenv(
        "KAFKA_BOOTSTRAP_SERVERS", 
        "localhost:9092"
    )
    
    # AI/ML
    GOOGLE_API_KEY: Optional[str] = os.getenv("GOOGLE_API_KEY")
    GEMINI_MODEL: str = "gemini-2.0-flash"
    
    # External APIs
    OSRM_URL: str = "http://router.project-osrm.org"
    WEATHER_API_KEY: Optional[str] = os.getenv("WEATHER_API_KEY")
    
    # Service URLs (for microservices)
    FREIGHT_SERVICE_URL: str = "http://localhost:8001"
    OPTIMIZER_SERVICE_URL: str = "http://localhost:8002"
    PRICING_SERVICE_URL: str = "http://localhost:8003"
    DEMAND_SERVICE_URL: str = "http://localhost:8004"
    CARBON_SERVICE_URL: str = "http://localhost:8005"
    EMPTY_MILES_SERVICE_URL: str = "http://localhost:8006"
    DIGITAL_TWIN_SERVICE_URL: str = "http://localhost:8007"
    WEATHER_SERVICE_URL: str = "http://localhost:8008"
    COPILOT_SERVICE_URL: str = "http://localhost:8009"
    
    # Application
    DEBUG: bool = os.getenv("DEBUG", "true").lower() == "true"
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    
    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()

