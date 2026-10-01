import { useEffect, useRef, useState } from 'react';

const icon = (s) => (s === 'done' ? '✓' : s === 'failed' ? '✗' : '⏳');

export default function App() {
  const [form, setForm] = useState({ text: '2 tonnes rice straw', quantityTonnes: 2, location: 'Nabha', imageUrl: '' });
  const [result, setResult] = useState(null);
  const [trace, setTrace] = useState([]);
  const [pickup, setPickup] = useState(null);
  const [busy, setBusy] = useState(false);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const [capturedImage, setCapturedImage] = useState('');
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    if (!cameraOpen || !videoRef.current || !streamRef.current) return;

    const video = videoRef.current;
    const stream = streamRef.current;
    video.srcObject = stream;
    video.play().catch((error) => {
      console.error('Camera playback failed:', error);
      setCameraError('Camera preview could not start. Check browser permissions and try again.');
    });

    return () => {
      if (video.srcObject === stream) video.srcObject = null;
    };
  }, [cameraOpen]);

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  async function openCamera() {
    setCameraError('');
    setCameraReady(false);
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraError('Camera access is not supported in this browser.');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }, audio: false });
      streamRef.current = stream;
      setCameraOpen(true);
    } catch (error) {
      console.error('Camera access failed:', error);
      setCameraError('Unable to access the camera. Allow camera permission and try again.');
    }
  }

  function closeCamera() {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraOpen(false);
    setCameraReady(false);
  }

  function captureImage() {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA || !video.videoWidth || !video.videoHeight) {
      setCameraError('The camera is still preparing a frame. Please wait a moment and try again.');
      return;
    }

    const context = canvas.getContext('2d');
    if (!context) {
      setCameraError('Could not prepare the photo capture. Please try again.');
      return;
    }

    const width = video.videoWidth;
    const height = video.videoHeight;

    canvas.width = width;
    canvas.height = height;
    context.drawImage(video, 0, 0, width, height);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    setCapturedImage(dataUrl);
    setForm((prev) => ({ ...prev, imageUrl: dataUrl }));
    closeCamera();
  }

  async function analyze() {
    setBusy(true); setPickup(null);
    const r = await fetch('/api/listings/analyze', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, quantityTonnes: Number(form.quantityTonnes) }) });
    const data = await r.json();
    setResult(data); setTrace(data.trace || []); setBusy(false);
  }

  async function accept(m) {
    const r = await fetch(`/api/matches/${m.id}/accept`, { method: 'POST' });
    const data = await r.json();
    setPickup(data.pickup); setTrace((t) => [...t, data.trace]);
  }

  const totalMatches = result?.matches?.length || 0;
  const bestDistance = result?.matches?.[0]?.distanceKm ?? null;

  return (
    <div className="app-shell">
      <div className="orb orb-one" />
      <div className="orb orb-two" />
      <div className="orb orb-three" />

      <header className="topbar panel glass-panel">
        <div>
          <p className="eyebrow">AgriWaste Exchange</p>
          <h1>🌾 Smart residue routing</h1>
        </div>
        <div className="topbar-meta">
          <span className="status-pill success">Live</span>
          <span className="status-pill">Farm-to-industry</span>
        </div>
      </header>

      <section className="showcase panel glass-panel">
        <div className="showcase-copy">
          <p className="showcase-kicker">AI-powered circular economy</p>
          <h2>Turn agriwaste into a connected, high-value logistics network.</h2>
          <div className="showcase-tags">
            <span>Waste detection</span>
            <span>Buyer matching</span>
            <span>Route planning</span>
          </div>

          <div className="showcase-metrics">
            <div className="metric-card">
              <span>Match precision</span>
              <strong>94%</strong>
            </div>
            <div className="metric-card">
              <span>Route speed</span>
              <strong>18 min</strong>
            </div>
            <div className="metric-card">
              <span>Recovered value</span>
              <strong>₹3.2M</strong>
            </div>
          </div>
        </div>

        <div className="showcase-scene" aria-hidden="true">
          <div className="tile tile-a" />
          <div className="tile tile-b" />
          <div className="tile tile-c" />
          <div className="tile tile-d" />
          <div className="tile tile-e" />
          <div className="tile tile-f" />
          <div className="device-card">
            <div className="device-screen">
              <div className="screen-topbar" />
              <div className="screen-lines" />
              <div className="screen-pill" />
            </div>
          </div>
        </div>
      </section>

      <main className="dashboard-grid">
        <section className="panel glass-panel form-panel">
          <div className="panel-header">
            <h2>Farmer Dashboard</h2>
            <span className="mini-badge">AI flow</span>
          </div>

          <div className="input-stack">
            <div>
              <label className="field-label">Waste description</label>
              <input className="field-input" value={form.text} onChange={(e) => setForm({ ...form, text: e.target.value })} />
            </div>

            <div>
              <label className="field-label">Quantity (tonnes)</label>
              <input type="number" className="field-input" value={form.quantityTonnes} onChange={(e) => setForm({ ...form, quantityTonnes: e.target.value })} />
            </div>

            <div>
              <label className="field-label">Location</label>
              <input className="field-input" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
            </div>
          </div>

          <div className="camera-panel">
            <div className="camera-header">
              <span className="camera-badge">OpenCV / Camera</span>
              <span className="camera-status">{capturedImage ? 'Photo ready' : 'No photo yet'}</span>
            </div>

            <div className="camera-actions">
              <button type="button" onClick={cameraOpen ? closeCamera : openCamera} className="camera-btn secondary">
                {cameraOpen ? 'Close camera' : 'Open camera'}
              </button>
              {cameraOpen && (
                <button type="button" onClick={captureImage} disabled={!cameraReady} className="camera-btn primary">
                  {cameraReady ? 'Capture photo' : 'Preparing camera…'}
                </button>
              )}
            </div>

            {cameraOpen ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                onCanPlay={() => setCameraReady(true)}
                className="camera-preview"
              />
            ) : (
              <div className="camera-placeholder">
                <span>📷</span>
                <p>Click to open the camera and capture waste photos for detection.</p>
              </div>
            )}

            {cameraError && <p className="camera-error" role="alert">{cameraError}</p>}

            {capturedImage && (
              <div className="capture-preview-wrap">
                <img src={capturedImage} alt="Captured waste detection sample" className="capture-preview" />
              </div>
            )}
          </div>

          <canvas ref={canvasRef} className="hidden-canvas" />

          <button onClick={analyze} disabled={busy} className="action-button primary">
            {busy ? 'Agents working…' : 'Analyze with AI agents'}
          </button>
        </section>

        <section className="panel glass-panel results-panel">
          <div className="panel-header">
            <h2>Nearby Matches</h2>
            <span className="mini-badge alt">{totalMatches} found</span>
          </div>

          {!result && <p className="empty-state">Run the agents to see matches.</p>}
          {result?.stoppedBecause && <p className="warning-banner">{result.stoppedBecause}</p>}

          {result?.matches.map((m) => (
            <div key={m.id} className="match-card">
              <div className="match-card-top">
                <div>
                  <div className="match-title">{m.buyer.name}</div>
                  <div className="match-meta">{m.distanceKm} km · score {m.score}</div>
                </div>
                <span className="score-chip">{m.score}</span>
              </div>

              <div className="match-value">
                {m.value?.min == null ? 'Indicative value: configure local rates' : `₹${m.value.min}–₹${m.value.max} (indicative)`}
              </div>

              <button onClick={() => accept(m)} className="action-button secondary">
                Accept match
              </button>
            </div>
          ))}

          {pickup && <p className="pickup-banner">🚚 Pickup request {pickup.id}: {pickup.status}</p>}
        </section>

        <section className="panel glass-panel activity-panel">
          <div className="panel-header">
            <h2>AI Agent Activity</h2>
            <span className="mini-badge alt">Trace</span>
          </div>

          <ul className="activity-list">
            {trace.map((t, i) => (
              <li key={i} className="activity-item">
                <span className="activity-icon">{icon(t.status)}</span>
                <div>
                  <strong>{t.agent}</strong>
                  <span>{t.message}</span>
                </div>
              </li>
            ))}
            {!trace.length && <li className="empty-state compact">No activity yet.</li>}
          </ul>
        </section>
      </main>

      {bestDistance && (
        <div className="floating-stat panel glass-panel">
          <span className="stat-label">Best route</span>
          <strong>{bestDistance} km</strong>
        </div>
      )}
    </div>
  );
}
