import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'sibling_vault_jwt_secret_key_2026';

/**
 * Optional Auth Middleware:
 * If a valid JWT is passed in Authorization header, attaches req.user.
 * If no token or invalid token, req.user is set to null and request continues (guest mode).
 */
export const optionalAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      req.user = null;
      return next();
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      req.user = null;
      return next();
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    // If token expired or invalid, treat as guest without blocking
    req.user = null;
    next();
  }
};

/**
 * Required Auth Middleware:
 * Blocks unauthenticated requests with 401 Unauthorized.
 */
export const requireAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authentication required. Please sign in.' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Authentication token missing.' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired session. Please sign in again.' });
  }
};
