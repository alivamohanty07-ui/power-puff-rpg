const path = require('path');
const dotenv = require('dotenv');

// Load .env from backend directory or fallback to root
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const config = {
  PROJECT_NAME: process.env.PROJECT_NAME || 'Power Puff RPG Backend',
  PORT: parseInt(process.env.PORT || '8000', 10),
  JWT_SECRET: process.env.JWT_SECRET || process.env.SECRET_KEY || 'powerpuff_secret_rpg_key_gamified_2026_super_secure',
  JWT_EXPIRES_IN: process.env.ACCESS_TOKEN_EXPIRE_MINUTES ? `${process.env.ACCESS_TOKEN_EXPIRE_MINUTES}m` : '7d',
  DATABASE_URL: process.env.DATABASE_URL || 'sqlite:///./powerpuff.db',
  ALLOWED_ORIGINS: [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:3000',
    'http://127.0.0.1:3000'
  ]
};

module.exports = config;
