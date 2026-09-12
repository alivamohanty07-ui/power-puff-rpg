const express = require('express');
const cors = require('cors');
const config = require('./config/env');
const authRoutes = require('./routes/authRoutes');

const app = express();

// CORS configuration
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || config.ALLOWED_ORIGINS.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, true);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    app: config.PROJECT_NAME,
    database: 'SQLite',
    timestamp: new Date().toISOString()
  });
});

// Root informational endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Power Puff RPG API! 🎮✨',
    health: '/api/health',
    endpoints: {
      auth: {
        register: 'POST /api/auth/register',
        signup: 'POST /api/auth/signup',
        login: 'POST /api/auth/login',
        me: 'GET /api/auth/me',
        logout: 'POST /api/auth/logout',
        house: 'PATCH /api/auth/house',
        avatar: 'PATCH /api/auth/avatar',
        theme: 'PATCH /api/auth/theme',
        stats: 'PATCH /api/auth/stats'
      }
    }
  });
});

const authMiddleware = require('./middleware/authMiddleware');
const authController = require('./controllers/authController');

// Mount auth routes
app.use('/api/auth', authRoutes);

// Life Profile routes (Phase 4: Build Your Life)
const lifeProfileRoutes = require('./routes/lifeProfileRoutes');
app.use('/api/life-profile', authMiddleware, lifeProfileRoutes);

// Quests routes (Phase 5A & 5B: Quest Hall & Focus Timer)
const questRoutes = require('./routes/questRoutes');
const questController = require('./controllers/questController');
app.use('/api/quests', authMiddleware, questRoutes);

// Daily Challenge routes (/api/daily-challenge)
app.get('/api/daily-challenge/today', authMiddleware, questController.getDailyChallenge);
app.get('/api/daily-challenge', authMiddleware, questController.getDailyChallenge);
app.post('/api/daily-challenge/:id/accept', authMiddleware, questController.acceptDailyChallenge);
app.post('/api/daily-challenge/:id/complete', authMiddleware, questController.completeDailyChallenge);

// User-scoped endpoints (/api/users/me/house)
app.post('/api/users/me/house', authMiddleware, authController.saveHouse);
app.get('/api/users/me/house', authMiddleware, authController.getHouse);
app.get('/api/users/me', authMiddleware, authController.getMe);

// 404 Handler for undefined API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ detail: `Route ${req.method} ${req.originalUrl} not found.` });
});

// Central error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    detail: 'An internal realm disturbance occurred. Please try again later.'
  });
});

module.exports = app;
