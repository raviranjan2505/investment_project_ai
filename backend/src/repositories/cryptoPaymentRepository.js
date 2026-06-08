import * as db from '../database/db.js';

export async function create(data, client = db) {
  const result = await client.query(
    `INSERT INTO crypto_payments
      (user_id, payment_id, pay_address, payment_url, price_amount, price_currency, pay_currency, status, transaction_id)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
     RETURNING *`,
    [
      data.userId,
      data.paymentId,
      data.payAddress,
      data.paymentUrl,
      data.priceAmount,
      data.priceCurrency,
      data.payCurrency,
      data.status,
      data.transactionId
    ]
  );
  return result.rows[0];
}

export async function findByPaymentIdForUpdate(paymentId, client = db) {
  const result = await client.query(
    'SELECT * FROM crypto_payments WHERE payment_id = $1 FOR UPDATE',
    [paymentId]
  );
  return result.rows[0] || null;
}

export async function updateStatus({ id, status, eventId }, client = db) {
  const result = await client.query(
    `UPDATE crypto_payments
     SET status = $2,
         webhook_event_ids = CASE
           WHEN $3::text IS NULL OR $3 = ANY(webhook_event_ids) THEN webhook_event_ids
           ELSE array_append(webhook_event_ids, $3::text)
         END,
         updated_at = NOW()
     WHERE id = $1
     RETURNING *`,
    [id, status, eventId || null]
  );
  return result.rows[0] || null;
}
