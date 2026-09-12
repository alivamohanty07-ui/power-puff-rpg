const bcrypt = require('bcryptjs');
const { db } = require('../config/database');

const BCRYPT_SALT_ROUNDS = 10;

/**
 * Hash plain-text password using bcrypt
 */
function hashPassword(password) {
  return bcrypt.hashSync(password, BCRYPT_SALT_ROUNDS);
}

/**
 * Verify plain-text password against bcrypt hash
 */
function verifyPassword(plainPassword, hashedPassword) {
  try {
    return bcrypt.compareSync(plainPassword, hashedPassword);
  } catch (err) {
    return false;
  }
}

/**
 * Sanitize user object to NEVER expose sensitive fields (password, password_hash, hashed_password)
 */
function sanitizeUser(user) {
  if (!user) return null;
  const { password_hash, hashed_password, ...safe } = user;
  return {
    ...safe,
    name: user.name || user.username,
    username: user.username || user.name,
    personality_house: user.personality_house || '',
    house: user.personality_house || '',
    character_avatar: user.character_avatar || 'emily',
    has_completed_induction: Boolean(user.has_completed_induction),
    has_completed_life_builder: Boolean(user.has_completed_life_builder),
    avatar_config: user.avatar_config || null,
    level: user.level || 1,
    xp: user.xp || 0,
    gold: user.gold || 100,
    streak: user.streak || 1,
    intellect: user.intellect || 10,
    strength: user.strength || 10,
    vitality: user.vitality || 10,
    mind: user.mind || 10
  };
}

/**
 * Find user by ID
 */
function findById(id) {
  const row = db.prepare('SELECT * FROM users WHERE id = ?').get(id);
  return row || null;
}

/**
 * Find user by email (case-insensitive)
 */
function findByEmail(email) {
  if (!email) return null;
  const row = db.prepare('SELECT * FROM users WHERE LOWER(email) = LOWER(?)').get(email.trim());
  return row || null;
}

/**
 * Find user by username (case-insensitive)
 */
function findByUsername(username) {
  if (!username) return null;
  const row = db.prepare('SELECT * FROM users WHERE LOWER(username) = LOWER(?)').get(username.trim());
  return row || null;
}

/**
 * Find user by either email or username
 */
function findByIdentifier(identifier) {
  if (!identifier) return null;
  const clean = identifier.trim().toLowerCase();
  const row = db.prepare('SELECT * FROM users WHERE LOWER(email) = ? OR LOWER(username) = ?').get(clean, clean);
  return row || null;
}

/**
 * Create a new user account with secure password hashing and default RPG attributes
 */
function createUser({
  name,
  username,
  email,
  password,
  selected_theme = 'dark-dungeon',
  personality_house = '',
  character_avatar = 'emily'
}) {
  const cleanName = (name || username || 'Adventurer').trim();
  const cleanUsername = (username || name || 'Adventurer').trim();
  const cleanEmail = email.trim().toLowerCase();
  const hash = hashPassword(password);

  const stmt = db.prepare(`
    INSERT INTO users (
      name,
      username,
      email,
      password_hash,
      hashed_password,
      selected_theme,
      personality_house,
      character_avatar,
      level,
      xp,
      gold,
      streak,
      intellect,
      strength,
      vitality,
      mind,
      has_completed_induction,
      avatar_config,
      created_at,
      updated_at
    ) VALUES (
      ?, ?, ?, ?, ?, ?, ?, ?, 1, 0, 100, 1, 10, 10, 10, 10, 0, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
    )
  `);

  const result = stmt.run(
    cleanName,
    cleanUsername,
    cleanEmail,
    hash,
    hash,
    selected_theme || 'dark-dungeon',
    personality_house || '',
    character_avatar || 'emily'
  );

  return findById(result.lastInsertRowid);
}

const CANONICAL_HOUSES = {
  blossom: 'House Blossom',
  bubbles: 'House Bubbles',
  buttercup: 'House Buttercup'
};

/**
 * Validate and normalize house identifier or name
 * Returns { houseId, houseName } or null if invalid
 */
function normalizeHouse(input) {
  if (!input || typeof input !== 'string') return null;
  const clean = input.trim().toLowerCase().replace(/^house\s+/, '');
  if (CANONICAL_HOUSES[clean]) {
    return {
      houseId: clean,
      houseName: CANONICAL_HOUSES[clean]
    };
  }
  return null;
}

/**
 * Persist House Selection into user_houses relational table and sync user profile
 */
function saveUserHouse(userId, houseInput) {
  const normalized = normalizeHouse(houseInput);
  if (!normalized) {
    const error = new Error('Invalid house. Valid houses are blossom, bubbles, or buttercup.');
    error.statusCode = 400;
    throw error;
  }

  const { houseId, houseName } = normalized;

  // Insert or update in user_houses relational table
  db.prepare(`
    INSERT INTO user_houses (user_id, house_id, house_name, selected_at)
    VALUES (?, ?, ?, CURRENT_TIMESTAMP)
    ON CONFLICT(user_id) DO UPDATE SET
      house_id = excluded.house_id,
      house_name = excluded.house_name,
      selected_at = CURRENT_TIMESTAMP
  `).run(userId, houseId, houseName);

  // Synchronize users profile
  db.prepare(`
    UPDATE users 
    SET personality_house = ?, has_completed_induction = 1, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).run(houseName, userId);

  const selection = db.prepare('SELECT * FROM user_houses WHERE user_id = ?').get(userId);
  const user = findById(userId);

  return {
    houseId: selection.house_id,
    houseName: selection.house_name,
    selectedAt: selection.selected_at,
    hasCompletedInduction: true,
    user: sanitizeUser(user)
  };
}

/**
 * Retrieve saved house for a user from user_houses table (or users fallback)
 */
function getUserHouse(userId) {
  const selection = db.prepare('SELECT * FROM user_houses WHERE user_id = ?').get(userId);
  if (selection) {
    return {
      completed: true,
      houseId: selection.house_id,
      houseName: selection.house_name,
      selectedAt: selection.selected_at
    };
  }

  // Check users table fallback for backward compatibility
  const user = findById(userId);
  if (user && user.has_completed_induction && user.personality_house) {
    const normalized = normalizeHouse(user.personality_house);
    if (normalized) {
      db.prepare(`
        INSERT OR IGNORE INTO user_houses (user_id, house_id, house_name, selected_at)
        VALUES (?, ?, ?, ?)
      `).run(userId, normalized.houseId, normalized.houseName, user.updated_at || user.created_at);

      return {
        completed: true,
        houseId: normalized.houseId,
        houseName: normalized.houseName,
        selectedAt: user.updated_at || user.created_at
      };
    }
  }

  return {
    completed: false,
    houseId: null,
    houseName: null,
    selectedAt: null
  };
}

/**
 * Persist House Induction result (legacy alias)
 */
function updateHouse(userId, houseName) {
  const result = saveUserHouse(userId, houseName);
  return result.user;
}

/**
 * Persist Avatar Customization
 */
function updateAvatar(userId, avatarData, characterName) {
  const avatarJson = typeof avatarData === 'string' ? avatarData : JSON.stringify(avatarData);

  if (characterName && characterName.trim()) {
    const cleanName = characterName.trim();
    db.prepare(`
      UPDATE users 
      SET avatar_config = ?, name = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(avatarJson, cleanName, userId);
  } else {
    db.prepare(`
      UPDATE users 
      SET avatar_config = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(avatarJson, userId);
  }

  return findById(userId);
}

/**
 * Persist Visual Theme
 */
function updateTheme(userId, selectedTheme) {
  db.prepare(`
    UPDATE users 
    SET selected_theme = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).run(selectedTheme, userId);

  return findById(userId);
}

/**
 * Update RPG stats (XP, Gold, Level, Streak, Attributes)
 */
function updateStats(userId, updates = {}) {
  const user = findById(userId);
  if (!user) return null;

  let newXp = (user.xp || 0) + (updates.xp_gain || 0);
  let newGold = (user.gold || 0) + (updates.gold_gain || 0);
  let newLevel = updates.level !== undefined ? updates.level : (1 + Math.floor(newXp / 100));
  let newStreak = updates.streak !== undefined ? updates.streak : user.streak;
  let newInt = updates.intellect !== undefined ? updates.intellect : user.intellect;
  let newStr = updates.strength !== undefined ? updates.strength : user.strength;
  let newVit = updates.vitality !== undefined ? updates.vitality : user.vitality;
  let newMnd = updates.mind !== undefined ? updates.mind : user.mind;

  db.prepare(`
    UPDATE users 
    SET xp = ?, gold = ?, level = ?, streak = ?, intellect = ?, strength = ?, vitality = ?, mind = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).run(newXp, newGold, newLevel, newStreak, newInt, newStr, newVit, newMnd, userId);

  return findById(userId);
}

module.exports = {
  CANONICAL_HOUSES,
  normalizeHouse,
  hashPassword,
  verifyPassword,
  sanitizeUser,
  findById,
  findByEmail,
  findByUsername,
  findByIdentifier,
  createUser,
  saveUserHouse,
  getUserHouse,
  updateHouse,
  updateAvatar,
  updateTheme,
  updateStats
};
