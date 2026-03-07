/**
 * Pricing Calculator Page
 * AI-powered dynamic freight pricing
 */

import React, { useState } from 'react';
import { Calculator, Truck, Milestone, Fuel, Clock, TrendingUp, Info } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

function PricingCalculatorPage() {
  const [formData, setFormData] = useState({
    origin: 'Delhi',
    destination: 'Mumbai',
    distance: 1400,
    weight: 5000,
    cargoType: 'Standard',
    urgency: 'normal',
    vehicleType: 'diesel_truck',
    fuelPrice: 85
  });
  
  const [pricing, setPricing] = useState(null);
  const [loading, setLoading] = useState(false);

  const cargoTypes = ['Standard', 'Perishable', 'Hazardous', 'Oversized', 'Fragile', 'valuable'];
  const vehicleTypes = [
    { id: 'small_truck', name: 'Small Truck (3.5T)', costPerKm: 25 },
    { id: 'large_truck', name: 'Large Truck (15T)', costPerKm: 40 },
    { id: 'trailer', name: 'Trailer (25T)', costPerKm: 55 },
    { id: 'refrigerated', name: 'Refrigerated Truck', costPerKm: 45 },
    { id: 'container', name: 'Container (20ft)', costPerKm: 50 }
  ];

  const calculatePrice = () => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const baseRate = vehicleTypes.find(v => v.id === formData.vehicleType)?.costPerKm || 40;
      const distanceRate = formData.distance * baseRate;
      
      // Cargo type multiplier
      const cargoMultiplier = {
        'Standard': 1.0,
        'Perishable': 1.5,
        'Hazardous': 1.8,
        'Oversized': 2.0,
        'Fragile': 1.4,
        'valuable': 2.5
      }[formData.cargoType] || 1.0;
      
      // Urgency multiplier
      const urgencyMultiplier = {
        'low': 0.9,
        'normal': 1.0,
        'high': 1.3,
        'urgent': 1.6
      }[formData.urgency] || 1.0;
      
      // Demand factor (mock)
      const demandFactor = 1.1;
      
      const total = distanceRate * cargoMultiplier * urgencyMultiplier * demandFactor;
      const fuelSurcharge = (formData.distance / 3) * (formData.fuelPrice / 80);
      const finalPrice = total + fuelSurcharge;
      
      setPricing({
        basePrice: total,
        fuelSurcharge: fuelSurcharge,
        totalPrice: finalPrice,
        pricePerKm: finalPrice / formData.distance,
        breakdown: {
          base: distanceRate,
          cargoType: distanceRate * (cargoMultiplier - 1),
          urgency: distanceRate * (urgencyMultiplier - 1),
          demand: distanceRate * (demandFactor - 1),
          fuel: fuelSurcharge
        }
      });
      
      setLoading(false);
    }, 1000);
  };

  const priceHistory = [
    { month: 'Jan', price: 42000 },
    { month: 'Feb', price: 45000 },
    { month: 'Mar', price: 41000 },
    { month: 'Apr', price: 48000 },
    { month: 'May', price: 52000 },
    { month: 'Jun', price: 49000 }
  ];

  const marketRates = [
    { name: 'Standard', value: 35, color: '#3b82f6' },
    { name: 'Express', value: 25, color: '#8b5cf6' },
    { name: 'Refrigerated', value: 20, color: '#06b6d4' },
    { name: 'Hazardous', value: 15, color: '#f59e0b' },
    { name: 'Oversized', value: 5, color: '#ef4444' }
  ];

  return (
    <div className="p-8 h-full overflow-y-auto bg-gray-50 dark:bg-gray-900">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-800 dark:text-white flex items-center gap-3">
          <Calculator className="text-blue-600" size={32} />
          Freight Pricing Calculator
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          AI-powered dynamic pricing based on distance, demand, and cargo type
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calculator Form */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">
            Calculate Shipping Cost
          </h3>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Origin
                </label>
                <input
                  type="text"
                  value={formData.origin}
                  onChange={(e) => setFormData({...formData, origin: e.target.value})}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Destination
                </label>
                <input
                  type="text"
                  value={formData.destination}
                  onChange={(e) => setFormData({...formData, destination: e.target.value})}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-2">
                <Route className="w-4 h-4" /> Distance (km)
              </label>
              <input
                type="number"
                value={formData.distance}
                onChange={(e) => setFormData({...formData, distance: parseInt(e.target.value) || 0})}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-2">
                <Truck className="w-4 h-4" /> Cargo Weight (kg)
              </label>
              <input
                type="number"
                value={formData.weight}
                onChange={(e) => setFormData({...formData, weight: parseInt(e.target.value) || 0})}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Cargo Type
                </label>
                <select
                  value={formData.cargoType}
                  onChange={(e) => setFormData({...formData, cargoType: e.target.value})}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700"
                >
                  {cargoTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Urgency
                </label>
                <select
                  value={formData.urgency}
                  onChange={(e) => setFormData({...formData, urgency: e.target.value})}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700"
                >
                  <option value="low">Low (3+ days)</option>
                  <option value="normal">Normal (2-3 days)</option>
                  <option value="high">High (1-2 days)</option>
                  <option value="urgent">Urgent (Same day)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Vehicle Type
              </label>
              <select
                value={formData.vehicleType}
                onChange={(e) => setFormData({...formData, vehicleType: e.target.value})}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700"
              >
                {vehicleTypes.map(v => (
                  <option key={v.id} value={v.id}>{v.name} (₹{v.costPerKm}/km)</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-2">
                <Fuel className="w-4 h-4" /> Fuel Price (₹/L)
              </label>
              <input
                type="number"
                value={formData.fuelPrice}
                onChange={(e) => setFormData({...formData, fuelPrice: parseFloat(e.target.value) || 0})}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700"
              />
            </div>

            <button
              onClick={calculatePrice}
              disabled={loading}
              className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? 'Calculating...' : 'Calculate Price'}
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-6">
          {pricing ? (
            <>
              {/* Price Summary */}
              <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl p-6 text-white">
                <p className="text-blue-100 mb-1">Estimated Total Cost</p>
                <p className="text-5xl font-black mb-4">₹{Math.round(pricing.totalPrice).toLocaleString()}</p>
                <div className="flex items-center gap-4 text-sm">
                  <span className="bg-white/20 px-3 py-1 rounded-full">
                    ₹{pricing.pricePerKm.toFixed(2)}/km
                  </span>
                  <span className="bg-white/20 px-3 py-1 rounded-full">
                    {formData.weight}kg cargo
                  </span>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow">
                <h4 className="font-bold text-gray-800 dark:text-white mb-4">Price Breakdown</h4>
                <div className="space-y-3">
                  <PriceRow label="Base Distance Cost" value={pricing.breakdown.base} />
                  <PriceRow label="Cargo Type Adjustment" value={pricing.breakdown.cargoType} />
                  <PriceRow label="Urgency Surcharge" value={pricing.breakdown.urgency} />
                  <PriceRow label="Demand Factor" value={pricing.breakdown.demand} />
                  <PriceRow label="Fuel Surcharge" value={pricing.breakdown.fuel} />
                  <div className="pt-3 border-t border-gray-200 dark:border-gray-700 flex justify-between font-bold">
                    <span className="text-gray-800 dark:text-white">Total</span>
                    <span className="text-blue-600">₹{Math.round(pricing.totalPrice).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Pricing Factors */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow">
                <h4 className="font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                  <Info className="w-5 h-5 text-blue-500" />
                  Pricing Factors Explained
                </h4>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5"></div>
                    <div>
                      <p className="font-medium text-gray-800 dark:text-white">Distance & Vehicle Type</p>
                      <p className="text-gray-500">Base cost calculated from distance × vehicle cost per km</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-purple-500 mt-1.5"></div>
                    <div>
                      <p className="font-medium text-gray-800 dark:text-white">Cargo Type</p>
                      <p className="text-gray-500">Special handling requirements increase pricing</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-orange-500 mt-1.5"></div>
                    <div>
                      <p className="font-medium text-gray-800 dark:text-white">Urgency</p>
                      <p className="text-gray-500">Faster delivery requires premium pricing</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-500 mt-1.5"></div>
                    <div>
                      <p className="font-medium text-gray-800 dark:text-white">Demand & Fuel</p>
                      <p className="text-gray-500">Market demand and fuel prices affect final cost</p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow h-full flex items-center justify-center">
              <div className="text-center">
                <Calculator className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">
                  Enter shipment details to calculate pricing
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Historical Data */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow">
          <h4 className="font-bold text-gray-800 dark:text-white mb-4">Price Trend (6 Months)</h4>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={priceHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip />
              <Bar dataKey="price" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Price (₹)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow">
          <h4 className="font-bold text-gray-800 dark:text-white mb-4">Market Rate Distribution</h4>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={marketRates}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={5}
                dataKey="value"
              >
                {marketRates.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function PriceRow({ label, value }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-gray-600 dark:text-gray-400">{label}</span>
      <span className={value >= 0 ? 'text-gray-800 dark:text-white' : 'text-green-600'}>
        {value >= 0 ? '₹' : '-'}{Math.abs(Math.round(value)).toLocaleString()}
      </span>
    </div>
  );
}

export default PricingCalculatorPage;

