import React from 'react';

export const StatCard = ({ title, value, subtitle, icon, isQuantum }) => {
  return (
    <div className="card stat-card">
      <div className={`stat-icon ${isQuantum ? 'purple' : ''}`}>
        {icon}
      </div>
      <div className="stat-content">
        <span className="stat-title">{title}</span>
        <span className="stat-value">{value}</span>
        {subtitle && <span className="stat-title" style={{ marginTop: '4px', fontSize: '0.75rem' }}>{subtitle}</span>}
      </div>
    </div>
  );
};
