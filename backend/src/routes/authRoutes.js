const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

// Public endpoints
router.post('/register', authController.register);
router.post('/signup', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);

// Protected endpoints
router.get('/me', authMiddleware, authController.getMe);
router.post('/house', authMiddleware, authController.saveHouse);
router.patch('/house', authMiddleware, authController.saveHouse);
router.get('/house', authMiddleware, authController.getHouse);
router.patch('/avatar', authMiddleware, authController.updateAvatar);
router.patch('/theme', authMiddleware, authController.updateTheme);
router.patch('/stats', authMiddleware, authController.updateStats);

module.exports = router;
