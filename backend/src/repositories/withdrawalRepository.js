import * as db from '../database/db.js';

export async function create({ userId, amount, method, destination, transactionId, metadata = {} }, client = db) {
  const result = await client.query(
    `INSERT INTO withdrawals (user_id, amount, method, destination, transaction_id, metadata)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [userId, amount, method, destination, transactionId, JSON.stringify(metadata)]
  );
  return result.rows[0];
}

export async function listByUser(userId) {
  const result = await db.query(
    `SELECT *
     FROM withdrawals
     WHERE user_id = $1
     ORDER BY requested_at DESC`,
    [userId]
  );
  return result.rows;
}
