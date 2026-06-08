import bcrypt from 'bcrypt';
import * as db from '../database/db.js';
import * as userRepository from '../repositories/userRepository.js';
import { generateReferralCode } from '../utils/referral.js';
import { signToken } from '../utils/jwt.js';
import { badRequest, unauthorized } from '../utils/errors.js';

async function createUniqueReferralCode(name, client) {
  for (let attempt = 0; attempt < 8; attempt += 1) {
    const code = generateReferralCode(name);
    if (!(await userRepository.referralCodeExists(code, client))) return code;
  }
  throw new Error('Unable to generate referral code');
}

export async function register({ name, email, password, referralCode }) {
  const existing = await userRepository.findByEmail(email);
  if (existing) throw badRequest('Email is already registered', 'EMAIL_EXISTS');

  return db.withTransaction(async (client) => {
    let referredBy = null;
    if (referralCode) {
      const referrer = await userRepository.findByReferralCode(referralCode);
      if (!referrer) throw badRequest('Invalid referral code');
      referredBy = referrer.id;
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const newReferralCode = await createUniqueReferralCode(name, client);
    const user = await userRepository.create(
      { name, email, passwordHash, referralCode: newReferralCode, referredBy },
      client
    );

    if (user.id === referredBy) {
      throw badRequest('Self referral is not allowed');
    }

    return { user, token: signToken(user) };
  });
}

export async function login({ email, password }) {
  const user = await userRepository.findByEmail(email);
  if (!user || !user.is_active) throw unauthorized('Invalid credentials');

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) throw unauthorized('Invalid credentials');

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      referral_code: user.referral_code,
      referred_by: user.referred_by,
      role: user.role
    },
    token: signToken(user)
  };
}
