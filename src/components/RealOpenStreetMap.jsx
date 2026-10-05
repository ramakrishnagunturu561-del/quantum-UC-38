import React, { useState, useEffect, useMemo, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Truck, MapPin, Navigation, Maximize2, Compass, RefreshCw } from 'lucide-react';
import { getVehicleRoadGeometries } from '../services/osrmRouting';

// Distinct, vibrant vehicle colors for multi-vehicle CVRP routes
const VEHICLE_COLORS = [
  '#8b5cf6', // Quantum Purple
  '#3b82f6', // Electric Blue
  '#10b981', // Emerald Green
  '#f59e0b', // Amber
  '#ec4899', // Fuchsia / Pink
  '#06b6d4', // Cyan
  '#f97316', // Orange
  '#6366f1'  // Indigo
];

// Vijayawada, Andhra Pradesh Coordinates
const VIJAYAWADA_DEPOT = {
  latitude: 16.5062,
  longitude: 80.6480,
  customer_name: 'Vijayawada Central Logistics Hub',
  address: 'Ring Road Logistics Park, Vijayawada, Andhra Pradesh',
  order_id: 'DEPOT'
};

// Create SVG-based DivIcons for crisp high-DPI Leaflet pins
const createDepotIcon = () => {
  return L.divIcon({
    className: 'custom-depot-pin',
    html: `
      <div style="
        background: #ef4444;
        color: #ffffff;
        border-radius: 50%;
        width: 34px;
        height: 34px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 15px;
        font-weight: 800;
        box-shadow: 0 4px 12px rgba(239, 68, 68, 0.45);
        border: 2.5px solid #ffffff;
        cursor: pointer;
        transition: transform 0.15s ease;
      " title="Central Depot">
        🏢
      </div>
    `,
    iconSize: [34, 34],
    iconAnchor: [17, 17],
    popupAnchor: [0, -20]
  });
};

const createOrderIcon = (order, isAssigned) => {
  const bg = isAssigned ? '#3b82f6' : '#64748b';
  return L.divIcon({
    className: 'custom-order-pin',
    html: `
      <div style="
        background: ${bg};
        color: #ffffff;
        border-radius: 8px;
        padding: 4px 7px;
        display: flex;
        align-items: center;
        gap: 4px;
        font-size: 11px;
        font-weight: 700;
        box-shadow: 0 3px 10px rgba(0,0,0,0.3);
        border: 2px solid #ffffff;
        white-space: nowrap;
        cursor: pointer;
      ">
        <span>📦</span>
        <span>${order.order_id?.replace('ORD-', '#') || ''}</span>
      </div>
    `,
    iconSize: [48, 26],
    iconAnchor: [24, 13],
    popupAnchor: [0, -16]
  });
};

// Auto-Fit Map Viewport Component
const MapViewportController = ({ points, autoFitTrigger }) => {
  const map = useMap();

  useEffect(() => {
    if (points && points.length > 0) {
      try {
        const bounds = L.latLngBounds(points);
        if (bounds.isValid()) {
          map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
        }
      } catch (e) {
        // Fallback silently if bounds invalid
      }
    }
  }, [points, autoFitTrigger, map]);

  return null;
};

export const RealOpenStreetMap = ({
  orders = [],
  routes = [],
  depot = VIJAYAWADA_DEPOT,
  height = '500px',
  showLegend = true,
  interactiveLegend = true
}) => {
  const [roadGeometries, setRoadGeometries] = useState([]);
  const [loadingRoads, setLoadingRoads] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [fitTrigger, setFitTrigger] = useState(0);

  // Compute all points on map for auto-centering
  const mapPoints = useMemo(() => {
    const pts = [[depot.latitude, depot.longitude]];
    orders.forEach(o => {
      if (typeof o.latitude === 'number' && typeof o.longitude === 'number') {
        pts.push([o.latitude, o.longitude]);
      }
    });
    return pts;
  }, [orders, depot]);

  // Set of assigned order IDs
  const assignedOrderIds = useMemo(() => {
    const set = new Set();
    routes.forEach(r => {
      (r.stops || []).forEach(s => {
        if (s.order_id && s.order_id !== 'DEPOT') {
          set.add(s.order_id);
        }
      });
    });
    return set;
  }, [routes]);

  // Fetch actual OSRM road geometry whenever routes change
  useEffect(() => {
    let isCancelled = false;

    if (!routes || routes.length === 0) {
      setRoadGeometries([]);
      return;
    }

    const loadGeometries = async () => {
      setLoadingRoads(true);
      try {
        const results = await getVehicleRoadGeometries(routes, depot);
        if (!isCancelled) {
          setRoadGeometries(results);
        }
      } catch (err) {
        console.error('Failed to resolve OSRM route geometries:', err);
      } finally {
        if (!isCancelled) {
          setLoadingRoads(false);
        }
      }
    };

    loadGeometries();

    return () => {
      isCancelled = true;
    };
  }, [routes, depot]);

  const depotIcon = useMemo(() => createDepotIcon(), []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
      {/* Top Map Action Bar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: '#0f172a',
        padding: '8px 14px',
        borderRadius: '10px',
        border: '1px solid var(--border-color)',
        fontSize: '0.82rem',
        flexWrap: 'wrap',
        gap: '8px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            color: 'var(--text-main)',
            fontWeight: 700
          }}>
            <Navigation size={15} color="var(--primary-blue)" />
            OpenStreetMap Engine
          </span>
          <span style={{ color: 'var(--text-muted)' }}>•</span>
          <span style={{ color: 'var(--text-muted)' }}>
            Vijayawada Logistics Network ({orders.length} stops)
          </span>
          {loadingRoads && (
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              color: 'var(--quantum-purple)',
              fontSize: '0.75rem',
              fontWeight: 600,
              background: 'rgba(139, 92, 246, 0.15)',
              padding: '2px 8px',
              borderRadius: '10px'
            }}>
              <RefreshCw size={12} className="animate-spin" />
              Snapping to OSRM roads…
            </span>
          )}
        </div>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button
            onClick={() => setFitTrigger(prev => prev + 1)}
            className="btn btn-secondary"
            style={{ padding: '5px 10px', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '5px' }}
            title="Fit viewport to all stops and routes"
          >
            <Maximize2 size={13} />
            Fit Map
          </button>
        </div>
      </div>

      {/* Main Leaflet Map Container */}
      <div style={{
        height,
        width: '100%',
        borderRadius: '10px',
        overflow: 'hidden',
        border: '1px solid var(--border-color)',
        position: 'relative'
      }}>
        <MapContainer
          center={[depot.latitude, depot.longitude]}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
          zoomControl={true}
        >
          {/* Free Standard OpenStreetMap TileLayer */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            maxZoom={19}
          />

          <MapViewportController points={mapPoints} autoFitTrigger={fitTrigger} />

          {/* Central Logistics Depot Marker */}
          <Marker position={[depot.latitude, depot.longitude]} icon={depotIcon}>
            <Popup>
              <div style={{ minWidth: '220px' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  marginBottom: '6px',
                  color: '#ef4444',
                  fontWeight: 700,
                  fontSize: '0.85rem'
                }}>
                  🏢 Central Logistics Depot
                </div>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '4px' }}>
                  {depot.customer_name}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                  {depot.address}
                </div>
                <div style={{
                  background: '#0f172a',
                  padding: '6px 8px',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  fontFamily: 'monospace',
                  color: '#60a5fa',
                  border: '1px solid var(--border-color)'
                }}>
                  GPS: {depot.latitude.toFixed(4)}, {depot.longitude.toFixed(4)}
                </div>
              </div>
            </Popup>
          </Marker>

          {/* Customer / Order Markers */}
          {orders.map((order) => {
            const isAssigned = assignedOrderIds.has(order.order_id);
            const icon = createOrderIcon(order, isAssigned);

            return (
              <Marker
                key={order.order_id}
                position={[order.latitude, order.longitude]}
                icon={icon}
              >
                <Popup>
                  <div style={{ minWidth: '220px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <span style={{ fontWeight: 800, color: 'var(--quantum-purple)', fontFamily: 'monospace', fontSize: '0.85rem' }}>
                        {order.order_id}
                      </span>
                      <span style={{
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        padding: '2px 6px',
                        borderRadius: '6px',
                        background: isAssigned ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                        color: isAssigned ? '#34d399' : '#fbbf24',
                        border: `1px solid ${isAssigned ? 'rgba(16, 185, 129, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`
                      }}>
                        {isAssigned ? 'In Route' : 'Pending'}
                      </span>
                    </div>

                    <div style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '3px' }}>
                      {order.customer_name}
                    </div>

                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                      {order.address || 'Vijayawada Region'}
                    </div>

                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '6px',
                      background: '#0f172a',
                      padding: '6px 8px',
                      borderRadius: '6px',
                      fontSize: '0.75rem',
                      border: '1px solid var(--border-color)',
                      marginBottom: '6px'
                    }}>
                      <div>
                        <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.68rem' }}>Demand:</span>
                        <strong style={{ color: 'var(--quantum-purple)' }}>{order.demand} kg</strong>
                      </div>
                      <div>
                        <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.68rem' }}>Location:</span>
                        <strong style={{ color: 'var(--text-main)' }}>Vijayawada</strong>
                      </div>
                    </div>

                    <div style={{ fontSize: '0.72rem', fontFamily: 'monospace', color: '#94a3b8' }}>
                      Lat: {order.latitude.toFixed(4)} | Lng: {order.longitude.toFixed(4)}
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}

          {/* Actual Solved Vehicle Route Polylines (OSRM Road-Snapping) */}
          {roadGeometries.map((rg, idx) => {
            const color = VEHICLE_COLORS[idx % VEHICLE_COLORS.length];
            const isFocussed = selectedVehicle === null || selectedVehicle === rg.vehicleId;
            const opacity = isFocussed ? 0.92 : 0.25;
            const weight = isFocussed ? (selectedVehicle === rg.vehicleId ? 6.5 : 4.5) : 3;

            return (
              <Polyline
                key={`route-${rg.vehicleId}-${idx}`}
                positions={rg.coordinates}
                pathOptions={{
                  color,
                  weight,
                  opacity,
                  lineJoin: 'round',
                  lineCap: 'round'
                }}
              >
                <Popup>
                  <div style={{ minWidth: '180px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                      <Truck size={16} color={color} />
                      <strong style={{ color: 'var(--text-main)', fontSize: '0.9rem' }}>
                        Vehicle #{rg.vehicleId} Route
                      </strong>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                      Distance: <strong style={{ color }}>{rg.route.distance_km} km</strong>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                      Payload: <strong>{rg.route.load_kg} / {rg.route.capacity_kg} kg</strong>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Total Stops: <strong>{rg.route.orders_count} deliveries</strong>
                    </div>
                  </div>
                </Popup>
              </Polyline>
            );
          })}
        </MapContainer>
      </div>

      {/* Responsive Interactive Route Legend */}
      {showLegend && routes.length > 0 && (
        <div style={{
          background: '#0f172a',
          border: '1px solid var(--border-color)',
          borderRadius: '10px',
          padding: '12px 16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Active Vehicle Route Dispatches ({routes.length} Vehicles)
            </span>
            {selectedVehicle !== null && (
              <button
                onClick={() => setSelectedVehicle(null)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--primary-blue)',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Show All Vehicles
              </button>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
            {routes.map((route, idx) => {
              const color = VEHICLE_COLORS[idx % VEHICLE_COLORS.length];
              const isSelected = selectedVehicle === route.vehicle_id;

              return (
                <div
                  key={idx}
                  onClick={() => interactiveLegend && setSelectedVehicle(isSelected ? null : route.vehicle_id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    background: isSelected ? 'rgba(59, 130, 246, 0.15)' : '#1e293b',
                    border: isSelected ? `1.5px solid ${color}` : '1px solid var(--border-color)',
                    cursor: interactiveLegend ? 'pointer' : 'default',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{
                      width: '12px',
                      height: '12px',
                      borderRadius: '3px',
                      background: color,
                      boxShadow: `0 0 6px ${color}`
                    }} />
                    <strong style={{ fontSize: '0.85rem', color: 'var(--text-main)' }}>
                      Vehicle #{route.vehicle_id}
                    </strong>
                  </div>

                  <div style={{ textAlign: 'right', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    <div><strong style={{ color }}>{route.distance_km} km</strong></div>
                    <div>{route.orders_count} stops • {route.load_kg}kg</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
