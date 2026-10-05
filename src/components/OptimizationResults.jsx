import React from 'react';
import { CheckCircle, AlertTriangle } from 'lucide-react';

export const OptimizationResults = ({ result }) => {
  if (!result) return null;

  const reducedClassicalOptimum = 232; 
  const isOptimal = result.quantum.distance === reducedClassicalOptimum;

  return (
    <div className="card" style={{ marginBottom: '24px' }}>
      <h2 className="card-title">Optimization Results</h2>
      
      {isOptimal ? (
        <div className="status-success">
          <CheckCircle size={24} className="icon" />
          <div>
            <h4>QAOA matched the exact classical optimum for the reduced 5-node subproblem.</h4>
          </div>
        </div>
      ) : (
        <div className="status-success" style={{ backgroundColor: '#fffbeb', color: '#b45309', borderColor: '#fde68a' }}>
          <AlertTriangle size={24} className="icon" />
          <div>
            <h4>Different solution found</h4>
          </div>
        </div>
      )}

      <div style={{ marginTop: '24px', marginBottom: '24px' }}>
        <h4 style={{ color: 'var(--text-muted)', marginBottom: '16px', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em' }}>Different problem scales</h4>
        <div className="two-col-grid" style={{ marginBottom: 0 }}>
          
          {/* Classical Box */}
          <div className="card" style={{ boxShadow: 'none', backgroundColor: '#f8fafc', borderLeft: '4px solid var(--text-muted)' }}>
            <h4 style={{ color: 'var(--text-main)', marginBottom: '12px' }}>CLASSICAL</h4>
            <span className="stat-title">Full CVRP Benchmark</span>
            <div className="stat-value" style={{ margin: '8px 0' }}>{result.classical.distance}</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
              <p>32 locations</p>
              <p>5 vehicles</p>
            </div>
          </div>
          
          {/* Quantum Box */}
          <div className="card" style={{ boxShadow: 'none', backgroundColor: '#faf5ff', borderLeft: '4px solid var(--quantum-purple)' }}>
            <h4 style={{ color: 'var(--quantum-purple)', marginBottom: '12px' }}>QUANTUM</h4>
            <span className="stat-title">Reduced CVRP</span>
            <div className="stat-value" style={{ color: 'var(--quantum-purple)', margin: '8px 0' }}>{result.quantum.distance}</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
              <p>5 nodes</p>
              <p>16 qubits</p>
              <p>QAOA p={result.quantum.qaoa_depth}</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
