import * as db from '../database/db.js';

export async function create({ userId, type, amount, status = 'completed', referenceType = null, referenceId = null, metadata = {} }, client = db) {
  const result = await client.query(
    `INSERT INTO transactions (user_id, type, amount, status, reference_type, reference_id, metadata)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [userId, type, amount, status, referenceType, referenceId, JSON.stringify(metadata)]
  );
  return result.rows[0];
}

export async function updateStatus(id, status, metadata = {}, client = db) {
  const result = await client.query(
    `UPDATE transactions
     SET status = $2, metadata = metadata || $3::jsonb
     WHERE id = $1
     RETURNING *`,
    [id, status, JSON.stringify(metadata)]
  );
  return result.rows[0] || null;
}

export async function listByUser(userId) {
  const result = await db.query(
    `SELECT *
     FROM transactions
     WHERE user_id = $1
     ORDER BY created_at DESC`,
    [userId]
  );
  return result.rows;
}

export async function getWalletBalance(userId, client = db) {
  const result = await client.query(
    `SELECT COALESCE(SUM(amount), 0)::numeric(18,2) AS balance
     FROM transactions
     WHERE user_id = $1 AND status = 'completed'`,
    [userId]
  );
  return Number(result.rows[0].balance);
}
