/**
 * OSRM Road-Following Routing Service
 * Converts stop coordinate sequences into real road-following street geometries
 * using the free OpenStreetMap OSRM routing engine.
 */

// In-memory cache to prevent redundant HTTP queries
const routeCache = new Map();

/**
 * Fetch road geometry for a sequence of stops from OSRM
 * @param {Array<{latitude: number, longitude: number}>} stops 
 * @returns {Promise<Array<[number, number]>>} Array of [lat, lng] points
 */
export async function getOsrmRouteGeometry(stops) {
  if (!stops || stops.length < 2) {
    return stops.map(s => [s.latitude, s.longitude]);
  }

  // Generate cache key from stop coordinates
  const cacheKey = stops
    .map(s => `${Number(s.latitude).toFixed(5)},${Number(s.longitude).toFixed(5)}`)
    .join(';');

  if (routeCache.has(cacheKey)) {
    return routeCache.get(cacheKey);
  }

  // OSRM expects coordinates formatted as "lng,lat;lng,lat;..."
  const coordinatesParam = stops
    .map(s => `${s.longitude},${s.latitude}`)
    .join(';');

  const url = `https://router.project-osrm.org/route/v1/driving/${coordinatesParam}?overview=full&geometries=geojson`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000); // 6s timeout

    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`OSRM responded with status ${res.status}`);
    }

    const data = await res.json();

    if (data.code === 'Ok' && data.routes && data.routes.length > 0) {
      // OSRM GeoJSON coordinates are [longitude, latitude]
      // Leaflet Polyline expects [latitude, longitude]
      const roadCoordinates = data.routes[0].geometry.coordinates.map(coord => [
        coord[1], // latitude
        coord[0]  // longitude
      ]);

      routeCache.set(cacheKey, roadCoordinates);
      return roadCoordinates;
    }
  } catch (err) {
    console.warn('OSRM road routing fallback to direct stop line:', err.message);
  }

  // Fallback to straight-line stops if OSRM is offline or timed out
  const fallbackPoints = stops.map(s => [s.latitude, s.longitude]);
  return fallbackPoints;
}

/**
 * Convert all vehicle routes into road-following polyline coordinates
 * @param {Array<Object>} routes 
 * @param {Object} depot { latitude, longitude }
 * @returns {Promise<Array<{ vehicleId: number, coordinates: Array<[number, number]>, route: Object }>>}
 */
export async function getVehicleRoadGeometries(routes = [], depot) {
  if (!routes || routes.length === 0) return [];

  const promises = routes.map(async (route) => {
    // Construct full route stop sequence including depot start & end if needed
    let fullStops = [];
    if (route.stops && route.stops.length > 0) {
      fullStops = route.stops;
    } else if (route.coordinates && route.coordinates.length > 0) {
      fullStops = route.coordinates;
    }

    // Ensure stops have valid lat & lng
    const validStops = fullStops.filter(s => 
      s && typeof s.latitude === 'number' && typeof s.longitude === 'number'
    );

    if (validStops.length < 2) {
      return {
        vehicleId: route.vehicle_id,
        coordinates: validStops.map(s => [s.latitude, s.longitude]),
        route
      };
    }

    const roadCoords = await getOsrmRouteGeometry(validStops);
    return {
      vehicleId: route.vehicle_id,
      coordinates: roadCoords,
      route
    };
  });

  return Promise.all(promises);
}
