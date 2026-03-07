"""
Kafka messaging for event-driven architecture
"""
import json
import logging
from datetime import datetime
from typing import Optional, Dict, Any, Callable
from dataclasses import dataclass, asdict

from kafka import KafkaProducer, KafkaConsumer
from kafka.errors import KafkaError

from .config import settings

logger = logging.getLogger(__name__)


class EventTopics:
    """Kafka event topic names"""
    SHIPMENT_CREATED = "shipment.created"
    SHIPMENT_UPDATED = "shipment.updated"
    SHIPMENT_BOOKED = "shipment.booked"
    BOOKING_CONFIRMED = "booking.confirmed"
    BOOKING_COMPLETED = "booking.completed"
    TRUCK_LOCATION_UPDATE = "truck.location_update"
    TRUCK_STATUS_CHANGED = "truck.status_changed"
    ROUTE_OPTIMIZED = "route.optimized"
    PRICING_UPDATED = "pricing.updated"
    DEMAND_PREDICTED = "demand.predicted"
    CARBON_CALCULATED = "carbon.calculated"
    WEATHER_ALERT = "weather.alert"
    COPILOT_MESSAGE = "copilot.message"


@dataclass
class BaseEvent:
    """Base event structure"""
    event_type: str
    payload: dict
    timestamp: str
    version: str = "1.0"
    correlation_id: Optional[str] = None
    
    def __post_init__(self):
        if not self.timestamp:
            self.timestamp = datetime.utcnow().isoformat()
    
    def to_dict(self) -> dict:
        return asdict(self)
    
    def to_json(self) -> str:
        return json.dumps(self.to_dict(), default=str)


class EventProducer:
    """Kafka event producer for publishing events"""
    
    def __init__(self, bootstrap_servers: Optional[list] = None):
        self.bootstrap_servers = bootstrap_servers or settings.KAFKA_BOOTSTRAP_SERVERS.split(',')
        self.producer = None
        self._connected = False
    
    def connect(self):
        """Connect to Kafka"""
        if self._connected:
            return
        
        try:
            self.producer = KafkaProducer(
                bootstrap_servers=self.bootstrap_servers,
                value_serializer=lambda v: json.dumps(v, default=str).encode('utf-8'),
                key_serializer=lambda k: k.encode('utf-8') if k else None,
                acks='all',
                retries=3,
                max_in_flight_requests_per_connection=1
            )
            self._connected = True
            logger.info(f"Kafka producer connected to {self.bootstrap_servers}")
        except KafkaError as e:
            logger.error(f"Failed to connect Kafka producer: {e}")
            self._connected = False
    
    def disconnect(self):
        """Disconnect from Kafka"""
        if self.producer:
            self.producer.flush()
            self.producer.close()
            self._connected = False
    
    def emit(self, topic: str, event: BaseEvent, key: Optional[str] = None) -> bool:
        """
        Emit an event to Kafka
        
        Args:
            topic: Kafka topic
            event: Event to emit
            key: Optional partition key
        
        Returns:
            True if successful, False otherwise
        """
        if not self._connected:
            self.connect()
        
        try:
            future = self.producer.send(
                topic,
                key=key,
                value=event.to_dict()
            )
            # Wait for send to complete
            record_metadata = future.get(timeout=10)
            logger.debug(f"Event emitted to {topic}: {record_metadata}")
            return True
        except Exception as e:
            logger.error(f"Failed to emit event to {topic}: {e}")
            return False
    
    # Convenience methods for common events
    def emit_shipment_created(self, shipment_id: str, data: dict) -> bool:
        event = BaseEvent(
            event_type=EventTopics.SHIPMENT_CREATED,
            payload={"shipment_id": shipment_id, **data}
        )
        return self.emit(EventTopics.SHIPMENT_CREATED, event, key=shipment_id)
    
    def emit_booking_confirmed(self, booking_id: str, shipment_id: str, truck_id: str) -> bool:
        event = BaseEvent(
            event_type=EventTopics.BOOKING_CONFIRMED,
            payload={
                "booking_id": booking_id,
                "shipment_id": shipment_id,
                "truck_id": truck_id
            }
        )
        return self.emit(EventTopics.BOOKING_CONFIRMED, event, key=booking_id)
    
    def emit_truck_location(self, truck_id: str, lat: float, lng: float) -> bool:
        event = BaseEvent(
            event_type=EventTopics.TRUCK_LOCATION_UPDATE,
            payload={
                "truck_id": truck_id,
                "latitude": lat,
                "longitude": lng,
                "timestamp": datetime.utcnow().isoformat()
            }
        )
        return self.emit(EventTopics.TRUCK_LOCATION_UPDATE, event, key=truck_id)
    
    def emit_route_optimized(self, route_id: str, optimization_data: dict) -> bool:
        event = BaseEvent(
            event_type=EventTopics.ROUTE_OPTIMIZED,
            payload={"route_id": route_id, **optimization_data}
        )
        return self.emit(EventTopics.ROUTE_OPTIMIZED, event, key=route_id)


class EventConsumer:
    """Kafka event consumer for processing events"""
    
    def __init__(self, group_id: str, bootstrap_servers: Optional[list] = None):
        self.group_id = group_id
        self.bootstrap_servers = bootstrap_servers or settings.KAFKA_BOOTSTRAP_SERVERS.split(',')
        self.consumer = None
        self._running = False
        self.handlers: Dict[str, Callable] = {}
    
    def connect(self):
        """Connect to Kafka"""
        try:
            self.consumer = KafkaConsumer(
                bootstrap_servers=self.bootstrap_servers,
                group_id=self.group_id,
                value_deserializer=lambda v: json.loads(v.decode('utf-8')),
                auto_offset_reset='earliest',
                enable_auto_commit=True,
                auto_commit_interval_ms=5000
            )
            logger.info(f"Kafka consumer connected with group_id: {self.group_id}")
        except KafkaError as e:
            logger.error(f"Failed to connect Kafka consumer: {e}")
    
    def disconnect(self):
        """Disconnect from Kafka"""
        if self.consumer:
            self.consumer.close()
            self._running = False
    
    def subscribe(self, topics: list):
        """Subscribe to topics"""
        if self.consumer:
            self.consumer.subscribe(topics)
            logger.info(f"Subscribed to topics: {topics}")
    
    def register_handler(self, event_type: str, handler: Callable):
        """Register event handler"""
        self.handlers[event_type] = handler
    
    def start(self):
        """Start consuming events"""
        if not self.consumer:
            self.connect()
        
        self._running = True
        logger.info("Event consumer started")
        
        while self._running:
            try:
                # Poll for messages
                records = self.consumer.poll(timeout_ms=1000)
                
                for topic_partition, messages in records.items():
                    topic = topic_partition.topic
                    
                    for message in messages:
                        event_data = message.value
                        event_type = event_data.get('event_type')
                        
                        # Call registered handler
                        if event_type in self.handlers:
                            try:
                                self.handlers[event_type](event_data.get('payload', {}))
                            except Exception as e:
                                logger.error(f"Handler error for {event_type}: {e}")
            
            except Exception as e:
                logger.error(f"Consumer error: {e}")
    
    def stop(self):
        """Stop consuming"""
        self._running = False


# Singleton instances
_producer: Optional[EventProducer] = None


def get_producer() -> EventProducer:
    """Get singleton event producer"""
    global _producer
    if _producer is None:
        _producer = EventProducer()
        _producer.connect()
    return _producer


def emit_event(topic: str, payload: dict, key: Optional[str] = None) -> bool:
    """Convenience function to emit events"""
    event = BaseEvent(event_type=topic, payload=payload)
    return get_producer().emit(topic, event, key)

