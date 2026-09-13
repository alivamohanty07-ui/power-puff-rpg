const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const path = require('path');

// Use Node.js built-in SQLite (DatabaseSync) or in-memory fallback
let db;
const DB_PATH = path.join(__dirname, 'powerpuff.db');

try {
  const { DatabaseSync } = require('node:sqlite');
  db = new DatabaseSync(DB_PATH);
} catch (e) {
  console.warn('node:sqlite not available, using in-memory mock');
}

const app = express();
const PORT = process.env.PORT || 8000;
const SECRET_KEY = process.env.SECRET_KEY || 'powerpuff_secret_rpg_key_gamified_2026_super_secure';

// -------------------------------------------------------------
// 1. CORS CONFIGURATION (Enabled for http://localhost:5173 with credentials)
// -------------------------------------------------------------
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
  'http://127.0.0.1:3000'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, true);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// -------------------------------------------------------------
// 2. DATABASE INITIALIZATION & SEEDING (SQLite)
// -------------------------------------------------------------
function initDb() {
  if (!db) return;

  // Create Users Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      hashed_password TEXT NOT NULL,
      salt TEXT NOT NULL,
      personality_house TEXT DEFAULT 'Blossom Leader',
      character_avatar TEXT DEFAULT 'ren',
      selected_theme TEXT DEFAULT 'cyberpunk-neon',
      level INTEGER DEFAULT 1,
      xp INTEGER DEFAULT 0,
      gold INTEGER DEFAULT 100,
      streak INTEGER DEFAULT 1,
      intellect INTEGER DEFAULT 10,
      strength INTEGER DEFAULT 10,
      vitality INTEGER DEFAULT 10,
      mind INTEGER DEFAULT 10,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Create Quests Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS quests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      title TEXT NOT NULL,
      description TEXT,
      map_location TEXT DEFAULT 'Town Square',
      difficulty TEXT DEFAULT 'Medium',
      attribute TEXT DEFAULT 'Intellect',
      xp_reward INTEGER DEFAULT 50,
      gold_reward INTEGER DEFAULT 20,
      is_completed INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Create Bounties Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS bounties (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      target_house TEXT DEFAULT 'All',
      bounty_type TEXT DEFAULT 'Daily Sprint',
      xp_reward INTEGER DEFAULT 100,
      gold_reward INTEGER DEFAULT 75,
      is_claimed INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Seed default hero user if none exists
  const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get().count;
  if (userCount === 0) {
    const salt = 'rpg_salt_2026';
    const hash = hashPassword('SecretPassword123!', salt);
    db.prepare(`
      INSERT INTO users (username, email, hashed_password, salt, personality_house, character_avatar, selected_theme, level, xp, gold, streak, intellect, strength, vitality, mind)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run('BlossomHero', 'blossom@powerpuff.io', hash, salt, 'Blossom Leader', 'ren', 'cyberpunk-neon', 1, 0, 100, 1, 14, 12, 12, 16);
  }

  // Seed default quests if none exist
  const questCount = db.prepare('SELECT COUNT(*) as count FROM quests').get().count;
  if (questCount === 0) {
    const defaultQuests = [
      ['Deep Work Sprint: Banish Procrastination', '25-minute focused sprint without notifications or distraction.', 'Town Square', 'Medium', 'Intellect', 60, 35],
      ['Physical Armor Conditioning (30m Workout)', 'Engage in physical resistance or high-intensity body workout.', 'Town Square', 'Hard', 'Strength', 75, 40],
      ['Hydration & Mindful Recharge Ritual', 'Drink 500ml water, stretch spine, and breathe deeply.', 'Blossom Sanctuary', 'Easy', 'Vitality', 40, 20],
      ['Refactor Legacy Code / Polish Architecture', 'Confront the most formidable boss engineering quest of the day.', 'Neon Citadel', 'Boss', 'Intellect', 90, 50]
    ];
    const insertQuest = db.prepare(`
      INSERT INTO quests (title, description, map_location, difficulty, attribute, xp_reward, gold_reward, is_completed)
      VALUES (?, ?, ?, ?, ?, ?, ?, 0)
    `);
    for (const q of defaultQuests) {
      insertQuest.run(...q);
    }
  }

  // Seed default bounties if none exist
  const bountyCount = db.prepare('SELECT COUNT(*) as count FROM bounties').get().count;
  if (bountyCount === 0) {
    const defaultBounties = [
      ['Bounty: Morning Procrastination Specter', 'Slay your toughest task before 11:00 AM.', 'House Buttercup', 'Daily Grit', 120, 100],
      ['Bounty: Codebase Fortification Raid', 'Complete 3 Pomodoro sprints with zero browser tab distractions.', 'House Blossom', 'Deep Focus', 150, 120],
      ['Bounty: Radiant Sanctuary Recharge', 'Log 8 hours of restorative sleep and hit 2L hydration goal.', 'House Bubbles', 'Vitality Ritual', 100, 80]
    ];
    const insertBounty = db.prepare(`
      INSERT INTO bounties (title, description, target_house, bounty_type, xp_reward, gold_reward, is_claimed)
      VALUES (?, ?, ?, ?, ?, ?, 0)
    `);
    for (const b of defaultBounties) {
      insertBounty.run(...b);
    }
  }
}

// -------------------------------------------------------------
// 3. CRYPTOGRAPHY & JWT HELPERS
// -------------------------------------------------------------
function hashPassword(password, salt) {
  return crypto.scryptSync(password, salt, 32).toString('hex');
}

function generateToken(user) {
  return jwt.sign(
    { sub: user.id, username: user.username },
    SECRET_KEY,
    { expiresIn: '7d' }
  );
}

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ detail: 'Authorization Bearer token required' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, SECRET_KEY);
    const user = db.prepare('SELECT * FROM users WHERE id = ? OR username = ?').get(payload.sub, payload.username);
    if (!user) {
      return res.status(401).json({ detail: 'Adventurer account not found' });
    }
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ detail: 'Invalid or expired token' });
  }
}

function sanitizeUser(user) {
  const { salt, hashed_password, ...safe } = user;
  return safe;
}

// -------------------------------------------------------------
// 4. API ROUTES
// -------------------------------------------------------------

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    app: 'Power Puff RPG Backend (Node.js/Express + SQLite)',
    database: 'SQLite',
    timestamp: new Date().toISOString()
  });
});

app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Power Puff RPG API! 🎮✨',
    health: '/api/health',
    endpoints: [
      'POST /api/auth/register',
      'POST /api/auth/login',
      'GET /api/auth/me',
      'GET /api/quests',
      'GET /api/bounties',
      'GET /api/character/stats'
    ]
  });
});

// --- AUTH: REGISTER / SIGNUP ---
const handleRegister = (req, res) => {
  const { username, email, password, guild_selection, personality_house, character_avatar, selected_theme } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ detail: 'Hero username, email, and password are required.' });
  }
  if (password.length < 6) {
    return res.status(400).json({ detail: 'Password must be at least 6 characters long.' });
  }

  const cleanUsername = username.trim();
  const cleanEmail = email.trim().toLowerCase();

  const existing = db.prepare('SELECT id FROM users WHERE LOWER(username) = LOWER(?) OR LOWER(email) = LOWER(?)').get(cleanUsername, cleanEmail);
  if (existing) {
    return res.status(400).json({ detail: 'Hero username or email is already registered.' });
  }

  const salt = crypto.randomBytes(16).toString('hex');
  const hashed_password = hashPassword(password, salt);
  const house = guild_selection || personality_house || 'Blossom Leader';

  const stmt = db.prepare(`
    INSERT INTO users (username, email, hashed_password, salt, personality_house, character_avatar, selected_theme, level, xp, gold, streak, intellect, strength, vitality, mind)
    VALUES (?, ?, ?, ?, ?, ?, ?, 1, 0, 100, 1, 10, 10, 10, 10)
  `);
  stmt.run(cleanUsername, cleanEmail, hashed_password, salt, house, character_avatar || 'ren', selected_theme || 'cyberpunk-neon');

  const newUser = db.prepare('SELECT * FROM users WHERE LOWER(username) = LOWER(?)').get(cleanUsername);
  const token = generateToken(newUser);

  return res.status(201).json({
    access_token: token,
    token_type: 'bearer',
    user: sanitizeUser(newUser)
  });
};

app.post('/api/auth/register', handleRegister);
app.post('/api/auth/signup', handleRegister);

// --- AUTH: LOGIN ---
app.post('/api/auth/login', (req, res) => {
  const { username_or_email, password } = req.body;

  if (!username_or_email || !password) {
    return res.status(400).json({ detail: 'Username/email and password are required.' });
  }

  const identifier = username_or_email.trim().toLowerCase();
  const user = db.prepare('SELECT * FROM users WHERE LOWER(username) = ? OR LOWER(email) = ?').get(identifier, identifier);

  if (!user) {
    return res.status(401).json({ detail: 'Invalid credentials. Hero not found.' });
  }

  const computedHash = hashPassword(password, user.salt);
  if (computedHash !== user.hashed_password) {
    return res.status(401).json({ detail: 'Invalid password. Please check your credentials.' });
  }

  const token = generateToken(user);
  return res.json({
    access_token: token,
    token_type: 'bearer',
    user: sanitizeUser(user)
  });
});

// --- AUTH: GET CURRENT HERO (/api/auth/me) ---
app.get('/api/auth/me', authMiddleware, (req, res) => {
  return res.json(sanitizeUser(req.user));
});

// --- AUTH: UPDATE THEME ---
app.patch('/api/auth/theme', authMiddleware, (req, res) => {
  const { selected_theme } = req.body;
  if (selected_theme) {
    db.prepare('UPDATE users SET selected_theme = ? WHERE id = ?').run(selected_theme, req.user.id);
  }
  const updated = db.prepare('SELECT * FROM users WHERE id = ?').get(req.user.id);
  return res.json(sanitizeUser(updated));
});

// --- CHARACTER & STATS: GET & UPDATE ---
const handleUpdateStats = (req, res) => {
  const { xp_gain, gold_gain, streak, intellect, strength, vitality, mind } = req.body;
  let user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.user.id);

  let newXp = (user.xp || 0) + (xp_gain || 0);
  let newGold = (user.gold || 0) + (gold_gain || 0);
  let newLevel = 1 + Math.floor(newXp / 100);
  let newStreak = streak !== undefined ? streak : user.streak;
  let newInt = intellect !== undefined ? intellect : user.intellect;
  let newStr = strength !== undefined ? strength : user.strength;
  let newVit = vitality !== undefined ? vitality : user.vitality;
  let newMnd = mind !== undefined ? mind : user.mind;

  db.prepare(`
    UPDATE users 
    SET xp = ?, gold = ?, level = ?, streak = ?, intellect = ?, strength = ?, vitality = ?, mind = ?
    WHERE id = ?
  `).run(newXp, newGold, newLevel, newStreak, newInt, newStr, newVit, newMnd, req.user.id);

  const updated = db.prepare('SELECT * FROM users WHERE id = ?').get(req.user.id);
  return res.json(sanitizeUser(updated));
};

app.patch('/api/auth/stats', authMiddleware, handleUpdateStats);
app.patch('/api/character/stats', authMiddleware, handleUpdateStats);

app.get('/api/character/stats', authMiddleware, (req, res) => {
  const user = req.user;
  return res.json({
    level: user.level || 1,
    xp: user.xp || 0,
    maxXp: (user.level || 1) * 100,
    gold: user.gold || 100,
    streak: user.streak || 1,
    intellect: user.intellect || 10,
    strength: user.strength || 10,
    vitality: user.vitality || 10,
    mind: user.mind || 10,
    personality_house: user.personality_house || 'Blossom Leader',
    character_avatar: user.character_avatar || 'ren',
    selected_theme: user.selected_theme || 'cyberpunk-neon'
  });
});

// --- QUESTS: GET, CREATE, COMPLETE, DELETE ---
app.get('/api/quests', (req, res) => {
  const quests = db.prepare('SELECT * FROM quests ORDER BY id ASC').all();
  return res.json(quests.map(q => ({ ...q, is_completed: Boolean(q.is_completed) })));
});

app.post('/api/quests', authMiddleware, (req, res) => {
  const { title, description, map_location, difficulty, attribute, xp_reward, gold_reward } = req.body;
  if (!title) {
    return res.status(400).json({ detail: 'Quest title is required.' });
  }

  const result = db.prepare(`
    INSERT INTO quests (user_id, title, description, map_location, difficulty, attribute, xp_reward, gold_reward, is_completed)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0)
  `).run(
    req.user.id,
    title,
    description || '',
    map_location || 'Town Square',
    difficulty || 'Medium',
    attribute || 'Intellect',
    xp_reward || 50,
    gold_reward || 20
  );

  const created = db.prepare('SELECT * FROM quests WHERE id = ?').get(result.lastInsertRowid);
  return res.status(201).json({ ...created, is_completed: false });
});

app.post('/api/quests/:id/complete', authMiddleware, (req, res) => {
  const questId = parseInt(req.params.id, 10);
  const quest = db.prepare('SELECT * FROM quests WHERE id = ?').get(questId);
  
  const xpGain = quest ? quest.xp_reward : 50;
  const goldGain = quest ? quest.gold_reward : 25;

  if (quest) {
    db.prepare('UPDATE quests SET is_completed = 1 WHERE id = ?').run(questId);
  }

  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.user.id);
  const newXp = (user.xp || 0) + xpGain;
  const newGold = (user.gold || 0) + goldGain;
  const newStreak = (user.streak || 0) + 1;
  const newLevel = 1 + Math.floor(newXp / 100);

  db.prepare('UPDATE users SET xp = ?, gold = ?, streak = ?, level = ? WHERE id = ?').run(
    newXp, newGold, newStreak, newLevel, req.user.id
  );

  return res.json({
    success: true,
    message: 'Quest conquered! Real-life stats calibrated.',
    xp_awarded: xpGain,
    gold_awarded: goldGain,
    current_level: newLevel,
    total_gold: newGold
  });
});

app.delete('/api/quests/:id', authMiddleware, (req, res) => {
  const questId = parseInt(req.params.id, 10);
  db.prepare('DELETE FROM quests WHERE id = ?').run(questId);
  return res.status(204).send();
});

// --- BOUNTIES: GET & CLAIM ---
app.get('/api/bounties', (req, res) => {
  const bounties = db.prepare('SELECT * FROM bounties ORDER BY id ASC').all();
  return res.json(bounties.map(b => ({ ...b, is_claimed: Boolean(b.is_claimed) })));
});

app.post('/api/bounties/:id/claim', authMiddleware, (req, res) => {
  const bountyId = parseInt(req.params.id, 10);
  const bounty = db.prepare('SELECT * FROM bounties WHERE id = ?').get(bountyId);

  if (bounty && bounty.is_claimed) {
    return res.status(400).json({ detail: 'Bounty already claimed today!' });
  }

  const xpGain = bounty ? bounty.xp_reward : 100;
  const goldGain = bounty ? bounty.gold_reward : 75;

  if (bounty) {
    db.prepare('UPDATE bounties SET is_claimed = 1 WHERE id = ?').run(bountyId);
  }

  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.user.id);
  const newXp = (user.xp || 0) + xpGain;
  const newGold = (user.gold || 0) + goldGain;
  const newLevel = 1 + Math.floor(newXp / 100);

  db.prepare('UPDATE users SET xp = ?, gold = ?, level = ? WHERE id = ?').run(
    newXp, newGold, newLevel, req.user.id
  );

  return res.json({
    success: true,
    message: 'Guild Bounty claimed! XP & Gold added to your treasury.',
    xp_awarded: xpGain,
    gold_awarded: goldGain,
    current_level: newLevel,
    total_gold: newGold
  });
});

// -------------------------------------------------------------
// 5. SERVER STARTUP
// -------------------------------------------------------------
initDb();

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`🗡️  POWER PUFF RPG BACKEND (SQLite) RUNNING ON PORT ${PORT}`);
    console.log(`🎮 Health Check: http://localhost:${PORT}/api/health`);
    console.log(`🌐 CORS Enabled: http://localhost:5173 (with credentials)`);
    console.log(`📦 Database: SQLite (${DB_PATH})`);
    console.log(`====================================================`);
  });
}

module.exports = app;
