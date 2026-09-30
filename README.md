# 🌾 AgriWaste Exchange — *Don't Burn It. Route It.*

A **multi-agent AI platform** that turns agricultural residue (rice straw, wheat straw, sugarcane residue, corn stalks…) into a **locally discoverable resource** by connecting farmers with nearby businesses that can use it.

> Solutions for agricultural waste already exist, but they are fragmented. We connect waste identification, demand discovery, matching, value estimation and logistics into **one intelligent workflow**.

Built for **Build with Bharat 4.0** (National Level Hackathon).

## How it works

```
Farmer → Orchestrator Agent ─┬─ Waste Agent      classifyWaste()
                             ├─ Demand Agent     searchBuyerRequirements()
                             ├─ Location Agent   calculateDistance()
                             ├─ Value Agent      estimateValue()
                             ├─ Matching Agent   createMatch()
                             └─ Logistics Agent  createPickupRequest()
                                      ↓
                              MATCH + PICKUP
```

Agents follow **Observe → Reason → Use tools → Collaborate → Take action**. The orchestrator decides which agent runs next and combines results into an actionable pathway. See [docs/architecture.md](docs/architecture.md).

## MVP scope (vertical slice)

Upload waste → AI classification → buyer requirements → agent matching → nearby match → indicative value → accept → pickup request.

## Tech stack

React + Tailwind (Vite) · Node.js + Express · PostgreSQL · LLM + Vision model (pluggable) · OpenAI Agents SDK / LangGraph (pluggable) · Google Maps / OpenStreetMap

## Quick start

```bash
# Backend (runs with in-memory seed data; no DB needed for the demo)
cd backend
npm install
cp .env.example .env
npm run dev          # http://localhost:4000

# Try the agent pipeline from the terminal
npm run demo         # 2 tonnes rice straw — Nabha

# Frontend
cd ../frontend
npm install
npm run dev          # http://localhost:5173
```

### API

| Method | Route | Purpose |
|---|---|---|
| POST | `/api/listings/analyze` | Run the full agent workflow. Body: `{ "text": "2 tonnes rice straw", "quantityTonnes": 2, "location": "Nabha" }` |
| POST | `/api/matches/:id/accept` | Farmer accepts a match → Logistics Agent creates a pickup request |
| GET | `/api/pickups` | List pickup requests |
| GET | `/api/health` | Health check |

## ⚠️ Honest notes on data

- Buyer records in `backend/src/data/buyers.json` are **illustrative sample data** for the demo — replace with real pilot buyers.
- Value estimates are **indicative ranges** computed from configurable per-tonne rates in `backend/src/config.js`. These rates are **placeholders, not market data**.
- No impact statistics are claimed.

## Project structure

```
backend/   Express API, orchestrator, six specialised agents, tools, SQL schema
frontend/  React + Tailwind dashboards (Farmer + live Agent activity)
docs/      Architecture notes
```

## Roadmap

Real logistics & maps API integrations · more residue types and buyer categories · regional-language / voice-first farmer interface · pilots with local farmers and buyers.

## License

MIT
