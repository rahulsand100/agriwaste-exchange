import { createPickupRequest } from '../tools.js';
export async function logisticsAgent(match) {
  const pickup = createPickupRequest(match);
  match.status = 'accepted';
  return { pickup, trace: { agent: 'Logistics Agent', status: 'done', message: 'Pickup request created', tool: 'createPickupRequest()' } };
}
