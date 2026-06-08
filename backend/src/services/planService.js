import * as planRepository from '../repositories/planRepository.js';

export async function getPlans() {
  return planRepository.findAllActive();
}
