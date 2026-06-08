import { badRequest } from '../utils/errors.js';

export function requiredString(value, field, max = 255) {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw badRequest(`${field} is required`);
  }
  if (value.trim().length > max) {
    throw badRequest(`${field} is too long`);
  }
  return value.trim();
}

export function optionalString(value, field, max = 255) {
  if (value === undefined || value === null || value === '') return null;
  return requiredString(value, field, max);
}

export function requiredAmount(value, field = 'amount') {
  const amount = Number(value);
  if (!Number.isFinite(amount) || amount <= 0) {
    throw badRequest(`${field} must be a positive number`);
  }
  return Math.round(amount * 100) / 100;
}

export function requiredEmail(value) {
  const email = requiredString(value, 'email', 180).toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw badRequest('email must be valid');
  }
  return email;
}

export function requiredPassword(value) {
  const password = requiredString(value, 'password', 128);
  if (password.length < 8) {
    throw badRequest('password must be at least 8 characters');
  }
  return password;
}
