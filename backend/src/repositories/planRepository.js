import * as db from '../database/db.js';

export async function findAllActive() {
  const result = await db.query(
    `SELECT id, slug, name, min_amount, max_amount, return_rate, duration_days, referral_bonus_rate
     FROM plans
     WHERE is_active = TRUE
     ORDER BY min_amount ASC`
  );
  return result.rows;
}

export async function findBySlug(slug, client = db) {
  const result = await client.query(
    `SELECT id, slug, name, min_amount, max_amount, return_rate, duration_days, referral_bonus_rate
     FROM plans
     WHERE slug = $1 AND is_active = TRUE`,
    [slug]
  );
  return result.rows[0] || null;
}
