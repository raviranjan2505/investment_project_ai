import crypto from 'crypto';

export function generateReferralCode(name = '') {
  const prefix = String(name).replace(/[^a-zA-Z0-9]/g, '').slice(0, 4).toUpperCase() || 'USER';
  return `${prefix}${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
}
