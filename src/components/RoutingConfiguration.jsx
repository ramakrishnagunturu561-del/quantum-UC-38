import React, { useState } from 'react';
import { Play } from 'lucide-react';

export const RoutingConfiguration = ({ onRunOptimization, isRunning }) => {
  const [config, setConfig] = useState({
    vehicles: 5,
    capacity: 100,
    qaoa_depth: 2,
    shots: 512,
    mode: 'comparison'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setConfig(prev => ({
      ...prev,
      [name]: name === 'mode' ? value : Number(value)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onRunOptimization) onRunOptimization(config);
  };

  return (
    <div className="card">
      <h2 className="card-title">Optimization Parameters</h2>
      <form onSubmit={handleSubmit}>
        <div className="two-col-grid" style={{ marginBottom: '16px' }}>
          <div className="form-group">
            <label className="form-label">Vehicles</label>
            <input 
              type="number" 
              className="form-control" 
              name="vehicles" 
              value={config.vehicles} 
              onChange={handleChange} 
              min="1"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Vehicle Capacity</label>
            <input 
              type="number" 
              className="form-control" 
              name="capacity" 
              value={config.capacity} 
              onChange={handleChange}
              min="1"
            />
          </div>
          <div className="form-group">
            <label className="form-label">QAOA Depth (p)</label>
            <input 
              type="number" 
              className="form-control" 
              name="qaoa_depth" 
              value={config.qaoa_depth} 
              onChange={handleChange}
              min="1"
              max="10"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Shots</label>
            <input 
              type="number" 
              className="form-control" 
              name="shots" 
              value={config.shots} 
              onChange={handleChange}
              step="128"
              min="128"
            />
          </div>
        </div>

        <div className="form-group" style={{ marginBottom: '24px' }}>
          <label className="form-label">Optimization Mode</label>
          <select 
            className="form-control" 
            name="mode" 
            value={config.mode} 
            onChange={handleChange}
          >
            <option value="classical">Classical CVRP</option>
            <option value="quantum">Quantum QAOA</option>
            <option value="comparison">Classical + Quantum Comparison</option>
          </select>
        </div>

        <button 
          type="submit" 
          className="btn btn-quantum" 
          disabled={isRunning}
          style={{ width: '100%', justifyContent: 'center' }}
        >
          {isRunning ? (
            'Running...'
          ) : (
            <>
              <Play size={18} />
              Run Optimization
            </>
          )}
        </button>
      </form>
    </div>
  );
};
