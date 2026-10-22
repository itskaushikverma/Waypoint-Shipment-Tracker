import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

const ISSUER = 'shipment-tracker';
const EXPIRES_IN = '60m';

export function validateJwtSecret(secret = process.env.JWT_SECRET) {
  if (!secret || typeof secret !== 'string' || secret.length < 32) {
    return { status: 500, message: 'Auth is not configured' };
  }

  return null;
}

export function readBearerToken(authorizationHeader = '', bodyToken) {
  const header = typeof authorizationHeader === 'string' ? authorizationHeader : '';
  if (header.startsWith('Bearer ')) return header.slice(7).trim();
  if (typeof bodyToken === 'string' && bodyToken.trim()) return bodyToken.trim();
  return '';
}

export function validateAccessToken(token) {
  if (!token || typeof token !== 'string') {
    return { status: 401, message: 'Please log in to continue' };
  }

  return validateJwtSecret();
}

export function signAccessToken(userId) {
  const secretError = validateJwtSecret();
  if (secretError) return { error: secretError };

  const id = String(userId);
  const token = jwt.sign({ userId: id, sub: id, type: 'access' }, process.env.JWT_SECRET, {
    algorithm: 'HS256',
    expiresIn: EXPIRES_IN,
    issuer: ISSUER,
  });

  return { token };
}

export function verifyAccessToken(token, { allowExpired = false } = {}) {
  const tokenError = validateAccessToken(token);
  if (tokenError) return { error: tokenError };

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ['HS256'],
      issuer: ISSUER,
    });
    const userId = decoded.userId || decoded.sub;

    if (!userId || decoded.type !== 'access' || !mongoose.isValidObjectId(userId)) {
      return { error: { status: 401, message: 'Please log in to continue' } };
    }

    return { userId: String(userId) };
  } catch (error) {
    if (allowExpired && error.name === 'TokenExpiredError') {
      return { expired: true };
    }

    const expired = error.name === 'TokenExpiredError';
    return {
      error: {
        status: 401,
        message: expired ? 'Session expired. Please log in again' : 'Please log in to continue',
      },
    };
  }
}
