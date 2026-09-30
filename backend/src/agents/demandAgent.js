import { searchBuyerRequirements } from '../tools.js';
export async function demandAgent(ctx) {
  const demand = await searchBuyerRequirements({ type: ctx.waste.type });
  ctx.trace.push({ agent: 'Demand Agent', status: demand.length ? 'done' : 'failed', message: `${demand.length} requirements found`, tool: 'searchBuyerRequirements()' });
  return { demand };
}
