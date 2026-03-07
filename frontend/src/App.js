// App.js - Professional Light Theme with Landing Pages
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap, CircleMarker } from 'react-leaflet';
import { 
  Leaf, Milestone as RouteIcon, MapPin, Package, Weight, Info, RefreshCw, 
  IndianRupee, Truck, Search, PlusCircle, CheckCircle, BarChart3,
  Zap, TrendingUp, Wind, Cloud, Gauge, DollarSign, Map, Navigation, Clock,
  ArrowRight, Activity, Layers, Settings, Home, X, Menu, Bot, Calculator, Network,
  Rocket, Sparkles, Globe, Users, Box, FileText, Ship, Warehouse, ArrowUpRight,
  ArrowDownRight, Target, Brain, Cpu, Wifi, Battery, Thermometer, Sun, Moon,
  ChevronRight, Play, Star, Shield, Clock3, Wallet, BarChart, ActivitySquare,
  Triangle, Hexagon, CircleDollarSign, Landmark, TruckFront
} from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { 
  LineChart, Line, AreaChart, Area, BarChart as RechartsBarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';

import CopilotPage from './pages/Copilot';
import DemandForecastPage from './pages/DemandForecast';
import DigitalTwinPage from './pages/DigitalTwin';
import PricingCalculatorPage from './pages/PricingCalculator';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({
  iconUrl: icon, 
  shadowUrl: iconShadow, 
  iconSize: [25, 41], 
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

function ChangeView({ center, zoom }) {
  const map = useMap();
  map.setView(center, zoom);
  return null;
}

// ==========================================
// THEME CONTEXT
// ==========================================
const ThemeContext = React.createContext();

function ThemeProvider({ children }) {
  const [darkMode, setDarkMode] = useState(false);
  const toggleTheme = () => setDarkMode(!darkMode);
  
  return (
    <ThemeContext.Provider value={{ darkMode, toggleTheme }}>
      <div className={darkMode ? 'dark' : ''}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

// ==========================================
// LANDING PAGE COMPONENT
// ==========================================
function LandingPage({ onGetStarted }) {
  const features = [
    { icon: Brain, title: 'AI Route Optimization', desc: 'Smart routing with Google OR-Tools', color: 'from-emerald-500 to-teal-500' },
    { icon: Wind, title: 'Carbon Tracking', desc: 'Monitor and reduce emissions', color: 'from-blue-500 to-cyan-500' },
    { icon: Truck, title: 'Freight Marketplace', desc: 'Connect shippers & carriers', color: 'from-purple-500 to-pink-500' },
    { icon: TrendingUp, title: 'Demand Forecasting', desc: 'Predict logistics demand', color: 'from-orange-500 to-red-500' },
    { icon: Calculator, title: 'Smart Pricing', desc: 'AI-powered freight pricing', color: 'from-indigo-500 to-violet-500' },
    { icon: Network, title: 'Digital Twin', desc: 'Simulate logistics networks', color: 'from-rose-500 to-pink-500' },
  ];

  const stats = [
    { value: '50K+', label: 'Routes Optimized', icon: RouteIcon },
    { value: '30%', label: 'Cost Savings', icon: DollarSign },
    { value: '25%', label: 'Less Emissions', icon: Wind },
    { value: '99.9%', label: 'Uptime', icon: Shield },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-xl">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-black bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent">
              EcoRoute
            </span>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={onGetStarted}
              className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-emerald-500/25 transition-all"
            >
              Get Started Free
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-cyan-500/5"></div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-200/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-cyan-200/30 rounded-full blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto relative">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium mb-6">
              <Star className="w-4 h-4" /> India's Leading Logistics AI Platform
            </div>
            <h1 className="text-5xl md:text-6xl font-black text-slate-800 mb-6 leading-tight">
              Smart Logistics
              <span className="block bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent">
                Powered by AI
              </span>
            </h1>
            <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
              Reduce empty miles, lower carbon emissions, and optimize delivery routes with our AI-powered logistics platform.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button 
                onClick={onGetStarted}
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-bold rounded-xl text-lg hover:shadow-xl hover:shadow-emerald-500/25 transition-all flex items-center justify-center gap-2"
              >
                Start Free Trial <ArrowRight className="w-5 h-5" />
              </button>
              <button className="w-full sm:w-auto px-8 py-4 bg-white text-slate-700 font-bold rounded-xl text-lg border-2 border-slate-200 hover:border-emerald-500 hover:text-emerald-600 transition-all flex items-center justify-center gap-2">
                <Play className="w-5 h-5" /> Watch Demo
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
            {stats.map((stat, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 text-center">
                <stat.icon className="w-8 h-8 mx-auto mb-3 text-emerald-500" />
                <p className="text-3xl font-black text-slate-800">{stat.value}</p>
                <p className="text-sm text-slate-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-slate-800 mb-4">Powerful Features</h2>
            <p className="text-xl text-slate-500">Everything you need for modern logistics</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, idx) => (
              <div 
                key={idx} 
                className="group p-8 rounded-2xl border-2 border-slate-100 hover:border-emerald-200 hover:shadow-xl transition-all duration-300"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">{feature.title}</h3>
                <p className="text-slate-500">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-emerald-600 to-cyan-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-black text-white mb-4">Ready to Transform Your Logistics?</h2>
          <p className="text-xl text-emerald-100 mb-8">Join thousands of businesses already using EcoRoute</p>
          <button 
            onClick={onGetStarted}
            className="px-10 py-5 bg-white text-emerald-600 font-bold rounded-xl text-xl hover:shadow-2xl transition-all"
          >
            Get Started Now - It's Free
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-xl">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">EcoRoute</span>
          </div>
          <p className="text-slate-400">© 2025 EcoRoute. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

// ==========================================
// BEAUTIFUL STATS CARD - LIGHT THEME
// ==========================================
function StatsCard({ icon: Icon, title, value, unit, gradient, trend, iconBg }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 hover:shadow-xl transition-all hover:-translate-y-1">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl ${iconBg} shadow-md`}>
          <Icon size={22} className="text-white" />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-sm font-bold ${trend > 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
            {trend > 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <p className="text-slate-500 text-sm font-medium">{title}</p>
      <p className="text-2xl font-black text-slate-800 mt-1">
        {value}
        <span className="text-sm font-normal text-slate-400 ml-1">{unit}</span>
      </p>
    </div>
  );
}

// ==========================================
// ANALYTICS DASHBOARD
// ==========================================
function AnalyticsDashboard({ onNavigate }) {
  const [analytics, setAnalytics] = useState(null);
  const [recentRoutes, setRecentRoutes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
    fetchRecentRoutes();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/analytics/summary');
      const data = await res.json();
      if (data.status === 'success') {
        setAnalytics(data.summary);
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const fetchRecentRoutes = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/analytics/recent?limit=5');
      const data = await res.json();
      if (data.status === 'success') {
        setRecentRoutes(data.recent_routes);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const carbonData = [
    { month: 'Jan', co2: 1200, saved: 300 },
    { month: 'Feb', co2: 1400, saved: 350 },
    { month: 'Mar', co2: 1100, saved: 400 },
    { month: 'Apr', co2: 1600, saved: 280 },
    { month: 'May', co2: 1300, saved: 450 },
    { month: 'Jun', co2: 1000, saved: 500 },
  ];

  const vehicleDistribution = [
    { name: 'Electric', value: 25, color: '#10b981' },
    { name: 'Diesel', value: 45, color: '#f59e0b' },
    { name: 'Hybrid', value: 20, color: '#8b5cf6' },
    { name: 'CNG', value: 10, color: '#06b6d4' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-emerald-200 rounded-full"></div>
          <div className="absolute top-0 left-0 w-16 h-16 border-4 border-emerald-500 rounded-full animate-spin border-t-transparent"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 overflow-y-auto h-full bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-800 flex items-center gap-3">
            <BarChart3 className="text-emerald-500" size={32} />
            Dashboard
          </h1>
          <p className="text-slate-500 mt-1">Your logistics at a glance</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => onNavigate('optimizer')}
            className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-bold rounded-xl flex items-center gap-2 hover:shadow-lg transition-all"
          >
            <Zap size={18} /> New Route
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard 
          icon={Truck} 
          title="Active Fleet" 
          value={analytics?.total_trucks || 5} 
          unit="vehicles"
          iconBg="bg-gradient-to-br from-blue-500 to-indigo-500"
          trend={12}
        />
        <StatsCard 
          icon={Package} 
          title="Total Shipments" 
          value={analytics?.total_shipments || 0} 
          unit="orders"
          iconBg="bg-gradient-to-br from-purple-500 to-pink-500"
          trend={8}
        />
        <StatsCard 
          icon={RouteIcon} 
          title="Distance Covered" 
          value={Math.round(analytics?.total_distance_km || 0)} 
          unit="km"
          iconBg="bg-gradient-to-br from-emerald-500 to-teal-500"
          trend={15}
        />
        <StatsCard 
          icon={Wind} 
          title="CO₂ Emissions" 
          value={Math.round(analytics?.total_co2_kg || 0)} 
          unit="kg"
          iconBg="bg-gradient-to-br from-orange-500 to-red-500"
          trend={-5}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Carbon Chart */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Wind className="text-orange-500" size={20} />
            Carbon Footprint
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={carbonData}>
              <defs>
                <linearGradient id="colorCo2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
              />
              <Area type="monotone" dataKey="co2" stroke="#f97316" strokeWidth={3} fillOpacity={1} fill="url(#colorCo2)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Fleet Distribution */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Truck className="text-cyan-500" size={20} />
            Fleet Composition
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={vehicleDistribution}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={5}
                dataKey="value"
              >
                {vehicleDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Routes */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Rocket className="text-purple-500" size={20} />
          Recent Optimizations
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-slate-500 text-sm border-b border-slate-100">
                <th className="pb-4 font-medium">Route</th>
                <th className="pb-4 font-medium">Distance</th>
                <th className="pb-4 font-medium">CO₂</th>
                <th className="pb-4 font-medium">Cost</th>
                <th className="pb-4 font-medium">Vehicle</th>
              </tr>
            </thead>
            <tbody>
              {recentRoutes.map((route, idx) => (
                <tr key={idx} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                  <td className="py-4 font-medium text-slate-800">{route.route?.join(' → ')}</td>
                  <td className="py-4 text-slate-600">{route.distance_km} km</td>
                  <td className="py-4 text-orange-500 font-medium">{route.co2_kg} kg</td>
                  <td className="py-4 text-emerald-600 font-medium">₹{route.cost_inr?.toLocaleString()}</td>
                  <td className="py-4">
                    <span className="px-3 py-1 bg-gradient-to-r from-blue-50 to-purple-50 text-blue-600 text-xs font-bold rounded-full border border-blue-200">
                      {route.vehicle_type}
                    </span>
                  </td>
                </tr>
              ))}
              {recentRoutes.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    <Rocket className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                    <p>No routes optimized yet</p>
                    <button 
                      onClick={() => onNavigate('optimizer')}
                      className="mt-3 text-emerald-500 font-medium hover:underline"
                    >
                      Optimize your first route →
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// FREIGHT MARKETPLACE
// ==========================================
function ShipCargoView({ availableTrucks, onNavigate }) {
  const [fromCity, setFromCity] = useState("New Delhi");
  const [toCity, setToCity] = useState("Jaipur");
  const [weight, setWeight] = useState(500);
  const [type, setType] = useState("Standard");
  const [matches, setMatches] = useState(null);
  const [expanded, setExpanded] = useState(null);

  const handleSearch = () => {
    const results = availableTrucks.filter(truck => 
      truck.route.some(r => r.toLowerCase().includes(fromCity.toLowerCase())) &&
      truck.route.some(r => r.toLowerCase().includes(toCity.toLowerCase())) &&
      truck.capacity >= weight &&
      (type === "Standard" || truck.type === type)
    );
    setMatches(results);
  };

  return (
    <div className="p-8 overflow-y-auto h-full bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-800 flex items-center gap-3">
          <Ship className="text-emerald-500" size={32} />
          Find Trucks
        </h1>
        <p className="text-slate-500 mt-1">Search available truck capacity for your cargo</p>
      </div>
      
      {/* Search Card */}
      <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-100 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-600 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-500" /> Origin
            </label>
            <input 
              type="text" 
              className="w-full p-3.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
              value={fromCity} 
              onChange={e => setFromCity(e.target.value)} 
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-600 flex items-center gap-2">
              <Target className="w-4 h-4 text-rose-500" /> Destination
            </label>
            <input 
              type="text" 
              className="w-full p-3.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition-all"
              value={toCity} 
              onChange={e => setToCity(e.target.value)} 
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-600 flex items-center gap-2">
              <Weight className="w-4 h-4 text-amber-500" /> Weight (kg)
            </label>
            <input 
              type="number" 
              className="w-full p-3.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all"
              value={weight} 
              onChange={e => setWeight(e.target.value)} 
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-600 flex items-center gap-2">
              <Box className="w-4 h-4 text-purple-500" /> Cargo Type
            </label>
            <select 
              className="w-full p-3.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
              value={type} 
              onChange={e => setType(e.target.value)}
            >
              <option value="Standard">Standard</option>
              <option value="Perishable">Perishable</option>
              <option value="Hazardous">Hazardous</option>
            </select>
          </div>
        </div>
        <button 
          onClick={handleSearch} 
          className="w-full py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-bold rounded-xl flex justify-center items-center hover:shadow-lg hover:shadow-emerald-500/25 transition-all"
        >
          <Search className="mr-2" /> Search Trucks
        </button>
      </div>

      {/* Results */}
      {matches && (
        <div>
          <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <CheckCircle className="text-emerald-500" /> 
            Available Trucks ({matches.length})
          </h3>
          {matches.length === 0 ? (
            <div className="p-6 bg-rose-50 border border-rose-200 rounded-2xl text-rose-600 text-center">
              No trucks found. Try adjusting your search criteria.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {matches.map(truck => (
                <div 
                  key={truck.id} 
                  className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-bold text-lg text-slate-800">{truck.carrier}</h4>
                      <span className="inline-block mt-2 px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full">
                        {truck.type}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-black text-slate-800">{truck.capacity}</p>
                      <p className="text-xs text-slate-400">kg capacity</p>
                    </div>
                  </div>
                  <p className="text-slate-500 text-sm mb-4 flex items-center gap-2">
                    <RouteIcon className="w-4 h-4" />
                    {truck.route.join(" → ")}
                  </p>
                  <div className="flex gap-3">
                    <button className="flex-1 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-bold rounded-xl hover:shadow-lg transition-all">
                      Book Now
                    </button>
                    <button 
                      onClick={() => setExpanded(expanded === truck.id ? null : truck.id)}
                      className="px-4 py-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition-all"
                    >
                      <Info className="w-5 h-5 text-slate-400" />
                    </button>
                  </div>
                  {expanded === truck.id && (
                    <div className="mt-4 pt-4 border-t border-slate-100">
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="text-slate-400">Location:</span>
                          <p className="font-medium text-slate-700">{truck.current_location || 'Unknown'}</p>
                        </div>
                        <div>
                          <span className="text-slate-400">Rate:</span>
                          <p className="font-bold text-emerald-600">₹{truck.price_per_km || 15}/km</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ==========================================
// LIST FLEET
// ==========================================
function ListFleetView({ refreshTrucks }) {
  const [carrier, setCarrier] = useState("Your Logistics Co.");
  const [route, setRoute] = useState("Chandigarh, New Delhi, Agra");
  const [capacity, setCapacity] = useState(2500);
  const [type, setType] = useState("Standard");
  const [pricePerKm, setPricePerKm] = useState(15);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handlePostTruck = async () => {
    setLoading(true);
    const newTruck = {
      carrier: carrier,
      route: route.split(',').map(s => s.trim()),
      capacity: Number(capacity),
      type: type,
      price_per_km: Number(pricePerKm)
    };

    try {
      await fetch('http://localhost:8000/api/trucks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTruck)
      });
      
      await refreshTrucks();
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      alert("Failed to save!");
    }
    setLoading(false);
  };

  return (
    <div className="p-8 overflow-y-auto h-full bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-800 flex items-center gap-3">
          <Warehouse className="text-blue-500" size={32} />
          List Your Fleet
        </h1>
        <p className="text-slate-500 mt-1">Maximize truck utilization. Reduce empty miles.</p>
      </div>

      <div className="max-w-2xl mx-auto bg-white rounded-2xl p-8 shadow-lg border border-slate-100">
        <div className="space-y-5 mb-8">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-600">Company Name</label>
            <input 
              type="text" 
              className="w-full p-3.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              value={carrier} 
              onChange={e => setCarrier(e.target.value)} 
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-600">Route (comma separated)</label>
            <input 
              type="text" 
              className="w-full p-3.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              value={route} 
              onChange={e => setRoute(e.target.value)} 
              placeholder="Mumbai, Pune, Bangalore"
            />
          </div>
          <div className="grid grid-cols-3 gap-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-600">Capacity (kg)</label>
              <input 
                type="number" 
                className="w-full p-3.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                value={capacity} 
                onChange={e => setCapacity(e.target.value)} 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-600">₹/km</label>
              <input 
                type="number" 
                className="w-full p-3.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                value={pricePerKm} 
                onChange={e => setPricePerKm(e.target.value)} 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-600">Type</label>
              <select 
                className="w-full p-3.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                value={type} 
                onChange={e => setType(e.target.value)}
              >
                <option value="Standard">Standard</option>
                <option value="Perishable">Refrigerated</option>
                <option value="Hazardous">Hazardous</option>
              </select>
            </div>
          </div>
        </div>

        {success ? (
          <div className="py-4 bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold rounded-xl text-center flex items-center justify-center">
            <CheckCircle className="mr-2" /> Successfully Listed!
          </div>
        ) : (
          <button 
            onClick={handlePostTruck} 
            disabled={loading} 
            className="w-full py-4 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-bold rounded-xl hover:shadow-lg transition-all flex items-center justify-center"
          >
            {loading ? "Publishing..." : <><PlusCircle className="mr-2" /> List Fleet Space</>}
          </button>
        )}
      </div>
    </div>
  );
}

// ==========================================
// AI OPTIMIZER
// ==========================================
function AIOptimizerView() {
  const [locations, setLocations] = useState("New Delhi, India\nAgra, India\nJaipur, India\nChandigarh, India");
  const [cargoWeight, setCargoWeight] = useState(800); 
  const [cargoType, setCargoType] = useState("Standard");
  const [maxDeliveryHours, setMaxDeliveryHours] = useState(72);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mapCenter, setMapCenter] = useState([28.6139, 77.2090]);
  const [mapZoom, setMapZoom] = useState(6);
  const [showLayers, setShowLayers] = useState(false);
  const [mapLayer, setMapLayer] = useState('standard');
  const [showSidebar, setShowSidebar] = useState(true);

  const mapLayers = {
    standard: { url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", name: "Standard" },
    satellite: { url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", name: "Satellite" },
    dark: { url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", name: "Dark" },
    terrain: { url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png", name: "Terrain" }
  };

  const handleOptimize = async () => {
    setLoading(true);
    const locationArray = locations.split('\n').filter(loc => loc.trim() !== "");

    try {
      const response = await fetch('http://localhost:8000/api/optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          locations: locationArray, 
          cargo_weight_kg: Number(cargoWeight), 
          cargo_type: cargoType,
          max_delivery_hours: Number(maxDeliveryHours)
        })
      });
      
      const data = await response.json();
      if (data.status === "success") {
        setResults(data);
        setMapCenter(data.coordinates[0]);
        setMapZoom(7);
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert("Backend connection failed!");
    }
    setLoading(false);
  };

  const getRoutePath = () => {
    if (results && results.road_geometry) return results.road_geometry;
    return [];
  };

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <div className={`${showSidebar ? 'w-[400px]' : 'w-0'} transition-all duration-300 overflow-hidden bg-white border-r border-slate-200 flex flex-col shadow-xl`}>
        <div className="p-5 flex-1 overflow-y-auto">
          <div className="flex items-center justify-between mb-5">
            <h1 className="text-xl font-black text-slate-800 flex items-center gap-2">
              <Brain className="text-emerald-500" />
              AI Route Engine
            </h1>
            <button onClick={() => setShowSidebar(false)} className="p-2 hover:bg-slate-100 rounded-lg">
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </div>

          <div className="space-y-4 mb-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-600 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-500" /> Delivery Stops
              </label>
              <textarea 
                className="w-full p-3.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none text-sm" 
                rows="4" 
                value={locations} 
                onChange={(e) => setLocations(e.target.value)} 
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-600 flex items-center gap-2">
                  <Weight className="w-4 h-4 text-amber-500" /> Weight (kg)
                </label>
                <input 
                  type="number" 
                  className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                  value={cargoWeight} 
                  onChange={(e) => setCargoWeight(e.target.value)} 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-600 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-purple-500" /> Deadline (hrs)
                </label>
                <input 
                  type="number" 
                  className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
                  value={maxDeliveryHours} 
                  onChange={(e) => setMaxDeliveryHours(e.target.value)} 
                />
              </div>
            </div>
          </div>

          <button 
            onClick={handleOptimize} 
            disabled={loading} 
            className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-emerald-500/25 flex justify-center items-center mb-5"
          >
            {loading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                Optimizing...
              </div>
            ) : (
              <><Zap className="mr-2" /> Optimize Route</>
            )}
          </button>

          {/* Results */}
          {results && results.status === "success" && (
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-emerald-50 to-cyan-50 rounded-xl p-4 border border-emerald-200">
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center">
                    <p className="text-2xl font-black text-slate-800">{results.total_distance_km}</p>
                    <p className="text-xs text-slate-500">Distance (km)</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-black text-emerald-600">₹{results.trip_cost_inr}</p>
                    <p className="text-xs text-slate-500">Est. Cost</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 rounded-xl p-3 text-center">
                  <Truck className="w-5 h-5 text-blue-500 mx-auto mb-1" />
                  <p className="text-sm font-bold text-slate-700">{results.vehicle_recommended}</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-3 text-center">
                  <Wind className="w-5 h-5 text-cyan-500 mx-auto mb-1" />
                  <p className="text-sm font-bold text-slate-700">{results.co2_emissions_kg} kg CO₂</p>
                </div>
              </div>

              {results.pooling_opportunities && results.pooling_opportunities.length > 0 && (
                <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
                  <h4 className="text-sm font-bold text-amber-700 mb-2 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" /> LTL Opportunities
                  </h4>
                  {results.pooling_opportunities.map((pool, idx) => (
                    <div key={idx} className="flex justify-between text-sm mb-1">
                      <span className="text-slate-600">{pool.city}</span>
                      <span className="text-emerald-600 font-bold">+₹{pool.revenue_inr}</span>
                    </div>
                  ))}
                </div>
              )}

              {results.backhaul_opportunity && (
                <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
                  <h4 className="text-sm font-bold text-purple-700 mb-2 flex items-center gap-2">
                    <RefreshCw className="w-4 h-4" /> Backhaul
                  </h4>
                  <p className="text-sm text-slate-600">
                    {results.backhaul_opportunity.from_city} → {results.backhaul_opportunity.to_city}
                  </p>
                  <p className="text-emerald-600 font-bold">+₹{results.backhaul_opportunity.revenue_inr}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Map */}
      <div className="flex-1 relative">
        {!showSidebar && (
          <button 
            onClick={() => setShowSidebar(true)}
            className="absolute top-4 left-4 z-[1000] bg-white p-3 rounded-xl shadow-lg hover:shadow-xl"
          >
            <Menu className="w-5 h-5 text-slate-700" />
          </button>
        )}

        <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
          <button 
            onClick={() => setShowLayers(!showLayers)}
            className="bg-white p-3 rounded-xl shadow-lg hover:shadow-xl"
          >
            <Layers className="w-5 h-5 text-slate-700" />
          </button>
          {showLayers && (
            <div className="bg-white rounded-xl shadow-xl p-2">
              {Object.entries(mapLayers).map(([key, layer]) => (
                <button
                  key={key}
                  onClick={() => { setMapLayer(key); setShowLayers(false); }}
                  className={`block w-full text-left px-4 py-2 text-sm rounded-lg ${
                    mapLayer === key ? 'bg-emerald-100 text-emerald-700' : 'hover:bg-slate-100'
                  }`}
                >
                  {layer.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {results && results.weather && (
          <div className="absolute top-4 left-4 z-[1000] bg-white/90 backdrop-blur p-3 rounded-xl shadow-lg">
            <div className="flex items-center gap-2">
              <Thermometer className="w-5 h-5 text-cyan-500" />
              <span className="text-sm font-medium text-slate-700">
                {results.weather.condition} • {results.weather.temperature_celsius}°C
              </span>
            </div>
          </div>
        )}

        <MapContainer center={mapCenter} zoom={mapZoom} className="w-full h-full">
          <ChangeView center={mapCenter} zoom={mapZoom} />
          <TileLayer url={mapLayers[mapLayer].url} />
          
          {results && results.coordinates && results.coordinates.map((coord, idx) => (
            <CircleMarker 
              key={idx} 
              center={coord}
              radius={10}
              pathOptions={{ 
                color: '#10b981', 
                fillColor: '#34d399', 
                fillOpacity: 0.9,
                weight: 3
              }}
            >
              <Popup>
                <div className="text-center">
                  <p className="font-bold">{results.valid_locations[idx]}</p>
                  <p className="text-sm text-gray-500">Stop #{idx + 1}</p>
                </div>
              </Popup>
            </CircleMarker>
          ))}
          
          {results && <Polyline positions={getRoutePath()} color="#10b981" weight={5} opacity={0.8} dashArray="10, 10" />}
        </MapContainer>
      </div>
    </div>
  );
}

// ==========================================
// MAIN APP
// ==========================================
function AppContent() {
  const [activeTab, setActiveTab] = useState('landing');
  const [availableTrucks, setAvailableTrucks] = useState([]);

  const fetchTrucks = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/trucks');
      const data = await response.json();
      if (data.status === "success") {
        setAvailableTrucks(data.trucks);
      }
    } catch (error) {
      console.error("Failed to fetch trucks:", error);
    }
  };

  useEffect(() => {
    fetchTrucks();
  }, []);

  const handleGetStarted = () => {
    setActiveTab('dashboard');
  };

  const handleNavigate = (tab) => {
    setActiveTab(tab);
  };

  const navItems = [
    { id: 'dashboard', icon: BarChart3, label: 'Dashboard', color: 'from-blue-500 to-indigo-500' },
    { id: 'ship', icon: Ship, label: 'Find Trucks', color: 'from-emerald-500 to-cyan-500' },
    { id: 'list', icon: Warehouse, label: 'List Fleet', color: 'from-purple-500 to-pink-500' },
    { id: 'optimizer', icon: Brain, label: 'AI Engine', color: 'from-amber-500 to-orange-500' },
    { id: 'pricing', icon: Calculator, label: 'Pricing', color: 'from-rose-500 to-red-500' },
    { id: 'demand', icon: TrendingUp, label: 'Demand', color: 'from-violet-500 to-purple-500' },
    { id: 'digital', icon: Network, label: 'Digital Twin', color: 'from-cyan-500 to-blue-500' },
    { id: 'copilot', icon: Bot, label: 'Copilot', color: 'from-green-500 to-emerald-500' },
  ];

  return (
    <div className="flex flex-col h-screen bg-slate-50 font-sans">
      {activeTab !== 'landing' && (
        <nav className="bg-white border-b border-slate-200 px-6 py-3 flex justify-between items-center shadow-sm z-20">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-lg">
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-slate-800">EcoRoute</span>
            </div>
            <span className="px-2 py-0.5 bg-gradient-to-r from-emerald-100 to-cyan-100 text-emerald-600 text-xs font-bold rounded-full">PRO</span>
          </div>
          
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map(item => (
              <button 
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-4 py-2 rounded-xl font-medium flex items-center gap-2 transition-all ${
                  activeTab === item.id 
                    ? `bg-gradient-to-r ${item.color} text-white shadow-md` 
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <item.icon className="w-4 h-4" />
                <span className="hidden xl:inline">{item.label}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-full">
              <Wifi className="w-4 h-4 text-emerald-500" />
              <span className="text-xs text-emerald-600 font-medium">Online</span>
            </div>
          </div>
        </nav>
      )}

      {/* Mobile Nav */}
      {activeTab !== 'landing' && (
        <div className="lg:hidden bg-white px-2 py-2 flex justify-around border-b border-slate-200">
          {navItems.slice(0, 5).map(item => (
            <button 
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`p-2 rounded-xl flex flex-col items-center ${
                activeTab === item.id ? 'text-emerald-600' : 'text-slate-400'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-[10px] mt-1">{item.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-hidden">
        {activeTab === 'landing' && <LandingPage onGetStarted={handleGetStarted} />}
        {activeTab === 'dashboard' && <AnalyticsDashboard onNavigate={handleNavigate} />}
        {activeTab === 'ship' && <ShipCargoView availableTrucks={availableTrucks} onNavigate={handleNavigate} />}
        {activeTab === 'list' && <ListFleetView refreshTrucks={fetchTrucks} />}
        {activeTab === 'optimizer' && <AIOptimizerView />}
        {activeTab === 'pricing' && <PricingCalculatorPage />}
        {activeTab === 'demand' && <DemandForecastPage />}
        {activeTab === 'digital' && <DigitalTwinPage />}
        {activeTab === 'copilot' && <CopilotPage />}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

