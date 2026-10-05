import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Route, Map, FileText, Zap, Package } from 'lucide-react';
import { optimizationApi } from '../api/optimizationApi';

export const Sidebar = () => {
  const [isBackendOnline, setIsBackendOnline] = useState(false);

  useEffect(() => {
    const check = async () => {
      const res = await optimizationApi.checkHealth();
      setIsBackendOnline(res.online);
    };
    check();
    const interval = setInterval(check, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <Zap size={24} color="var(--quantum-purple)" />
          <div>
            QuantumRoute AI
            <br />
            <span>Fleet Logistics Platform</span>
          </div>
        </div>
      </div>
      
      <div className="sidebar-nav">
        <NavLink to="/" className={({isActive}) => isActive ? "nav-item active" : "nav-item"} end>
          <LayoutDashboard size={20} />
          Overview
        </NavLink>
        <NavLink to="/orders" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
          <Package size={20} color="var(--primary-blue)" />
          Live Orders
          <span style={{ 
            fontSize: '0.65rem', 
            background: isBackendOnline ? '#10b981' : '#64748b', 
            color: 'white', 
            padding: '1px 6px', 
            borderRadius: '8px', 
            marginLeft: 'auto',
            fontWeight: 700 
          }}>
            {isBackendOnline ? 'LIVE' : 'OFFLINE'}
          </span>
        </NavLink>
        <NavLink to="/optimization" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
          <Route size={20} />
          Route Optimization
        </NavLink>
        <NavLink to="/map" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
          <Map size={20} />
          Route Map
        </NavLink>
        <NavLink to="/results" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
          <FileText size={20} />
          Results
        </NavLink>
      </div>

      <div className="sidebar-footer">
        <div className="status-row">
          <div 
            className="status-dot" 
            style={{ backgroundColor: isBackendOnline ? '#10b981' : '#ef4444' }} 
          />
          System Status
        </div>
        <div style={{ color: 'white', fontWeight: 500, fontSize: '0.82rem' }}>
          {isBackendOnline ? 'FastAPI Backend Online' : 'Backend Offline'}
        </div>
      </div>
    </div>
  );
};
