import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Package, Truck, Route as RouteIcon, Zap, 
  CheckCircle, AlertTriangle, ArrowRight, ShieldCheck, Clock, MapPin, Map as MapIcon, RefreshCw
} from 'lucide-react';
import { useOptimization } from '../context/OptimizationContext';
import { StatCard } from '../components/StatCard';
import { RealOpenStreetMap } from '../components/RealOpenStreetMap';

export const Dashboard = () => {
  const { orders, backendOnline, latestResult, refreshOrders } = useOptimization();
  const [mapMode, setMapMode] = useState('classical'); // 'classical' | 'quantum'

  const totalDemand = orders.reduce((sum, o) => sum + (o.demand || 0), 0);
  const pendingOrders = orders.filter(o => o.status === 'pending').length;

  // Active routes for the map visualization
  const activeRoutes = latestResult?.status === 'success'
    ? (mapMode === 'classical' ? latestResult.classical?.routes : latestResult.quantum?.routes) || []
    : [];

  return (
    <div className="content-area">
      {/* Top Welcome / Hero Banner */}
      <div className="hero-section" style={{ padding: '28px 36px', marginBottom: '24px' }}>
        <div className="hero-badge">Quantum Computing for Logistics</div>
        <div className="hero-content">
          <h1 className="hero-title" style={{ fontSize: '1.9rem', marginBottom: '10px' }}>
            QuantumRoute AI Dashboard
          </h1>
          <p className="hero-subtitle" style={{ fontSize: '1rem', marginBottom: '20px' }}>
            Real-time delivery route optimization using Classical OR-Tools CVRP and QAOA quantum algorithms on live Vijayawada orders.
          </p>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <Link to="/orders" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              <Package size={16} /> Manage Live Orders
            </Link>
            <Link to="/optimization" className="btn btn-quantum" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              <Zap size={16} /> Run Route Optimization
            </Link>
          </div>
        </div>
        <Zap size={220} className="hero-bg-icon" />
      </div>

      {/* Live System Status Strip */}
      <div style={{
        background: 'var(--card-bg)',
        border: '1px solid var(--border-color)',
        borderRadius: '12px',
        padding: '12px 20px',
        marginBottom: '24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            background: backendOnline ? '#10b981' : '#ef4444',
            boxShadow: backendOnline ? '0 0 8px #10b981' : 'none'
          }} />
          <strong style={{ fontSize: '0.9rem' }}>LIVE SYSTEM STATUS:</strong>
          <span style={{
            color: backendOnline ? '#059669' : '#dc2626',
            fontWeight: 700,
            fontSize: '0.88rem'
          }}>
            {backendOnline ? '● Backend Connected (FastAPI)' : '● Backend Offline'}
          </span>
        </div>

        <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
          Depot: <strong>Vijayawada Central Logistics Hub</strong> (16.5062, 80.6480)
        </div>
      </div>

      {/* 4-Column Stat Cards Row */}
      <div className="stats-grid" style={{ marginBottom: '24px' }}>
        <StatCard
          title="Active Orders"
          value={orders.length}
          subtitle={`${pendingOrders} pending dispatch`}
          icon={<Package size={22} />}
        />

        <StatCard
          title="Total Demand"
          value={`${totalDemand} kg`}
          subtitle="Active delivery payload"
          icon={<MapPin size={22} />}
          isQuantum={true}
        />

        <StatCard
          title="Classical CVRP Distance"
          value={latestResult?.status === 'success' ? `${latestResult.classical.distance_km} km` : '—'}
          subtitle={latestResult?.status === 'success' ? `${latestResult.classical.vehicles_used} vehicles used` : 'No run yet'}
          icon={<RouteIcon size={22} />}
        />

        <StatCard
          title="QAOA Quantum Distance"
          value={latestResult?.status === 'success' ? `${latestResult.quantum.distance_km} km` : '—'}
          subtitle={latestResult?.status === 'success' ? `Circuit depth p=${latestResult.quantum.qaoa_depth}` : 'No run yet'}
          icon={<Zap size={22} />}
          isQuantum={true}
        />
      </div>

      {/* Main 2-Column Grid: Controls & Stats (Left) + Interactive Route Map (Right) */}
      <div className="two-col-grid" style={{ alignItems: 'stretch', marginBottom: '24px' }}>
        {/* Left Column: Latest Optimization & Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Latest Optimization Run */}
          <div className="card" style={{ flexGrow: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 className="card-title" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Clock size={20} color="var(--primary-blue)" />
                Latest Optimization Run
              </h2>

              {latestResult?.status === 'success' ? (
                <span style={{ fontSize: '0.72rem', background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '3px 8px', borderRadius: '8px', fontWeight: 700 }}>
                  COMPLETED
                </span>
              ) : (
                <span style={{ fontSize: '0.72rem', background: '#0f172a', border: '1px solid var(--border-color)', color: '#94a3b8', padding: '3px 8px', borderRadius: '8px', fontWeight: 600 }}>
                  PENDING
                </span>
              )}
            </div>

            {!latestResult || latestResult.status !== 'success' ? (
              <div style={{ padding: '24px 0', textAlign: 'center', color: 'var(--text-muted)' }}>
                <p style={{ margin: '0 0 16px', fontSize: '0.92rem' }}>
                  No optimization run yet.
                </p>
                <Link to="/optimization" className="btn btn-primary" style={{ padding: '9px 18px', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  Run First Optimization <ArrowRight size={15} />
                </Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.875rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: '#0f172a', borderRadius: '6px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Run Timestamp</span>
                  <strong style={{ fontFamily: 'monospace' }}>{latestResult.timestamp}</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: '#0f172a', borderRadius: '6px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Orders Processed</span>
                  <strong>{latestResult.orders_count} orders ({latestResult.total_demand} kg)</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: '#0f172a', borderRadius: '6px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Classical OR-Tools</span>
                  <strong style={{ color: 'var(--primary-blue)' }}>{latestResult.classical.distance_km} km ({latestResult.classical.runtime_ms} ms)</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: '#0f172a', borderRadius: '6px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>QAOA Quantum</span>
                  <strong style={{ color: 'var(--quantum-purple)' }}>{latestResult.quantum.distance_km} km ({latestResult.quantum.valid_shots}/{latestResult.quantum.shots} valid)</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: '#0f172a', borderRadius: '6px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Comparison Summary</span>
                  <span style={{ fontWeight: 600, color: latestResult.comparison.quantum_advantage ? '#16a34a' : 'var(--text-main)' }}>
                    {latestResult.comparison.quantum_advantage ? 'Quantum Advantage Found' : 'Classical Optimal'}
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
                  <Link to="/optimization" className="btn btn-primary" style={{ flexGrow: 1, textAlign: 'center', fontSize: '0.85rem', padding: '9px 12px' }}>
                    Re-Optimize
                  </Link>
                  <Link to="/results" className="btn btn-secondary" style={{ flexGrow: 1, textAlign: 'center', fontSize: '0.85rem', padding: '9px 12px' }}>
                    Full Results
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Prominent Interactive Route Map */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
            <div>
              <h2 className="card-title" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MapIcon size={20} color="var(--primary-blue)" />
                Vijayawada Delivery Route Map
              </h2>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                {orders.length} locations • Central Logistics Depot (16.5062, 80.6480)
              </span>
            </div>

            {latestResult?.status === 'success' && (
              <div style={{ display: 'flex', gap: '6px', background: '#0f172a', padding: '3px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <button
                  onClick={() => setMapMode('classical')}
                  style={{
                    padding: '5px 12px',
                    borderRadius: '6px',
                    border: 'none',
                    background: mapMode === 'classical' ? 'var(--primary-blue)' : 'transparent',
                    color: mapMode === 'classical' ? '#ffffff' : 'var(--text-muted)',
                    fontWeight: mapMode === 'classical' ? 700 : 500,
                    cursor: 'pointer',
                    fontSize: '0.75rem',
                    transition: 'all 0.15s ease'
                  }}
                >
                  OR-Tools ({latestResult.classical.distance_km} km)
                </button>
                <button
                  onClick={() => setMapMode('quantum')}
                  style={{
                    padding: '5px 12px',
                    borderRadius: '6px',
                    border: 'none',
                    background: mapMode === 'quantum' ? 'var(--quantum-purple)' : 'transparent',
                    color: mapMode === 'quantum' ? '#ffffff' : 'var(--text-muted)',
                    fontWeight: mapMode === 'quantum' ? 700 : 500,
                    cursor: 'pointer',
                    fontSize: '0.75rem',
                    transition: 'all 0.15s ease'
                  }}
                >
                  QAOA ({latestResult.quantum.distance_km} km)
                </button>
              </div>
            )}
          </div>

          {/* Interactive Map Component */}
          <div style={{ flexGrow: 1, minHeight: '440px' }}>
            <RealOpenStreetMap 
              orders={orders} 
              routes={activeRoutes} 
              height="440px" 
              showLegend={false}
            />
          </div>

          <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            <div style={{ display: 'flex', gap: '12px' }}>
              <span>🏢 Central Depot</span>
              <span>📦 Orders</span>
              {activeRoutes.length > 0 && <span>🚚 Vehicle Routes</span>}
            </div>
            <Link to="/map" style={{ color: 'var(--primary-blue)', fontWeight: 600, textDecoration: 'none' }}>
              Open Fullscreen Route Map →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
