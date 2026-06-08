import * as db from '../database/db.js';

export async function create(data, client = db) {
  const result = await client.query(
    `INSERT INTO investments
      (user_id, plan_id, amount, return_rate, duration_days, expected_return, end_date)
     VALUES ($1, $2, $3, $4, $5, $6, NOW() + ($5::int * INTERVAL '1 day'))
     RETURNING *`,
    [data.userId, data.planId, data.amount, data.returnRate, data.durationDays, data.expectedReturn]
  );
  return result.rows[0];
}

export async function listByUser(userId, client = db) {
  const result = await client.query(
    `SELECT i.*, p.slug AS plan_slug, p.name AS plan_name
     FROM investments i
     JOIN plans p ON p.id = i.plan_id
     WHERE i.user_id = $1
     ORDER BY i.created_at DESC`,
    [userId]
  );
  return result.rows;
}

export async function findMaturedActive(client = db) {
  const result = await client.query(
    `SELECT *
     FROM investments
     WHERE status = 'active' AND end_date <= NOW()
     FOR UPDATE SKIP LOCKED`
  );
  return result.rows;
}

export async function markCompleted(id, client = db) {
  const result = await client.query(
    `UPDATE investments
     SET status = 'completed', completed_at = NOW()
     WHERE id = $1 AND status = 'active'
     RETURNING *`,
    [id]
  );
  return result.rows[0] || null;
}

export async function markReferralPaid(id, client = db) {
  const result = await client.query(
    `UPDATE investments
     SET referral_bonus_paid = TRUE
     WHERE id = $1
     RETURNING *`,
    [id]
  );
  return result.rows[0] || null;
}
