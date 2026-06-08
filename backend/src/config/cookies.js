import env from './env.js';

export function authCookieOptions() {
  return {
    httpOnly: true,
    secure: env.isProduction,
    sameSite: env.isProduction ? 'none' : 'lax',
    domain: env.cookieDomain,
    path: '/',
    maxAge: 7 * 24 * 60 * 60 * 1000
  };
}
