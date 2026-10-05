import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './pages/Dashboard';
import { LiveOrders } from './pages/LiveOrders';
import { RouteOptimization } from './pages/RouteOptimization';
import { RouteMapPage } from './pages/RouteMapPage';
import { ResultsPage } from './pages/ResultsPage';
import { OptimizationProvider } from './context/OptimizationContext';

function App() {
  return (
    <OptimizationProvider>
      <BrowserRouter>
        <div className="app-container">
          <Sidebar />
          <div className="main-content">
            <Header />
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/orders" element={<LiveOrders />} />
              <Route path="/optimization" element={<RouteOptimization />} />
              <Route path="/map" element={<RouteMapPage />} />
              <Route path="/results" element={<ResultsPage />} />
              {/* Fallback route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </OptimizationProvider>
  );
}

export default App;
