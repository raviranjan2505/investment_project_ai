import * as db from '../database/db.js';

export async function create({ name, email, passwordHash, referralCode, referredBy }, client = db) {
  const result = await client.query(
    `INSERT INTO users (name, email, password_hash, referral_code, referred_by)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, name, email, referral_code, referred_by, role, is_active, created_at`,
    [name, email, passwordHash, referralCode, referredBy]
  );
  return result.rows[0];
}

export async function findByEmail(email) {
  const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
  return result.rows[0] || null;
}

export async function findById(id) {
  const result = await db.query(
    'SELECT id, name, email, referral_code, referred_by, role, is_active, created_at FROM users WHERE id = $1',
    [id]
  );
  return result.rows[0] || null;
}

export async function findAuthById(id) {
  const result = await db.query('SELECT * FROM users WHERE id = $1', [id]);
  return result.rows[0] || null;
}

export async function findByReferralCode(referralCode) {
  const result = await db.query('SELECT * FROM users WHERE referral_code = $1', [referralCode]);
  return result.rows[0] || null;
}

export async function referralCodeExists(referralCode, client = db) {
  const result = await client.query('SELECT 1 FROM users WHERE referral_code = $1', [referralCode]);
  return result.rowCount > 0;
}
