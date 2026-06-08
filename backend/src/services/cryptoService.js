import crypto from 'crypto';
import * as db from '../database/db.js';
import env from '../config/env.js';
import * as cryptoPaymentRepository from '../repositories/cryptoPaymentRepository.js';
import * as transactionRepository from '../repositories/transactionRepository.js';
import { badRequest } from '../utils/errors.js';

function sortObject(value) {
  if (Array.isArray(value)) return value.map(sortObject);
  if (value && typeof value === 'object') {
    return Object.keys(value)
      .sort()
      .reduce((acc, key) => {
        acc[key] = sortObject(value[key]);
        return acc;
      }, {});
  }
  return value;
}

function verifyNowPaymentsSignature(payload, signature) {
  if (!env.nowPaymentsIpnSecret) throw badRequest('Webhook secret is not configured');
  if (!signature || !payload) throw badRequest('Missing webhook signature');

  const expected = crypto
    .createHmac('sha512', env.nowPaymentsIpnSecret)
    .update(JSON.stringify(sortObject(payload)))
    .digest('hex');

  if (Buffer.byteLength(expected) !== Buffer.byteLength(signature)) return false;
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
}

export async function createPayment({ userId, amount, payCurrency }) {
  if (!env.nowPaymentsApiKey) throw badRequest('NOWPayments API key is not configured');

  const body = {
    price_amount: amount,
    price_currency: 'usd',
    pay_currency: payCurrency,
    order_id: `${userId}-${Date.now()}`,
    order_description: 'Wallet deposit',
    ipn_callback_url: env.nowPaymentsIpnCallbackUrl,
    success_url: env.nowPaymentsSuccessUrl,
    cancel_url: env.nowPaymentsCancelUrl
  };

  const response = await fetch(`${env.nowPaymentsApiUrl}/invoice`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': env.nowPaymentsApiKey
    },
    body: JSON.stringify(body)
  });

  const payload = await response.json();
  if (!response.ok) {
    throw badRequest(payload.message || 'Unable to create crypto payment');
  }

  return db.withTransaction(async (client) => {
    const transaction = await transactionRepository.create(
      {
        userId,
        type: 'crypto_payment',
        amount,
        status: 'pending',
        referenceType: 'crypto_payment',
        metadata: { pay_currency: payCurrency }
      },
      client
    );

    const payment = await cryptoPaymentRepository.create(
      {
        userId,
        paymentId: String(payload.id || payload.payment_id),
        payAddress: payload.pay_address || null,
        paymentUrl: payload.invoice_url || payload.payment_url || null,
        priceAmount: amount,
        priceCurrency: 'usd',
        payCurrency,
        status: 'waiting',
        transactionId: transaction.id
      },
      client
    );

    return { payment, payment_link: payment.payment_url };
  });
}

export async function getPaymentStatus(userId, paymentId) {
  const result = await db.query(
    `SELECT 
      cp.id,
      cp.payment_id AS "paymentId",
      cp.pay_address AS "payAddress",
      cp.payment_url AS "paymentUrl",
      cp.price_amount AS "priceAmount",
      cp.price_currency AS "priceCurrency",
      cp.pay_currency AS "payCurrency",
      cp.status,
      cp.created_at AS "createdAt",
      cp.updated_at AS "updatedAt",
      t.status AS "transactionStatus",
      t.amount
     FROM crypto_payments cp
     LEFT JOIN transactions t ON t.id = cp.transaction_id
     WHERE cp.user_id = $1 AND cp.payment_id = $2`,
    [userId, paymentId]
  );
  return result.rows[0] || null;
}

export async function handleWebhook(_rawBody, headers, payload) {
  const signature = headers['x-nowpayments-sig'];
  if (!verifyNowPaymentsSignature(payload, signature)) {
    throw badRequest('Invalid webhook signature');
  }

  const paymentId = String(payload.payment_id || payload.invoice_id || payload.id || '');
  const eventId = String(payload.id || payload.payment_id || payload.invoice_id || `${paymentId}:${payload.payment_status}`);
  if (!paymentId) throw badRequest('Missing payment id');

  return db.withTransaction(async (client) => {
    const payment = await cryptoPaymentRepository.findByPaymentIdForUpdate(paymentId, client);
    if (!payment) throw badRequest('Unknown payment');

    if (payment.webhook_event_ids.includes(eventId)) {
      return { duplicate: true, payment };
    }

    const status = payload.payment_status || payload.status;
    const successStatuses = new Set(['confirmed', 'finished']);
    const failedStatuses = new Set(['failed', 'expired', 'refunded']);

    const updated = await cryptoPaymentRepository.updateStatus(
      { id: payment.id, status: status || payment.status, eventId },
      client
    );

    if (successStatuses.has(status) && payment.status !== 'finished' && payment.status !== 'confirmed') {
      await transactionRepository.updateStatus(
        payment.transaction_id,
        'completed',
        { webhook: payload },
        client
      );
    }

    if (failedStatuses.has(status)) {
      await transactionRepository.updateStatus(
        payment.transaction_id,
        'failed',
        { webhook: payload },
        client
      );
    }

    return { duplicate: false, payment: updated };
  });
}

export async function recordDirectDeposit({ userId, amount, description = 'Direct Deposit', metadata = {} }) {
  return db.withTransaction(async (client) => {
    const transaction = await transactionRepository.create(
      {
        userId,
        type: 'deposit',
        amount,
        status: 'completed',
        referenceType: 'direct_deposit',
        metadata: { description, ...metadata }
      },
      client
    );

    return transaction;
  });
}
