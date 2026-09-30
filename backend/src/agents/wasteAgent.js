import { classifyWaste } from '../tools.js';
export async function wasteAgent(ctx) {
  const waste = await classifyWaste({ text: ctx.input.text, imageUrl: ctx.input.imageUrl });
  ctx.trace.push({ agent: 'Waste Agent', status: waste.type === 'unknown' ? 'failed' : 'done',
    message: waste.type === 'unknown' ? 'Could not identify residue' : `${waste.type.replace('_', ' ')} identified`, tool: 'classifyWaste()' });
  return { waste };
}
