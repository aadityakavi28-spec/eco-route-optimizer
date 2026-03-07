"""
Route Optimizer Service
Advanced VRP solving using Google OR-Tools with multiple constraints
"""
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional, Dict, Tuple
from datetime import datetime
import math
import json

app = FastAPI(
    title="Route Optimizer Service",
    description="AI-powered route optimization using OR-Tools",
    version="1.0.0"
)

# ============================================
# Request/Response Models
# ============================================

class Location(BaseModel):
    city: str
    latitude: float
    longitude: float


class OptimizeRequest(BaseModel):
    locations: List[Location]
    cargo_weight_kg: float = 0
    vehicle_capacity_kg: float = 15000
    num_vehicles: int = 1
    depot_index: int = 0
    max_distance_per_vehicle: Optional[float] = None
    time_windows: Optional[List[Tuple[float, float]]] = None


class OptimizationResult(BaseModel):
    status: str
    total_distance_km: float
    total_duration_hours: float
    routes: List[dict]
    vehicle_utilization: List[float]
    estimated_cost_inr: float
    estimated_fuel_liters: float
    co2_emissions_kg: float
    solution_quality: str


# ============================================
# OR-Tools VRP Solver
# ============================================

try:
    from ortools.constraint_solver import routing_enums_pb2
    from ortools.constraint_solver import pywrapcp
    ORTOOLS_AVAILABLE = True
except ImportError:
    ORTOOLS_AVAILABLE = False


class VRPSolver:
    """Vehicle Routing Problem Solver using OR-Tools"""
    
    def __init__(self, distance_matrix: List[List[float]], num_vehicles: int = 1):
        self.distance_matrix = distance_matrix
        self.num_locations = len(distance_matrix)
        self.num_vehicles = num_vehicles
        self.manager = None
        self.routing = None
        
    def create_model(self, demands: List[float] = None, capacities: List[float] = None,
                    depot: int = 0, max_distance: float = None):
        """Create the VRP model"""
        
        self.manager = pywrapcp.RoutingIndexManager(
            self.num_locations,
            self.num_vehicles,
            depot
        )
        
        self.routing = pywrapcp.RoutingModel(self.manager)
        
        # Register distance callback
        transit_callback_index = self.routing.RegisterTransitCallback(
            self._distance_callback
        )
        
        # Set arc cost (minimize distance)
        self.routing.SetArcCostEvaluatorOfAllVehicles(transit_callback_index)
        
        # Add capacity constraint if demands provided
        if demands and capacities:
            demand_callback_index = self.routing.RegisterUnaryTransitCallback(
                self._demand_callback
            )
            self.routing.AddDimensionWithVehicleCapacity(
                demand_callback_index,
                0,  # no slack
                capacities,
                True,
                'Capacity'
            )
        
        # Add distance constraint
        if max_distance:
            self.routing.AddDimension(
                transit_callback_index,
                0,  # no slack
                int(max_distance),
                True,
                'Distance'
            )
        
        # Set search parameters
        self.search_parameters = pywrapcp.DefaultRoutingSearchParameters()
        self.search_parameters.first_solution_strategy = (
            routing_enums_pb2.FirstSolutionStrategy.PATH_CHEAPEST_ARC
        )
        self.search_parameters.local_search_metaheuristic = (
            routing_enums_pb2.LocalSearchMetaheuristic.GUIDED_LOCAL_SEARCH
        )
        self.search_parameters.time_limit.seconds = 30
        
        self.demands = demands or [0] * self.num_locations
        
    def _distance_callback(self, from_index, to_index):
        """Calculate distance between two nodes"""
        from_node = self.manager.IndexToNode(from_index)
        to_node = self.manager.IndexToNode(to_index)
        return int(self.distance_matrix[from_node][to_node])
    
    def _demand_callback(self, from_index):
        """Get demand at a node"""
        from_node = self.manager.IndexToNode(from_index)
        return self.demands[from_node]
        
    def solve(self) -> Dict:
        """Solve the VRP and return results"""
        
        solution = self.routing.SolveWithParameters(self.search_parameters)
        
        if not solution:
            return {
                "status": "error",
                "message": "No solution found"
            }
        
        routes = []
        total_distance = 0
        total_load = 0
        
        for vehicle_id in range(self.num_vehicles):
            index = self.routing.Start(vehicle_id)
            route = []
            route_distance = 0
            route_load = 0
            
            while not self.routing.IsEnd(index):
                node = self.manager.IndexToNode(index)
                route.append(node)
                route_load += self.demands[node]
                
                previous_index = index
                index = solution.Value(self.routing.NextVar(index))
                route_distance += self.routing.GetArcCostForVehicle(
                    previous_index, index, vehicle_id
                )
            
            # Add return to depot
            route.append(self.manager.IndexToNode(index))
            
            if route_distance > 0:
                routes.append({
                    "vehicle_id": vehicle_id,
                    "route": route,
                    "distance_km": route_distance,
                    "load_kg": route_load
                })
                total_distance += route_distance
                total_load += route_load
        
        return {
            "status": "success",
            "total_distance_km": total_distance,
            "routes": routes,
            "total_load_kg": total_load,
            "solution_quality": "optimal" if solution else "heuristic"
        }


# ============================================
# Utility Functions
# ============================================

def haversine_distance(coord1: Tuple[float, float], coord2: Tuple[float, float]) -> float:
    """Calculate distance between two coordinates in km using Haversine formula"""
    R = 6371  # Earth radius in km
    
    lat1, lon1 = math.radians(coord1[0]), math.radians(coord1[1])
    lat2, lon2 = math.radians(coord2[0]), math.radians(coord2[1])
    
    dlat = lat2 - lat1
    dlon = lon2 - lon1
    
    a = math.sin(dlat/2)**2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon/2)**2
    c = 2 * math.asin(math.sqrt(a))
    
    return R * c


def create_distance_matrix(coords: List[Tuple[float, float]]) -> List[List[float]]:
    """Create distance matrix from coordinates"""
    n = len(coords)
    matrix = [[0] * n for _ in range(n)]
    
    for i in range(n):
        for j in range(n):
            if i != j:
                matrix[i][j] = int(haversine_distance(coords[i], coords[j]))
    
    return matrix


# ============================================
# API Endpoints
# ============================================

@app.get("/health")
def health_check():
    return {
        "status": "healthy", 
        "service": "route-optimizer",
        "ortools_available": ORTOOLS_AVAILABLE
    }


@app.post("/optimize", response_model=OptimizationResult)
def optimize_route(request: OptimizeRequest):
    """
    Optimize routes for given locations using VRP
    """
    
    if len(request.locations) < 2:
        raise HTTPException(status_code=400, 
                          detail="At least 2 locations required")
    
    if not ORTOOLS_AVAILABLE:
        # Fallback to simple optimization
        return simple_optimize(request)
    
    try:
        # Extract coordinates
        coords = [(loc.latitude, loc.longitude) for loc in request.locations]
        
        # Create distance matrix
        distance_matrix = create_distance_matrix(coords)
        
        # Set demands (first location = depot = 0)
        demands = [0] + [request.cargo_weight_kg / (len(request.locations) - 1)] * (len(request.locations) - 1)
        
        # Set vehicle capacities
        capacities = [request.vehicle_capacity_kg] * request.num_vehicles
        
        # Solve VRP
        solver = VRPSolver(distance_matrix, request.num_vehicles)
        solver.create_model(
            demands=demands,
            capacities=capacities,
            depot=request.depot_index,
            max_distance=request.max_distance_per_vehicle
        )
        
        result = solver.solve()
        
        if result["status"] == "error":
            raise HTTPException(status_code=500, detail=result.get("message"))
        
        # Calculate additional metrics
        total_distance = result["total_distance_km"]
        
        # Vehicle utilization
        utilization = []
        for route in result["routes"]:
            util = (route["load_kg"] / request.vehicle_capacity_kg) * 100
            utilization.append(round(util, 1))
        
        # Cost estimation (₹40/km average)
        cost_per_km = 40
        estimated_cost = total_distance * cost_per_km
        
        # Fuel consumption (3 km/L average for trucks)
        fuel_efficiency = 3
        estimated_fuel = total_distance / fuel_efficiency
        
        # CO2 emissions (0.35 kg/L diesel)
        co2_per_liter = 0.35
        co2_emissions = estimated_fuel * co2_per_liter
        
        # Total duration (60 km/h average + 30 min stop per stop)
        avg_speed = 60
        num_stops = len(result["routes"][0]["route"]) - 2 if result["routes"] else 0
        total_duration = (total_distance / avg_speed) + (num_stops * 0.5)
        
        return OptimizationResult(
            status="success",
            total_distance_km=total_distance,
            total_duration_hours=round(total_duration, 1),
            routes=result["routes"],
            vehicle_utilization=utilization,
            estimated_cost_inr=round(estimated_cost, 2),
            estimated_fuel_liters=round(estimated_fuel, 2),
            co2_emissions_kg=round(co2_emissions, 2),
            solution_quality=result.get("solution_quality", "optimal")
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


def simple_optimize(request: OptimizeRequest) -> OptimizationResult:
    """Fallback simple optimization when OR-Tools not available"""
    
    coords = [(loc.latitude, loc.longitude) for loc in request.locations]
    distance_matrix = create_distance_matrix(coords)
    
    # Nearest neighbor heuristic
    n = len(coords)
    visited = [False] * n
    route = [request.depot_index]
    visited[request.depot_index] = True
    total_distance = 0
    
    current = request.depot_index
    for _ in range(n - 1):
        nearest = -1
        min_dist = float('inf')
        
        for j in range(n):
            if not visited[j] and distance_matrix[current][j] < min_dist:
                min_dist = distance_matrix[current][j]
                nearest = j
        
        if nearest != -1:
            route.append(nearest)
            visited[nearest] = True
            total_distance += min_dist
            current = nearest
    
    # Return to depot
    route.append(request.depot_index)
    total_distance += distance_matrix[current][request.depot_index]
    
    # Calculate metrics
    cost_per_km = 40
    estimated_cost = total_distance * cost_per_km
    fuel_efficiency = 3
    estimated_fuel = total_distance / fuel_efficiency
    co2_emissions = estimated_fuel * 0.35
    total_duration = (total_distance / 60) + (len(route) * 0.5)
    
    return OptimizationResult(
        status="success",
        total_distance_km=total_distance,
        total_duration_hours=round(total_duration, 1),
        routes=[{
            "vehicle_id": 0,
            "route": route,
            "distance_km": total_distance,
            "load_kg": request.cargo_weight_kg
        }],
        vehicle_utilization=[(request.cargo_weight_kg / request.vehicle_capacity_kg) * 100],
        estimated_cost_inr=round(estimated_cost, 2),
        estimated_fuel_liters=round(estimated_fuel, 2),
        co2_emissions_kg=round(co2_emissions, 2),
        solution_quality="heuristic"
    )


@app.post("/distance-matrix")
def get_distance_matrix(locations: List[Location]):
    """Calculate distance matrix for given locations"""
    
    coords = [(loc.latitude, loc.longitude) for loc in locations]
    matrix = create_distance_matrix(coords)
    
    return {
        "status": "success",
        "matrix": matrix,
        "locations": [l.city for l in locations]
    }


@app.post("/compare-routes")
def compare_routes(request: OptimizeRequest):
    """Compare multiple route scenarios"""
    
    # Generate alternative scenarios
    scenarios = []
    
    # Scenario 1: Shortest distance
    scenarios.append({
        "name": "Shortest Distance",
        "result": optimize_route(request).dict()
    })
    
    # Scenario 2: Balanced load (if multiple vehicles)
    if request.num_vehicles > 1:
        balanced_request = OptimizeRequest(
            locations=request.locations,
            cargo_weight_kg=request.cargo_weight_kg,
            vehicle_capacity_kg=request.vehicle_capacity_kg * 0.8,
            num_vehicles=request.num_vehicles + 1,
            depot_index=request.depot_index
        )
        scenarios.append({
            "name": "Balanced Fleet",
            "result": optimize_route(balanced_request).dict()
        })
    
    return {
        "status": "success",
        "scenarios": scenarios
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8002)

