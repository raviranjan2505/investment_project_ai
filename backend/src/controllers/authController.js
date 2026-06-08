import * as authService from '../services/authService.js';
import { authCookieOptions } from '../config/cookies.js';
import { requiredEmail, requiredPassword, requiredString, optionalString } from '../validations/common.js';

export async function register(req, res) {
  const data = {
    name: requiredString(req.body.name, 'name', 120),
    email: requiredEmail(req.body.email),
    password: requiredPassword(req.body.password),
    referralCode: optionalString(req.body.referral_code, 'referral_code', 32)
  };
  const result = await authService.register(data);
  res.cookie('token', result.token, authCookieOptions());
  res.status(201).json({ user: result.user, token: result.token });
}

export async function login(req, res) {
  const data = {
    email: requiredEmail(req.body.email),
    password: requiredString(req.body.password, 'password', 128)
  };
  const result = await authService.login(data);
  res.cookie('token', result.token, authCookieOptions());
  res.json({ user: result.user, token: result.token });
}
