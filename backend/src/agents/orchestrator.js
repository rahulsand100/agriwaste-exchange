import { wasteAgent } from './wasteAgent.js';
import { demandAgent } from './demandAgent.js';
import { locationAgent } from './locationAgent.js';
import { valueAgent } from './valueAgent.js';
import { matchingAgent } from './matchingAgent.js';

// Plan: each step has a guard so the orchestrator can stop early and explain why.
const PLAN = [
  { agent: wasteAgent,    ok: (c) => c.waste?.type && c.waste.type !== 'unknown', why: 'Residue not identified' },
  { agent: demandAgent,   ok: (c) => c.demand?.length > 0, why: 'No buyers need this residue yet' },
  { agent: locationAgent, ok: (c) => c.candidates?.length > 0, why: 'No suitable buyer within radius' },
  { agent: valueAgent,    ok: () => true },
  { agent: matchingAgent, ok: (c) => c.matches?.length > 0, why: 'No viable match' }
];

export async function runOrchestrator(input) {
  const ctx = { input, trace: [] };
  for (const step of PLAN) {
    Object.assign(ctx, await step.agent(ctx));
    if (!step.ok(ctx)) { ctx.stoppedBecause = step.why; break; }
  }
  const best = ctx.matches?.[0];
  return {
    waste: ctx.waste, matches: ctx.matches || [], trace: ctx.trace, stoppedBecause: ctx.stoppedBecause || null,
    pathway: best ? `${input.quantityTonnes} t ${ctx.waste.type.replace('_', ' ')} → ${best.buyer.name} (${best.distanceKm} km). Awaiting farmer confirmation.` : null
  };
}
