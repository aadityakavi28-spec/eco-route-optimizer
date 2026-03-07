/**
 * Digital Twin Page
 * What-if scenario simulation for logistics network
 */

import React, { useState } from 'react';
import { Play, Settings, RefreshCw, TrendingUp, TrendingDown, AlertCircle, Network } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function DigitalTwinPage() {
  const [scenarios, setScenarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedScenario, setSelectedScenario] = useState(null);

  // Available scenario types
  const scenarioTypes = [
    { id: 'fuel_price', name: 'Fuel Price Increase', value: 20, unit: '%', description: 'Simulate fuel price increase' },
    { id: 'demand', name: 'Demand Change', value: 2, unit: 'x', description: 'Double or halve demand' },
    { id: 'breakdown', name: 'Truck Breakdowns', value: 10, unit: '%', description: 'Percentage of fleet unavailable' },
    { id: 'warehouse', name: 'New Warehouse', value: 1, unit: '', description: 'Add new distribution center' }
  ];

  const [activeScenarios, setActiveScenarios] = useState([]);

  // Mock simulation results
  const mockResults = {
    baseline: {
      total_shipments: 1500,
      on_time_rate: 85,
      avg_cost: 25000,
      total_co2: 45000,
      utilization: 72
    },
    simulated: {
      total_shipments: 3000,
      on_time_rate: 78,
      avg_cost: 26250,
      total_co2: 47250,
      utilization: 86
    }
  };

  const addScenario = (scenario) => {
    setActiveScenarios([...activeScenarios, { ...scenario, key: Date.now() }]);
  };

  const removeScenario = (key) => {
    setActiveScenarios(activeScenarios.filter(s => s.key !== key));
  };

  const runSimulation = () => {
    setLoading(true);
    setTimeout(() => {
      setSelectedScenario(mockResults);
      setLoading(false);
    }, 1500);
  };

  const getChange = (baseline, simulated) => {
    const change = ((simulated - baseline) / baseline) * 100;
    return {
      value: Math.abs(change).toFixed(1),
      direction: change > 0 ? 'up' : change < 0 ? 'down' : 'stable'
    };
  };

  return (
    <div className="p-8 h-full overflow-y-auto bg-gray-50 dark:bg-gray-900">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-800 dark:text-white flex items-center gap-3">
          <Network className="text-indigo-600" size={32} />
          Digital Twin Simulation
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          What-if scenario analysis for your logistics network
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Scenario Builder */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">
              Build Scenario
            </h3>
            
            <div className="space-y-3 mb-6">
              {scenarioTypes.map(scenario => (
                <button
                  key={scenario.id}
                  onClick={() => addScenario(scenario)}
                  className="w-full p-4 text-left rounded-xl border border-gray-200 dark:border-gray-700 hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold text-gray-800 dark:text-white">{scenario.name}</p>
                      <p className="text-sm text-gray-500">{scenario.description}</p>
                    </div>
                    <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-sm font-medium">
                      {scenario.value}{scenario.unit}
                    </span>
                  </div>
                </button>
              ))}
            </div>

            {/* Active Scenarios */}
            {activeScenarios.length > 0 && (
              <div className="mb-6">
                <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                  Active Scenarios
                </h4>
                <div className="space-y-2">
                  {activeScenarios.map(s => (
                    <div key={s.key} className="flex justify-between items-center p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                      <span className="font-medium text-gray-800 dark:text-white">{s.name}</span>
                      <button
                        onClick={() => removeScenario(s.key)}
                        className="text-gray-500 hover:text-red-500"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={runSimulation}
              disabled={loading || activeScenarios.length === 0}
              className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  Running Simulation...
                </>
              ) : (
                <>
                  <Play className="w-5 h-5" />
                  Run Simulation
                </>
              )}
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-2">
          {selectedScenario ? (
            <div className="space-y-6">
              {/* Key Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <MetricCard 
                  title="Shipments" 
                  baseline={selectedScenario.baseline.total_shipments}
                  simulated={selectedScenario.simulated.total_shipments}
                />
                <MetricCard 
                  title="On-Time %" 
                  baseline={selectedScenario.baseline.on_time_rate}
                  simulated={selectedScenario.simulated.on_time_rate}
                  suffix="%"
                />
                <MetricCard 
                  title="Avg Cost" 
                  baseline={selectedScenario.baseline.avg_cost}
                  simulated={selectedScenario.simulated.avg_cost}
                  prefix="₹"
                />
                <MetricCard 
                  title="CO₂ (kg)" 
                  baseline={selectedScenario.baseline.total_co2}
                  simulated={selectedScenario.simulated.total_co2}
                />
                <MetricCard 
                  title="Utilization" 
                  baseline={selectedScenario.baseline.utilization}
                  simulated={selectedScenario.simulated.utilization}
                  suffix="%"
                />
              </div>

              {/* Comparison Chart */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">
                  Baseline vs Simulated
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={[
                      { metric: 'Shipments', baseline: 1500, simulated: 3000 },
                      { metric: 'On-Time %', baseline: 85, simulated: 78 },
                      { metric: 'Cost (₹)', baseline: 25, simulated: 26.25 },
                      { metric: 'CO₂ (tons)', baseline: 45, simulated: 47.25 },
                      { metric: 'Utilization %', baseline: 72, simulated: 86 }
                    ]}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="metric" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip contentStyle={{ borderRadius: '12px' }} />
                    <Legend />
                    <Bar dataKey="baseline" fill="#94a3b8" name="Baseline" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="simulated" fill="#6366f1" name="Simulated" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Impact Analysis */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">
                  Impact Analysis
                </h3>
                <div className="space-y-4">
                  <ImpactRow 
                    label="Total Shipments" 
                    change={getChange(selectedScenario.baseline.total_shipments, selectedScenario.simulated.total_shipments)}
                  />
                  <ImpactRow 
                    label="On-Time Delivery" 
                    change={getChange(selectedScenario.baseline.on_time_rate, selectedScenario.simulated.on_time_rate)}
                    invert
                  />
                  <ImpactRow 
                    label="Average Cost" 
                    change={getChange(selectedScenario.baseline.avg_cost, selectedScenario.simulated.avg_cost)}
                  />
                  <ImpactRow 
                    label="Carbon Emissions" 
                    change={getChange(selectedScenario.baseline.total_co2, selectedScenario.simulated.total_co2)}
                  />
                  <ImpactRow 
                    label="Truck Utilization" 
                    change={getChange(selectedScenario.baseline.utilization, selectedScenario.simulated.utilization)}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow h-full flex items-center justify-center">
              <div className="text-center">
                <Settings className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">
                  Select scenarios and run simulation to see results
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, baseline, simulated, prefix = '', suffix = '' }) {
  const change = ((simulated - baseline) / baseline) * 100;
  const isPositive = change > 0;
  
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{title}</p>
      <p className="text-xl font-black text-gray-800 dark:text-white">
        {prefix}{simulated.toLocaleString()}{suffix}
      </p>
      <p className={`text-xs font-medium ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
        {isPositive ? '+' : ''}{change.toFixed(1)}%
      </p>
    </div>
  );
}

function ImpactRow({ label, change, invert = false }) {
  const isPositive = invert ? change.direction === 'down' : change.direction === 'up';
  const isNegative = invert ? change.direction === 'up' : change.direction === 'down';
  
  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
      <span className="text-gray-700 dark:text-gray-300">{label}</span>
      <div className="flex items-center gap-2">
        {change.direction === 'stable' ? (
          <span className="text-gray-500">No change</span>
        ) : (
          <>
            {isPositive ? (
              <TrendingUp className="w-4 h-4 text-green-500" />
            ) : isNegative ? (
              <TrendingDown className="w-4 h-4 text-red-500" />
            ) : null}
            <span className={`font-bold ${isPositive ? 'text-green-500' : isNegative ? 'text-red-500' : 'text-gray-500'}`}>
              {change.direction === 'up' ? '+' : '-'}{change.value}%
            </span>
          </>
        )}
      </div>
    </div>
  );
}

export default DigitalTwinPage;

