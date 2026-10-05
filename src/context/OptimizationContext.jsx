import React, { createContext, useContext, useState, useEffect } from 'react';
import { optimizationApi } from '../api/optimizationApi';

const OptimizationContext = createContext(null);

export const OptimizationProvider = ({ children }) => {
  const [latestResult, setLatestResult] = useState(() => {
    try {
      const saved = localStorage.getItem('quantum_route_latest_result');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [backendOnline, setBackendOnline] = useState(false);
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState(null);

  // Check health and load initial orders
  const refreshOrders = async () => {
    setOrdersLoading(true);
    setOrdersError(null);
    try {
      const data = await optimizationApi.getOrders();
      setOrders(data);
      setBackendOnline(true);
    } catch (err) {
      setOrdersError(err.message || 'Backend unavailable');
      setBackendOnline(false);
    } finally {
      setOrdersLoading(false);
    }
  };

  // Poll backend health and latest optimization on mount
  useEffect(() => {
    refreshOrders();

    // Check if backend already has a latest result
    optimizationApi.getLatestOptimization()
      .then(res => {
        if (res && res.status === 'success') {
          setLatestResult(res);
          localStorage.setItem('quantum_route_latest_result', JSON.stringify(res));
        }
      })
      .catch(() => {});

    const interval = setInterval(async () => {
      const health = await optimizationApi.checkHealth();
      setBackendOnline(health.online);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  const saveOptimizationResult = (result) => {
    setLatestResult(result);
    try {
      localStorage.setItem('quantum_route_latest_result', JSON.stringify(result));
    } catch {}
    // Refresh orders to reflect 'assigned' status
    refreshOrders();
  };

  const clearOptimizationResult = () => {
    setLatestResult(null);
    try {
      localStorage.removeItem('quantum_route_latest_result');
    } catch {}
  };

  return (
    <OptimizationContext.Provider
      value={{
        latestResult,
        saveOptimizationResult,
        clearOptimizationResult,
        backendOnline,
        orders,
        ordersLoading,
        ordersError,
        refreshOrders
      }}
    >
      {children}
    </OptimizationContext.Provider>
  );
};

export const useOptimization = () => {
  const ctx = useContext(OptimizationContext);
  if (!ctx) {
    throw new Error('useOptimization must be used within an OptimizationProvider');
  }
  return ctx;
};
