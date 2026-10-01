import { memo } from 'react';

function FieldnoteHeader() {
  return (
    <>
      <header className="topbar panel glass-panel">
        <div>
          <p className="eyebrow"><span className="brand-mark" aria-hidden="true"><i /></span> KhetLoop <span className="brand-divider">/</span> AgriWaste Exchange</p>
        </div>
        <div className="topbar-meta">
          <span className="status-pill success"><span className="live-dot" /> A field-to-market pilot</span>
          <span className="status-pill">Made for the harvest after</span>
        </div>
      </header>

      <section className="showcase panel glass-panel">
        <div className="showcase-copy">
          <p className="showcase-kicker"><span className="kicker-index">01</span> FIELDNOTE / NABHA, PUNJAB</p>
          <h2>Let the harvest have a <em>second life.</em></h2>
          <p className="showcase-description">A field-side exchange for crop leftovers. Find a nearby use for rice straw, wheat straw, and more.</p>
          <div className="showcase-tags">
            <span><i>01</i> List residue</span>
            <span><i>02</i> Meet local buyers</span>
            <span><i>03</i> Arrange pickup</span>
          </div>
          <a className="showcase-cta" href="#listing-form">
            Start a field listing <span aria-hidden="true">↓</span>
          </a>

          <div className="showcase-metrics">
            <div className="metric-card">
              <span>FROM THE FIELD</span>
              <strong>Residue</strong>
            </div>
            <div className="metric-card">
              <span>TO THE NETWORK</span>
              <strong>Buyer</strong>
            </div>
            <div className="metric-card">
              <span>ON THE ROAD</span>
              <strong>Pickup</strong>
            </div>
          </div>
        </div>

        <div className="showcase-scene" aria-hidden="true">
          <div className="scene-coordinate">30°22' N <span>/</span> 76°09' E</div>
          <div className="scene-glow" />
          <div className="floating-sprig">
            <span className="sprig-stem" />
            <span className="sprig-leaf sprig-leaf-one" />
            <span className="sprig-leaf sprig-leaf-two" />
            <span className="sprig-leaf sprig-leaf-three" />
            <span className="sprig-seed" />
          </div>
          <div className="map-sheet">
            <div className="map-sheet-heading">
              <span>FIELD ROUTE / NABHA</span>
              <span className="map-sheet-scale">30°22' N&nbsp; 76°09' E</span>
            </div>
            <svg className="field-map" viewBox="0 0 620 440" fill="none">
              <path className="map-land" d="M0 0h620v440H0z" />
              <path className="map-parcel parcel-a" d="M0 0h176l-18 87-62 32L0 101z" />
              <path className="map-parcel parcel-b" d="m176 0 138 0-9 72-147 15z" />
              <path className="map-parcel parcel-c" d="m314 0h182l-22 90-169-18z" />
              <path className="map-parcel parcel-d" d="M496 0h124v111l-146-21z" />
              <path className="map-parcel parcel-e" d="m0 101 96 18-22 125L0 221z" />
              <path className="map-parcel parcel-f" d="m96 119 62-32 80 12-20 132-144 13z" />
              <path className="map-parcel parcel-g" d="m238 99 67-27 44 34-10 127-121-2z" />
              <path className="map-parcel parcel-h" d="m349 106 147-16 124 21v113l-151-11-130 19z" />
              <path className="map-parcel parcel-i" d="M0 221 74 244l38 113-112 24z" />
              <path className="map-parcel parcel-j" d="m74 244 144-2 31 112-137 3z" />
              <path className="map-parcel parcel-k" d="m229 236 110-3 32 123-122 1z" />
              <path className="map-parcel parcel-l" d="m349 233 120-20 151 11v132l-128 13-121-13z" />
              <path className="map-lane" d="M-13 176c104-28 176 3 273-26 96-30 151-73 243-53 44 10 76 29 130 25" />
              <path className="map-lane-edge" d="M-13 176c104-28 176 3 273-26 96-30 151-73 243-53 44 10 76 29 130 25" />
              <path className="map-lane" d="M219-17c-19 85 16 122 7 201-8 73-5 160 44 274" />
              <path className="map-lane-edge" d="M219-17c-19 85 16 122 7 201-8 73-5 160 44 274" />
              <path className="map-track" d="M125 295c70-58 117-58 177-37 63 22 101 19 160-47" />
              <circle className="map-route-dot" cx="125" cy="295" r="11" />
              <circle className="map-route-dot map-route-destination" cx="462" cy="211" r="11" />
              <circle className="map-route-core" cx="125" cy="295" r="3" />
              <circle className="map-route-core map-route-destination-core" cx="462" cy="211" r="3" />
              <path className="map-north" d="M566 58v35m0-35-7 10m7-10 7 10" />
              <text className="map-north-label" x="562" y="51">N</text>
            </svg>
            <div className="map-caption map-caption-field">
              <span className="map-caption-dot" />
              <span><b>THE FARM</b><small>Rice straw</small></span>
            </div>
            <div className="map-caption map-caption-buyer">
              <span className="map-buyer-mark">↗</span>
              <span><b>THE NEXT STOP</b><small>Local buyer</small></span>
            </div>
            <div className="map-sheet-footer">
              <span>FROM FIELD</span><i /><span>TO SECOND LIFE</span>
              <span className="map-sheet-stamp">K · L</span>
            </div>
          </div>
          <div className="scene-note">
            <span className="scene-note-mark">↳</span>
            <span>One field.<br /><b>A better next step.</b></span>
          </div>
          <div className="scene-index">
            <span>FIELD STUDY</span>
            <b>01</b>
          </div>
          <div className="scene-orbit-tag"><span /> RESIDUE → RESOURCE</div>
        </div>
      </section>

      <section className="dashboard-intro" aria-labelledby="dashboard-title">
        <div>
          <p className="dashboard-kicker">FROM FIELD TO NEXT USE</p>
          <h2 id="dashboard-title">A simple next step for what’s left.</h2>
        </div>
        <p>Share a few details. We’ll look for a useful local match.</p>
      </section>
    </>
  );
}

export default memo(FieldnoteHeader);
