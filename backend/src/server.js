import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import env from './config/env.js';
import routes from './routes/index.js';
import logger from './middleware/logger.js';
import errorHandler from './middleware/errorHandler.js';
import { captureRawBody } from './middleware/rawBody.js';
import { startInvestmentCron } from './cron/investmentCron.js';
import { pool } from './database/db.js';
import { listAvailableModels }from "./ai/openaiClient.js";

const app = express();

app.use(helmet());
app.use(cors({ origin: env.clientOrigin, credentials: true }));
app.use(cookieParser());
app.use(express.json({ limit: '1mb', verify: captureRawBody }));
app.use(logger);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api', routes);
app.use((_req, res) => {
  res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Route not found' } });
});
app.get('/models', async (req, res) => {
  console.log('GET /models endpoint called');
  try {
    console.log('Calling listAvailableModels...');
    const models = await listAvailableModels();
    console.log('Models received:', models);
    res.json(models);
  } catch (err) {
    console.error('Error in /models route:', err);
    res.status(500).json({ error: err.message, stack: err.stack });
  }
});
app.use(errorHandler);

const server = app.listen(env.port, () => {
  console.log(`Server running on port ${env.port}`);
  startInvestmentCron();
});

async function shutdown(signal) {
  console.log(`${signal} received. Shutting down gracefully.`);
  server.close(async () => {
    await pool.end();
    process.exit(0);
  });
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

export default app;
