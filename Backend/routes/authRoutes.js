import express from 'express';

import { signup, login, logout, me } from '../controllers/authController.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', me);

export default router;
