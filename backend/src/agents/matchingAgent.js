import { createMatch } from '../tools.js';
import { MAX_RADIUS_KM } from '../config.js';
// Score = demand fit (0..1) * proximity (0..1). Transparent, explainable weights.
export async function matchingAgent(ctx) {
  const q = ctx.input.quantityTonnes;
  const matches = ctx.candidates.map((c) => {
    const fit = Math.min(1, c.buyer.demandTonnes / q);
    const proximity = 1 - c.distanceKm / MAX_RADIUS_KM;
    const score = +(0.5 * fit + 0.5 * proximity).toFixed(3);
    return createMatch({ listing: { type: ctx.waste.type, quantityTonnes: q, location: ctx.input.location }, buyer: c.buyer, distanceKm: c.distanceKm, value: c.value, score });
  }).sort((a, b) => b.score - a.score);
  ctx.trace.push({ agent: 'Matching Agent', status: matches.length ? 'done' : 'failed', message: `${matches.length} matches found`, tool: 'createMatch()' });
  return { matches };
}
