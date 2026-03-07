/**
 * API Service Layer for EcoRoute Optimizer
 * Centralized API calls to all microservices
 */

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// Service endpoints mapping
const SERVICES = {
  freight: 'http://localhost:8001',
  optimizer: 'http://localhost:8002',
  pricing: 'http://localhost:8003',
  demand: 'http://localhost:8004',
  carbon: 'http://localhost:8005',
  emptyMiles: 'http://localhost:8006',
  digitalTwin: 'http://localhost:8007',
  weather: 'http://localhost:8008',
  copilot: 'http://localhost:8009'
};

// Generic fetch wrapper
async function fetchAPI(service, endpoint, options = {}) {
  const url = `${SERVICES[service]}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`API Call failed: ${error.message}`);
    throw error;
  }
}

// ============================================
// Freight Marketplace API
// ============================================

export const freightApi = {
  // Shipments
  createShipment: (data) => 
    fetchAPI('freight', '/shipments', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
  
  getShipments: (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    return fetchAPI(`/shipments?${params}`);
  },
  
  getShipment: (id) => 
    fetchAPI('freight', `/shipments/${id}`),
  
  updateShipmentStatus: (id, status) =>
    fetchAPI('freight', `/shipments/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    }),
  
  // Truck Routes
  createTruckRoute: (data) =>
    fetchAPI('freight', '/truck-routes', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
  
  getTruckRoutes: (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    return fetchAPI('freight', `/truck-routes?${params}`);
  },
  
  matchShipment: (shipmentId) =>
    fetchAPI('freight', `/truck-routes/match/${shipmentId}`),
  
  // Bookings
  createBooking: (data) =>
    fetchAPI('freight', '/bookings', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
  
  getBookings: (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    return fetchAPI('freight', `/bookings?${params}`);
  },
  
  // Analytics
  getMarketplaceSummary: () =>
    fetchAPI('freight', '/analytics/summary')
};

// ============================================
// Route Optimizer API
// ============================================

export const optimizerApi = {
  optimizeRoute: (data) =>
    fetchAPI('optimizer', '/optimize', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
  
  getDistanceMatrix: (locations) =>
    fetchAPI('optimizer', '/distance-matrix', {
      method: 'POST',
      body: JSON.stringify(locations)
    }),
  
  compareRoutes: (data) =>
    fetchAPI('optimizer', '/compare-routes', {
      method: 'POST',
      body: JSON.stringify(data)
    })
};

// ============================================
// Pricing AI API
// ============================================

export const pricingApi = {
  calculatePrice: (data) =>
    fetchAPI('pricing', '/calculate', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
  
  calculateBatch: (pricingRequests) =>
    fetchAPI('pricing', '/batch', {
      method: 'POST',
      body: JSON.stringify(pricingRequests)
    }),
  
  getPricingHistory: (routeKey, days = 30) =>
    fetchAPI('pricing', `/history/${routeKey}?days=${days}`),
  
  getCargoTypeRates: () =>
    fetchAPI('pricing', '/rates/cargo-types'),
  
  getMarketRates: () =>
    fetchAPI('pricing', '/analytics/market-rates')
};

// ============================================
// Demand Prediction API
// ============================================

export const demandApi = {
  predictDemand: (data) =>
    fetchAPI('demand', '/predict', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
  
  getDemandForecast: (data) =>
    fetchAPI('demand', '/forecast', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
  
  getDemandTrends: (days = 30) =>
    fetchAPI('demand', `/trends?days=${days}`),
  
  getCapacityAnalysis: (routeKey) =>
    fetchAPI('demand', `/capacity-analysis/${routeKey}`),
  
  getDemandAlerts: () =>
    fetchAPI('demand', '/alerts')
};

// ============================================
// Carbon Intelligence API
// ============================================

export const carbonApi = {
  calculateEmissions: (data) =>
    fetchAPI('carbon', '/calculate', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
  
  getReductionStrategies: (data) =>
    fetchAPI('carbon', '/reduce', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
  
  getImpactSummary: () =>
    fetchAPI('carbon', '/impact-summary')
};

// ============================================
// Empty Miles Detection API
// ============================================

export const emptyMilesApi = {
  getTrucksEnRoute: () =>
    fetchAPI('emptyMiles', '/trucks-en-route'),
  
  getBackhaulSuggestions: (truckId) =>
    fetchAPI('emptyMiles', `/suggestions/${truckId}`),
  
  getAllOpportunities: () =>
    fetchAPI('emptyMiles', '/all-opportunities'),
  
  getAnalytics: () =>
    fetchAPI('emptyMiles', '/analytics')
};

// ============================================
// Digital Twin API
// ============================================

export const digitalTwinApi = {
  simulateScenario: (data) =>
    fetchAPI('digitalTwin', '/simulate', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
  
  getNetworkStatus: () =>
    fetchAPI('digitalTwin', '/network-status')
};

// ============================================
// Weather API
// ============================================

export const weatherApi = {
  getCurrentWeather: (location) =>
    fetchAPI('weather', '/current', {
      method: 'POST',
      body: JSON.stringify({ location })
    }),
  
  getRouteWeatherImpact: (locations) =>
    fetchAPI('weather', `/route-impact?locations=${locations}`)
};

// ============================================
// AI Copilot API
// ============================================

export const copilotApi = {
  chat: (message, context = {}, history = []) =>
    fetchAPI('copilot', '/chat', {
      method: 'POST',
      body: JSON.stringify({ message, context, history })
    }),
  
  getSuggestions: (topic) =>
    fetchAPI('copilot', `/suggestions/${topic}`)
};

// ============================================
// Default export
// ============================================

export default {
  freight: freightApi,
  optimizer: optimizerApi,
  pricing: pricingApi,
  demand: demandApi,
  carbon: carbonApi,
  emptyMiles: emptyMilesApi,
  digitalTwin: digitalTwinApi,
  weather: weatherApi,
  copilot: copilotApi
};

