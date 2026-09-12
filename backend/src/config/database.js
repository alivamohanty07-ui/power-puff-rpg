const path = require('path');
const { DatabaseSync } = require('node:sqlite');
const config = require('./env');

// Determine database path
let dbPath = path.resolve(__dirname, '../../powerpuff.db');
if (config.DATABASE_URL && config.DATABASE_URL.startsWith('sqlite:///')) {
  const customPath = config.DATABASE_URL.replace('sqlite:///', '');
  dbPath = path.isAbsolute(customPath) ? customPath : path.resolve(__dirname, '../../', customPath);
}

// Connect to SQLite database
const db = new DatabaseSync(dbPath);

/**
 * Initialize and migrate database schema
 */
function initDatabase() {
  // 1. Create users table if not exists
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name VARCHAR(100),
      username VARCHAR(100) UNIQUE NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash VARCHAR(255),
      hashed_password VARCHAR(255) NOT NULL,
      selected_theme VARCHAR(50) DEFAULT 'dark-dungeon',
      personality_house VARCHAR(100) DEFAULT '',
      character_avatar VARCHAR(100) DEFAULT 'emily',
      level INTEGER DEFAULT 1,
      xp INTEGER DEFAULT 0,
      gold INTEGER DEFAULT 100,
      streak INTEGER DEFAULT 1,
      intellect INTEGER DEFAULT 10,
      strength INTEGER DEFAULT 10,
      vitality INTEGER DEFAULT 10,
      mind INTEGER DEFAULT 10,
      has_completed_induction BOOLEAN DEFAULT 0,
      avatar_config TEXT DEFAULT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Ensure unique index on email
  db.exec(`CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email ON users(email);`);
  db.exec(`CREATE UNIQUE INDEX IF NOT EXISTS idx_users_username ON users(username);`);

  // 2. Migration: Ensure 'name' and 'password_hash' columns exist if table was previously created without them
  try {
    const columns = db.prepare('PRAGMA table_info(users);').all().map(c => c.name);
    if (!columns.includes('name')) {
      db.exec('ALTER TABLE users ADD COLUMN name VARCHAR(100);');
    }
    if (!columns.includes('password_hash')) {
      db.exec('ALTER TABLE users ADD COLUMN password_hash VARCHAR(255);');
    }
    // Synchronize name with username if empty
    db.exec(`UPDATE users SET name = username WHERE name IS NULL OR name = '';`);
    // Synchronize password_hash with hashed_password if empty
    db.exec(`UPDATE users SET password_hash = hashed_password WHERE password_hash IS NULL OR password_hash = '';`);
  } catch (err) {
    console.warn('Database column check notice:', err.message);
  }
}

// Run schema initialization immediately
initDatabase();

module.exports = {
  db,
  dbPath,
  initDatabase
};
