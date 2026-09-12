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
    character_avatar: user.character_avatar || 'emily',
    has_completed_induction: Boolean(user.has_completed_induction),
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

/**
 * Persist House Induction result
 */
function updateHouse(userId, houseName) {
  db.prepare(`
    UPDATE users 
    SET personality_house = ?, has_completed_induction = 1, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).run(houseName, userId);

  return findById(userId);
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
      SET avatar_config = ?, name = ?, username = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(avatarJson, cleanName, cleanName, userId);
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
  hashPassword,
  verifyPassword,
  sanitizeUser,
  findById,
  findByEmail,
  findByUsername,
  findByIdentifier,
  createUser,
  updateHouse,
  updateAvatar,
  updateTheme,
  updateStats
};
