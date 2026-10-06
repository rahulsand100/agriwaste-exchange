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
const server = app.listen(port, () => console.log(`AgriWaste Exchange API on :${port}`));

server.on('error', async (error) => {
  if (error.code === 'EADDRINUSE') {
    try {
      const response = await fetch(`http://127.0.0.1:${port}/api/health`, {
        signal: AbortSignal.timeout(1500)
      });
      const health = await response.json();

      if (response.ok && health.ok) {
        console.log(`AgriWaste Exchange API is already running on :${port}`);
        return;
        //rahul
      }
    } catch {
      // The port is occupied, but not by a responding AgriWaste API.
    }

    console.error(`Port ${port} is already in use. Stop the other service or set PORT to a free port.`);
    process.exitCode = 1;
    return;
  }

  console.error('Failed to start AgriWaste Exchange API:', error);
  process.exitCode = 1;
});
