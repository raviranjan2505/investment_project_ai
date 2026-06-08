import { forbidden } from '../utils/errors.js';

export function requireAdmin(req, _res, next) {
  if (!req.user) {
    throw forbidden('Not authenticated');
  }

  if (req.user.role !== 'admin') {
    throw forbidden('Admin access required');
  }

  next();
}
