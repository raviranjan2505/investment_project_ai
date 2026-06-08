import * as investmentService from '../services/investmentService.js';

export async function settleInvestmentsJob() {
  try {
    const settled = await investmentService.settleMaturedInvestments();
    if (settled.length > 0) {
      console.log(`[Settlement Job] ✅ Settled ${settled.length} matured investments`);
    } else {
      console.log('[Settlement Job] No matured investments to settle');
    }
    return settled;
  } catch (error) {
    console.error('[Settlement Job] Error:', error);
    throw error;
  }
}
