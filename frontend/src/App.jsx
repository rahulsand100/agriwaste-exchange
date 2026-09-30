import { useState } from 'react';

const icon = (s) => (s === 'done' ? '✓' : s === 'failed' ? '✗' : '⏳');

export default function App() {
  const [form, setForm] = useState({ text: '2 tonnes rice straw', quantityTonnes: 2, location: 'Nabha' });
  const [result, setResult] = useState(null);
  const [trace, setTrace] = useState([]);
  const [pickup, setPickup] = useState(null);
  const [busy, setBusy] = useState(false);

  async function analyze() {
    setBusy(true); setPickup(null);
    const r = await fetch('/api/listings/analyze', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    const data = await r.json();
    setResult(data); setTrace(data.trace || []); setBusy(false);
  }
  async function accept(m) {
    const r = await fetch(`/api/matches/${m.id}/accept`, { method: 'POST' });
    const data = await r.json();
    setPickup(data.pickup); setTrace((t) => [...t, data.trace]);
  }

  return (
    <div className="min-h-screen bg-white text-slate-800">
      <header className="bg-leaf px-8 py-5 text-white">
        <h1 className="text-2xl font-bold">🌾 AgriWaste Exchange</h1>
        <p className="text-sm opacity-90">Don't Burn It. Route It.</p>
      </header>
      <main className="mx-auto grid max-w-6xl gap-6 p-8 md:grid-cols-3">
        <section className="rounded-2xl border p-5 shadow-md">
          <h2 className="mb-3 font-semibold text-leaf">Farmer Dashboard</h2>
          <label className="text-sm">Waste description</label>
          <input className="mb-3 w-full rounded border p-2" value={form.text} onChange={(e) => setForm({ ...form, text: e.target.value })} />
          <label className="text-sm">Quantity (tonnes)</label>
          <input type="number" className="mb-3 w-full rounded border p-2" value={form.quantityTonnes} onChange={(e) => setForm({ ...form, quantityTonnes: e.target.value })} />
          <label className="text-sm">Location</label>
          <input className="mb-4 w-full rounded border p-2" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
          <button onClick={analyze} disabled={busy} className="w-full rounded-lg bg-saffron py-2 font-semibold text-white disabled:opacity-50">
            {busy ? 'Agents working…' : 'Analyze with AI agents'}
          </button>
        </section>

        <section className="rounded-2xl border p-5 shadow-md">
          <h2 className="mb-3 font-semibold text-leaf">Nearby Matches</h2>
          {!result && <p className="text-sm text-slate-500">Run the agents to see matches.</p>}
          {result?.stoppedBecause && <p className="text-sm text-saffron">{result.stoppedBecause}</p>}
          {result?.matches.map((m) => (
            <div key={m.id} className="mb-3 rounded-xl bg-green-50 p-3">
              <div className="font-semibold">{m.buyer.name}</div>
              <div className="text-sm">{m.distanceKm} km · score {m.score}</div>
              <div className="text-sm text-slate-600">{m.value?.min == null ? 'Indicative value: configure local rates' : `₹${m.value.min}–₹${m.value.max} (indicative)`}</div>
              <button onClick={() => accept(m)} className="mt-2 rounded bg-leaf px-3 py-1 text-sm text-white">Accept match</button>
            </div>
          ))}
          {pickup && <p className="mt-2 rounded bg-orange-50 p-2 text-sm">🚚 Pickup request {pickup.id}: {pickup.status}</p>}
        </section>

        <section className="rounded-2xl border p-5 shadow-md">
          <h2 className="mb-3 font-semibold text-leaf">AI Agent Activity</h2>
          <ul className="space-y-2 text-sm">
            {trace.map((t, i) => (<li key={i}><span className="font-mono">{icon(t.status)}</span> <b>{t.agent}</b> — {t.message}</li>))}
            {!trace.length && <li className="text-slate-500">No activity yet.</li>}
          </ul>
        </section>
      </main>
    </div>
  );
}
