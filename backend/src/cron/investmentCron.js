import cron from 'node-cron';
import { settleInvestmentsJob } from '../jobs/settleInvestmentsJob.js';

export function startInvestmentCron() {
  // Run settlement every hour (more frequent to catch matured investments quicker)
  cron.schedule('0 * * * *', async () => {
    try {
      console.log('[Investment Cron] Running settlement check...');
      await settleInvestmentsJob();
    } catch (error) {
      console.error('[Investment Cron] Settlement failed:', error);
    }
  });
  console.log('[Investment Cron] Initialized - runs every hour at :00');
}
