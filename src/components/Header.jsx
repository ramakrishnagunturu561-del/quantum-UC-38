import React from 'react';
import { MapPin, Zap, Package, Activity } from 'lucide-react';
import { useOptimization } from '../context/OptimizationContext';

export const Header = () => {
  const { orders, backendOnline } = useOptimization();

  return (
    <div className="page-header">
      <div className="header-left">
        <h1 className="page-title">Last-Mile Vehicle Routing</h1>
        <p className="page-subtitle">Live Vijayawada Fleet Logistics • Classical CVRP & QAOA Quantum Engine</p>
      </div>
      <div className="header-right" style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        <div className="header-status">
          <MapPin size={15} color="var(--primary-blue)" />
          Hub: Vijayawada
        </div>
        <div className="header-status">
          <Package size={15} color="var(--quantum-purple)" />
          Live Orders: {orders.length}
        </div>
        <div className="header-status" style={{
          background: backendOnline ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
          color: backendOnline ? '#34d399' : '#f87171',
          border: `1px solid ${backendOnline ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          <span style={{
            width: '7px',
            height: '7px',
            borderRadius: '50%',
            background: backendOnline ? '#10b981' : '#ef4444'
          }} />
          {backendOnline ? 'API Connected' : 'API Offline'}
        </div>
      </div>
    </div>
  );
};
