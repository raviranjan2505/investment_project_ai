import pg from 'pg';
import env from '../config/env.js';

const { Pool } = pg;

const pool = new Pool({
  connectionString: env.databaseUrl,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
  ssl: env.isProduction ? { rejectUnauthorized: false } : false
});

export async function query(sql, params = []) {
  return pool.query(sql, params);
}

export async function withTransaction(handler) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await handler(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

export { pool };
