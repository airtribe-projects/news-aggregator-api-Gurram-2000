const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authentication = require('../Middleware/apiauthenticate');
const getUsers= require('../User')
const users = getUsers();
const axios = require('axios');

const router = express.Router();
const SECRET_KEY = process.env.SECRET_KEY;
const NEWS_API_KEY = process.env.NewsAPiKey;

// ---------------------- Helper Functions ----------------------

function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

function validatePassword(password, minLength = 8) {
  if (typeof password !== 'string') return false;
  const hasMinLength = password.length >= minLength;
  const hasAlphaNumeric = /[a-zA-Z0-9]/.test(password);
  const hasSpecialChar = /[^a-zA-Z0-9]/.test(password);
  return hasMinLength && hasAlphaNumeric && hasSpecialChar;
}

// ---------------------- POST /users/signup ----------------------

router.post('/users/signup', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  if (!validateEmail(email)) {
    return res.status(400).json({ message: 'Invalid email format.' });
  }

  if (!validatePassword(password)) {
    return res.status(400).json({
      message:
        'Password must include letters, numbers, a special character, and be at least 8 characters long.'
    });
  }

  const existingUser = users.find((u) => u.email === email);
  if (existingUser) {
    return res.status(400).json({ message: 'User already exists.' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  users.push({ email, password: hashedPassword, preferences: req.body.preferences || [] });

  res.status(200).json({ message: 'Signup successful.' });
});

// ---------------------- POST /users/login ----------------------

router.post('/users/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Missing credentials.' });
  }

  const user = users.find((u) => u.email === email);
  if (!user) {
    return res.status(401).json({ message: 'Invalid username or password.' });
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    return res.status(401).json({ message: 'Invalid username or password.' });
  }

  const token = jwt.sign({ email }, SECRET_KEY);
  res.status(200).json({ token });
});

// ---------------------- GET /users/preferences ----------------------

router.get('/users/preferences', authentication, (req, res) => {
  const user = users.find((u) => u.email === req.user.email);
  if (!user) {
    return res.status(404).json({ message: 'User not found.' });
  }

  res.status(200).json({ preferences: user.preferences || [] });
});

// ---------------------- PUT /users/preferences ----------------------

router.put('/users/preferences', authentication, (req, res) => {
  const { preferences } = req.body;

  if (!Array.isArray(preferences)) {
    return res.status(400).json({ message: 'Preferences must be an array.' });
  }

  const invalid = preferences.some((p) => typeof p !== 'string' || p.trim() === '');
  if (invalid) {
    return res.status(400).json({ message: 'Preferences must be non-empty strings.' });
  }

  const user = users.find((u) => u.email === req.user.email);
  if (!user) {
    return res.status(404).json({ message: 'User not found.' });
  }

  user.preferences = preferences;
  res.status(200).json({ message: 'Preferences updated.', preferences });
});

// ---------------------- GET /users/news ----------------------

router.get('/news', authentication, async (req, res) => {
  const user = users.find((u) => u.email === req.user.email);
  if (!user) {
    return res.status(404).json({ message: 'User not found.' });
  }

  const preferences = user.preferences || [];
  if (preferences.length === 0) {
    return res.status(400).json({ message: 'No preferences set.' });
  }

  try {
    const query = preferences.join(' OR ');
    const response = await axios.get('https://gnews.io/api/v4/search', {
      params: {
        q: query,
        token: NEWS_API_KEY,
        language: 'en',
        max: 10
      }
    });

    res.status(200).json({ news: response.data.articles });
  } catch (err) {
    console.error('News fetch error:', err.message);
    res.status(500).json({ message: 'Failed to retrieve news.' });
  }
});

module.exports = router;
