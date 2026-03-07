/**
 * Zustand Store for EcoRoute Optimizer
 * Centralized state management
 */

import { create } from 'zustand';

// ============================================
// Truck Store
// ============================================

export const useTruckStore = create((set, get) => ({
  trucks: [],
  selectedTruck: null,
  loading: false,
  error: null,
  
  setTrucks: (trucks) => set({ trucks }),
  setSelectedTruck: (truck) => set({ selectedTruck: truck }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  
  addTruck: (truck) => set((state) => ({ 
    trucks: [...state.trucks, truck] 
  })),
  
  updateTruck: (id, updates) => set((state) => ({
    trucks: state.trucks.map(t => 
      t.id === id ? { ...t, ...updates } : t
    )
  })),
  
  removeTruck: (id) => set((state) => ({
    trucks: state.trucks.filter(t => t.id !== id)
  })),
  
  fetchTrucks: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetch('http://localhost:8000/api/trucks');
      const data = await response.json();
      if (data.status === 'success') {
        set({ trucks: data.trucks, loading: false });
      }
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  }
}));

// ============================================
// Shipment Store
// ============================================

export const useShipmentStore = create((set, get) => ({
  shipments: [],
  selectedShipment: null,
  loading: false,
  error: null,
  
  setShipments: (shipments) => set({ shipments }),
  setSelectedShipment: (shipment) => set({ selectedShipment: shipment }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  
  addShipment: (shipment) => set((state) => ({
    shipments: [...state.shipments, shipment]
  })),
  
  updateShipment: (id, updates) => set((state) => ({
    shipments: state.shipments.map(s => 
      s.id === id ? { ...s, ...updates } : s
    )
  })),
  
  fetchShipments: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetch('http://localhost:8000/api/shipments');
      const data = await response.json();
      if (data.status === 'success') {
        set({ shipments: data.shipments, loading: false });
      }
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  }
}));

// ============================================
// Route Optimization Store
// ============================================

export const useRouteStore = create((set) => ({
  optimizationResult: null,
  loading: false,
  error: null,
  
  setOptimizationResult: (result) => set({ optimizationResult: result }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  
  clearResult: () => set({ optimizationResult: null }),
  
  optimizeRoute: async (locations, cargoWeight, cargoType, maxHours) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch('http://localhost:8000/api/optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          locations,
          cargo_weight_kg: cargoWeight,
          cargo_type: cargoType,
          max_delivery_hours: maxHours
        })
      });
      const data = await response.json();
      if (data.status === 'success') {
        set({ optimizationResult: data, loading: false });
      } else {
        set({ error: data.message, loading: false });
      }
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  }
}));

// ============================================
// Analytics Store
// ============================================

export const useAnalyticsStore = create((set) => ({
  summary: null,
  recentRoutes: [],
  loading: false,
  error: null,
  
  setSummary: (summary) => set({ summary }),
  setRecentRoutes: (routes) => set({ recentRoutes: routes }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  
  fetchAnalytics: async () => {
    set({ loading: true, error: null });
    try {
      const [summaryRes, routesRes] = await Promise.all([
        fetch('http://localhost:8000/api/analytics/summary'),
        fetch('http://localhost:8000/api/analytics/recent?limit=10')
      ]);
      
      const summaryData = await summaryRes.json();
      const routesData = await routesRes.json();
      
      if (summaryData.status === 'success') {
        set({ summary: summaryData.summary, loading: false });
      }
      if (routesData.status === 'success') {
        set({ recentRoutes: routesData.recent_routes });
      }
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  }
}));

// ============================================
// Copilot Store
// ============================================

export const useCopilotStore = create((set) => ({
  messages: [],
  suggestions: [],
  loading: false,
  
  addMessage: (message) => set((state) => ({
    messages: [...state.messages, message]
  })),
  
  setSuggestions: (suggestions) => set({ suggestions }),
  setLoading: (loading) => set({ loading }),
  
  clearChat: () => set({ messages: [], suggestions: [] }),
  
  sendMessage: async (message, context = {}) => {
    set({ loading: true });
    
    // Add user message
    set((state) => ({
      messages: [...state.messages, { role: 'user', content: message }]
    }));
    
    try {
      const response = await fetch('http://localhost:8009/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message, 
          context,
          history: get().messages
        })
      });
      
      const data = await response.json();
      
      if (data.response) {
        set((state) => ({
          messages: [...state.messages, { 
            role: 'assistant', 
            content: data.response,
            suggestions: data.suggestions,
            actions: data.actions
          }],
          suggestions: data.suggestions || [],
          loading: false
        }));
      }
    } catch (error) {
      set({ loading: false });
      set((state) => ({
        messages: [...state.messages, { 
          role: 'assistant', 
          content: 'Sorry, I encountered an error. Please try again.' 
        }]
      }));
    }
  }
}));

// ============================================
// UI Store
// ============================================

export const useUIStore = create((set) => ({
  darkMode: false,
  sidebarOpen: true,
  activeModal: null,
  
  toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  openModal: (modal) => set({ activeModal: modal }),
  closeModal: () => set({ activeModal: null })
}));

export default {
  useTruckStore,
  useShipmentStore,
  useRouteStore,
  useAnalyticsStore,
  useCopilotStore,
  useUIStore
};

