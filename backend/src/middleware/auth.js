import { verifyToken } from '../utils/jwt.js';
import { unauthorized } from '../utils/errors.js';
import * as userRepository from '../repositories/userRepository.js';

export async function requireAuth(req, _res, next) {
  try {
    // Try to get token from Authorization header first, then fall back to cookies
    let token = req.cookies?.token;
    
    if (!token && req.headers.authorization) {
      const authHeader = req.headers.authorization;
      if (authHeader.startsWith('Bearer ')) {
        token = authHeader.slice(7); // Remove 'Bearer ' prefix
      }
    }
    
    if (!token) throw unauthorized();

    const payload = verifyToken(token);
    const user = await userRepository.findById(payload.sub);
    if (!user || !user.is_active) throw unauthorized();

    req.user = user;
    next();
  } catch (error) {
    next(unauthorized('Invalid or expired token'));
  }
}
