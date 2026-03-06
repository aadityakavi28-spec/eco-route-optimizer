# backend/optimizer.py - Beast Mode Enhanced Version
from ortools.constraint_solver import routing_enums_pb2
from ortools.constraint_solver import pywrapcp
import math

def create_data_model(distance_matrix, num_vehicles=1):
    """Stores the data for the routing problem."""
    data = {}
    data['distance_matrix'] = distance_matrix
    data['num_vehicles'] = num_vehicles
    data['depot'] = 0  # The starting point (index 0)
    
    # Default parameters
    data['vehicle_speed_kmh'] = 80
    data['max_delivery_hours'] = 72
    data['demands'] = [0] * len(distance_matrix)  # No demands for VRP in basic mode
    
    return data

def calculate_distance_matrix_fallback(coords):
    """Create distance matrix using Haversine formula as fallback"""
    n = len(coords)
    matrix = [[0] * n for _ in range(n)]
    
    for i in range(n):
        for j in range(n):
            if i != j:
                matrix[i][j] = int(haversine_distance(coords[i], coords[j]))
    
    return matrix

def haversine_distance(coord1, coord2):
    """Calculate distance between two coordinates in km"""
    R = 6371  # Earth radius in km
    
    lat1, lon1 = math.radians(coord1[0]), math.radians(coord1[1])
    lat2, lon2 = math.radians(coord2[0]), math.radians(coord2[1])
    
    dlat = lat2 - lat1
    dlon = lon2 - lon1
    
    a = math.sin(dlat/2)**2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon/2)**2
    c = 2 * math.asin(math.sqrt(a))
    
    return R * c

def optimize_routes(distance_matrix, num_vehicles=1, demands=None, vehicle_capacities=None):
    """
    Enhanced route optimizer with multiple options.
    
    Args:
        distance_matrix: 2D array of distances between locations
        num_vehicles: Number of vehicles to use (default: 1)
        demands: Array of demands at each location (optional)
        vehicle_capacities: Array of vehicle capacities (optional)
    """
    # Handle edge cases
    if not distance_matrix or len(distance_matrix) < 2:
        return {"status": "error", "message": "Insufficient locations for routing"}
    
    data = create_data_model(distance_matrix, num_vehicles)
    
    # Add demands if provided
    if demands:
        data['demands'] = demands
    
    # Create the routing index manager
    manager = pywrapcp.RoutingIndexManager(
        len(data['distance_matrix']),
        data['num_vehicles'], 
        data['depot']
    )
    
    # Create Routing Model
    routing = pywrapcp.RoutingModel(manager)

    # Create and register a transit callback (returns distance between nodes)
    def distance_callback(from_index, to_index):
        from_node = manager.IndexToNode(from_index)
        to_node = manager.IndexToNode(to_index)
        return int(data['distance_matrix'][from_node][to_node])

    transit_callback_index = routing.RegisterTransitCallback(distance_callback)

    # Define cost of each arc (we want to minimize distance)
    routing.SetArcCostEvaluatorOfAllVehicles(transit_callback_index)

    # Add capacity constraint if demands are provided
    if demands and vehicle_capacities:
        def demand_callback(from_index):
            from_node = manager.IndexToNode(from_index)
            return data['demands'][from_node]
        
        demand_callback_index = routing.RegisterUnaryTransitCallback(demand_callback)
        routing.AddDimensionWithVehicleCapacity(
            demand_callback_index,
            0,  # no slack
            vehicle_capacities,  # vehicle capacities
            True,  # start cumul to zero
            'Capacity'
        )

    # TIME CALLBACK AND DIMENSION
    def time_callback(from_index, to_index):
        from_node = manager.IndexToNode(from_index)
        to_node = manager.IndexToNode(to_index)
        distance = data['distance_matrix'][from_node][to_node]
        speed = data['vehicle_speed_kmh']
        return int(distance / speed)  # Time in hours converted to minutes for OR-Tools

    time_callback_index = routing.RegisterTransitCallback(time_callback)

    # Add the Time Dimension
    routing.AddDimension(
        time_callback_index,
        30 * 60,  # allow up to 30 hours of waiting time in minutes
        data['max_delivery_hours'] * 60,  # maximum total time in minutes
        False,  # Don't force start to 0
        'Time'
    )

    # Set search parameters
    search_parameters = pywrapcp.DefaultRoutingSearchParameters()
    search_parameters.first_solution_strategy = (
        routing_enums_pb2.FirstSolutionStrategy.PATH_CHEAPEST_ARC)
    
    # Enable local search for better solutions
    search_parameters.local_search_metaheuristic = (
        routing_enums_pb2.LocalSearchMetaheuristic.GUIDED_LOCAL_SEARCH)
    search_parameters.time_limit.seconds = 30  # 30 second time limit for better optimization

    # Solve the problem
    solution = routing.SolveWithParameters(search_parameters)

    # Extract the results
    if solution:
        total_distance = 0
        routes = []
        
        for vehicle_id in range(data['num_vehicles']):
            index = routing.Start(vehicle_id)
            route = []
            route_distance = 0
            
            if not routing.IsEnd(index):
                while not routing.IsEnd(index):
                    node_index = manager.IndexToNode(index)
                    route.append(node_index)
                    previous_index = index
                    index = solution.Value(routing.NextVar(index))
                    route_distance += routing.GetArcCostForVehicle(previous_index, index, vehicle_id)
                
                # Add final node
                route.append(manager.IndexToNode(index))
                
                if route_distance > 0:
                    routes.append({
                        "vehicle_id": vehicle_id,
                        "route": route,
                        "distance_km": route_distance
                    })
                    total_distance += route_distance
        
        # If single vehicle, return simpler format
        if len(routes) == 1:
            return {
                "status": "success",
                "optimized_route_indices": routes[0]["route"],
                "total_distance_km": routes[0]["distance_km"],
                "routes": routes,
                "solution_quality": "optimized"
            }
        
        return {
            "status": "success",
            "optimized_route_indices": routes[0]["route"] if routes else [],
            "total_distance_km": total_distance,
            "routes": routes,
            "solution_quality": "optimized"
        }
    else:
        # Try simpler first solution strategy if optimal fails
        return optimize_simple(distance_matrix)

def optimize_simple(distance_matrix):
    """Simple nearest neighbor optimization as fallback"""
    n = len(distance_matrix)
    if n < 2:
        return {"status": "error", "message": "Insufficient locations"}
    
    visited = [False] * n
    route = [0]  # Start from depot
    visited[0] = True
    total_distance = 0
    
    current = 0
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
    route.append(0)
    total_distance += distance_matrix[current][0]
    
    return {
        "status": "success",
        "optimized_route_indices": route,
        "total_distance_km": total_distance,
        "solution_quality": "nearest_neighbor"
    }

def optimize_multi_vehicle(distance_matrix, num_vehicles, vehicle_capacities=None, demands=None):
    """Optimize routes for multiple vehicles with capacity constraints"""
    return optimize_routes(distance_matrix, num_vehicles, demands, vehicle_capacities)

