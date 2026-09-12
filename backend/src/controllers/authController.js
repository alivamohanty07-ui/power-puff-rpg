const jwt = require('jsonwebtoken');
const config = require('../config/env');
const userModel = require('../models/userModel');

/**
 * Generate signed JWT Bearer token
 */
function generateToken(user) {
  return jwt.sign(
    {
      sub: user.id,
      email: user.email,
      name: user.name || user.username
    },
    config.JWT_SECRET,
    { expiresIn: config.JWT_EXPIRES_IN }
  );
}

/**
 * Email format validation regex
 */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Register / Create Account
 * POST /api/auth/register or POST /api/auth/signup
 */
exports.register = (req, res) => {
  const name = (req.body.name || req.body.username || '').trim();
  const email = (req.body.email || '').trim();
  const password = req.body.password;
  const confirmPassword = req.body.confirm_password;

  // 1. Validate Hero Name
  if (!name || name.length < 2) {
    return res.status(400).json({
      detail: 'Hero name must be at least 2 characters of power.'
    });
  }

  // 2. Validate Email
  if (!email || !EMAIL_REGEX.test(email)) {
    return res.status(400).json({
      detail: 'Please provide a valid realm scroll email.'
    });
  }

  // 3. Validate Password
  if (!password || password.length < 6) {
    return res.status(400).json({
      detail: 'Your password must contain at least 6 characters of power.'
    });
  }

  // 4. Validate Password Confirmation (if provided)
  if (confirmPassword && password !== confirmPassword) {
    return res.status(400).json({
      detail: 'Your passwords do not match in harmony.'
    });
  }

  // 5. Check if email already registered
  const existingEmail = userModel.findByEmail(email);
  if (existingEmail) {
    return res.status(400).json({
      detail: 'An adventurer with this realm scroll email already exists.'
    });
  }

  // 6. Check if username already registered
  const existingUsername = userModel.findByUsername(name);
  if (existingUsername) {
    return res.status(400).json({
      detail: 'This hero name is already claimed. Please choose another.'
    });
  }

  // 7. Create user with hashed password
  const newUser = userModel.createUser({
    name,
    username: name,
    email,
    password,
    selected_theme: req.body.selected_theme || 'dark-dungeon',
    personality_house: req.body.personality_house || '',
    character_avatar: req.body.character_avatar || 'emily'
  });

  // 8. Generate auth token
  const token = generateToken(newUser);

  // 9. Return safe user information (never password or hash)
  return res.status(201).json({
    access_token: token,
    token_type: 'bearer',
    user: userModel.sanitizeUser(newUser)
  });
};

/**
 * Login / Sign In
 * POST /api/auth/login
 */
exports.login = (req, res) => {
  const identifier = (req.body.email || req.body.username_or_email || req.body.username || '').trim();
  const password = req.body.password;

  if (!identifier || !password) {
    return res.status(400).json({
      detail: 'Please provide both realm email and password.'
    });
  }

  // Find user by email or username
  const user = userModel.findByIdentifier(identifier);

  if (!user) {
    // Avoid revealing specifically whether email exists or password was wrong
    return res.status(401).json({
      detail: "That spell didn't work. Check your email or password."
    });
  }

  const hash = user.password_hash || user.hashed_password;
  const isMatch = userModel.verifyPassword(password, hash);

  if (!isMatch) {
    return res.status(401).json({
      detail: "That spell didn't work. Check your email or password."
    });
  }

  // Generate auth token
  const token = generateToken(user);

  return res.json({
    access_token: token,
    token_type: 'bearer',
    user: userModel.sanitizeUser(user)
  });
};

/**
 * Get Current Authenticated Hero Profile
 * GET /api/auth/me
 */
exports.getMe = (req, res) => {
  // req.user attached by authMiddleware
  return res.json(userModel.sanitizeUser(req.user));
};

/**
 * Logout
 * POST /api/auth/logout
 */
exports.logout = (req, res) => {
  return res.json({
    success: true,
    message: 'Successfully departed the realm gates. Safe travels!'
  });
};

/**
 * Persist House Attunement
 * PATCH /api/auth/house
 */
exports.updateHouse = (req, res) => {
  const houseName = req.body.house || req.body.personality_house;
  if (!houseName) {
    return res.status(400).json({ detail: 'House name is required.' });
  }

  const updated = userModel.updateHouse(req.user.id, houseName);
  return res.json(userModel.sanitizeUser(updated));
};

/**
 * Persist Avatar Customization
 * PATCH /api/auth/avatar
 */
exports.updateAvatar = (req, res) => {
  const avatarData = req.body.avatar_data || req.body.avatar;
  const characterName = req.body.name || req.body.characterName;

  if (!avatarData) {
    return res.status(400).json({ detail: 'Avatar data is required.' });
  }

  const updated = userModel.updateAvatar(req.user.id, avatarData, characterName);
  return res.json(userModel.sanitizeUser(updated));
};

/**
 * Update Selected Visual Theme
 * PATCH /api/auth/theme
 */
exports.updateTheme = (req, res) => {
  const selectedTheme = req.body.selected_theme || req.body.theme;
  if (!selectedTheme) {
    return res.status(400).json({ detail: 'Theme name is required.' });
  }

  const updated = userModel.updateTheme(req.user.id, selectedTheme);
  return res.json(userModel.sanitizeUser(updated));
};

/**
 * Update RPG stats (XP, Gold, Level, Streak)
 * PATCH /api/auth/stats
 */
exports.updateStats = (req, res) => {
  const updated = userModel.updateStats(req.user.id, req.body);
  return res.json(userModel.sanitizeUser(updated));
};
