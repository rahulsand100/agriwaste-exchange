import { useEffect, useRef, useState } from 'react';

const residueOptions = [
  { label: 'Rice straw', value: 'rice straw' },
  { label: 'Wheat straw', value: 'wheat straw' },
  { label: 'Sugarcane residue', value: 'sugarcane bagasse' },
  { label: 'Corn stalks', value: 'corn stalks' },
];

export default function FieldListingForm({ busy, requestError, onAnalyze, onChange }) {
  const [form, setForm] = useState({ text: '2 tonnes rice straw', quantityTonnes: 2, location: 'Nabha', imageUrl: '' });
  const [cameraOpen, setCameraOpen] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const [capturedImage, setCapturedImage] = useState('');
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    if (!cameraOpen || !videoRef.current || !streamRef.current) return undefined;

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

  useEffect(() => () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
  }, []);

  function updateForm(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
    onChange();
  }

  async function openCamera() {
    setCameraError('');
    setCameraReady(false);
    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraError('Camera access is not supported in this browser.');
      return;
    }

    try {
      streamRef.current = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
        audio: false,
      });
      setCameraOpen(true);
    } catch (error) {
      console.error('Camera access failed:', error);
      setCameraError('Unable to access the camera. Allow camera permission and try again.');
    }
  }

  function closeCamera() {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
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

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    setCapturedImage(dataUrl);
    setForm((current) => ({ ...current, imageUrl: dataUrl }));
    onChange();
    closeCamera();
  }

  const selectedResidue = residueOptions.find((option) => form.text.toLowerCase().includes(option.value.split(' ')[0]));

  return (
    <section id="listing-form" className="panel glass-panel form-panel">
      <div className="panel-header">
        <div>
          <span className="panel-step">STEP 01 · LIST YOUR RESIDUE</span>
          <h2>Your field details</h2>
        </div>
        <span className="mini-badge">Farmer</span>
      </div>

      <div className="input-stack">
        <div>
          <label className="field-label" htmlFor="waste-description">What’s left after harvest?</label>
          <input id="waste-description" className="field-input" value={form.text} onChange={(event) => updateForm('text', event.target.value)} placeholder="e.g. rice straw" aria-describedby="residue-options-help" />
          <span className="field-hint" id="residue-options-help">Choose a common residue or type your own.</span>
          <div className="residue-options" aria-label="Common crop residues">
            {residueOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                className={`residue-option ${selectedResidue?.value === option.value ? 'is-selected' : ''}`}
                aria-pressed={selectedResidue?.value === option.value}
                onClick={() => updateForm('text', option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="field-label" htmlFor="residue-quantity">Approximate quantity <span className="field-unit">tonnes</span></label>
          <input id="residue-quantity" type="number" min="0.1" step="0.1" className="field-input" value={form.quantityTonnes} onChange={(event) => updateForm('quantityTonnes', event.target.value)} />
        </div>

        <div>
          <label className="field-label" htmlFor="field-location">Where is the field?</label>
          <input id="field-location" className="field-input" value={form.location} onChange={(event) => updateForm('location', event.target.value)} placeholder="Village or nearest town" aria-describedby="location-help" />
          <span className="field-hint" id="location-help">Use the village or nearest town; we’ll look nearby.</span>
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
      {requestError && <p className="request-error" role="alert">{requestError}</p>}
      <button
        onClick={() => onAnalyze(form)}
        disabled={busy || !form.text.trim() || !form.location.trim() || Number(form.quantityTonnes) <= 0}
        className="action-button primary"
      >
        {busy ? 'Finding a useful match…' : 'Find a next use'}
      </button>
      <p className="form-footnote">No commitment yet. Review local matches before requesting a pickup.</p>
    </section>
  );
}
