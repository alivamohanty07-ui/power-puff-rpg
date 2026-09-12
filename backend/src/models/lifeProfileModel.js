const { db } = require('../config/database');

/**
 * Ensures a life_profiles record exists for user
 */
function getOrCreateProfile(userId) {
  let profile = db.prepare('SELECT * FROM life_profiles WHERE user_id = ?').get(userId);
  if (!profile) {
    db.prepare(`
      INSERT INTO life_profiles (user_id, path_type, completed_step, is_completed)
      VALUES (?, '', 0, 0)
    `).run(userId);
    profile = db.prepare('SELECT * FROM life_profiles WHERE user_id = ?').get(userId);
  }
  return profile;
}

/**
 * Retrieve comprehensive Life Profile aggregated across all 4 chapters
 */
function getLifeProfile(userId) {
  const profile = db.prepare('SELECT * FROM life_profiles WHERE user_id = ?').get(userId);
  const subjects = db.prepare('SELECT id, subject_name FROM user_subjects WHERE user_id = ? ORDER BY id ASC').all(userId);
  const interests = db.prepare('SELECT id, activity_name, category, frequency, approximate_duration FROM user_interests WHERE user_id = ? ORDER BY id ASC').all(userId);
  const schedule = db.prepare('SELECT id, activity_name, category, start_time, end_time, sort_order FROM user_schedules WHERE user_id = ? ORDER BY sort_order ASC, start_time ASC').all(userId);

  let educationData = {};
  if (profile && profile.education_data) {
    try {
      educationData = JSON.parse(profile.education_data);
    } catch {
      educationData = {};
    }
  }

  return {
    has_profile: Boolean(profile),
    completed_step: profile ? profile.completed_step : 0,
    is_completed: profile ? Boolean(profile.is_completed) : false,
    path: {
      path_type: profile ? profile.path_type : '',
      custom_path: profile ? profile.custom_path : null
    },
    education: educationData,
    subjects: subjects || [],
    interests: interests || [],
    schedule: schedule || []
  };
}

/**
 * Save Chapter 01: Path
 */
function savePath(userId, { path_type, custom_path = null }) {
  if (!path_type || !path_type.trim()) {
    throw new Error('path_type is required.');
  }

  const cleanType = path_type.trim().toLowerCase();
  const cleanCustom = custom_path ? custom_path.trim() : null;

  db.prepare(`
    INSERT INTO life_profiles (user_id, path_type, custom_path, completed_step, updated_at)
    VALUES (?, ?, ?, 1, CURRENT_TIMESTAMP)
    ON CONFLICT(user_id) DO UPDATE SET
      path_type = excluded.path_type,
      custom_path = excluded.custom_path,
      completed_step = MAX(life_profiles.completed_step, 1),
      updated_at = CURRENT_TIMESTAMP
  `).run(userId, cleanType, cleanCustom);

  return getLifeProfile(userId);
}

/**
 * Save Chapter 02: Education & Work Details
 */
function saveEducation(userId, { education_data = {}, subjects = null }) {
  getOrCreateProfile(userId);

  const jsonString = typeof education_data === 'string' 
    ? education_data 
    : JSON.stringify(education_data || {});

  db.prepare(`
    UPDATE life_profiles
    SET education_data = ?,
        completed_step = MAX(completed_step, 2),
        updated_at = CURRENT_TIMESTAMP
    WHERE user_id = ?
  `).run(jsonString, userId);

  if (Array.isArray(subjects)) {
    syncSubjects(userId, subjects);
  }

  return getLifeProfile(userId);
}

/**
 * Subjects CRUD
 */
function getSubjects(userId) {
  return db.prepare('SELECT id, subject_name FROM user_subjects WHERE user_id = ? ORDER BY id ASC').all(userId);
}

function createSubject(userId, subjectName) {
  if (!subjectName || !subjectName.trim()) {
    throw new Error('subject_name is required.');
  }
  const cleanName = subjectName.trim();
  const result = db.prepare(`
    INSERT INTO user_subjects (user_id, subject_name)
    VALUES (?, ?)
  `).run(userId, cleanName);

  return db.prepare('SELECT id, subject_name FROM user_subjects WHERE id = ?').get(result.lastInsertRowid);
}

function updateSubject(userId, id, subjectName) {
  if (!subjectName || !subjectName.trim()) {
    throw new Error('subject_name is required.');
  }
  const cleanName = subjectName.trim();
  db.prepare(`
    UPDATE user_subjects
    SET subject_name = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ? AND user_id = ?
  `).run(cleanName, id, userId);

  return db.prepare('SELECT id, subject_name FROM user_subjects WHERE id = ? AND user_id = ?').get(id, userId);
}

function deleteSubject(userId, id) {
  const result = db.prepare('DELETE FROM user_subjects WHERE id = ? AND user_id = ?').run(id, userId);
  return result.changes > 0;
}

function syncSubjects(userId, subjectsList) {
  db.prepare('DELETE FROM user_subjects WHERE user_id = ?').run(userId);
  const insertStmt = db.prepare('INSERT INTO user_subjects (user_id, subject_name) VALUES (?, ?)');
  
  if (Array.isArray(subjectsList)) {
    for (const sub of subjectsList) {
      const name = typeof sub === 'string' ? sub : (sub.subject_name || sub.name);
      if (name && name.trim()) {
        insertStmt.run(userId, name.trim());
      }
    }
  }
  return getSubjects(userId);
}

/**
 * Interests CRUD
 */
function getInterests(userId) {
  return db.prepare(`
    SELECT id, activity_name, category, frequency, approximate_duration 
    FROM user_interests 
    WHERE user_id = ? 
    ORDER BY id ASC
  `).all(userId);
}

function createInterest(userId, {
  activity_name,
  category = 'GENERAL',
  frequency = 'several_times_a_week',
  approximate_duration = '1_hour'
}) {
  if (!activity_name || !activity_name.trim()) {
    throw new Error('activity_name is required.');
  }
  const cleanName = activity_name.trim();
  const cleanCategory = (category || 'GENERAL').trim();

  const result = db.prepare(`
    INSERT INTO user_interests (user_id, activity_name, category, frequency, approximate_duration)
    VALUES (?, ?, ?, ?, ?)
  `).run(userId, cleanName, cleanCategory, frequency || 'several_times_a_week', approximate_duration || '1_hour');

  // Mark step 3 reached
  getOrCreateProfile(userId);
  db.prepare('UPDATE life_profiles SET completed_step = MAX(completed_step, 3) WHERE user_id = ?').run(userId);

  return db.prepare('SELECT id, activity_name, category, frequency, approximate_duration FROM user_interests WHERE id = ?').get(result.lastInsertRowid);
}

function updateInterest(userId, id, updates = {}) {
  const existing = db.prepare('SELECT * FROM user_interests WHERE id = ? AND user_id = ?').get(id, userId);
  if (!existing) return null;

  const activity_name = updates.activity_name ? updates.activity_name.trim() : existing.activity_name;
  const category = updates.category ? updates.category.trim() : existing.category;
  const frequency = updates.frequency || existing.frequency;
  const approximate_duration = updates.approximate_duration || existing.approximate_duration;

  db.prepare(`
    UPDATE user_interests
    SET activity_name = ?, category = ?, frequency = ?, approximate_duration = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ? AND user_id = ?
  `).run(activity_name, category, frequency, approximate_duration, id, userId);

  return db.prepare('SELECT id, activity_name, category, frequency, approximate_duration FROM user_interests WHERE id = ?').get(id);
}

function deleteInterest(userId, id) {
  const result = db.prepare('DELETE FROM user_interests WHERE id = ? AND user_id = ?').run(id, userId);
  return result.changes > 0;
}

function syncInterests(userId, interestsList) {
  db.prepare('DELETE FROM user_interests WHERE user_id = ?').run(userId);
  const insertStmt = db.prepare(`
    INSERT INTO user_interests (user_id, activity_name, category, frequency, approximate_duration)
    VALUES (?, ?, ?, ?, ?)
  `);

  if (Array.isArray(interestsList)) {
    for (const item of interestsList) {
      if (!item) continue;
      const name = item.activity_name || item.name;
      if (name && name.trim()) {
        insertStmt.run(
          userId,
          name.trim(),
          (item.category || 'CUSTOM').trim(),
          item.frequency || 'several_times_a_week',
          item.approximate_duration || '1_hour'
        );
      }
    }
  }

  // Mark step 3 reached
  getOrCreateProfile(userId);
  db.prepare('UPDATE life_profiles SET completed_step = MAX(completed_step, 3) WHERE user_id = ?').run(userId);

  return getInterests(userId);
}

/**
 * Schedule Blocks CRUD
 */
function getSchedule(userId) {
  return db.prepare(`
    SELECT id, activity_name, category, start_time, end_time, sort_order
    FROM user_schedules
    WHERE user_id = ?
    ORDER BY sort_order ASC, start_time ASC
  `).all(userId);
}

function createScheduleBlock(userId, {
  activity_name,
  category = 'other',
  start_time = '08:00',
  end_time = '09:00',
  sort_order = 0
}) {
  if (!activity_name || !activity_name.trim()) {
    throw new Error('activity_name is required.');
  }

  const result = db.prepare(`
    INSERT INTO user_schedules (user_id, activity_name, category, start_time, end_time, sort_order)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(
    userId,
    activity_name.trim(),
    (category || 'other').trim().toLowerCase(),
    (start_time || '08:00').trim(),
    (end_time || '09:00').trim(),
    Number(sort_order) || 0
  );

  // Mark step 4 reached
  getOrCreateProfile(userId);
  db.prepare('UPDATE life_profiles SET completed_step = MAX(completed_step, 4) WHERE user_id = ?').run(userId);

  return db.prepare('SELECT id, activity_name, category, start_time, end_time, sort_order FROM user_schedules WHERE id = ?').get(result.lastInsertRowid);
}

function updateScheduleBlock(userId, id, updates = {}) {
  const existing = db.prepare('SELECT * FROM user_schedules WHERE id = ? AND user_id = ?').get(id, userId);
  if (!existing) return null;

  const activity_name = updates.activity_name ? updates.activity_name.trim() : existing.activity_name;
  const category = updates.category ? updates.category.trim().toLowerCase() : existing.category;
  const start_time = updates.start_time ? updates.start_time.trim() : existing.start_time;
  const end_time = updates.end_time ? updates.end_time.trim() : existing.end_time;
  const sort_order = updates.sort_order !== undefined ? Number(updates.sort_order) : existing.sort_order;

  db.prepare(`
    UPDATE user_schedules
    SET activity_name = ?, category = ?, start_time = ?, end_time = ?, sort_order = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ? AND user_id = ?
  `).run(activity_name, category, start_time, end_time, sort_order, id, userId);

  return db.prepare('SELECT id, activity_name, category, start_time, end_time, sort_order FROM user_schedules WHERE id = ?').get(id);
}

function deleteScheduleBlock(userId, id) {
  const result = db.prepare('DELETE FROM user_schedules WHERE id = ? AND user_id = ?').run(id, userId);
  return result.changes > 0;
}

function syncSchedule(userId, scheduleList) {
  db.prepare('DELETE FROM user_schedules WHERE user_id = ?').run(userId);
  const insertStmt = db.prepare(`
    INSERT INTO user_schedules (user_id, activity_name, category, start_time, end_time, sort_order)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  if (Array.isArray(scheduleList)) {
    scheduleList.forEach((block, idx) => {
      if (!block) return;
      const name = block.activity_name || block.title || block.name;
      if (name && name.trim()) {
        insertStmt.run(
          userId,
          name.trim(),
          (block.category || 'other').trim().toLowerCase(),
          (block.start_time || '08:00').trim(),
          (block.end_time || '09:00').trim(),
          block.sort_order !== undefined ? Number(block.sort_order) : idx
        );
      }
    });
  }

  // Mark step 4 reached
  getOrCreateProfile(userId);
  db.prepare('UPDATE life_profiles SET completed_step = MAX(completed_step, 4) WHERE user_id = ?').run(userId);

  return getSchedule(userId);
}

/**
 * Mark Life Profile completely forged
 */
function completeLifeProfile(userId) {
  getOrCreateProfile(userId);
  db.prepare(`
    UPDATE life_profiles
    SET is_completed = 1, completed_step = 4, updated_at = CURRENT_TIMESTAMP
    WHERE user_id = ?
  `).run(userId);

  db.prepare(`
    UPDATE users
    SET has_completed_life_builder = 1, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).run(userId);

  return getLifeProfile(userId);
}

module.exports = {
  getOrCreateProfile,
  getLifeProfile,
  savePath,
  saveEducation,
  getSubjects,
  createSubject,
  updateSubject,
  deleteSubject,
  syncSubjects,
  getInterests,
  createInterest,
  updateInterest,
  deleteInterest,
  syncInterests,
  getSchedule,
  createScheduleBlock,
  updateScheduleBlock,
  deleteScheduleBlock,
  syncSchedule,
  completeLifeProfile
};
