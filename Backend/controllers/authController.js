import User from '../models/User.js';
import { isDisposableEmail } from '../utils/checkDispose.js';
import { readBearerToken, signAccessToken, verifyAccessToken } from '../utils/jwt.js';
import { validateLogin, validateSignup } from '../utils/validator.js';

export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const validation = validateSignup({ name, email, password });

    if (validation) {
      return res.status(400).json({ success: false, data: null, message: validation.message });
    }

    if (await isDisposableEmail(email)) {
      return res
        .status(400)
        .json({
          success: false,
          data: null,
          message: 'Disposable email addresses are not allowed.',
        });
    }

    const existing = await User.findOne({ email }).select('_id');

    if (existing) {
      return res
        .status(400)
        .json({ success: false, data: null, message: 'An account with this email already exists' });
    }

    await User.create({ name, email, password });

    return res.status(201).json({
      success: true,
      data: null,
      message: 'Account created successfully.',
    });
  } catch (err) {
    return res.status(500).json({ success: false, data: null, message: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const validation = validateLogin({ email, password });
    if (validation) {
      return res.status(400).json({ success: false, data: null, message: validation.message });
    }
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.comparePassword(password))) {
      return res
        .status(400)
        .json({ success: false, data: null, message: 'Invalid email or password' });
    }

    const signed = signAccessToken(user._id);
    if (signed.error) {
      return res
        .status(signed.error.status)
        .json({ success: false, data: null, message: signed.error.message });
    }

    return res.status(200).json({
      success: true,
      data: {
        isAuthenticated: true,
        token: signed.token,
      },
      message: 'Logged in successfully.',
    });
  } catch (err) {
    return res.status(500).json({ success: false, data: null, message: err.message });
  }
};

export const me = async (req, res) => {
  try {
    const verified = verifyAccessToken(readBearerToken(req.headers.authorization, req.body?.token));
    if (verified.error) {
      return res
        .status(verified.error.status)
        .json({ success: false, data: null, message: verified.error.message });
    }

    const user = await User.findById(verified.userId).select('name email');
    if (!user) {
      return res
        .status(401)
        .json({ success: false, data: null, message: 'Please log in to continue' });
    }

    return res.status(200).json({
      success: true,
      data: {
        isAuthenticated: true,
      },
      message: 'Authenticated successfully.',
    });
  } catch (err) {
    return res.status(500).json({ success: false, data: null, message: err.message });
  }
};

export const logout = async (req, res) => {
  try {
    const verified = verifyAccessToken(
      readBearerToken(req.headers.authorization, req.body?.token),
      {
        allowExpired: true,
      },
    );
    if (verified.error) {
      return res
        .status(verified.error.status)
        .json({ success: false, data: null, message: verified.error.message });
    }

    return res.status(200).json({
      success: true,
      data: null,
      message: 'Logged out successfully.',
    });
  } catch (err) {
    return res.status(500).json({ success: false, data: null, message: err.message });
  }
};
