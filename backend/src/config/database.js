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

  // 7. Create user_quests table (Phase 5A: Quest Hall)
  db.exec(`
    CREATE TABLE IF NOT EXISTS user_quests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      title VARCHAR(200) NOT NULL,
      category VARCHAR(100) NOT NULL,
      attribute VARCHAR(50) NOT NULL DEFAULT 'intellect',
      secondary_attribute VARCHAR(50) DEFAULT NULL,
      difficulty VARCHAR(50) NOT NULL DEFAULT 'normal',
      duration_minutes INTEGER NOT NULL DEFAULT 30,
      elapsed_seconds INTEGER NOT NULL DEFAULT 0,
      status VARCHAR(50) NOT NULL DEFAULT 'ready',
      xp_reward INTEGER NOT NULL DEFAULT 50,
      gold_reward INTEGER NOT NULL DEFAULT 20,
      attribute_gain INTEGER NOT NULL DEFAULT 2,
      quest_date VARCHAR(20) NOT NULL,
      started_at DATETIME DEFAULT NULL,
      completed_at DATETIME DEFAULT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);
  db.exec(`CREATE INDEX IF NOT EXISTS idx_user_quests_user_date ON user_quests(user_id, quest_date);`);

  // 8. Create daily_challenges table (Phase 5A: Academy Daily Challenges)
  db.exec(`
    CREATE TABLE IF NOT EXISTS daily_challenges (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      title VARCHAR(200) NOT NULL,
      subtitle VARCHAR(200) DEFAULT '',
      description TEXT DEFAULT '',
      challenge_tier VARCHAR(50) DEFAULT 'normal',
      tasks_json TEXT NOT NULL,
      xp_reward INTEGER NOT NULL DEFAULT 120,
      gold_reward INTEGER NOT NULL DEFAULT 60,
      gems_reward INTEGER NOT NULL DEFAULT 15,
      attribute VARCHAR(50) DEFAULT 'intellect',
      attribute_gain INTEGER DEFAULT 5,
      status VARCHAR(50) NOT NULL DEFAULT 'ready',
      challenge_date VARCHAR(20) NOT NULL,
      completed_at DATETIME DEFAULT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);
  db.exec(`CREATE INDEX IF NOT EXISTS idx_daily_challenges_user_date ON daily_challenges(user_id, challenge_date);`);

  // 9. Create focus_sessions table (Phase 5B: Authoritative Focus Sessions)
  db.exec(`
    CREATE TABLE IF NOT EXISTS focus_sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      quest_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      started_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      paused_at DATETIME DEFAULT NULL,
      resumed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      completed_at DATETIME DEFAULT NULL,
      accumulated_active_seconds INTEGER NOT NULL DEFAULT 0,
      status VARCHAR(50) NOT NULL DEFAULT 'active',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (quest_id) REFERENCES user_quests(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);
  db.exec(`CREATE INDEX IF NOT EXISTS idx_focus_sessions_quest_user ON focus_sessions(quest_id, user_id);`);

  // 10. Create quest_completion_logs table (Phase 5B: Historical Completion Logs)
  db.exec(`
    CREATE TABLE IF NOT EXISTS quest_completion_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      quest_id INTEGER NOT NULL,
      session_id INTEGER DEFAULT NULL,
      completed_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      duration_seconds INTEGER NOT NULL,
      xp_awarded INTEGER NOT NULL,
      gold_awarded INTEGER NOT NULL DEFAULT 0,
      gems_awarded INTEGER NOT NULL DEFAULT 0,
      attribute_awarded VARCHAR(50) NOT NULL,
      attribute_gain INTEGER NOT NULL DEFAULT 2,
      is_perfect_day_trigger BOOLEAN NOT NULL DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (quest_id) REFERENCES user_quests(id) ON DELETE CASCADE,
      FOREIGN KEY (session_id) REFERENCES focus_sessions(id) ON DELETE SET NULL
    );
  `);
  db.exec(`CREATE INDEX IF NOT EXISTS idx_quest_logs_user_date ON quest_completion_logs(user_id, completed_at);`);

  // 11. Migrations: Ensure columns exist if tables were created previously
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
    if (!userColumns.includes('gems')) {
      db.exec('ALTER TABLE users ADD COLUMN gems INTEGER DEFAULT 25;');
    }
    // Synchronize name with username if empty
    db.exec(`UPDATE users SET name = username WHERE name IS NULL OR name = '';`);
    // Synchronize password_hash with hashed_password if empty
    db.exec(`UPDATE users SET password_hash = hashed_password WHERE password_hash IS NULL OR password_hash = '';`);

    // user_quests migrations
    const questColumns = db.prepare('PRAGMA table_info(user_quests);').all().map(c => c.name);
    if (!questColumns.includes('source_type')) {
      db.exec("ALTER TABLE user_quests ADD COLUMN source_type VARCHAR(50) DEFAULT 'custom';");
    }
    if (!questColumns.includes('source_reference')) {
      db.exec('ALTER TABLE user_quests ADD COLUMN source_reference TEXT DEFAULT NULL;');
    }
    if (!questColumns.includes('primary_attribute')) {
      db.exec("ALTER TABLE user_quests ADD COLUMN primary_attribute VARCHAR(50) DEFAULT 'intellect';");
      db.exec("UPDATE user_quests SET primary_attribute = attribute WHERE primary_attribute IS NULL OR primary_attribute = '';");
    }
    if (!questColumns.includes('planned_date')) {
      db.exec('ALTER TABLE user_quests ADD COLUMN planned_date VARCHAR(20) DEFAULT NULL;');
      db.exec('UPDATE user_quests SET planned_date = quest_date WHERE planned_date IS NULL;');
    }
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
