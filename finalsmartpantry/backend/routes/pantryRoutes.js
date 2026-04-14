import express from 'express';
import { requireAuth } from '../middleware/authMiddleware.js';
import { saveUserPantry } from '../services/authService.js';

const router = express.Router();

router.put('/', requireAuth, async (req, res) => {
  try {
    const pantry = Array.isArray(req.body?.pantry) ? req.body.pantry : [];
    const savedPantry = await saveUserPantry(req.user.sub, pantry);
    return res.json({ pantry: savedPantry });
  } catch (error) {
    return res.status(400).json({ message: error.message || 'Could not save pantry.' });
  }
});

export default router;
