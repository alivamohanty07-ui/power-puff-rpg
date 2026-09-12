const jwt = require('jsonwebtoken');
const config = require('../config/env');
const userModel = require('../models/userModel');

/**
 * Authentication middleware for protecting API routes
 * Derives user strictly from the verified JWT bearer token
 */
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      detail: 'Authorization Bearer token required. Please sign in to enter the realm.'
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, config.JWT_SECRET);
    const userId = decoded.sub || decoded.id;

    if (!userId) {
      return res.status(401).json({ detail: 'Invalid token payload.' });
    }

    const user = userModel.findById(userId);
    if (!user) {
      return res.status(401).json({ detail: 'Adventurer account not found.' });
    }

    // Attach authenticated user to request
    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ detail: 'Session expired. Please sign in again.' });
    }
    return res.status(401).json({ detail: 'Invalid or corrupted authorization token.' });
  }
}

module.exports = authMiddleware;
