import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

export const RouteMap = ({ nodes, route }) => {
  // Using Recharts for custom coordinate map visualization since it's X/Y coordinates, not lat/lng
  
  if (!nodes || nodes.length === 0) {
    return (
      <div className="card">
        <h2 className="card-title">Route Visualization</h2>
        <div className="map-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fafafa' }}>
          <p style={{ color: 'var(--text-muted)' }}>No dataset loaded.</p>
        </div>
      </div>
    );
  }

  // Generate path data if route is available
  const pathData = [];
  if (route && route.length > 0) {
    route.forEach(nodeId => {
      const node = nodes.find(n => n.id === nodeId);
      if (node) {
        pathData.push({ x: node.x, y: node.y, id: node.id });
      }
    });
  }

  const depotData = nodes.filter(n => n.type === 'depot');
  const customerData = nodes.filter(n => n.type === 'customer' && route?.includes(n.id));
  const otherCustomerData = nodes.filter(n => n.type === 'customer' && !route?.includes(n.id));

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h2 className="card-title" style={{ margin: 0 }}>Route Visualization</h2>
        <div style={{ display: 'flex', gap: '16px', fontSize: '0.875rem' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '12px', height: '12px', backgroundColor: '#ef4444', display: 'inline-block' }}></span>
            Depot
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '12px', height: '12px', backgroundColor: '#3b82f6', borderRadius: '50%', display: 'inline-block' }}></span>
            Customer
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '20px', height: '2px', backgroundColor: 'var(--quantum-purple)', display: 'inline-block' }}></span>
            Optimized Route
          </span>
        </div>
      </div>
      
      <div className="map-container" style={{ border: 'none' }}>
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
            <XAxis type="number" dataKey="x" name="X" hide domain={['dataMin - 10', 'dataMax + 10']} />
            <YAxis type="number" dataKey="y" name="Y" hide domain={['dataMin - 10', 'dataMax + 10']} />
            <Tooltip cursor={{ strokeDasharray: '3 3' }} />
            
            {/* Draw lines manually using SVG lines inside Recharts is tricky without ComposedChart line, so we use a Line element or path.
                Actually, Recharts LineChart is better for paths but ScatterChart is better for points.
                We can just show the points for now, or use a custom shape. 
                For a true route, let's use a Line connecting the pathData */}
            
            {pathData.length > 1 && pathData.map((point, index) => {
              if (index === pathData.length - 1) return null;
              const nextPoint = pathData[index + 1];
              return (
                <ReferenceLine 
                  key={`line-${index}`}
                  segment={[{ x: point.x, y: point.y }, { x: nextPoint.x, y: nextPoint.y }]}
                  stroke="var(--quantum-purple)"
                  strokeWidth={2}
                  opacity={0.8}
                />
              );
            })}

            <Scatter name="Other Customers" data={otherCustomerData} fill="#9ca3af" />
            <Scatter name="Customers" data={customerData} fill="#3b82f6" shape="circle" />
            <Scatter name="Depot" data={depotData} fill="#ef4444" shape="square" />
            
          </ScatterChart>
        </ResponsiveContainer>
      </div>
      {route && route.length > 0 && (
        <div style={{ marginTop: '16px', textAlign: 'center' }}>
          <p className="route-text">
            {route.join(' → ')}
          </p>
        </div>
      )}
    </div>
  );
};
