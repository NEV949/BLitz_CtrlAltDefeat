import express from 'express';
import { getProfile, loginUser, registerUser } from '../services/authService.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name?.trim() || !email?.trim() || !password?.trim()) {
      return res.status(400).json({ message: 'Name, email, and password are required.' });
    }

    if (password.trim().length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters.' });
    }

    const payload = await registerUser({ name, email, password });
    return res.status(201).json(payload);
  } catch (error) {
    return res.status(400).json({ message: error.message || 'Could not create account.' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email?.trim() || !password?.trim()) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const payload = await loginUser({ email, password });
    return res.json(payload);
  } catch (error) {
    return res.status(400).json({ message: error.message || 'Could not log in.' });
  }
});

router.get('/me', requireAuth, async (req, res) => {
  try {
    const user = await getProfile(req.user.sub);
    return res.json({ user });
  } catch (error) {
    return res.status(404).json({ message: error.message || 'Could not load profile.' });
  }
});

export default router;
