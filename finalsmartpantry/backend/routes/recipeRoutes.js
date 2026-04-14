import express from 'express';
import { getRecommendations } from '../services/recommendationService.js';

const router = express.Router();

router.post('/recommend', (req, res) => {
  const { ingredients } = req.body;

  if (!Array.isArray(ingredients) || ingredients.length === 0) {
    return res.status(400).json({ message: 'Ingredients array is required.' });
  }

  const results = getRecommendations(ingredients);
  return res.json({ results });
});

export default router;
