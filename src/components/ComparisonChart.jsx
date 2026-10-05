import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export const ComparisonChart = ({ result }) => {
  if (!result) return null;

  const shotsData = [
    {
      name: 'QAOA Shots',
      valid: result.quantum.valid_shots,
      invalid: result.quantum.shots - result.quantum.valid_shots
    }
  ];

  const pieData = [
    { name: 'Optimal', value: result.quantum.optimal_probability },
    { name: 'Other', value: 100 - result.quantum.optimal_probability }
  ];
  const COLORS = ['var(--quantum-purple)', '#e2e8f0'];

  return (
    <>
      <div className="card" style={{ height: '100%' }}>
        <h3 className="card-title" style={{ fontSize: '1.125rem' }}>QAOA Results</h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
          <div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>QAOA Depth</div>
            <div style={{ fontWeight: 600 }}>p = {result.quantum.qaoa_depth}</div>
          </div>
          <div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Qubits</div>
            <div style={{ fontWeight: 600 }}>{result.quantum.qubits}</div>
          </div>
          <div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Total Shots</div>
            <div style={{ fontWeight: 600 }}>{result.quantum.shots}</div>
          </div>
          <div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Valid Shots</div>
            <div style={{ fontWeight: 600, color: 'var(--success-green)' }}>{result.quantum.valid_shots}</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '24px', backgroundColor: '#f8fafc', padding: '16px', borderRadius: '8px', marginBottom: '24px' }}>
          <div style={{ width: '80px', height: '80px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  innerRadius={30}
                  outerRadius={40}
                  startAngle={90}
                  endAngle={-270}
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Optimal Route Probability</div>
            <div style={{ fontWeight: 700, fontSize: '1.5rem', color: 'var(--quantum-purple)' }}>{result.quantum.optimal_probability}%</div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '4px' }}>Best Route Found</div>
          <div style={{ fontFamily: 'monospace', fontWeight: 600, fontSize: '1.125rem', marginBottom: '12px' }}>
            {result.quantum.route.join(' → ')}
          </div>
          
          <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '4px' }}>Best Distance</div>
          <div style={{ fontWeight: 700, fontSize: '1.25rem', color: 'var(--quantum-purple)' }}>{result.quantum.distance}</div>
        </div>
      </div>
      
      <div className="card">
        <h3 className="card-title" style={{ fontSize: '1rem' }}>QAOA Shot Distribution</h3>
        <div style={{ height: '100px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={shotsData} layout="vertical" margin={{ top: 0, right: 30, left: 40, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" hide />
              <YAxis type="category" dataKey="name" hide />
              <Tooltip cursor={{fill: 'transparent'}} />
              <Bar dataKey="valid" name="Valid Shots" stackId="a" fill="var(--success-green)" radius={[4, 0, 0, 4]} />
              <Bar dataKey="invalid" name="Invalid Shots" stackId="a" fill="#ef4444" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
};
