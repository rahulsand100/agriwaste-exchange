import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { runOrchestrator } from './agents/orchestrator.js';
import { logisticsAgent } from './agents/logisticsAgent.js';
import { store } from './tools.js';

const app = express();
app.use(cors()); app.use(express.json());

app.get('/api/health', (_, res) => res.json({ ok: true }));

app.post('/api/listings/analyze', async (req, res) => {
  const { text, quantityTonnes, location, imageUrl } = req.body || {};
  if (!text || !quantityTonnes || !location) return res.status(400).json({ error: 'text, quantityTonnes and location are required' });
  res.json(await runOrchestrator({ text, quantityTonnes: Number(quantityTonnes), location, imageUrl }));
});

app.post('/api/matches/:id/accept', async (req, res) => {
  const match = store.matches.get(req.params.id);
  if (!match) return res.status(404).json({ error: 'match not found' });
  const { pickup, trace } = await logisticsAgent(match);
  res.json({ pickup, trace });
});

app.get('/api/pickups', (_, res) => res.json([...store.pickups.values()]));

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`AgriWaste Exchange API on :${port}`));
