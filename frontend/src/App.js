// App.js - Beast Mode Enhanced Version
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap, CircleMarker } from 'react-leaflet';
import { 
  Leaf, Milestone as RouteIcon, MapPin, Package, Weight, Info, RefreshCw, 
  IndianRupee, Truck, Search, PlusCircle, CheckCircle, Sun, Moon, BarChart3,
  Zap, TrendingUp, Wind, Cloud, Gauge, DollarSign, Map, Navigation, Clock,
  ArrowRight, Activity, Layers, Settings, Home, X, Menu
} from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';

// Fix Leaflet marker icons
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({
  iconUrl: icon, 
  shadowUrl: iconShadow, 
  iconSize: [25, 41], 
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Custom vehicle icons
const createVehicleIcon = (type) => {
  const colors = {
    'electric': '#22c55e',
    'diesel': '#f59e0b',
    'hybrid': '#8b5cf6',
    'default': '#3b82f6'
  };
  return L.divIcon({
    className: 'vehicle-marker',
    html: `<div style="
      background: ${colors[type] || colors.default};
      width: 30px;
      height: 30px;
      border-radius: 50%;
      border: 3px solid white;
      box-shadow: 0 2px 10px rgba(0,0,0,0.3);
      display: flex;
      align-items: center;
      justify-content: center;
    "><svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M18 18.5c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5-1.5.67-1.5 1.5.67 1.5 1.5 1.5zM19.5 9.5l1.96 2.5H17V9.5h2.5m-12 9c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5-1.5.67-1.5 1.5.67 1.5 1.5 1.5M20 8h-3V4H3c-1.11 0-2 .89-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4z"/></svg></div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15]
  });
};

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
// DASHBOARD STATS CARD
// ==========================================
function StatsCard({ icon: Icon, title, value, unit, color, trend }) {
  const colors = {
    green: 'from-green-500 to-emerald-600',
    blue: 'from-blue-500 to-cyan-600',
    purple: 'from-purple-500 to-pink-600',
    orange: 'from-orange-500 to-red-600',
    indigo: 'from-indigo-500 to-violet-600'
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700">
      <div className="flex items-center justify-between">
        <div className={`p-3 rounded-xl bg-gradient-to-br ${colors[color] || colors.blue} text-white`}>
          <Icon size={24} />
        </div>
        {trend && (
          <span className={`text-sm font-bold ${trend > 0 ? 'text-green-500' : 'text-red-500'} flex items-center`}>
            {trend > 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
      <div className="mt-4">
        <p className="text-gray-500 dark:text-gray-400 text-sm">{title}</p>
        <p className="text-2xl font-black text-gray-800 dark:text-white mt-1">
          {value}
          <span className="text-sm font-normal text-gray-500 ml-1">{unit}</span>
        </p>
      </div>
    </div>
  );
}

// ==========================================
// ANALYTICS DASHBOARD
// ==========================================
function AnalyticsDashboard() {
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

  // Sample data for charts
  const carbonData = [
    { month: 'Jan', co2: 1200, saved: 300 },
    { month: 'Feb', co2: 1400, saved: 350 },
    { month: 'Mar', co2: 1100, saved: 400 },
    { month: 'Apr', co2: 1600, saved: 280 },
    { month: 'May', co2: 1300, saved: 450 },
    { month: 'Jun', co2: 1000, saved: 500 },
  ];

  const vehicleDistribution = [
    { name: 'Electric', value: 25, color: '#22c55e' },
    { name: 'Diesel', value: 45, color: '#f59e0b' },
    { name: 'Hybrid', value: 20, color: '#8b5cf6' },
    { name: 'CNG', value: 10, color: '#06b6d4' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="p-8 overflow-y-auto h-full bg-gray-50 dark:bg-gray-900">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-800 dark:text-white flex items-center gap-3">
          <BarChart3 className="text-green-600" size={32} />
          Analytics Dashboard
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">Real-time logistics performance metrics</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard 
          icon={Truck} 
          title="Active Trucks" 
          value={analytics?.total_trucks || 0} 
          unit="vehicles"
          color="blue"
          trend={12}
        />
        <StatsCard 
          icon={Package} 
          title="Total Shipments" 
          value={analytics?.total_shipments || 0} 
          unit="orders"
          color="purple"
          trend={8}
        />
        <StatsCard 
          icon={RouteIcon} 
          title="Total Distance" 
          value={Math.round(analytics?.total_distance_km || 0)} 
          unit="km"
          color="green"
          trend={15}
        />
        <StatsCard 
          icon={Wind} 
          title="CO₂ Emissions" 
          value={Math.round(analytics?.total_co2_kg || 0)} 
          unit="kg"
          color="orange"
          trend={-5}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Carbon Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Carbon Footprint Trend</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={carbonData}>
              <defs>
                <linearGradient id="colorCo2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
              />
              <Area type="monotone" dataKey="co2" stroke="#f59e0b" fillOpacity={1} fill="url(#colorCo2)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Vehicle Distribution */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Fleet Composition</h3>
          <ResponsiveContainer width="100%" height={250}>
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
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Recent Route Optimizations</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-gray-500 dark:text-gray-400 text-sm border-b border-gray-200 dark:border-gray-700">
                <th className="pb-3">Route</th>
                <th className="pb-3">Distance</th>
                <th className="pb-3">CO₂</th>
                <th className="pb-3">Cost</th>
                <th className="pb-3">Vehicle</th>
              </tr>
            </thead>
            <tbody>
              {recentRoutes.map((route, idx) => (
                <tr key={idx} className="border-b border-gray-100 dark:border-gray-700">
                  <td className="py-3 text-gray-800 dark:text-white">{route.route?.join(' → ')}</td>
                  <td className="py-3 text-gray-600 dark:text-gray-300">{route.distance_km} km</td>
                  <td className="py-3 text-orange-500">{route.co2_kg} kg</td>
                  <td className="py-3 text-green-600">₹{route.cost_inr}</td>
                  <td className="py-3">
                    <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                      {route.vehicle_type}
                    </span>
                  </td>
                </tr>
              ))}
              {recentRoutes.length === 0 && (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-gray-500">No recent routes</td>
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
// SHIPPER VIEW - ENHANCED
// ==========================================
function ShipCargoView({ availableTrucks }) {
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
    <div className="p-8 max-w-6xl mx-auto overflow-y-auto h-full bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <h2 className="text-3xl font-black text-gray-800 dark:text-white mb-6 flex items-center">
        <Package className="mr-3 w-8 h-8 text-green-600"/> 
        Find LTL Cargo Space
      </h2>
      
      {/* Search Form */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl mb-8 border border-gray-100 dark:border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Origin City</label>
            <input 
              type="text" 
              className="w-full p-3 border rounded-xl bg-gray-50 dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-green-500 outline-none transition"
              value={fromCity} 
              onChange={e => setFromCity(e.target.value)} 
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Destination City</label>
            <input 
              type="text" 
              className="w-full p-3 border rounded-xl bg-gray-50 dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-green-500 outline-none transition"
              value={toCity} 
              onChange={e => setToCity(e.target.value)} 
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Weight (kg)</label>
            <input 
              type="number" 
              className="w-full p-3 border rounded-xl bg-gray-50 dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-green-500 outline-none transition"
              value={weight} 
              onChange={e => setWeight(e.target.value)} 
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Cargo Type</label>
            <select 
              className="w-full p-3 border rounded-xl bg-gray-50 dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-green-500 outline-none transition"
              value={type} 
              onChange={e => setType(e.target.value)}
            >
              <option value="Standard">Standard</option>
              <option value="Perishable">Perishable (Fast Track)</option>
              <option value="Hazardous">Hazardous</option>
            </select>
          </div>
        </div>
        <button 
          onClick={handleSearch} 
          className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-4 rounded-xl flex justify-center items-center transition-all transform hover:scale-[1.02] shadow-lg"
        >
          <Search className="mr-2" /> Scan Live Marketplace
        </button>
      </div>

      {/* Results */}
      {matches && (
        <div>
          <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
            Available Fleet Matches ({matches.length})
          </h3>
          {matches.length === 0 ? (
            <div className="p-6 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-xl border border-red-200 dark:border-red-800">
              No trucks currently matching your route and capacity. Try expanding your search.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {matches.map(truck => (
                <div 
                  key={truck.id} 
                  className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-md border border-green-100 dark:border-gray-700 hover:shadow-xl transition-all"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-black text-lg text-gray-800 dark:text-white">{truck.carrier}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300 px-2 py-1 rounded text-xs font-bold mr-2">{truck.type}</span>
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-black text-green-600">{truck.capacity}</p>
                      <p className="text-xs text-gray-500">kg available</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 flex items-center">
                    <RouteIcon className="w-4 h-4 mr-2" />
                    {truck.route.join(" → ")}
                  </p>
                  <div className="flex gap-2">
                    <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition">
                      Book Space
                    </button>
                    <button 
                      onClick={() => setExpanded(expanded === truck.id ? null : truck.id)}
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                    >
                      Details
                    </button>
                  </div>
                  {expanded === truck.id && (
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-gray-500">Current Location:</span>
                          <p className="font-bold text-gray-800 dark:text-white">{truck.current_location || 'Unknown'}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Price/km:</span>
                          <p className="font-bold text-green-600">₹{truck.price_per_km || 15}</p>
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
// CARRIER VIEW - ENHANCED
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
      alert("Failed to save to database!");
    }
    setLoading(false);
  };

  return (
    <div className="p-8 max-w-3xl mx-auto overflow-y-auto h-full bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <h2 className="text-3xl font-black text-gray-800 dark:text-white mb-2 flex items-center">
        <Truck className="mr-3 w-8 h-8 text-blue-600"/> 
        Post Available Fleet Space
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mb-8">Reduce empty miles. List your truck's route and available capacity.</p>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700">
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Transport Company Name</label>
            <input 
              type="text" 
              className="w-full p-3 border rounded-xl bg-gray-50 dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none transition"
              value={carrier} 
              onChange={e => setCarrier(e.target.value)} 
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Planned Route (Comma separated cities)</label>
            <input 
              type="text" 
              className="w-full p-3 border rounded-xl bg-gray-50 dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none transition"
              value={route} 
              onChange={e => setRoute(e.target.value)} 
              placeholder="e.g. New Delhi, Agra, Kanpur" 
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Available Capacity (kg)</label>
              <input 
                type="number" 
                className="w-full p-3 border rounded-xl bg-gray-50 dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none transition"
                value={capacity} 
                onChange={e => setCapacity(e.target.value)} 
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Price per km (₹)</label>
              <input 
                type="number" 
                className="w-full p-3 border rounded-xl bg-gray-50 dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none transition"
                value={pricePerKm} 
                onChange={e => setPricePerKm(e.target.value)} 
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Vehicle Type</label>
              <select 
                className="w-full p-3 border rounded-xl bg-gray-50 dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none transition"
                value={type} 
                onChange={e => setType(e.target.value)}
              >
                <option value="Standard">Standard Freight</option>
                <option value="Perishable">Refrigerated</option>
                <option value="Hazardous">Hazardous</option>
              </select>
            </div>
          </div>
        </div>

        {success ? (
          <div className="w-full bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 font-bold py-4 rounded-xl flex justify-center items-center">
            <CheckCircle className="mr-2" /> Saved to Live Database!
          </div>
        ) : (
          <button 
            onClick={handlePostTruck} 
            disabled={loading} 
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 rounded-xl flex justify-center items-center transition-all transform hover:scale-[1.02] shadow-lg"
          >
            {loading ? "Saving..." : <><PlusCircle className="mr-2" /> Post to Marketplace</>}
          </button>
        )}
      </div>
    </div>
  );
}

// ==========================================
// AI OPTIMIZER VIEW - ENHANCED
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
    <div className="flex h-full bg-gray-50 dark:bg-gray-900 font-sans text-gray-800 dark:text-gray-100">
      {/* Sidebar */}
      <div className="w-[400px] p-6 bg-white dark:bg-gray-800 shadow-2xl z-10 flex flex-col overflow-y-auto border-r border-gray-200 dark:border-gray-700">
        <h1 className="text-2xl font-black text-green-600 flex items-center mb-6 tracking-tight">
          <Leaf className="mr-2" /> AI Route Engine
        </h1>

        <div className="mb-4">
          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 flex items-center">
            <MapPin className="mr-1 w-4 h-4 text-green-600" /> Stop List (Addresses)
          </label>
          <textarea 
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 outline-none text-sm bg-gray-50 dark:bg-gray-700 transition" 
            rows="4" 
            value={locations} 
            onChange={(e) => setLocations(e.target.value)} 
          />
        </div>

        <div className="flex gap-3 mb-6">
          <div className="flex-1">
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 flex items-center">
              <Weight className="mr-1 w-4 h-4 text-green-600" /> Weight (kg)
            </label>
            <input 
              type="number" 
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 outline-none bg-gray-50 dark:bg-gray-700 transition" 
              value={cargoWeight} 
              onChange={(e) => setCargoWeight(e.target.value)} 
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 flex items-center">
              <Package className="mr-1 w-4 h-4 text-green-600" /> Cargo Type
            </label>
            <select 
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 outline-none bg-gray-50 dark:bg-gray-700 transition" 
              value={cargoType} 
              onChange={(e) => setCargoType(e.target.value)}
            >
              <option value="Standard">Standard</option>
              <option value="Perishable">Perishable</option>
              <option value="Hazardous">Hazardous</option>
            </select>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 flex items-center">
            <Clock className="mr-1 w-4 h-4 text-green-600" /> Time Limit (Hours)
          </label>
          <input 
            type="number" 
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 outline-none bg-gray-50 dark:bg-gray-700 transition" 
            value={maxDeliveryHours} 
            onChange={(e) => setMaxDeliveryHours(e.target.value)} 
          />
        </div>

        <button 
          onClick={handleOptimize} 
          disabled={loading} 
          className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-4 px-4 rounded-xl shadow-lg transition-all flex justify-center items-center active:scale-95 mb-6"
        >
          {loading ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Crunching Logistics...
            </div>
          ) : (
            <><RouteIcon className="mr-2" /> Auto-Dispatch Route</>
          )}
        </button>

        {/* Results Panel */}
        {results && results.status === "success" && (
          <div className="flex-1 overflow-y-auto pb-4">
            {/* Trip Overview */}
            <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 rounded-xl mb-4">
              <h3 className="text-sm font-bold text-green-800 dark:text-green-300 uppercase tracking-wider mb-3 flex items-center">
                <Zap className="w-4 h-4 mr-1"/> Trip Overview
              </h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400 flex items-center">
                    <Truck className="w-4 h-4 mr-1"/> Vehicle:
                  </span>
                  <span className="font-bold text-blue-600 bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-full text-sm">
                    {results.vehicle_recommended}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Capacity Used:</span>
                  <span className={`font-bold ${results.capacity_utilization_percent < 50 ? 'text-red-500' : 'text-green-600'}`}>
                    {results.capacity_utilization_percent}%
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400 flex items-center">
                    <RouteIcon className="w-4 h-4 mr-1"/> Distance:
                  </span>
                  <span className="font-bold text-gray-800 dark:text-white">{results.total_distance_km} km</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400 flex items-center">
                    <Wind className="w-4 h-4 mr-1"/> Carbon:
                  </span>
                  <span className="font-bold text-green-600">{results.co2_emissions_kg} kg CO₂</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400 flex items-center">
                    <IndianRupee className="w-4 h-4 mr-1"/> Est. Cost:
                  </span>
                  <span className="font-bold text-gray-800 dark:text-white text-lg">₹{results.trip_cost_inr}</span>
                </div>

                {/* Route Efficiency */}
                {results.route_efficiency && (
                  <div className="pt-3 border-t border-green-200 dark:border-green-800 mt-3">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-gray-500">Efficiency Score</span>
                      <span className="font-bold text-purple-600">{results.route_efficiency.efficiency_score}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full" 
                        style={{ width: `${results.route_efficiency.efficiency_score}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* AI Reasoning */}
            {results.ai_reasoning && (
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl mb-4">
                <p className="text-xs text-blue-800 dark:text-blue-300">
                  <span className="font-bold">AI:</span> {results.ai_reasoning}
                </p>
              </div>
            )}

            {/* Pooling Opportunities */}
            {results.pooling_opportunities && results.pooling_opportunities.length > 0 && (
              <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl mb-4">
                <h3 className="text-sm font-bold text-amber-800 dark:text-amber-300 flex items-center mb-2">
                  <Package className="w-4 h-4 mr-1"/> LTL Pooling Opportunities
                </h3>
                {results.pooling_opportunities.map((pool, idx) => (
                  <div key={idx} className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-amber-100 dark:border-amber-900 text-sm mb-2">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-gray-800 dark:text-white">{pool.city}</span>
                      <span className="text-green-600 font-bold">+₹{pool.revenue_inr}</span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 text-xs">{pool.item} • {pool.weight}kg</p>
                  </div>
                ))}
              </div>
            )}

            {/* Backhaul */}
            {results.backhaul_opportunity && (
              <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl mb-4">
                <h3 className="text-sm font-bold text-emerald-800 dark:text-emerald-300 flex items-center mb-2">
                  <RefreshCw className="w-4 h-4 mr-1"/> Backhaul Opportunity
                </h3>
                <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-emerald-100 dark:border-emerald-900">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-gray-800 dark:text-white">
                      {results.backhaul_opportunity.from_city} → {results.backhaul_opportunity.to_city}
                    </span>
                    <span className="text-green-600 font-bold">+₹{results.backhaul_opportunity.revenue_inr}</span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-xs">
                    {results.backhaul_opportunity.item} • {results.backhaul_opportunity.weight}kg
                  </p>
                </div>
              </div>
            )}

            {/* Opportunity Summary */}
            {results.opportunity_summary && (
              <div className="p-4 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 border border-purple-200 dark:border-purple-800 rounded-xl">
                <h3 className="text-sm font-bold text-purple-800 dark:text-purple-300 mb-3 flex items-center">
                  <TrendingUp className="w-4 h-4 mr-1"/> Revenue Opportunities
                </h3>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-white dark:bg-gray-800 p-2 rounded-lg">
                    <p className="text-xs text-gray-500">Additional</p>
                    <p className="font-bold text-green-600">₹{results.opportunity_summary.total_additional_revenue}</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-2 rounded-lg">
                    <p className="text-xs text-gray-500">Miles Saved</p>
                    <p className="font-bold text-blue-600">{results.opportunity_summary.total_empty_miles_saved} km</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-2 rounded-lg">
                    <p className="text-xs text-gray-500">CO₂ Saved</p>
                    <p className="font-bold text-emerald-600">{results.opportunity_summary.total_co2_saved} kg</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Map Area */}
      <div className="flex-1 relative">
        {/* Map Layer Controls */}
        <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
          <button 
            onClick={() => setShowLayers(!showLayers)}
            className="bg-white dark:bg-gray-800 p-2 rounded-lg shadow-lg hover:shadow-xl transition"
          >
            <Layers className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          </button>
          {showLayers && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-2">
              {Object.entries(mapLayers).map(([key, layer]) => (
                <button
                  key={key}
                  onClick={() => { setMapLayer(key); setShowLayers(false); }}
                  className={`block w-full text-left px-3 py-2 text-sm rounded ${
                    mapLayer === key 
                      ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300' 
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  {layer.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Weather Badge */}
        {results && results.weather && (
          <div className="absolute top-4 left-4 z-[1000] bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-3 rounded-xl shadow-lg">
            <div className="flex items-center gap-2">
              <Cloud className="w-5 h-5 text-gray-600" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {results.weather.condition} • {results.weather.temperature_celsius}°C
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">{results.weather.advisory}</p>
          </div>
        )}

        <MapContainer center={mapCenter} zoom={mapZoom} className="w-full h-full z-0">
          <ChangeView center={mapCenter} zoom={mapZoom} />
          <TileLayer 
            attribution='&copy; OpenStreetMap' 
            url={mapLayers[mapLayer].url} 
          />
          
          {/* Route Markers */}
          {results && results.coordinates && results.coordinates.map((coord, idx) => (
            <CircleMarker 
              key={idx} 
              center={coord}
              radius={8}
              pathOptions={{ 
                color: '#16a34a', 
                fillColor: '#22c55e', 
                fillOpacity: 0.8,
                weight: 2
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
          
          {/* Route Line */}
          {results && <Polyline positions={getRoutePath()} color="#16a34a" weight={5} opacity={0.8} dashArray="10, 10" />}
        </MapContainer>
      </div>
    </div>
  );
}

// ==========================================
// MAIN APP SHELL
// ==========================================
function AppContent() {
  const [activeTab, setActiveTab] = useState('optimizer');
  const [availableTrucks, setAvailableTrucks] = useState([]);
  const { darkMode, toggleTheme } = React.useContext(ThemeContext);
  const [sidebarOpen, setSidebarOpen] = useState(true);

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

  const navItems = [
    { id: 'dashboard', icon: BarChart3, label: 'Dashboard' },
    { id: 'ship', icon: Package, label: 'Ship Cargo' },
    { id: 'list', icon: Truck, label: 'List Fleet' },
    { id: 'optimizer', icon: RouteIcon, label: 'AI Engine' },
  ];

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900 font-sans text-gray-800 dark:text-gray-100">
      {/* Top Navigation */}
      <nav className="bg-gradient-to-r from-green-800 to-green-900 dark:from-gray-800 dark:to-gray-900 text-white shadow-2xl p-4 flex justify-between items-center z-20">
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 hover:bg-green-700 rounded-lg transition"
          >
            <Menu className="w-6 h-6" />
          </button>
          <Leaf className="w-8 h-8 text-green-400" />
          <span className="text-xl font-black tracking-tight hidden sm:block">EcoRoute Network</span>
        </div>
        
        {/* Desktop Nav */}
        <div className="hidden lg:flex space-x-2">
          {navItems.map(item => (
            <button 
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`px-4 py-2.5 rounded-xl font-bold flex items-center transition-all ${
                activeTab === item.id 
                  ? 'bg-white/20 shadow-inner' 
                  : 'hover:bg-white/10'
              }`}
            >
              <item.icon className="w-5 h-5 mr-2"/> 
              <span className="hidden xl:inline">{item.label}</span>
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-3">
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-xl hover:bg-white/10 transition"
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Nav */}
      <div className="lg:hidden bg-green-900 dark:bg-gray-800 p-2 flex justify-around">
        {navItems.map(item => (
          <button 
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`p-2 rounded-lg flex flex-col items-center ${
              activeTab === item.id 
                ? 'bg-white/20' 
                : ''
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span className="text-xs mt-1">{item.label}</span>
          </button>
        ))}
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden relative">
        {activeTab === 'dashboard' && <AnalyticsDashboard />}
        {activeTab === 'ship' && <ShipCargoView availableTrucks={availableTrucks} />}
        {activeTab === 'list' && <ListFleetView refreshTrucks={fetchTrucks} />}
        {activeTab === 'optimizer' && <AIOptimizerView />}
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

