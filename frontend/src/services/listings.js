async function requestJson(url, options) {
  const response = await fetch(url, options);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || `Request failed (${response.status}).`);
  }

  return data;
}

export function analyzeListing(listing) {
  return requestJson('/api/listings/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...listing,
      quantityTonnes: Number(listing.quantityTonnes),
    }),
  });
}

export function requestPickup(matchId) {
  return requestJson(`/api/matches/${matchId}/accept`, { method: 'POST' });
}
