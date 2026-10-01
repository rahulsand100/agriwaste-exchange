import { memo } from 'react';

function BuyerMatches({ result, acceptingMatch, onAccept }) {
  const matches = result?.matches || [];

  return (
    <section className="panel glass-panel results-panel">
      <div className="panel-header">
        <div>
          <span className="panel-step">STEP 02 · FIND A LOCAL USE</span>
          <h2>Nearby buyers</h2>
        </div>
        <span className="mini-badge alt">{matches.length} {matches.length === 1 ? 'match' : 'matches'}</span>
      </div>

      {!result && (
        <div className="empty-state empty-matches">
          <span className="empty-mark">↗</span>
          <p>Your local matches will show up here.</p>
          <small>Add your residue details, then we’ll look for a nearby use.</small>
        </div>
      )}
      {result?.stoppedBecause && <p className="warning-banner">{result.stoppedBecause}</p>}
      {result && !matches.length && !result.stoppedBecause && (
        <p className="empty-state">No nearby matches yet. Try adjusting the location or residue details.</p>
      )}

      {matches.map((match) => (
        <article key={match.id} className="match-card">
          <div className="match-card-top">
            <div>
              <div className="match-title">{match.buyer.name}</div>
              <div className="match-meta">{match.distanceKm} km · score {match.score}</div>
            </div>
            <span className="score-chip">{match.score}</span>
          </div>

          <div className="match-value">
            {match.value?.min == null
              ? 'Indicative value: configure local rates'
              : `₹${match.value.min}–₹${match.value.max} (indicative)`}
          </div>

          <button
            onClick={() => onAccept(match)}
            disabled={acceptingMatch !== null}
            className="action-button secondary"
          >
            {acceptingMatch === match.id ? 'Requesting pickup…' : 'Request this pickup'}
          </button>
        </article>
      ))}
    </section>
  );
}

function AgentActivity({ trace, pickup }) {
  return (
    <section className="panel glass-panel activity-panel">
      <div className="panel-header">
        <div>
          <span className="panel-step">STEP 03 · COORDINATE THE NEXT MOVE</span>
          <h2>Matching activity</h2>
        </div>
        <span className="mini-badge alt">{trace.length ? `${trace.length} updates` : 'Ready'}</span>
      </div>

      <ul className="activity-list">
        {trace.map((entry, index) => (
          <li key={`${entry.agent}-${index}`} className="activity-item">
            <span className="activity-icon">
              {entry.status === 'done' ? '✓' : entry.status === 'failed' ? '✗' : '⏳'}
            </span>
            <div>
              <strong>{entry.agent}</strong>
              <span>{entry.message}</span>
            </div>
          </li>
        ))}
        {!trace.length && <li className="empty-state compact">No activity yet.</li>}
      </ul>
      {pickup && <p className="pickup-banner">Pickup request {pickup.id}: {pickup.status}</p>}
    </section>
  );
}

function MatchingResults({ result, trace, pickup, acceptingMatch, onAccept }) {
  return (
    <>
      <BuyerMatches result={result} acceptingMatch={acceptingMatch} onAccept={onAccept} />
      <AgentActivity trace={trace} pickup={pickup} />
    </>
  );
}

export default memo(MatchingResults);
