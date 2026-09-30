import { runOrchestrator } from './agents/orchestrator.js';
import { logisticsAgent } from './agents/logisticsAgent.js';
const r = await runOrchestrator({ text: '2 tonnes rice straw', quantityTonnes: 2, location: 'Nabha' });
for (const t of r.trace) console.log(`${t.status === 'done' ? '✓' : '✗'} ${t.agent} — ${t.message}`);
console.log('\nPathway:', r.pathway);
if (r.matches[0]) { const { trace } = await logisticsAgent(r.matches[0]); console.log(`✓ ${trace.agent} — ${trace.message}`); }
