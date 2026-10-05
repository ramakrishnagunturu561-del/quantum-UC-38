import React from 'react';
import { Database, CheckCircle } from 'lucide-react';

export const DatasetUploader = ({ datasetMeta }) => {
  return (
    <div className="card">
      <h2 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Database size={20} color="var(--primary-blue)" />
        Dataset Configuration
      </h2>
      
      {!datasetMeta ? (
        <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
          <div className="animate-spin" style={{ display: 'inline-block', marginBottom: '16px' }}>
            <Database size={32} />
          </div>
          <p>Loading dataset from backend...</p>
        </div>
      ) : (
        <div className="status-success" style={{ marginBottom: 0, border: '1px solid #bbf7d0' }}>
          <CheckCircle size={24} className="icon" />
          <div style={{ width: '100%' }}>
            <h4 style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              Dataset loaded successfully
              <span style={{ fontSize: '0.75rem', backgroundColor: '#bbf7d0', color: '#166534', padding: '2px 8px', borderRadius: '12px' }}>● Ready</span>
            </h4>
            <p style={{ fontFamily: 'monospace', margin: '8px 0', fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-main)' }}>
              {datasetMeta.name}
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '12px', fontSize: '0.875rem' }}>
              <div style={{ backgroundColor: '#0f172a', border: '1px solid var(--border-color)', padding: '8px', borderRadius: '4px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Locations:</span> <strong style={{ color: 'var(--text-main)' }}>{datasetMeta.nodes}</strong>
              </div>
              <div style={{ backgroundColor: '#0f172a', border: '1px solid var(--border-color)', padding: '8px', borderRadius: '4px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Vehicles:</span> <strong style={{ color: 'var(--text-main)' }}>{datasetMeta.vehicles}</strong>
              </div>
              <div style={{ backgroundColor: '#0f172a', border: '1px solid var(--border-color)', padding: '8px', borderRadius: '4px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Capacity:</span> <strong style={{ color: 'var(--text-main)' }}>{datasetMeta.capacity}</strong>
              </div>
              <div style={{ backgroundColor: '#0f172a', border: '1px solid var(--border-color)', padding: '8px', borderRadius: '4px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Depot:</span> <strong style={{ color: 'var(--text-main)' }}>{datasetMeta.depot}</strong>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
