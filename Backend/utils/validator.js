import validator from 'validator';
import User from '../models/User.js';
import { readBearerToken, verifyAccessToken } from './jwt.js';

export function validateSignup({ name, email, password }) {
  const trimmedName = typeof name === 'string' ? name.trim() : '';
  if (!validator.isLength(trimmedName, { min: 2, max: 80 })) {
    return {
      message: 'Name must be at least 2 characters and at most 80 characters',
    };
  }

  const trimmedEmail = typeof email === 'string' ? email.trim() : '';
  if (!validator.isEmail(trimmedEmail)) {
    return {
      message: 'Invalid email address',
    };
  }

  if (typeof password !== 'string' || password.length < 6 || password.length > 72) {
    return {
      message: 'Password must be at least 6 characters and at most 72 characters',
    };
  }

  if (
    !validator.isStrongPassword(password, {
      minLength: 6,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
  ) {
    return {
      message:
        'Password must include an uppercase letter, a lowercase letter, a number, and a symbol',
    };
  }

  return null;
}

export function validateLogin({ email, password }) {
  const trimmedEmail = typeof email === 'string' ? email.trim() : '';
  if (!validator.isEmail(trimmedEmail)) {
    return {
      message: 'Please enter a valid email address.',
    };
  }

  if (typeof password !== 'string' || !password.trim()) {
    return {
      message: 'Please enter your password.',
    };
  }

  if (password.length > 72) {
    return {
      message: 'Password must be at most 72 characters',
    };
  }

  return null;
}

const SHIPMENT_STATUSES = ['Pending', 'In Transit'];

function readCoordinate(value, min, max) {
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) return null;
    value = Number(trimmed);
  }

  if (typeof value !== 'number' || !Number.isFinite(value) || value < min || value > max) {
    return null;
  }

  return value;
}

export function validateContainerId(containerId) {
  const value =
    typeof containerId === 'number'
      ? String(containerId)
      : typeof containerId === 'string'
        ? containerId.trim()
        : '';

  if (!value) {
    return { message: 'Container ID is required' };
  }

  if (!/^\d+$/.test(value)) {
    return { message: 'Container ID must be a number' };
  }

  return { value };
}

export function validateShipmentStatus(status) {
  if (!SHIPMENT_STATUSES.includes(status)) {
    return { message: 'Status must be Pending or In Transit' };
  }

  return null;
}

export function validateLocation(location, label) {
  if (!location || typeof location !== 'object') {
    return { message: `${label} is required` };
  }

  const lat = readCoordinate(location.lat, -90, 90);
  const lng = readCoordinate(location.lng, -180, 180);
  if (lat === null || lng === null) {
    return { message: `${label} must include a valid latitude and longitude` };
  }

  return { lat, lng };
}

export async function validateAccessUser(authorizationHeader = '') {
  const verified = verifyAccessToken(readBearerToken(authorizationHeader));
  if (verified.error) return verified.error;

  const user = await User.findById(verified.userId).select('_id');
  if (!user) {
    return { status: 401, message: 'Please log in to continue' };
  }

  return { userId: verified.userId };
}
