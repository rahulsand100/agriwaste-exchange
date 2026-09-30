import { geocode, calculateDistance } from '../tools.js';
import { MAX_RADIUS_KM } from '../config.js';
export async function locationAgent(ctx) {
  const origin = geocode(ctx.input.location);
  if (!origin) { ctx.trace.push({ agent: 'Location Agent', status: 'failed', message: `Unknown location "${ctx.input.location}"`, tool: 'calculateDistance()' }); return { origin: null, candidates: [] }; }
  const candidates = ctx.demand
    .map((b) => ({ buyer: b, distanceKm: calculateDistance(origin, b) }))
    .filter((c) => c.distanceKm <= MAX_RADIUS_KM)
    .sort((a, b) => a.distanceKm - b.distanceKm);
  ctx.trace.push({ agent: 'Location Agent', status: 'done', message: candidates.length ? `Closest suitable buyer: ${candidates[0].distanceKm} km` : 'No buyer within radius', tool: 'calculateDistance()' });
  return { origin, candidates };
}
