const { db } = require('../config/database');

/**
 * Focus Session Model — Authoritative Server-Side Timer & Session Tracking
 * 
 * Protects against client-side clock manipulation, browser refresh/disconnections,
 * and tracks real active focus seconds via server timestamps.
 */

/**
 * Robustly parse timestamps (including SQLite UTC without 'Z')
 */
function parseTimestamp(ts) {
  if (!ts) return Date.now();
  if (typeof ts === 'number') return ts;
  const str = String(ts).trim();
  if (str.endsWith('Z')) return new Date(str).getTime();
  return new Date(str.replace(' ', 'T') + 'Z').getTime();
}

/**
 * Create a new active focus session for a quest
 */
function createSession(userId, questId) {
  const nowIso = new Date().toISOString();

  // Cancel any lingering active sessions for this quest
  db.prepare(`
    UPDATE focus_sessions 
    SET status = 'abandoned', completed_at = ?, updated_at = ?
    WHERE user_id = ? AND quest_id = ? AND status IN ('active', 'paused')
  `).run(nowIso, nowIso, userId, questId);

  const result = db.prepare(`
    INSERT INTO focus_sessions (
      quest_id, user_id, started_at, resumed_at, accumulated_active_seconds, status, created_at, updated_at
    )
    VALUES (?, ?, ?, ?, 0, 'active', ?, ?)
  `).run(questId, userId, nowIso, nowIso, nowIso, nowIso);

  return db.prepare('SELECT * FROM focus_sessions WHERE id = ?').get(result.lastInsertRowid);
}

/**
 * Get active or paused session for a quest
 */
function getActiveSession(userId, questId) {
  const session = db.prepare(`
    SELECT * FROM focus_sessions 
    WHERE user_id = ? AND quest_id = ? AND status IN ('active', 'paused')
    ORDER BY id DESC LIMIT 1
  `).get(userId, questId);

  return session || null;
}

/**
 * Calculate legitimate elapsed active seconds on the server
 */
function calculateElapsedSeconds(session) {
  if (!session) return 0;
  
  let accumulated = session.accumulated_active_seconds || 0;
  if (session.status === 'active' && session.resumed_at) {
    const resumedTime = parseTimestamp(session.resumed_at);
    const now = Date.now();
    const diff = Math.max(0, Math.floor((now - resumedTime) / 1000));
    accumulated += diff;
  }

  return accumulated;
}

/**
 * Pause session — safely adds real elapsed time to accumulated_active_seconds
 */
function pauseSession(userId, questId) {
  const session = getActiveSession(userId, questId);
  if (!session) {
    throw new Error('No active focus session found to pause.');
  }

  if (session.status === 'paused') {
    return session;
  }

  const elapsed = calculateElapsedSeconds(session);
  const nowIso = new Date().toISOString();

  db.prepare(`
    UPDATE focus_sessions 
    SET status = 'paused',
        paused_at = ?,
        accumulated_active_seconds = ?,
        updated_at = ?
    WHERE id = ?
  `).run(nowIso, elapsed, nowIso, session.id);

  return db.prepare('SELECT * FROM focus_sessions WHERE id = ?').get(session.id);
}

/**
 * Resume a paused session
 */
function resumeSession(userId, questId) {
  let session = getActiveSession(userId, questId);
  if (!session) {
    return createSession(userId, questId);
  }

  if (session.status === 'active') {
    return session;
  }

  const nowIso = new Date().toISOString();

  db.prepare(`
    UPDATE focus_sessions 
    SET status = 'active',
        resumed_at = ?,
        paused_at = NULL,
        updated_at = ?
    WHERE id = ?
  `).run(nowIso, nowIso, session.id);

  return db.prepare('SELECT * FROM focus_sessions WHERE id = ?').get(session.id);
}

/**
 * Complete session
 */
function completeSession(userId, questId, finalElapsedSeconds = null) {
  const session = getActiveSession(userId, questId);
  if (!session) return null;

  const total = finalElapsedSeconds !== null ? finalElapsedSeconds : calculateElapsedSeconds(session);
  const nowIso = new Date().toISOString();

  db.prepare(`
    UPDATE focus_sessions 
    SET status = 'completed',
        completed_at = ?,
        accumulated_active_seconds = ?,
        updated_at = ?
    WHERE id = ?
  `).run(nowIso, total, nowIso, session.id);

  return db.prepare('SELECT * FROM focus_sessions WHERE id = ?').get(session.id);
}

/**
 * Abandon session
 */
function abandonSession(userId, questId) {
  const session = getActiveSession(userId, questId);
  if (!session) return null;

  const nowIso = new Date().toISOString();

  db.prepare(`
    UPDATE focus_sessions 
    SET status = 'abandoned',
        completed_at = ?,
        updated_at = ?
    WHERE id = ?
  `).run(nowIso, nowIso, session.id);

  return db.prepare('SELECT * FROM focus_sessions WHERE id = ?').get(session.id);
}

module.exports = {
  createSession,
  getActiveSession,
  calculateElapsedSeconds,
  pauseSession,
  resumeSession,
  completeSession,
  abandonSession,
  parseTimestamp
};
