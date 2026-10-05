import React, { useState } from 'react';
import { 
  Package, Plus, Trash2, RefreshCw, AlertTriangle, 
  MapPin, CheckCircle2, ShieldAlert, X, ExternalLink
} from 'lucide-react';
import { useOptimization } from '../context/OptimizationContext';
import { optimizationApi } from '../api/optimizationApi';

export const LiveOrders = () => {
  const { orders, ordersLoading, ordersError, refreshOrders, backendOnline } = useOptimization();

  const [showAddModal, setShowAddModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [actionError, setActionError] = useState(null);

  // New order form fields
  const [formData, setFormData] = useState({
    customer_name: '',
    address: '',
    demand: 10,
    latitude: 16.5062,
    longitude: 80.6480
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'demand' || name === 'latitude' || name === 'longitude' 
        ? Number(value) 
        : value
    }));
  };

  const handleCreateOrder = async (e) => {
    e.preventDefault();
    if (!formData.customer_name.trim()) {
      setActionError('Customer name is required.');
      return;
    }
    if (formData.demand <= 0) {
      setActionError('Demand must be greater than 0 kg.');
      return;
    }

    setSubmitting(true);
    setActionError(null);
    try {
      await optimizationApi.createOrder(formData);
      setShowAddModal(false);
      setFormData({
        customer_name: '',
        address: '',
        demand: 10,
        latitude: 16.5062,
        longitude: 80.6480
      });
      await refreshOrders();
    } catch (err) {
      setActionError(err.message || 'Failed to create order on backend.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm(`Delete order ${orderId}?`)) return;
    try {
      await optimizationApi.deleteOrder(orderId);
      await refreshOrders();
    } catch (err) {
      alert(`Could not delete order: ${err.message}`);
    }
  };

  const handleResetSeed = async () => {
    try {
      await optimizationApi.seedOrders();
      await refreshOrders();
    } catch (err) {
      alert(`Failed to seed sample orders: ${err.message}`);
    }
  };

  const totalDemand = orders.reduce((sum, o) => sum + (o.demand || 0), 0);
  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const assignedOrders = orders.filter(o => o.status === 'assigned').length;

  return (
    <div className="content-area">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '3px 10px',
              borderRadius: '12px',
              fontSize: '0.75rem',
              fontWeight: 700,
              background: backendOnline ? '#ecfdf5' : '#fef2f2',
              color: backendOnline ? '#059669' : '#dc2626',
              border: `1px solid ${backendOnline ? '#a7f3d0' : '#fca5a5'}`
            }}>
              <span style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                background: backendOnline ? '#10b981' : '#ef4444'
              }} />
              {backendOnline ? 'Backend Connected' : 'Backend Unavailable'}
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Source: <code>GET /api/orders</code>
            </span>
          </div>

          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Package size={28} color="var(--primary-blue)" />
            Live Delivery Orders
          </h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '4px' }}>
            Real-time delivery requests for Vijayawada logistics network from FastAPI Orders API.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button
            onClick={refreshOrders}
            disabled={ordersLoading}
            className="btn btn-secondary"
            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 14px' }}
          >
            <RefreshCw size={15} className={ordersLoading ? 'animate-pulse' : ''} />
            Refresh
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="btn btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 16px' }}
          >
            <Plus size={18} />
            Add Order
          </button>
        </div>
      </div>

      {/* Backend Offline Banner */}
      {!backendOnline && (
        <div style={{
          backgroundColor: '#fef2f2',
          color: '#b91c1c',
          padding: '14px 18px',
          borderRadius: '10px',
          marginBottom: '24px',
          border: '1px solid #fca5a5',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <ShieldAlert size={22} />
          <div>
            <strong>Backend unavailable.</strong> Ensure the FastAPI server is running on <code>http://localhost:8000</code>.
          </div>
        </div>
      )}

      {ordersError && (
        <div style={{
          backgroundColor: '#fef2f2',
          color: '#b91c1c',
          padding: '12px 16px',
          borderRadius: '8px',
          marginBottom: '20px',
          border: '1px solid #fca5a5'
        }}>
          <strong>Error: </strong> {ordersError}
        </div>
      )}

      {/* KPI Cards */}
      <div className="stats-grid" style={{ marginBottom: '24px' }}>
        <div className="card">
          <div className="stat-header">
            <span className="stat-title">Total Active Orders</span>
            <div className="stat-icon-wrapper" style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa' }}>
              <Package size={20} />
            </div>
          </div>
          <div className="stat-value">{orders.length}</div>
          <div className="stat-subtitle">Current backend database entries</div>
        </div>

        <div className="card">
          <div className="stat-header">
            <span className="stat-title">Pending Dispatch</span>
            <div className="stat-icon-wrapper" style={{ background: 'rgba(217, 119, 6, 0.15)', color: '#fbbf24' }}>
              <AlertTriangle size={20} />
            </div>
          </div>
          <div className="stat-value" style={{ color: '#fbbf24' }}>{pendingOrders}</div>
          <div className="stat-subtitle">Awaiting route assignment</div>
        </div>

        <div className="card">
          <div className="stat-header">
            <span className="stat-title">Total Demand</span>
            <div className="stat-icon-wrapper" style={{ background: 'rgba(139, 92, 246, 0.15)', color: '#c084fc' }}>
              <MapPin size={20} />
            </div>
          </div>
          <div className="stat-value" style={{ color: '#c084fc' }}>
            {totalDemand} <span style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--text-muted)' }}>kg</span>
          </div>
          <div className="stat-subtitle">Combined payload across all orders</div>
        </div>

        <div className="card">
          <div className="stat-header">
            <span className="stat-title">Assigned / In Route</span>
            <div className="stat-icon-wrapper" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399' }}>
              <CheckCircle2 size={20} />
            </div>
          </div>
          <div className="stat-value" style={{ color: '#34d399' }}>{assignedOrders}</div>
          <div className="stat-subtitle">Optimized into delivery vehicles</div>
        </div>
      </div>

      {/* Table Card */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <h2 className="card-title" style={{ margin: 0 }}>Vijayawada Deliveries</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginTop: '2px' }}>
              Live orders retrieved directly from <code>/api/orders</code>.
            </p>
          </div>

          {orders.length === 0 && (
            <button
              onClick={handleResetSeed}
              className="btn btn-secondary"
              style={{ fontSize: '0.8rem', padding: '6px 12px' }}
            >
              Seed Sample Orders
            </button>
          )}
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ background: '#0f172a', borderBottom: '2px solid var(--border-color)', textAlign: 'left', color: 'var(--text-muted)' }}>
                <th style={{ padding: '12px' }}>Order ID</th>
                <th style={{ padding: '12px' }}>Customer</th>
                <th style={{ padding: '12px' }}>Address</th>
                <th style={{ padding: '12px' }}>Latitude</th>
                <th style={{ padding: '12px' }}>Longitude</th>
                <th style={{ padding: '12px' }}>Demand</th>
                <th style={{ padding: '12px' }}>Status</th>
                <th style={{ padding: '12px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {ordersLoading && orders.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ padding: '36px', textAlign: 'center', color: 'var(--text-muted)' }}>
                    Loading orders from backend…
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ padding: '36px', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No delivery orders found. Click <strong>"+ Add Order"</strong> or <strong>"Seed Sample Orders"</strong> to create live orders.
                  </td>
                </tr>
              ) : (
                orders.map((o) => (
                  <tr key={o.order_id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '12px', fontWeight: 700, color: 'var(--quantum-purple)', fontFamily: 'monospace' }}>
                      {o.order_id}
                    </td>
                    <td style={{ padding: '12px', fontWeight: 600 }}>{o.customer_name}</td>
                    <td style={{ padding: '12px', color: 'var(--text-muted)', fontSize: '0.82rem', maxWidth: '240px' }}>
                      {o.address || '—'}
                    </td>
                    <td style={{ padding: '12px', fontFamily: 'monospace', fontSize: '0.82rem' }}>
                      {typeof o.latitude === 'number' ? o.latitude.toFixed(4) : o.latitude}
                    </td>
                    <td style={{ padding: '12px', fontFamily: 'monospace', fontSize: '0.82rem' }}>
                      {typeof o.longitude === 'number' ? o.longitude.toFixed(4) : o.longitude}
                    </td>
                    <td style={{ padding: '12px' }}>
                      <span style={{ background: '#0f172a', border: '1px solid var(--border-color)', color: 'var(--text-main)', padding: '4px 8px', borderRadius: '8px', fontWeight: 700 }}>
                        {o.demand} kg
                      </span>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <span style={{
                        display: 'inline-block',
                        padding: '3px 10px',
                        borderRadius: '12px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        background: o.status === 'assigned' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                        color: o.status === 'assigned' ? '#34d399' : '#fbbf24',
                        border: `1px solid ${o.status === 'assigned' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`
                      }}>
                        {o.status === 'assigned' ? 'In Route' : 'Pending'}
                      </span>
                    </td>
                    <td style={{ padding: '12px', textAlign: 'right' }}>
                      <button
                        onClick={() => handleDeleteOrder(o.order_id)}
                        title="Delete Order"
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: '#94a3b8',
                          cursor: 'pointer',
                          padding: '4px',
                          borderRadius: '4px'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.color = '#ef4444'}
                        onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Order Modal */}
      {showAddModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(11, 19, 43, 0.75)',
          backdropFilter: 'blur(5px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '16px'
        }}>
          <div style={{
            background: 'var(--card-bg)',
            border: '1px solid var(--border-color)',
            color: 'var(--text-main)',
            borderRadius: '12px',
            width: '100%',
            maxWidth: '500px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
            overflow: 'hidden'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '16px 20px',
              borderBottom: '1px solid var(--border-color)',
              background: '#0f172a'
            }}>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Plus size={18} color="var(--primary-blue)" />
                Add New Delivery Order
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateOrder} style={{ padding: '20px' }}>
              {actionError && (
                <div style={{
                  background: 'rgba(239, 68, 68, 0.15)',
                  color: '#f87171',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  padding: '10px 14px',
                  borderRadius: '6px',
                  marginBottom: '16px',
                  fontSize: '0.85rem'
                }}>
                  {actionError}
                </div>
              )}

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                  Customer Name *
                </label>
                <input
                  type="text"
                  name="customer_name"
                  required
                  placeholder="e.g. Benz Circle Superstore"
                  value={formData.customer_name}
                  onChange={handleInputChange}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid var(--border-color)', fontSize: '0.9rem' }}
                />
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                  Delivery Address / Landmark
                </label>
                <input
                  type="text"
                  name="address"
                  placeholder="e.g. Ring Road, Benz Circle, Vijayawada"
                  value={formData.address}
                  onChange={handleInputChange}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid var(--border-color)', fontSize: '0.9rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                    Latitude (Vijayawada: ~16.50)
                  </label>
                  <input
                    type="number"
                    step="0.0001"
                    name="latitude"
                    required
                    value={formData.latitude}
                    onChange={handleInputChange}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid var(--border-color)', fontSize: '0.9rem', fontFamily: 'monospace' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                    Longitude (Vijayawada: ~80.64)
                  </label>
                  <input
                    type="number"
                    step="0.0001"
                    name="longitude"
                    required
                    value={formData.longitude}
                    onChange={handleInputChange}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid var(--border-color)', fontSize: '0.9rem', fontFamily: 'monospace' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                  Demand / Package Weight (kg) *
                </label>
                <input
                  type="number"
                  name="demand"
                  min="1"
                  max="200"
                  required
                  value={formData.demand}
                  onChange={handleInputChange}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid var(--border-color)', fontSize: '0.9rem' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="btn btn-secondary"
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={submitting}
                >
                  {submitting ? 'Creating...' : 'Create Order'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
