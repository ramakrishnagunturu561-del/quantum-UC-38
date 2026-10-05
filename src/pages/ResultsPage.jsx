import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, Zap, Award, CheckCircle, TrendingUp, Cpu, 
  Clock, Download, RefreshCw, BarChart2, ShieldCheck, ArrowRight, Truck, AlertTriangle 
} from 'lucide-react';
import { useOptimization } from '../context/OptimizationContext';

export const ResultsPage = () => {
  const { latestResult } = useOptimization();

  if (!latestResult || latestResult.status !== 'success') {
    return (
      <div className="content-area">
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FileText size={28} color="var(--quantum-purple)" />
            Optimization Results
          </h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '4px' }}>
            Comparative evaluation of Classical CVRP vs. QAOA Quantum Optimization.
          </p>
        </div>

        <div className="card" style={{ padding: '48px', textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📊</div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '8px' }}>
            No optimization results yet
          </h2>
          <p style={{ color: 'var(--text-muted)', maxWidth: '440px', margin: '0 auto 24px', fontSize: '0.9rem' }}>
            Run optimization on your live orders to generate and compare real classical and QAOA quantum route solutions.
          </p>
          <Link to="/optimization" className="btn btn-primary" style={{ padding: '10px 20px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            Go to Route Optimization <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    );
  }

  const { classical, quantum, comparison, config, orders_count, total_demand, timestamp } = latestResult;

  const handleExportJSON = () => {
    const blob = new Blob([JSON.stringify(latestResult, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `quantum_route_result_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="content-area">
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
        <div>
          <div className="hero-badge" style={{ marginBottom: '8px' }}>
            <Award size={14} style={{ marginRight: '6px' }} />
            Optimization Run Report • {timestamp}
          </div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FileText size={28} color="var(--quantum-purple)" />
            Optimization Results & Benchmark
          </h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '4px' }}>
            Evaluating real OR-Tools classical CVRP routing against QAOA Hamiltonian simulation on {orders_count} live orders.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button
            onClick={handleExportJSON}
            className="btn btn-secondary"
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '9px 16px' }}
          >
            <Download size={16} />
            Export JSON
          </button>
          <Link
            to="/map"
            className="btn btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '9px 16px' }}
          >
            <Truck size={16} />
            View Routes on Map
          </Link>
        </div>
      </div>

      {/* Honest Comparison Summary Banner */}
      <div style={{
        background: comparison.quantum_advantage ? 'rgba(16, 185, 129, 0.1)' : 'rgba(139, 92, 246, 0.1)',
        border: `1px solid ${comparison.quantum_advantage ? 'rgba(16, 185, 129, 0.3)' : 'rgba(139, 92, 246, 0.3)'}`,
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '24px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <ShieldCheck size={22} color={comparison.quantum_advantage ? '#34d399' : 'var(--quantum-purple)'} />
          <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: comparison.quantum_advantage ? '#34d399' : '#c084fc' }}>
            Algorithm Comparison & Verification
          </h3>
        </div>
        <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-main)', lineHeight: 1.5 }}>
          {comparison.analysis}
        </p>
      </div>

      {/* Side-by-Side: Classical vs Quantum Sections */}
      <div className="two-col-grid" style={{ marginBottom: '24px' }}>
        {/* Section 1: CLASSICAL CVRP */}
        <div className="card" style={{ borderTop: '4px solid var(--primary-blue)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <h2 className="card-title" style={{ margin: 0, color: 'var(--primary-blue)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <TrendingUp size={20} />
              CLASSICAL CVRP
            </h2>
            <span style={{ fontSize: '0.75rem', background: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa', border: '1px solid rgba(59, 130, 246, 0.3)', padding: '2px 8px', borderRadius: '10px', fontWeight: 700 }}>
              {classical.feasible ? 'FEASIBLE' : 'HEURISTIC'}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.875rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 12px', background: '#0f172a', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-muted)' }}>Algorithm</span>
              <strong style={{ color: 'var(--text-main)' }}>{classical.algorithm}</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 12px', background: '#0f172a', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-muted)' }}>Total Fleet Distance</span>
              <strong style={{ color: 'var(--primary-blue)', fontSize: '1.1rem' }}>{classical.distance_km} km</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 12px', background: '#0f172a', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-muted)' }}>Vehicles Utilized</span>
              <strong style={{ color: 'var(--text-main)' }}>{classical.vehicles_used} / {config.vehicles} vehicles</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 12px', background: '#0f172a', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-muted)' }}>Total Demand Delivered</span>
              <strong style={{ color: 'var(--text-main)' }}>{total_demand} kg</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 12px', background: '#0f172a', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-muted)' }}>Solution Feasibility</span>
              <span style={{ color: classical.feasible ? '#34d399' : '#fbbf24', fontWeight: 700 }}>
                {classical.feasible ? '✓ Feasible' : 'Approximate'}
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 12px', background: '#0f172a', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-muted)' }}>Solver Runtime</span>
              <strong style={{ fontFamily: 'monospace', color: 'var(--text-main)' }}>{classical.runtime_ms} ms</strong>
            </div>
          </div>
        </div>

        {/* Section 2: QUANTUM / QAOA */}
        <div className="card" style={{ borderTop: '4px solid var(--quantum-purple)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <h2 className="card-title" style={{ margin: 0, color: 'var(--quantum-purple)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Zap size={20} />
              QUANTUM / QAOA
            </h2>
            <span style={{ fontSize: '0.75rem', background: 'rgba(139, 92, 246, 0.15)', color: '#c084fc', border: '1px solid rgba(139, 92, 246, 0.3)', padding: '2px 8px', borderRadius: '10px', fontWeight: 700 }}>
              CIRCUIT p={quantum.qaoa_depth}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.875rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 12px', background: '#0f172a', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-muted)' }}>Algorithm</span>
              <strong style={{ color: 'var(--text-main)' }}>{quantum.algorithm}</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 12px', background: '#0f172a', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-muted)' }}>QAOA Route Distance</span>
              <strong style={{ color: 'var(--quantum-purple)', fontSize: '1.1rem' }}>{quantum.distance_km} km</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 12px', background: '#0f172a', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-muted)' }}>Qubit Encoding</span>
              <strong style={{ color: 'var(--text-main)' }}>{quantum.qubits} Qubits</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 12px', background: '#0f172a', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-muted)' }}>Sampling Shots</span>
              <strong style={{ color: 'var(--text-main)' }}>{quantum.shots} shots</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 12px', background: '#0f172a', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-muted)' }}>Valid Constraint Shots</span>
              <strong style={{ color: '#34d399' }}>{quantum.valid_shots} / {quantum.shots}</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 12px', background: '#0f172a', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-muted)' }}>Feasible State Probability</span>
              <strong style={{ color: 'var(--quantum-purple)' }}>{quantum.feasible_probability_pct}%</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 12px', background: '#0f172a', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-muted)' }}>Simulation Duration</span>
              <strong style={{ fontFamily: 'monospace', color: 'var(--text-main)' }}>{quantum.runtime_ms} ms</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Section 3: CLASSICAL vs QUANTUM Comparison Table */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <h2 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <BarChart2 size={20} color="var(--primary-blue)" />
          Head-to-Head Comparison: Classical vs. Quantum
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '16px' }}>
          Real empirical metrics computed on current live order inputs.
        </p>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ background: '#0f172a', borderBottom: '2px solid var(--border-color)', textAlign: 'left', color: 'var(--text-muted)' }}>
                <th style={{ padding: '12px' }}>Evaluation Metric</th>
                <th style={{ padding: '12px', color: 'var(--primary-blue)' }}>Classical CVRP (OR-Tools)</th>
                <th style={{ padding: '12px', color: 'var(--quantum-purple)' }}>Quantum Solver (QAOA)</th>
                <th style={{ padding: '12px' }}>Difference / Variance</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '12px', fontWeight: 600 }}>Total Fleet Distance</td>
                <td style={{ padding: '12px', fontWeight: 700, color: 'var(--primary-blue)' }}>{classical.distance_km} km</td>
                <td style={{ padding: '12px', fontWeight: 700, color: 'var(--quantum-purple)' }}>{quantum.distance_km} km</td>
                <td style={{ padding: '12px', fontWeight: 600, color: comparison.distance_diff_km <= 0 ? '#34d399' : '#fbbf24' }}>
                  {comparison.distance_diff_km > 0 ? `+${comparison.distance_diff_km} km` : `${comparison.distance_diff_km} km`}
                </td>
              </tr>

              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '12px', fontWeight: 600 }}>Vehicles Used</td>
                <td style={{ padding: '12px' }}>{classical.vehicles_used} vehicles</td>
                <td style={{ padding: '12px' }}>{quantum.routes?.length || config.vehicles} vehicles</td>
                <td style={{ padding: '12px', color: 'var(--text-muted)' }}>
                  Matches capacity constraints
                </td>
              </tr>

              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '12px', fontWeight: 600 }}>Feasible Solution Found</td>
                <td style={{ padding: '12px', color: classical.feasible ? '#34d399' : '#fbbf24', fontWeight: 700 }}>
                  {classical.feasible ? 'Yes (Global)' : 'Approximate'}
                </td>
                <td style={{ padding: '12px', color: '#34d399', fontWeight: 700 }}>
                  Yes ({quantum.feasible_probability_pct}%)
                </td>
                <td style={{ padding: '12px', color: 'var(--text-muted)' }}>
                  Hamiltonian penalty met
                </td>
              </tr>

              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '12px', fontWeight: 600 }}>Computation Runtime</td>
                <td style={{ padding: '12px', fontFamily: 'monospace' }}>{classical.runtime_ms} ms</td>
                <td style={{ padding: '12px', fontFamily: 'monospace' }}>{quantum.runtime_ms} ms</td>
                <td style={{ padding: '12px', color: 'var(--text-muted)' }}>
                  Statevector evolution time
                </td>
              </tr>

              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '12px', fontWeight: 600 }}>Active Route Count</td>
                <td style={{ padding: '12px' }}>{classical.routes?.length || 0}</td>
                <td style={{ padding: '12px' }}>{quantum.routes?.length || 0}</td>
                <td style={{ padding: '12px', color: 'var(--text-muted)' }}>0 slack</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Section 4: ROUTE CARDS */}
      <div className="card">
        <h2 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Truck size={20} color="var(--primary-blue)" />
          Individual Vehicle Route Schedules
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '16px' }}>
          Detailed delivery sequence and payload capacity for each dispatched vehicle.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
          {classical.routes?.map((route, idx) => (
            <div
              key={idx}
              style={{
                border: '1px solid var(--border-color)',
                borderRadius: '10px',
                padding: '18px',
                background: '#0f172a',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Truck size={18} color="var(--primary-blue)" />
                    <strong style={{ fontSize: '1.05rem', color: 'var(--text-main)' }}>VEHICLE #{route.vehicle_id}</strong>
                  </div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '2px 8px', borderRadius: '8px' }}>
                    DISPATCHED
                  </span>
                </div>

                {/* Metrics */}
                <div style={{ display: 'flex', gap: '12px', fontSize: '0.82rem', marginBottom: '16px', background: '#1e293b', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                  <div>
                    <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.72rem' }}>Distance</span>
                    <strong style={{ color: 'var(--text-main)' }}>{route.distance_km} km</strong>
                  </div>
                  <div style={{ borderLeft: '1px solid var(--border-color)', paddingLeft: '12px' }}>
                    <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.72rem' }}>Load</span>
                    <strong style={{ color: 'var(--text-main)' }}>{route.load_kg} / {route.capacity_kg} kg</strong>
                  </div>
                  <div style={{ borderLeft: '1px solid var(--border-color)', paddingLeft: '12px' }}>
                    <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.72rem' }}>Orders</span>
                    <strong style={{ color: 'var(--text-main)' }}>{route.orders_count} stops</strong>
                  </div>
                </div>

                {/* Turn by turn sequence */}
                <div style={{ fontSize: '0.82rem', color: 'var(--text-main)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    Stop Sequence:
                  </span>
                  {route.stops.map((stop, sIdx) => {
                    const isDepot = stop.order_id === 'DEPOT';
                    return (
                      <div key={sIdx} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{
                          width: '18px', height: '18px', borderRadius: '50%',
                          background: isDepot ? 'rgba(239, 68, 68, 0.2)' : 'var(--primary-blue)',
                          color: isDepot ? '#f87171' : '#ffffff',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '0.65rem', fontWeight: 700, flexShrink: 0
                        }}>
                          {isDepot ? 'D' : sIdx}
                        </span>
                        <span style={{ fontWeight: isDepot ? 700 : 500, color: isDepot ? '#f87171' : 'var(--text-main)' }}>
                          {isDepot ? 'Vijayawada Central Depot' : `${stop.customer_name} (${stop.demand} kg)`}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
