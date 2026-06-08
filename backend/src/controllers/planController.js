import * as planService from '../services/planService.js';

export async function getPlans(_req, res) {
  res.json({ plans: await planService.getPlans() });
}
