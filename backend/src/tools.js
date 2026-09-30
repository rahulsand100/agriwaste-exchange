import { readFileSync } from 'node:fs';
import { VALUE_RATES, TRANSPORT_COST_PER_TONNE_KM } from './config.js';
const load = (p) => JSON.parse(readFileSync(new URL(p, import.meta.url), 'utf8'));
const BUYERS = load('./data/buyers.json');
const PLACES = load('./data/places.json');

export const store = { matches: new Map(), pickups: new Map(), seq: 1 };

const KEYWORDS = {
  rice_straw: ['rice', 'paddy', 'parali'],
  wheat_straw: ['wheat', 'bhusa'],
  sugarcane_residue: ['sugarcane', 'cane', 'bagasse'],
  corn_stalks: ['corn', 'maize']
};
const USES = {
  rice_straw: ['Mushroom cultivation', 'Composting', 'Biomass energy'],
  wheat_straw: ['Mushroom cultivation', 'Composting', 'Animal feed / biomass'],
  sugarcane_residue: ['Biomass energy', 'Biofuel', 'Composting'],
  corn_stalks: ['Composting', 'Biofuel', 'Biomass energy']
};

// TODO: replace the keyword heuristic with a Vision/LLM call when an image is supplied.
export async function classifyWaste({ text = '', imageUrl }) {
  const t = text.toLowerCase();
  for (const [type, words] of Object.entries(KEYWORDS)) {
    if (words.some((w) => t.includes(w))) return { type, uses: USES[type], source: imageUrl ? 'image+text' : 'text' };
  }
  return { type: 'unknown', uses: [], source: 'text' };
}

export async function searchBuyerRequirements({ type }) {
  return BUYERS.filter((b) => b.accepts.includes(type));
}

export function geocode(location = '') {
  return PLACES[location.trim().toLowerCase()] || null; // TODO: Google Maps / Nominatim
}

export function calculateDistance(a, b) {
  const R = 6371, rad = (d) => (d * Math.PI) / 180;
  const dLat = rad(b.lat - a.lat), dLng = rad(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return +(2 * R * Math.asin(Math.sqrt(h))).toFixed(1); // straight-line km; swap for road distance API
}

export function estimateValue({ type, quantityTonnes, distanceKm }) {
  const r = VALUE_RATES[type];
  if (!r || (r.min === 0 && r.max === 0)) return { min: null, max: null, currency: 'INR', note: 'Configure local rates in config.js' };
  const transport = distanceKm * quantityTonnes * TRANSPORT_COST_PER_TONNE_KM;
  return { min: Math.max(0, r.min * quantityTonnes - transport), max: Math.max(0, r.max * quantityTonnes - transport), currency: 'INR', note: 'Indicative only' };
}

export function createMatch({ listing, buyer, distanceKm, value, score }) {
  const id = 'm' + store.seq++;
  const m = { id, listing, buyer, distanceKm, value, score, status: 'proposed' };
  store.matches.set(id, m);
  return m;
}

export function createPickupRequest(match) {
  const id = 'p' + store.seq++;
  const p = { id, matchId: match.id, buyer: match.buyer.name, quantityTonnes: match.listing.quantityTonnes, status: 'requested', createdAt: new Date().toISOString() };
  store.pickups.set(id, p);
  // TODO: call logistics partner API + notification service
  return p;
}
