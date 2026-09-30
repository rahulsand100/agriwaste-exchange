import { estimateValue } from '../tools.js';
export async function valueAgent(ctx) {
  const candidates = ctx.candidates.map((c) => ({ ...c, value: estimateValue({ type: ctx.waste.type, quantityTonnes: ctx.input.quantityTonnes, distanceKm: c.distanceKm }) }));
  ctx.trace.push({ agent: 'Value Agent', status: 'done', message: 'Indicative estimate generated', tool: 'estimateValue()' });
  return { candidates };
}
