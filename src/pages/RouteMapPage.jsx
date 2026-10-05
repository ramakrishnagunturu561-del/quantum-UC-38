import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Map as MapIcon, Truck, Package, ArrowRight, 
  AlertTriangle, CheckCircle2, Navigation, Zap
} from 'lucide-react';
import { useOptimization } from '../context/OptimizationContext';
import { RealOpenStreetMap } from '../components/RealOpenStreetMap';

const VEHICLE_COLORS = [
  '#8b5cf6', // Quantum Purple
  '#3b82f6', // Electric Blue
  '#10b981', // Emerald
  '#f59e0b', // Amber
  '#ec4899', // Pink
  '#06b6d4', // Cyan
  '#6366f1', // Indigo
  '#f97316'  // Orange
];

export const RouteMapPage = () => {
  const { latestResult, orders, backendOnline } = useOptimization();
  const [routeView, setRouteView] = useState('classical'); // 'classical' | 'quantum'

  // Requirement 13: If the backend is unavailable, show "Backend unavailable"
  if (!backendOnline) {
    return (
      <div className="content-area">
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <MapIcon size={28} color="var(--primary-blue)" />
            Route Map Visualization
          </h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '4px' }}>
            Vijayawada Fleet Logistics • OpenStreetMap & OSRM Engine
          </p>
        </div>

        <div className="card" style={{ padding: '48px', textAlign: 'center', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: 'rgba(239, 68, 68, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            color: '#f87171'
          }}>
            <AlertTriangle size={32} />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '8px', color: '#f87171' }}>
            Backend unavailable
          </h2>
          <p style={{ color: 'var(--text-muted)', maxWidth: '440px', margin: '0 auto 20px', fontSize: '0.9rem' }}>
            The FastAPI backend server is currently offline or unreachable at <code>http://localhost:8000</code>. Please ensure the backend daemon is running to retrieve orders and routes.
          </p>
        </div>
      </div>
    );
  }

  // Requirement 12: Before optimization, show "No optimized route available. Add orders and run optimization."
  if (!latestResult || latestResult.status !== 'success') {
    return (
      <div className="content-area">
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <MapIcon size={28} color="var(--primary-blue)" />
            Route Map Visualization
          </h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '4px' }}>
            Interactive OpenStreetMap for Vijayawada vehicle routing.
          </p>
        </div>

        <div className="card" style={{ padding: '48px', textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🗺️</div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '8px' }}>
            No optimized route available.
          </h2>
          <p style={{ color: 'var(--text-muted)', maxWidth: '440px', margin: '0 auto 24px', fontSize: '0.95rem' }}>
            Add orders and run optimization.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <Link to="/orders" className="btn btn-secondary" style={{ padding: '10px 18px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              <Package size={16} /> Manage Orders ({orders.length} loaded)
            </Link>
            <Link to="/optimization" className="btn btn-primary" style={{ padding: '10px 20px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              <Zap size={16} /> Run Quantum Optimization <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Active solution routes
  const activeSolution = routeView === 'classical' ? latestResult.classical : latestResult.quantum;
  const routes = activeSolution?.routes || [];
  const depot = latestResult.depot || { latitude: 16.5062, longitude: 80.6480, customer_name: 'Vijayawada Central Logistics Hub' };

  return (
    <div className="content-area">
      {/* Header and Solution Switcher */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#c084fc', background: 'rgba(139, 92, 246, 0.15)', border: '1px solid rgba(139, 92, 246, 0.3)', padding: '2px 8px', borderRadius: '10px' }}>
              Computed at {latestResult.timestamp}
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {latestResult.orders_count} Orders • Total Demand: {latestResult.total_demand} kg
            </span>
          </div>

          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <MapIcon size={28} color="var(--primary-blue)" />
            Vijayawada Fleet Route Map
          </h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '4px' }}>
            Free OpenStreetMap with real OSRM road-following geometries and vehicle dispatch telemetry.
          </p>
        </div>

        {/* View Switcher: Classical OR-Tools vs Quantum QAOA */}
        <div style={{ display: 'flex', gap: '8px', background: '#0f172a', padding: '4px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
          <button
            onClick={() => setRouteView('classical')}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              background: routeView === 'classical' ? 'var(--primary-blue)' : 'transparent',
              color: routeView === 'classical' ? '#ffffff' : 'var(--text-muted)',
              fontWeight: routeView === 'classical' ? 700 : 500,
              cursor: 'pointer',
              fontSize: '0.85rem',
              boxShadow: routeView === 'classical' ? '0 1px 3px rgba(0,0,0,0.3)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            Classical (OR-Tools: {latestResult.classical.distance_km} km)
          </button>

          <button
            onClick={() => setRouteView('quantum')}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              background: routeView === 'quantum' ? 'var(--quantum-purple)' : 'transparent',
              color: routeView === 'quantum' ? '#ffffff' : 'var(--text-muted)',
              fontWeight: routeView === 'quantum' ? 700 : 500,
              cursor: 'pointer',
              fontSize: '0.85rem',
              boxShadow: routeView === 'quantum' ? '0 1px 3px rgba(0,0,0,0.3)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            Quantum (QAOA: {latestResult.quantum.distance_km} km)
          </button>
        </div>
      </div>

      {/* Main OpenStreetMap Component Card */}
      <div className="card" style={{ padding: '16px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <strong style={{ fontSize: '0.95rem', color: 'var(--text-main)' }}>
              Active Routing Layer: {routeView === 'classical' ? 'OR-Tools Optimal Route' : 'QAOA Quantum Route'}
            </strong>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              ({routes.length} vehicle paths rendered with OSRM street networks)
            </span>
          </div>
        </div>

        {/* Real OpenStreetMap + React-Leaflet + OSRM road geometry */}
        <RealOpenStreetMap
          orders={orders}
          routes={routes}
          depot={depot}
          height="540px"
          showLegend={true}
        />
      </div>

      {/* Requirement 10: Display route information beside/below the map */}
      <div className="card">
        <h2 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Navigation size={20} color="var(--primary-blue)" />
          Vehicle Route Details & Trajectories
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '20px' }}>
          Live delivery sequences computed by the {routeView === 'classical' ? 'OR-Tools CVRP solver' : 'QAOA quantum circuit'}.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
          {routes.map((route, idx) => {
            const color = VEHICLE_COLORS[idx % VEHICLE_COLORS.length];
            return (
              <div
                key={idx}
                style={{
                  border: `1px solid var(--border-color)`,
                  borderLeft: `5px solid ${color}`,
                  borderRadius: '10px',
                  padding: '18px',
                  background: '#0f172a',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  {/* Header: Vehicle title + Status Feasible */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Truck size={20} color={color} />
                      <strong style={{ fontSize: '1.1rem', color: 'var(--text-main)' }}>
                        Vehicle {route.vehicle_id}
                      </strong>
                    </div>

                    <span style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      background: 'rgba(16, 185, 129, 0.15)',
                      color: '#34d399',
                      border: '1px solid rgba(16, 185, 129, 0.3)',
                      padding: '3px 10px',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <CheckCircle2 size={13} />
                      Status: Feasible
                    </span>
                  </div>

                  {/* Telemetry Metrics Grid */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '8px',
                    fontSize: '0.82rem',
                    marginBottom: '16px',
                    background: '#1e293b',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)'
                  }}>
                    <div>
                      <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.72rem' }}>Orders</span>
                      <strong style={{ color: 'var(--text-main)', fontSize: '0.95rem' }}>{route.orders_count}</strong>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.72rem' }}>Load</span>
                      <strong style={{ color: 'var(--text-main)', fontSize: '0.95rem' }}>{route.load_kg} / {route.capacity_kg} kg</strong>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.72rem' }}>Distance</span>
                      <strong style={{ color, fontSize: '0.95rem' }}>{route.distance_km} km</strong>
                    </div>
                  </div>

                  {/* Stop-by-stop Sequence: Depot → ORD-xxx → ... → Depot */}
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-main)' }}>
                    <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
                      Delivery Sequence:
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '6px' }}>
                      {route.stops.map((stop, sIdx) => {
                        const isDepot = stop.order_id === 'DEPOT';
                        return (
                          <React.Fragment key={sIdx}>
                            <span style={{
                              padding: '4px 9px',
                              borderRadius: '6px',
                              background: isDepot ? 'rgba(239, 68, 68, 0.15)' : '#1e293b',
                              color: isDepot ? '#f87171' : 'var(--text-main)',
                              border: isDepot ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid var(--border-color)',
                              fontWeight: isDepot ? 700 : 500,
                              fontSize: '0.78rem',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}>
                              {isDepot ? '🏢 Depot' : stop.order_id}
                            </span>
                            {sIdx < route.stops.length - 1 && (
                              <span style={{ color: '#64748b', fontSize: '0.75rem' }}>→</span>
                            )}
                          </React.Fragment>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
