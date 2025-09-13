'use client';

// Simple Haversine distance in meters
function distanceMeters(lat1, lon1, lat2, lon2) {
  const toRad = (d) => (d * Math.PI) / 180;
  const R = 6371000;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) ** 2 +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Provider-agnostic search. Default uses OpenStreetMap Nominatim (no key, fair-use only)
async function nominatimSearch({ query, latitude, longitude, limit, radiusMeters }) {
  const qLower = query.toLowerCase();
  if (qLower.includes('hiking') || qLower.includes('trail') || qLower.includes('trek')) {
    radiusMeters = Math.max(radiusMeters, 50000);
  }
  // Build a bounding box around user's location to constrain results nearby
  let bboxParam = '';
  if (latitude != null && longitude != null) {
    const lat = Number(latitude);
    const lon = Number(longitude);
    const degLat = radiusMeters / 111000; // ~111km per degree latitude
    const degLon = radiusMeters / (111000 * Math.cos((lat * Math.PI) / 180) || 1);
    const minLon = lon - degLon;
    const minLat = lat - degLat;
    const maxLon = lon + degLon;
    const maxLat = lat + degLat;
    bboxParam = `&viewbox=${minLon},${maxLat},${maxLon},${minLat}&bounded=1`;
  }
  const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&addressdetails=1&extratags=1&limit=${limit}${bboxParam}&q=${encodeURIComponent(query)}`;
  const res = await fetch(url, { headers: { 'Accept-Language': 'en' } });
  if (!res.ok) throw new Error('Place search failed');
  const data = await res.json();
  const withCoords = data.map((p) => ({
    id: p.place_id,
    name: p.display_name?.split(',')[0] || p.display_name,
    displayName: p.display_name,
    lat: parseFloat(p.lat),
    lon: parseFloat(p.lon),
    type: p.type,
    category: p.category,
    address: p.address || {},
    url: `https://www.openstreetmap.org/?mlat=${p.lat}&mlon=${p.lon}#map=18/${p.lat}/${p.lon}`,
  }));

  if (latitude != null && longitude != null) {
    const annotated = withCoords.map((p) => ({
      ...p,
      distanceMeters: distanceMeters(latitude, longitude, p.lat, p.lon),
    }));
    const within = annotated.filter((p) => p.distanceMeters <= radiusMeters);
    const list = within.length > 0 ? within : annotated;
    list.sort((a, b) => (a.distanceMeters ?? Infinity) - (b.distanceMeters ?? Infinity));
    return list;
  }
  return withCoords;
}

export async function searchPlaces({ query, latitude, longitude, limit = 10, radiusMeters = 15000, provider = 'nominatim', apiKey }) {
  if (!query) throw new Error('query required');
  if (provider === 'nominatim') {
    return nominatimSearch({ query, latitude, longitude, limit, radiusMeters });
  }

  if (provider === 'google' && apiKey) {
    try {
      // Use Places Text Search API
      const locParam = latitude != null && longitude != null ? `&location=${latitude},${longitude}&radius=${Math.floor(radiusMeters)}` : '';
      const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}${locParam}&key=${apiKey}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Google Places search failed');
      const data = await res.json();
      if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
        throw new Error(`Google Places error: ${data.status}`);
      }
      const results = (data.results || []).map((r) => ({
        id: r.place_id,
        name: r.name,
        displayName: `${r.name}, ${r.formatted_address || ''}`,
        lat: r.geometry?.location?.lat,
        lon: r.geometry?.location?.lng,
        type: r.types?.[0],
        address: { formatted: r.formatted_address },
        url: r.url || (r.geometry?.location ? `https://www.google.com/maps/search/?api=1&query=${r.geometry.location.lat},${r.geometry.location.lng}` : undefined),
        rating: r.rating,
        userRatingsTotal: r.user_ratings_total,
        priceLevel: r.price_level, // 0-4
        openNow: r.opening_hours?.open_now,
        businessStatus: r.business_status,
      }));
      if (latitude != null && longitude != null) {
        results.forEach((p) => {
          if (p.lat != null && p.lon != null) {
            p.distanceMeters = distanceMeters(latitude, longitude, p.lat, p.lon);
          }
        });
        results.sort((a, b) => (a.distanceMeters ?? Infinity) - (b.distanceMeters ?? Infinity));
      }
      return results;
    } catch (err) {
      // Fallback to nominatim on network/CORS failure
      return nominatimSearch({ query, latitude, longitude, limit, radiusMeters });
    }
  }

  // Fallback
  throw new Error(`Unsupported provider: ${provider}`);
}

// Build robust search variants for common activity intents
export function buildQueryVariants(seed) {
  const q = (seed || '').toLowerCase();
  const variants = new Set();
  const add = (v) => variants.add(v);
  
  if (/coffee|cafe|caf[eé]/.test(q)) {
    ['coffee', 'cafe', 'coffee shop', 'cafeteria', 'espresso'].forEach(add);
  }
  if (/brunch|breakfast/.test(q)) {
    ['brunch', 'breakfast cafe', 'pancake', 'bakery', 'diner'].forEach(add);
  }
  if (/dinner|family/.test(q)) {
    ['family restaurant', 'dinner restaurant', 'casual dining', 'restaurant'].forEach(add);
  }
  if (/hike|trail|trek/.test(q)) {
    ['hiking trail', 'nature trail', 'park', 'national park', 'scenic hike'].forEach(add);
  }
  if (/movie|cinema/.test(q)) {
    ['cinema', 'movie theater'].forEach(add);
  }
  if (/read|book/.test(q)) {
    ['library', 'bookstore'].forEach(add);
  }
  if (/game|gaming/.test(q)) {
    ['gaming cafe', 'arcade', 'board game cafe'].forEach(add);
  }
  if (/music/.test(q)) {
    ['live music', 'music venue', 'concert'].forEach(add);
  }
  if (/photo|photography|sunset|view/.test(q)) {
    ['viewpoint', 'scenic spot', 'lookout point', 'sunset point'].forEach(add);
  }
  if (/shop|mall|market/.test(q)) {
    ['shopping mall', 'market', 'bazaar', 'shopping center'].forEach(add);
  }
  if (variants.size === 0) add(seed); // default
  return Array.from(variants);
}

// Try multiple variants until we get results; prefer Google, fallback to Nominatim per attempt
export async function searchPlacesMulti({ seedQuery, latitude, longitude, providerPrimary = 'google', apiKey, limit = 15, radiusMeters = 20000 }) {
  const candidates = buildQueryVariants(seedQuery);
  for (const q of candidates) {
    try {
      if (providerPrimary === 'google' && apiKey) {
        const res = await searchPlaces({ query: q, latitude, longitude, limit, radiusMeters, provider: 'google', apiKey });
        if (res && res.length) return res;
      }
      const res2 = await searchPlaces({ query: q, latitude, longitude, limit, radiusMeters, provider: 'nominatim' });
      if (res2 && res2.length) return res2;
    } catch {
      // try next
    }
  }
  // As a last resort return empty array
  return [];
}

const placeSearchUtils = { searchPlaces };
export default placeSearchUtils;


