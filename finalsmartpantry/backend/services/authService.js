import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { usersDb } from '../db/database.js';

const JWT_SECRET = process.env.JWT_SECRET || 'smartpantry-dev-secret';
const TOKEN_EXPIRES_IN = '7d';

const sanitizePantryItem = (item = {}) => ({
  name: String(item.name || '').trim().toLowerCase(),
  qty: Math.max(0, Number(item.qty) || 0),
  freshness: ['fresh', 'medium', 'near-expiry'].includes(item.freshness) ? item.freshness : 'fresh'
});

const sanitizePantry = (pantry = []) => pantry
  .map(sanitizePantryItem)
  .filter((item) => item.name && item.qty > 0);

const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  pantry: sanitizePantry(user.pantry || []),
  createdAt: user.createdAt
});

const createToken = (user) => jwt.sign(
  { sub: user._id, email: user.email, name: user.name },
  JWT_SECRET,
  { expiresIn: TOKEN_EXPIRES_IN }
);

export const registerUser = async ({ name, email, password }) => {
  const normalizedEmail = email.trim().toLowerCase();
  const existingUser = await usersDb.findOne({ email: normalizedEmail });

  if (existingUser) {
    throw new Error('An account with this email already exists.');
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await usersDb.insert({
    name: name.trim(),
    email: normalizedEmail,
    passwordHash,
    pantry: []
  });

  return {
    token: createToken(user),
    user: sanitizeUser(user)
  };
};

export const loginUser = async ({ email, password }) => {
  const normalizedEmail = email.trim().toLowerCase();
  const user = await usersDb.findOne({ email: normalizedEmail });

  if (!user) {
    throw new Error('No account found with that email.');
  }

  const isValid = await bcrypt.compare(password, user.passwordHash);

  if (!isValid) {
    throw new Error('Incorrect password.');
  }

  return {
    token: createToken(user),
    user: sanitizeUser(user)
  };
};

export const getProfile = async (userId) => {
  const user = await usersDb.findOne({ _id: userId });

  if (!user) {
    throw new Error('User not found.');
  }

  return sanitizeUser(user);
};

export const saveUserPantry = async (userId, pantry) => {
  const sanitizedPantry = sanitizePantry(pantry);

  const updates = await usersDb.update(
    { _id: userId },
    { $set: { pantry: sanitizedPantry, updatedAt: new Date().toISOString() } },
    { returnUpdatedDocs: true }
  );

  const updatedUser = Array.isArray(updates) ? updates[1] : null;

  if (!updatedUser) {
    const user = await usersDb.findOne({ _id: userId });
    if (!user) throw new Error('User not found.');
    return sanitizePantry(user.pantry || []);
  }

  return sanitizePantry(updatedUser.pantry || []);
};
