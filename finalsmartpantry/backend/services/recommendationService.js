import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const recipesPath = path.join(__dirname, '../data/recipes.json');
const recipes = JSON.parse(fs.readFileSync(recipesPath, 'utf-8'));

const freshnessWeights = {
  'near-expiry': 1,
  medium: 0.72,
  fresh: 0.45
};

const synonymMap = {
  capsicum: ['bell pepper'],
  coriander: ['cilantro'],
  paneer: ['cottage cheese'],
  chilli: ['green chilli', 'red chilli', 'chili'],
  flour: ['maida', 'wheat flour']
};

const normalizeName = (value = '') => String(value)
  .trim()
  .toLowerCase()
  .replace(/\([^)]*\)/g, ' ')
  .replace(/[^a-z\s-]/g, ' ')
  .replace(/\s+/g, ' ')
  .trim();

const namesMatch = (a, b) => {
  const left = normalizeName(a);
  const right = normalizeName(b);
  if (!left || !right) return false;
  if (left === right) return true;
  if (left.includes(right) || right.includes(left)) return true;

  for (const [key, values] of Object.entries(synonymMap)) {
    const bucket = [key, ...values].map(normalizeName);
    if (bucket.includes(left) && bucket.includes(right)) return true;
  }

  return false;
};

const classifyScore = (score, coverageRatio) => {
  if (coverageRatio >= 0.7 && score >= 70) return 'Optimal';
  if (coverageRatio >= 0.4 && score >= 40) return 'Partial';
  return 'Low';
};

const normalizePantry = (ingredients) => ingredients.reduce((acc, item) => {
  const name = normalizeName(item.name);
  if (!name) return acc;

  const qty = Math.max(0, Number(item.qty) || 0);
  const freshness = ['fresh', 'medium', 'near-expiry'].includes(item.freshness) ? item.freshness : 'fresh';

  if (!acc[name]) {
    acc[name] = { name, qty, freshness };
    return acc;
  }

  acc[name].qty += qty;
  const order = ['fresh', 'medium', 'near-expiry'];
  if (order.indexOf(freshness) > order.indexOf(acc[name].freshness)) {
    acc[name].freshness = freshness;
  }

  return acc;
}, {});

const ingredientFrequency = recipes.reduce((acc, recipe) => {
  for (const ingredient of recipe.ingredients || []) {
    const key = normalizeName(ingredient.name);
    if (!key) continue;
    acc[key] = (acc[key] || 0) + 1;
  }
  return acc;
}, {});

const scarcityWeight = (ingredientName) => {
  const key = normalizeName(ingredientName);
  const frequency = ingredientFrequency[key] || recipes.length;
  const rarity = 1 - Math.min(frequency / recipes.length, 1);
  return 1 + rarity * 0.35;
};

const buildReason = ({ matchedCount, totalRequired, urgentMatches, exactQtyMatches, missingCount }) => {
  const coverageText = `${matchedCount}/${totalRequired} ingredients matched`;
  const urgencyText = urgentMatches > 0
    ? `${urgentMatches} near-expiry ingredient${urgentMatches === 1 ? '' : 's'} boosted priority`
    : 'no urgent pantry boost';
  const qtyText = `${exactQtyMatches} ingredient${exactQtyMatches === 1 ? '' : 's'} met required quantity`;
  const missingText = missingCount === 0 ? 'nothing missing' : `${missingCount} still missing`;

  return `${coverageText}, ${urgencyText}, ${qtyText}, ${missingText}.`;
};

const findPantryMatch = (pantryEntries, ingredientName) => pantryEntries.find(([name]) => namesMatch(name, ingredientName));

const scoreRecipe = (recipe, pantry) => {
  const requiredIngredients = recipe.ingredients || [];
  const pantryEntries = Object.entries(pantry);
  const matched = [];
  const missing = [];
  let coveragePoints = 0;
  let freshnessPoints = 0;
  let qtyPoints = 0;
  let urgentMatches = 0;
  let exactQtyMatches = 0;

  for (const ingredient of requiredIngredients) {
    const matchedEntry = findPantryMatch(pantryEntries, ingredient.name);
    const ingredientWeight = scarcityWeight(ingredient.name);

    if (!matchedEntry) {
      missing.push(ingredient.name);
      continue;
    }

    const [, pantryItem] = matchedEntry;
    const requiredQty = Math.max(1, Number(ingredient.qty) || 1);
    const qtyRatio = Math.min((pantryItem.qty || 0) / requiredQty, 1);

    matched.push({
      name: ingredient.name,
      requiredQty,
      availableQty: pantryItem.qty,
      freshness: pantryItem.freshness
    });

    coveragePoints += ingredientWeight;
    freshnessPoints += (freshnessWeights[pantryItem.freshness] || 0) * ingredientWeight;
    qtyPoints += qtyRatio * ingredientWeight;
    if (pantryItem.freshness === 'near-expiry') urgentMatches += 1;
    if (qtyRatio >= 1) exactQtyMatches += 1;
  }

  const totalWeight = requiredIngredients.reduce((sum, ingredient) => sum + scarcityWeight(ingredient.name), 0) || 1;
  const coverageRatio = coveragePoints / totalWeight;
  const qtyRatio = qtyPoints / totalWeight;
  const freshnessRatio = freshnessPoints / totalWeight;

  let score = Math.round((coverageRatio * 58) + (freshnessRatio * 24) + (qtyRatio * 18));

  if (missing.length === 0) score = Math.min(100, score + 8);
  if (coverageRatio < 0.35) score = Math.min(score, 39);
  else if (coverageRatio < 0.7) score = Math.min(score, 69);

  const classification = classifyScore(score, coverageRatio);

  return {
    id: recipe.id,
    name: recipe.name,
    description: recipe.description,
    totalIngredients: requiredIngredients.length,
    score,
    classification,
    matched,
    missing,
    reason: buildReason({
      matchedCount: matched.length,
      totalRequired: requiredIngredients.length || 1,
      urgentMatches,
      exactQtyMatches,
      missingCount: missing.length
    })
  };
};

export const getRecommendations = (ingredients) => {
  const pantry = normalizePantry(ingredients);

  return recipes
    .map((recipe) => scoreRecipe(recipe, pantry))
    .filter((recipe) => recipe.score > 0)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      if (b.matched.length !== a.matched.length) return b.matched.length - a.matched.length;
      return a.missing.length - b.missing.length;
    })
    .slice(0, 12);
};
