import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Zap, Play, RefreshCw, AlertTriangle, CheckCircle, 
  Truck, Package, MapPin, Database, ArrowRight, ShieldCheck, Cpu, Map as MapIcon
} from 'lucide-react';
import { useOptimization } from '../context/OptimizationContext';
import { optimizationApi } from '../api/optimizationApi';
import { RealOpenStreetMap } from '../components/RealOpenStreetMap';

const PROGRESS_STAGES = [
  '1. Loading live Vijayawada orders from Orders API',
  '2. Constructing spherical Haversine distance matrix',
  '3. Solving classical CVRP with Google OR-Tools',
  '4. Formulating CVRP QUBO & Ising Cost Hamiltonian',
  '5. Simulating QAOA variational quantum circuit',
  '6. Decoding quantum statevector measurement samples',
  '7. Evaluating classical vs. quantum route distances',
  '8. Optimization complete'
];

export const RouteOptimization = () => {
  const { 
    orders, 
    ordersLoading, 
    refreshOrders, 
    backendOnline, 
    latestResult, 
    saveOptimizationResult 
  } = useOptimization();

  const [isRunning, setIsRunning] = useState(false);
  const [activeStage, setActiveStage] = useState(0);
  const [error, setError] = useState(null);
  const [benchmarkMeta, setBenchmarkMeta] = useState(null);

  // Optimization Parameters
  const [config, setConfig] = useState({
    vehicles: 4,
    capacity: 100,
    qaoa_depth: 2,
    shots: 512
  });

  const [mapMode, setMapMode] = useState('classical');

  useEffect(() => {
    optimizationApi.getBenchmarkReference().then(setBenchmarkMeta).catch(() => {});
  }, []);

  const totalDemand = orders.reduce((sum, o) => sum + (o.demand || 0), 0);

  const activeRoutes = latestResult?.status === 'success'
    ? (mapMode === 'classical' ? latestResult.classical?.routes : latestResult.quantum?.routes) || []
    : [];

  const handleRunOptimization = async () => {
    if (!orders || orders.length === 0) {
      setError('Add delivery orders before running optimization. Head to Live Orders to create orders.');
      return;
    }

    setIsRunning(true);
    setError(null);
    setActiveStage(0);

    // Realistic step progression visualization while backend solves
    const stageInterval = setInterval(() => {
      setActiveStage(prev => (prev < PROGRESS_STAGES.length - 2 ? prev + 1 : prev));
    }, 280);

    try {
      const response = await optimizationApi.optimize(config);
      clearInterval(stageInterval);
      setActiveStage(PROGRESS_STAGES.length - 1);
      saveOptimizationResult(response);
    } catch (err) {
      clearInterval(stageInterval);
      setError(err.message || 'Optimization failed on backend.');
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="content-area">
      {/* Hero Header */}
      <div className="hero-section" style={{ padding: '24px 32px', marginBottom: '24px' }}>
        <div className="hero-badge">CVRP & Quantum QAOA Optimization</div>
        <div className="hero-content">
          <h1 className="hero-title" style={{ fontSize: '1.8rem' }}>
            Quantum Route Optimization Engine
          </h1>
          <p className="hero-subtitle">
            Optimize real-time last-mile delivery routes across Vijayawada by comparing classical OR-Tools with QAOA Hamiltonian subproblem solving.
          </p>
        </div>
        <Zap size={220} className="hero-bg-icon" />
      </div>

      {error && (
        <div style={{
          backgroundColor: '#fef2f2',
          color: '#b91c1c',
          padding: '14px 18px',
          borderRadius: '10px',
          marginBottom: '24px',
          border: '1px solid #fca5a5',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <AlertTriangle size={22} />
          <div>
            <strong>Optimization Error: </strong> {error}
          </div>
        </div>
      )}

      {/* Main Two-Column Layout */}
      <div className="two-col-grid" style={{ alignItems: 'flex-start', marginBottom: '24px' }}>
        {/* Left Column: Live Delivery Data + Benchmark Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Live Delivery Data Block */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 className="card-title" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Package size={20} color="var(--primary-blue)" />
                Live Delivery Data
              </h2>

              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '3px 10px',
                borderRadius: '12px',
                fontSize: '0.75rem',
                fontWeight: 700,
                background: backendOnline ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                color: backendOnline ? '#34d399' : '#f87171',
                border: `1px solid ${backendOnline ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`
              }}>
                <span style={{
                  width: '7px',
                  height: '7px',
                  borderRadius: '50%',
                  background: backendOnline ? '#10b981' : '#ef4444'
                }} />
                {backendOnline ? 'Backend Connected' : 'Offline'}
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.875rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 12px', background: '#0f172a', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <span style={{ color: 'var(--text-muted)' }}>Active Orders</span>
                <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>
                  {ordersLoading ? 'Loading…' : `${orders.length} delivery stops`}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 12px', background: '#0f172a', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <span style={{ color: 'var(--text-muted)' }}>Total Demand</span>
                <span style={{ fontWeight: 700, color: 'var(--quantum-purple)' }}>
                  {totalDemand} kg
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 12px', background: '#0f172a', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <span style={{ color: 'var(--text-muted)' }}>Central Depot</span>
                <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>Vijayawada Central Logistics Hub (16.5062, 80.6480)</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 12px', background: '#0f172a', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <span style={{ color: 'var(--text-muted)' }}>Data Source</span>
                <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>FastAPI Orders API (<code>/api/orders</code>)</span>
              </div>
            </div>

            {orders.length === 0 && (
              <div style={{ marginTop: '16px', padding: '12px', background: 'rgba(245, 158, 11, 0.12)', borderRadius: '8px', border: '1px solid rgba(245, 158, 11, 0.3)', fontSize: '0.82rem', color: '#fbbf24' }}>
                ⚠️ No live delivery orders loaded. Go to <Link to="/orders" style={{ fontWeight: 700, color: 'var(--primary-blue)' }}>Live Orders</Link> to add delivery stops.
              </div>
            )}
          </div>

          {/* Benchmark Reference Information */}
          <div className="card" style={{ background: '#0f172a', border: '1px solid var(--border-color)', borderLeft: '4px solid #64748b' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '8px', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Database size={16} color="var(--quantum-purple)" />
              Benchmark Reference Information
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
              The A-n32-k5.vrp dataset is a standard CVRP validation benchmark used strictly for algorithmic baseline comparisons, not live delivery data.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', fontSize: '0.8rem' }}>
              <div style={{ background: '#1e293b', padding: '8px 10px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                <span style={{ color: 'var(--text-muted)' }}>Dataset: </span>
                <strong style={{ color: 'var(--text-main)' }}>{benchmarkMeta?.dataset || 'A-n32-k5.vrp'}</strong>
              </div>
              <div style={{ background: '#1e293b', padding: '8px 10px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                <span style={{ color: 'var(--text-muted)' }}>Benchmark Nodes: </span>
                <strong style={{ color: 'var(--text-main)' }}>{benchmarkMeta?.locations || 32}</strong>
              </div>
              <div style={{ background: '#1e293b', padding: '8px 10px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                <span style={{ color: 'var(--text-muted)' }}>Known Optimum: </span>
                <strong style={{ color: 'var(--text-main)' }}>{benchmarkMeta?.known_benchmark_optimum || 784} km</strong>
              </div>
              <div style={{ background: '#1e293b', padding: '8px 10px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                <span style={{ color: 'var(--text-muted)' }}>Vehicle Capacity: </span>
                <strong style={{ color: 'var(--text-main)' }}>{benchmarkMeta?.capacity || 100}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Optimization Parameters & Single Execution Button */}
        <div className="card">
          <h2 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Zap size={20} color="var(--quantum-purple)" />
            Optimization Parameters
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '20px' }}>
            Configure fleet constraints and quantum circuit hyperparameters for the live CVRP solve.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                Fleet Vehicles
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={config.vehicles}
                onChange={(e) => setConfig({ ...config, vehicles: Number(e.target.value) })}
                style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid var(--border-color)', fontSize: '0.9rem' }}
              />
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Default: 4 vehicles</span>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                Vehicle Capacity (kg)
              </label>
              <input
                type="number"
                min="10"
                max="500"
                value={config.capacity}
                onChange={(e) => setConfig({ ...config, capacity: Number(e.target.value) })}
                style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid var(--border-color)', fontSize: '0.9rem' }}
              />
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Default: 100 kg</span>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                QAOA Depth (p)
              </label>
              <input
                type="number"
                min="1"
                max="6"
                value={config.qaoa_depth}
                onChange={(e) => setConfig({ ...config, qaoa_depth: Number(e.target.value) })}
                style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid var(--border-color)', fontSize: '0.9rem' }}
              />
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Layer count (p=1 to 6)</span>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                Quantum Measurement Shots
              </label>
              <input
                type="number"
                min="128"
                max="4096"
                step="128"
                value={config.shots}
                onChange={(e) => setConfig({ ...config, shots: Number(e.target.value) })}
                style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid var(--border-color)', fontSize: '0.9rem' }}
              />
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Sampling budget (e.g. 512)</span>
            </div>
          </div>

          {/* SINGLE MAIN EXECUTION BUTTON */}
          <button
            className="btn btn-quantum"
            onClick={handleRunOptimization}
            disabled={isRunning || orders.length === 0 || !backendOnline}
            style={{
              width: '100%',
              padding: '14px',
              fontSize: '1.05rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              cursor: isRunning || orders.length === 0 || !backendOnline ? 'not-allowed' : 'pointer'
            }}
          >
            {isRunning ? (
              <>
                <RefreshCw size={20} className="animate-pulse" />
                Optimizing Current Live Orders…
              </>
            ) : (
              <>
                <Zap size={20} />
                Run Quantum Optimization
              </>
            )}
          </button>

          {/* Real Execution Progress Pipeline */}
          {isRunning && (
            <div style={{ marginTop: '24px', background: '#0f172a', padding: '16px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>
                Solving Pipeline Progress
              </div>

              {PROGRESS_STAGES.map((stage, idx) => {
                const isDone = activeStage > idx;
                const isCurrent = activeStage === idx;
                return (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '6px 0',
                      fontSize: '0.82rem',
                      color: isDone ? '#34d399' : isCurrent ? 'var(--quantum-purple)' : '#94a3b8',
                      fontWeight: isDone || isCurrent ? 600 : 400
                    }}
                  >
                    <div style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.7rem',
                      background: isDone ? '#10b981' : isCurrent ? 'var(--quantum-purple)' : '#334155',
                      color: '#ffffff'
                    }}>
                      {isDone ? '✓' : idx + 1}
                    </div>
                    <span>{stage}</span>
                  </div>
                );
              })}
            </div>
          )}

          {/* Quick Success Box when complete */}
          {!isRunning && latestResult && latestResult.status === 'success' && (
            <div style={{ marginTop: '24px', background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '10px', padding: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                <CheckCircle size={22} color="#34d399" />
                <strong style={{ color: '#34d399', fontSize: '1rem' }}>
                  Optimization Computed Successfully!
                </strong>
              </div>

              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0 0 14px' }}>
                Processed {latestResult.orders_count} live Vijayawada delivery orders across {latestResult.config.vehicles} vehicles at {latestResult.timestamp}.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
                <div style={{ background: '#0f172a', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Classical OR-Tools</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary-blue)' }}>
                    {latestResult.classical.distance_km} km
                  </div>
                </div>
                <div style={{ background: '#0f172a', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>QAOA Quantum</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--quantum-purple)' }}>
                    {latestResult.quantum.distance_km} km
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <Link to="/map" className="btn btn-primary" style={{ fontSize: '0.85rem', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  View Routes on Map <ArrowRight size={15} />
                </Link>
                <Link to="/results" className="btn btn-secondary" style={{ fontSize: '0.85rem', padding: '8px 16px' }}>
                  View Detailed Results
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Interactive Optimization Route Map */}
      <div className="card" style={{ marginTop: '8px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
          <div>
            <h2 className="card-title" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MapIcon size={20} color="var(--primary-blue)" />
              Route Visualization Map – Vijayawada
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', margin: '2px 0 0' }}>
              Real-time map rendering of current delivery orders and solved vehicle routes.
            </p>
          </div>

          {latestResult?.status === 'success' && (
            <div style={{ display: 'flex', gap: '6px', background: '#0f172a', padding: '3px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <button
                onClick={() => setMapMode('classical')}
                style={{
                  padding: '4px 12px',
                  borderRadius: '6px',
                  border: 'none',
                  background: mapMode === 'classical' ? 'var(--primary-blue)' : 'transparent',
                  color: mapMode === 'classical' ? '#ffffff' : 'var(--text-muted)',
                  fontWeight: mapMode === 'classical' ? 700 : 500,
                  cursor: 'pointer',
                  fontSize: '0.78rem',
                  boxShadow: mapMode === 'classical' ? '0 1px 2px rgba(0,0,0,0.2)' : 'none'
                }}
              >
                OR-Tools ({latestResult.classical.distance_km} km)
              </button>
              <button
                onClick={() => setMapMode('quantum')}
                style={{
                  padding: '4px 12px',
                  borderRadius: '6px',
                  border: 'none',
                  background: mapMode === 'quantum' ? 'var(--quantum-purple)' : 'transparent',
                  color: mapMode === 'quantum' ? '#ffffff' : 'var(--text-muted)',
                  fontWeight: mapMode === 'quantum' ? 700 : 500,
                  cursor: 'pointer',
                  fontSize: '0.78rem',
                  boxShadow: mapMode === 'quantum' ? '0 1px 2px rgba(0,0,0,0.2)' : 'none'
                }}
              >
                QAOA ({latestResult.quantum.distance_km} km)
              </button>
            </div>
          )}
        </div>

        <RealOpenStreetMap 
          orders={orders} 
          routes={activeRoutes} 
          height="460px" 
        />
      </div>
    </div>
  );
};
