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

  // 2. Create user_houses relational table
  db.exec(`
    CREATE TABLE IF NOT EXISTS user_houses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL UNIQUE,
      house_id VARCHAR(50) NOT NULL,
      house_name VARCHAR(100) NOT NULL,
      selected_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);
  db.exec(`CREATE INDEX IF NOT EXISTS idx_user_houses_user_id ON user_houses(user_id);`);

  // 3. Create life_profiles table
  db.exec(`
    CREATE TABLE IF NOT EXISTS life_profiles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL UNIQUE,
      path_type VARCHAR(50) NOT NULL DEFAULT '',
      custom_path TEXT DEFAULT NULL,
      education_data TEXT DEFAULT NULL,
      completed_step INTEGER DEFAULT 0,
      is_completed BOOLEAN DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);
  db.exec(`CREATE INDEX IF NOT EXISTS idx_life_profiles_user_id ON life_profiles(user_id);`);

  // 4. Create user_subjects table
  db.exec(`
    CREATE TABLE IF NOT EXISTS user_subjects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      subject_name VARCHAR(150) NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);
  db.exec(`CREATE INDEX IF NOT EXISTS idx_user_subjects_user_id ON user_subjects(user_id);`);

  // 5. Create user_interests table
  db.exec(`
    CREATE TABLE IF NOT EXISTS user_interests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      activity_name VARCHAR(150) NOT NULL,
      category VARCHAR(100) NOT NULL,
      frequency VARCHAR(50) DEFAULT 'several_times_a_week',
      approximate_duration VARCHAR(50) DEFAULT '1_hour',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);
  db.exec(`CREATE INDEX IF NOT EXISTS idx_user_interests_user_id ON user_interests(user_id);`);

  // 6. Create user_schedules table
  db.exec(`
    CREATE TABLE IF NOT EXISTS user_schedules (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      activity_name VARCHAR(150) NOT NULL,
      category VARCHAR(50) NOT NULL DEFAULT 'other',
      start_time VARCHAR(10) NOT NULL,
      end_time VARCHAR(10) NOT NULL,
      sort_order INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);
  db.exec(`CREATE INDEX IF NOT EXISTS idx_user_schedules_user_id ON user_schedules(user_id);`);

  // 7. Migrations: Ensure columns exist if tables were created previously
  try {
    const userColumns = db.prepare('PRAGMA table_info(users);').all().map(c => c.name);
    if (!userColumns.includes('name')) {
      db.exec('ALTER TABLE users ADD COLUMN name VARCHAR(100);');
    }
    if (!userColumns.includes('password_hash')) {
      db.exec('ALTER TABLE users ADD COLUMN password_hash VARCHAR(255);');
    }
    if (!userColumns.includes('has_completed_life_builder')) {
      db.exec('ALTER TABLE users ADD COLUMN has_completed_life_builder BOOLEAN DEFAULT 0;');
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
