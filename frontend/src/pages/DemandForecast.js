/**
 * Demand Forecast Page
 * ML-powered demand prediction and forecasting
 */

import React, { useState, useEffect } from 'react';
import { TrendingUp, Calendar, Milestone, Truck, AlertTriangle, BarChart3 } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function DemandForecastPage() {
  const [route, setRoute] = useState('Delhi-Mumbai');
  const [forecast, setForecast] = useState(null);
  const [trends, setTrends] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(false);

  const routes = [
    'Delhi-Mumbai',
    'Delhi-Bangalore',
    'Mumbai-Bangalore',
    'Chennai-Hyderabad',
    'Kolkata-Delhi',
    'Pune-Mumbai'
  ];

  // Mock forecast data
  const mockForecast = [
    { date: 'Mon', demand: 0.75, volume: 75, trucks: 5 },
    { date: 'Tue', demand: 0.65, volume: 65, trucks: 4 },
    { date: 'Wed', demand: 0.70, volume: 70, trucks: 5 },
    { date: 'Thu', demand: 0.80, volume: 80, trucks: 5 },
    { date: 'Fri', demand: 0.90, volume: 90, trucks: 6 },
    { date: 'Sat', demand: 0.55, volume: 55, trucks: 4 },
    { date: 'Sun', demand: 0.45, volume: 45, trucks: 3 }
  ];

  const mockTrends = [
    { route: 'Delhi-Mumbai', demand: 0.85, trend: 'increasing' },
    { route: 'Mumbai-Bangalore', demand: 0.78, trend: 'stable' },
    { route: 'Chennai-Hyderabad', demand: 0.65, trend: 'decreasing' },
    { route: 'Kolkata-Delhi', demand: 0.72, trend: 'stable' }
  ];

  const mockAlerts = [
    { route: 'Delhi-Mumbai', level: 'HIGH', message: 'High demand expected. Recommend 8+ trucks.' },
    { route: 'Pune-Mumbai', level: 'MEDIUM', message: 'Moderate demand. Book early for best rates.' }
  ];

  useEffect(() => {
    setForecast(mockForecast);
    setTrends(mockTrends);
    setAlerts(mockAlerts);
  }, [route]);

  const getDemandLevel = (score) => {
    if (score >= 0.8) return { label: 'CRITICAL', color: 'red' };
    if (score >= 0.6) return { label: 'HIGH', color: 'orange' };
    if (score >= 0.4) return { label: 'MODERATE', color: 'yellow' };
    return { label: 'LOW', color: 'green' };
  };

  return (
    <div className="p-8 h-full overflow-y-auto bg-gray-50 dark:bg-gray-900">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-800 dark:text-white flex items-center gap-3">
          <TrendingUp className="text-purple-600" size={32} />
          Demand Forecast
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          AI-powered demand prediction for logistics planning
        </p>
      </div>

      {/* Route Selector */}
      <div className="mb-6">
        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
          Select Route
        </label>
        <select
          value={route}
          onChange={(e) => setRoute(e.target.value)}
          className="w-full md:w-64 p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 focus:ring-2 focus:ring-purple-500"
        >
          {routes.map(r => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <div className="mb-6">
          {alerts.map((alert, idx) => (
            <div 
              key={idx}
              className={`p-4 rounded-xl border mb-2 flex items-center gap-3 ${
                alert.level === 'HIGH' 
                  ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800' 
                  : 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'
              }`}
            >
              <AlertTriangle className={`w-5 h-5 ${
                alert.level === 'HIGH' ? 'text-red-500' : 'text-yellow-500'
              }`} />
              <div>
                <p className="font-bold text-gray-800 dark:text-white">{alert.route}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{alert.message}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="text-purple-500" size={20} />
            <span className="text-gray-500 dark:text-gray-400">Avg Demand</span>
          </div>
          <p className="text-2xl font-black text-gray-800 dark:text-white">68%</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow">
          <div className="flex items-center gap-3 mb-2">
            <Route className="text-blue-500" size={20} />
            <span className="text-gray-500 dark:text-gray-400">Peak Day</span>
          </div>
          <p className="text-2xl font-black text-gray-800 dark:text-white">Friday</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow">
          <div className="flex items-center gap-3 mb-2">
            <Truck className="text-green-500" size={20} />
            <span className="text-gray-500 dark:text-gray-400">Trucks Needed</span>
          </div>
          <p className="text-2xl font-black text-gray-800 dark:text-white">32</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow">
          <div className="flex items-center gap-3 mb-2">
            <BarChart3 className="text-orange-500" size={20} />
            <span className="text-gray-500 dark:text-gray-400">Volume (Tons)</span>
          </div>
          <p className="text-2xl font-black text-gray-800 dark:text-white">480</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Demand Forecast Chart */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">
            7-Day Demand Forecast
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={forecast}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" stroke="#6b7280" />
              <YAxis stroke="#6b7280" domain={[0, 1]} />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="demand" 
                stroke="#8b5cf6" 
                strokeWidth={3}
                name="Demand Score"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Volume Chart */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">
            Predicted Volume (Tons)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={forecast}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
              />
              <Bar dataKey="volume" fill="#10b981" radius={[4, 4, 0, 0]} name="Volume (Tons)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Route Trends */}
      <div className="mt-6 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow">
        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">
          Route Demand Trends
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-gray-500 dark:text-gray-400 text-sm border-b border-gray-200 dark:border-gray-700">
                <th className="pb-3">Route</th>
                <th className="pb-3">Demand Score</th>
                <th className="pb-3">Level</th>
                <th className="pb-3">Trend</th>
              </tr>
            </thead>
            <tbody>
              {trends.map((t, idx) => {
                const level = getDemandLevel(t.demand);
                return (
                  <tr key={idx} className="border-b border-gray-100 dark:border-gray-700">
                    <td className="py-3 font-medium text-gray-800 dark:text-white">{t.route}</td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-purple-500 h-2 rounded-full" 
                            style={{ width: `${t.demand * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">{Math.round(t.demand * 100)}%</span>
                      </div>
                    </td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold bg-${level.color}-100 text-${level.color}-700 dark:bg-${level.color}-900 dark:text-${level.color}-300`}>
                        {level.label}
                      </span>
                    </td>
                    <td className="py-3">
                      <span className={`text-sm font-medium ${
                        t.trend === 'increasing' ? 'text-green-500' : 
                        t.trend === 'decreasing' ? 'text-red-500' : 'text-gray-500'
                      }`}>
                        {t.trend.charAt(0).toUpperCase() + t.trend.slice(1)}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default DemandForecastPage;

