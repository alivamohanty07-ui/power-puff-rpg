const { db } = require('../config/database');
const userModel = require('./userModel');
const lifeProfileModel = require('./lifeProfileModel');
const focusSessionModel = require('./focusSessionModel');
const { calculateLevel, getLevelProgress } = require('../utils/progression');

function getTodayDateString() {
  const now = new Date();
  return now.toISOString().split('T')[0]; // e.g. '2026-09-13'
}

/**
 * Infer primary and secondary RPG attributes from title & category
 */
function inferAttributes(title = '', category = '') {
  const text = `${title} ${category}`.toLowerCase();

  if (text.includes('math') || text.includes('physic') || text.includes('chemist') || 
      text.includes('study') || text.includes('research') || text.includes('exam') ||
      text.includes('lecture') || text.includes('course') || text.includes('science')) {
    return { attribute: 'intellect', secondary: 'mind' };
  }

  if (text.includes('code') || text.includes('coding') || text.includes('program') || 
      text.includes('software') || text.includes('tech') || text.includes('ai') || 
      text.includes('develop') || text.includes('bug') || text.includes('deploy')) {
    return { attribute: 'intellect', secondary: 'vitality' };
  }

  if (text.includes('gym') || text.includes('workout') || text.includes('lift') || 
      text.includes('strength') || text.includes('athletic') || text.includes('sport') || 
      text.includes('heavy')) {
    return { attribute: 'strength', secondary: 'vitality' };
  }

  if (text.includes('run') || text.includes('walk') || text.includes('cycl') || 
      text.includes('swim') || text.includes('cardio') || text.includes('hike')) {
    return { attribute: 'vitality', secondary: 'strength' };
  }

  if (text.includes('paint') || text.includes('draw') || text.includes('music') || 
      text.includes('art') || text.includes('write') || text.includes('design') || 
      text.includes('read') || text.includes('book') || text.includes('craft')) {
    return { attribute: 'mind', secondary: 'intellect' };
  }

  if (text.includes('meditat') || text.includes('yoga') || text.includes('zen') || 
      text.includes('journal') || text.includes('mindful') || text.includes('cook') || 
      text.includes('clean') || text.includes('garden')) {
    return { attribute: 'vitality', secondary: 'mind' };
  }

  // Category fallback
  const cat = (category || '').toUpperCase();
  if (cat.includes('KNOWLEDGE') || cat.includes('STUDY')) return { attribute: 'intellect', secondary: 'mind' };
  if (cat.includes('TECH') || cat.includes('WORK')) return { attribute: 'intellect', secondary: 'vitality' };
  if (cat.includes('FITNESS') || cat.includes('HEALTH')) return { attribute: 'strength', secondary: 'vitality' };
  if (cat.includes('CREATIVE')) return { attribute: 'mind', secondary: 'intellect' };
  if (cat.includes('WELLNESS')) return { attribute: 'vitality', secondary: 'mind' };

  return { attribute: 'intellect', secondary: null };
}

/**
 * Deterministic calculation of XP, Gold, and attribute points on the server.
 * Pure server authority — client submitted values are strictly ignored.
 */
function calculateRewards(durationMinutes = 30, difficulty = 'normal') {
  const duration = Number(durationMinutes);
  if (isNaN(duration) || duration < 1 || duration > 240) {
    const error = new Error('Duration must be between 1 and 240 minutes.');
    error.statusCode = 400;
    throw error;
  }

  const diff = String(difficulty || 'normal').toLowerCase();
  const validDiffs = ['easy', 'normal', 'challenging'];
  if (!validDiffs.includes(diff)) {
    const error = new Error("Invalid difficulty. Allowed values are 'easy', 'normal', or 'challenging'.");
    error.statusCode = 400;
    throw error;
  }

  // Base rewards
  let diffMultiplier = 1.0;
  let attrBonus = 2;
  let flatXpBonus = 0;

  if (diff === 'easy') {
    diffMultiplier = 0.85;
    attrBonus = 1;
  } else if (diff === 'challenging') {
    diffMultiplier = 1.4;
    attrBonus = 3;
    flatXpBonus = 10;
  }

  // Duration depth multiplier
  let durationMultiplier = 1.0;
  if (duration >= 90) {
    durationMultiplier = 1.15;
  } else if (duration >= 60) {
    durationMultiplier = 1.10;
  } else if (duration >= 45) {
    durationMultiplier = 1.05;
  }

  if (duration >= 60) {
    attrBonus += 1;
  }

  const xp = Math.max(Math.round(duration * 1.25 * diffMultiplier * durationMultiplier) + flatXpBonus, 15);
  const gold = Math.max(Math.round(duration * 0.5 * diffMultiplier), 10);

  return {
    xp_reward: xp,
    gold_reward: gold,
    attribute_gain: attrBonus
  };
}

/**
 * Get all quests for a user on a given date (defaults to today)
 */
function getTodayQuests(userId, targetDate = null) {
  const dateStr = targetDate || getTodayDateString();
  const quests = db.prepare(`
    SELECT * FROM user_quests 
    WHERE user_id = ? AND (quest_date = ? OR planned_date = ?)
    ORDER BY id ASC
  `).all(userId, dateStr, dateStr);

  const totalQuests = quests.length;
  const completedQuests = quests.filter(q => q.status === 'completed' || q.status === 'COMPLETED').length;
  const inProgressQuests = quests.filter(q => q.status === 'in_progress' || q.status === 'ACTIVE').length;

  let totalMinutes = 0;
  let completedMinutes = 0;
  let potentialXp = 0;
  let earnedXp = 0;

  for (const q of quests) {
    totalMinutes += q.duration_minutes || 0;
    potentialXp += q.xp_reward || 0;
    if (q.status === 'completed' || q.status === 'COMPLETED') {
      completedMinutes += q.duration_minutes || 0;
      earnedXp += q.xp_reward || 0;
    }
  }

  const isPerfectDay = totalQuests >= 2 && completedQuests === totalQuests;

  return {
    quest_date: dateStr,
    summary: {
      total_quests: totalQuests,
      completed_quests: completedQuests,
      in_progress_quests: inProgressQuests,
      total_minutes: totalMinutes,
      completed_minutes: completedMinutes,
      potential_xp: potentialXp,
      earned_xp: earnedXp,
      is_perfect_day: isPerfectDay
    },
    quests
  };
}

/**
 * Get single quest by ID with ownership verification
 */
function getQuestById(userId, questId) {
  const quest = db.prepare('SELECT * FROM user_quests WHERE id = ? AND user_id = ?').get(questId, userId);
  if (!quest) {
    const error = new Error('Quest not found.');
    error.statusCode = 404;
    throw error;
  }
  return quest;
}

/**
 * Create a new quest for today
 */
function createQuest(userId, {
  title,
  category = 'CUSTOM',
  attribute = null,
  primary_attribute = null,
  secondary_attribute = null,
  difficulty = 'normal',
  duration_minutes = 30,
  durationMinutes = null,
  source_type = 'custom',
  sourceType = null,
  source_reference = null,
  quest_date = null,
  planned_date = null
}) {
  if (!title || typeof title !== 'string' || !title.trim()) {
    const error = new Error('Quest title is required.');
    error.statusCode = 400;
    throw error;
  }

  const cleanTitle = title.trim();
  if (cleanTitle.length > 200) {
    const error = new Error('Quest title cannot exceed 200 characters.');
    error.statusCode = 400;
    throw error;
  }

  const cleanCat = (category || 'CUSTOM').trim().toUpperCase();
  const cleanDiff = (difficulty || 'normal').trim().toLowerCase();
  const duration = Number(durationMinutes !== null ? durationMinutes : duration_minutes);
  const dateStr = planned_date || quest_date || getTodayDateString();
  const cleanSourceType = (sourceType || source_type || 'custom').trim().toLowerCase();

  // Enforce maximum planned quests limit per day (20)
  const existingCount = db.prepare(`
    SELECT COUNT(*) as count FROM user_quests 
    WHERE user_id = ? AND (quest_date = ? OR planned_date = ?)
  `).get(userId, dateStr, dateStr).count;

  if (existingCount >= 20) {
    const error = new Error('Daily planned quest limit reached (maximum 20 quests per day).');
    error.statusCode = 400;
    throw error;
  }

  // Calculate authoritative server rewards (validates duration & difficulty)
  const rewards = calculateRewards(duration, cleanDiff);

  // Infer attribute if omitted
  const inferred = inferAttributes(cleanTitle, cleanCat);
  const inputAttr = primary_attribute || attribute;
  const finalAttr = (inputAttr && ['intellect', 'strength', 'vitality', 'mind'].includes(inputAttr.toLowerCase()))
    ? inputAttr.toLowerCase()
    : inferred.attribute;

  const finalSecondary = secondary_attribute || inferred.secondary;

  const result = db.prepare(`
    INSERT INTO user_quests (
      user_id, title, category, attribute, primary_attribute, secondary_attribute,
      difficulty, duration_minutes, elapsed_seconds, status,
      xp_reward, gold_reward, attribute_gain, quest_date, planned_date,
      source_type, source_reference
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, 'ready', ?, ?, ?, ?, ?, ?, ?)
  `).run(
    userId,
    cleanTitle,
    cleanCat,
    finalAttr,
    finalAttr,
    finalSecondary,
    cleanDiff,
    duration,
    rewards.xp_reward,
    rewards.gold_reward,
    rewards.attribute_gain,
    dateStr,
    dateStr,
    cleanSourceType,
    source_reference ? String(source_reference) : null
  );

  return db.prepare('SELECT * FROM user_quests WHERE id = ?').get(result.lastInsertRowid);
}

/**
 * Start a quest (creates server-side focus session)
 */
function startQuest(userId, questId) {
  const quest = getQuestById(userId, questId);

  if (quest.status === 'completed' || quest.status === 'COMPLETED') {
    const error = new Error('Cannot start an already completed quest.');
    error.statusCode = 400;
    throw error;
  }

  if (quest.status === 'abandoned' || quest.status === 'ABANDONED') {
    const error = new Error('Cannot start an abandoned quest.');
    error.statusCode = 400;
    throw error;
  }

  // Enforce single active quest rule: user cannot have two quests active simultaneously
  const otherActive = db.prepare(`
    SELECT * FROM user_quests 
    WHERE user_id = ? AND id != ? AND status IN ('in_progress', 'ACTIVE')
  `).get(userId, questId);

  if (otherActive) {
    const error = new Error(`Another quest ("${otherActive.title}") is currently active. Please pause or complete it before starting this quest.`);
    error.statusCode = 400;
    throw error;
  }

  // Create or resume server focus session
  const session = focusSessionModel.createSession(userId, questId);

  db.prepare(`
    UPDATE user_quests 
    SET status = 'in_progress', 
        started_at = COALESCE(started_at, CURRENT_TIMESTAMP),
        updated_at = CURRENT_TIMESTAMP
    WHERE id = ? AND user_id = ?
  `).run(questId, userId);

  const updatedQuest = db.prepare('SELECT * FROM user_quests WHERE id = ?').get(questId);
  return {
    quest: updatedQuest,
    session: {
      id: session.id,
      started_at: session.started_at,
      status: session.status,
      server_time: new Date().toISOString()
    }
  };
}

/**
 * Pause quest (synchronizes server focus session)
 */
function pauseQuest(userId, questId, clientElapsedSeconds = null) {
  const quest = getQuestById(userId, questId);

  if (quest.status === 'completed' || quest.status === 'COMPLETED') {
    const error = new Error('Cannot pause a completed quest.');
    error.statusCode = 400;
    throw error;
  }

  if (quest.status === 'paused' || quest.status === 'PAUSED') {
    return { quest, session: focusSessionModel.getActiveSession(userId, questId) };
  }

  // Pause session and calculate legitimate active elapsed time
  let session = focusSessionModel.getActiveSession(userId, questId);
  if (!session) {
    session = focusSessionModel.createSession(userId, questId);
  }
  const updatedSession = focusSessionModel.pauseSession(userId, questId);
  const elapsed = updatedSession.accumulated_active_seconds;

  db.prepare(`
    UPDATE user_quests 
    SET status = 'paused',
        elapsed_seconds = ?,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = ? AND user_id = ?
  `).run(elapsed, questId, userId);

  const updatedQuest = db.prepare('SELECT * FROM user_quests WHERE id = ?').get(questId);
  return {
    quest: updatedQuest,
    session: updatedSession
  };
}

/**
 * Resume a paused quest
 */
function resumeQuest(userId, questId) {
  const quest = getQuestById(userId, questId);

  if (quest.status === 'completed' || quest.status === 'COMPLETED') {
    const error = new Error('Cannot resume a completed quest.');
    error.statusCode = 400;
    throw error;
  }

  if (quest.status === 'abandoned' || quest.status === 'ABANDONED') {
    const error = new Error('Cannot resume an abandoned quest.');
    error.statusCode = 400;
    throw error;
  }

  // Enforce single active quest rule
  const otherActive = db.prepare(`
    SELECT * FROM user_quests 
    WHERE user_id = ? AND id != ? AND status IN ('in_progress', 'ACTIVE')
  `).get(userId, questId);

  if (otherActive) {
    const error = new Error(`Another quest ("${otherActive.title}") is currently active. Please pause it first.`);
    error.statusCode = 400;
    throw error;
  }

  const session = focusSessionModel.resumeSession(userId, questId);

  db.prepare(`
    UPDATE user_quests 
    SET status = 'in_progress',
        updated_at = CURRENT_TIMESTAMP
    WHERE id = ? AND user_id = ?
  `).run(questId, userId);

  const updatedQuest = db.prepare('SELECT * FROM user_quests WHERE id = ?').get(questId);
  return {
    quest: updatedQuest,
    session
  };
}

/**
 * Abandon an active, paused, or planned quest
 * Zero rewards awarded.
 */
function abandonQuest(userId, questId) {
  const quest = getQuestById(userId, questId);

  if (quest.status === 'completed' || quest.status === 'COMPLETED') {
    const error = new Error('Completed quests cannot be abandoned.');
    error.statusCode = 400;
    throw error;
  }

  if (quest.status === 'abandoned' || quest.status === 'ABANDONED') {
    const error = new Error('Quest is already abandoned.');
    error.statusCode = 400;
    throw error;
  }

  focusSessionModel.abandonSession(userId, questId);

  db.prepare(`
    UPDATE user_quests 
    SET status = 'abandoned',
        completed_at = CURRENT_TIMESTAMP,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = ? AND user_id = ?
  `).run(questId, userId);

  return db.prepare('SELECT * FROM user_quests WHERE id = ?').get(questId);
}

/**
 * Complete a quest — Server is the Source of Truth.
 * 
 * Verifies active duration requirement via server timestamps, awards legitimate rewards,
 * checks Perfect Day bonus, updates user stats, and logs completion history atomically.
 */
function completeQuest(userId, questId, options = {}) {
  const quest = getQuestById(userId, questId);

  // Prevent double rewards
  if (quest.status === 'completed' || quest.status === 'COMPLETED') {
    const error = new Error('Quest is already completed. Duplicate rewards prevented.');
    error.statusCode = 400;
    throw error;
  }

  if (quest.status === 'abandoned' || quest.status === 'ABANDONED') {
    const error = new Error('Cannot complete an abandoned quest.');
    error.statusCode = 400;
    throw error;
  }

  // Server Timer Security: Calculate elapsed active seconds on server
  let session = focusSessionModel.getActiveSession(userId, questId);
  let serverElapsedSeconds = session ? focusSessionModel.calculateElapsedSeconds(session) : quest.elapsed_seconds;

  // Development/Testing accommodation: allows test runner to simulate time advancement
  if (options && options.test_fast_forward_seconds && process.env.NODE_ENV !== 'production') {
    serverElapsedSeconds += Number(options.test_fast_forward_seconds);
  }

  const requiredSeconds = quest.duration_minutes * 60;

  // Check if active duration requirement is satisfied
  const isTestMode = Boolean(options && options.bypass_timer === true && process.env.NODE_ENV !== 'production');
  
  if (!isTestMode && serverElapsedSeconds < requiredSeconds) {
    const error = new Error(`Quest duration requirement not yet satisfied. Elapsed: ${serverElapsedSeconds}s, Required: ${requiredSeconds}s.`);
    error.statusCode = 400;
    error.details = {
      elapsed_seconds: serverElapsedSeconds,
      required_seconds: requiredSeconds,
      remaining_seconds: requiredSeconds - serverElapsedSeconds
    };
    throw error;
  }

  // Execute entire completion in an atomic SQLite transaction
  db.exec('BEGIN IMMEDIATE TRANSACTION');
  try {
    const finalElapsed = Math.max(serverElapsedSeconds, requiredSeconds);

    // 1. Mark quest completed
    db.prepare(`
      UPDATE user_quests
      SET status = 'completed',
          completed_at = CURRENT_TIMESTAMP,
          elapsed_seconds = ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ? AND user_id = ?
    `).run(finalElapsed, questId, userId);

    // 2. Complete focus session
    const completedSession = focusSessionModel.completeSession(userId, questId, finalElapsed);

    // 3. Evaluate Perfect Day bonus
    const todayData = getTodayQuests(userId, quest.quest_date || quest.planned_date);
    let perfectDayBonus = false;

    if (todayData.summary.is_perfect_day) {
      perfectDayBonus = true;
    }

    // 4. Update user stats & non-linear level
    const currentUser = userModel.findById(userId);
    const currentAttrVal = currentUser[quest.attribute] || 10;
    const newAttrVal = currentAttrVal + (quest.attribute_gain || 2);

    const xpToAward = quest.xp_reward + (perfectDayBonus ? 75 : 0);
    const goldToAward = quest.gold_reward;
    const gemsToAward = (perfectDayBonus ? 10 : 0);
    const newStreak = perfectDayBonus ? (currentUser.streak || 1) + 1 : currentUser.streak;

    userModel.updateStats(userId, {
      xp_gain: xpToAward,
      gold_gain: goldToAward,
      gems_gain: gemsToAward,
      [quest.attribute]: newAttrVal,
      streak: newStreak
    });

    // 5. Create historical completion log record
    db.prepare(`
      INSERT INTO quest_completion_logs (
        user_id, quest_id, session_id, completed_at, duration_seconds,
        xp_awarded, gold_awarded, gems_awarded, attribute_awarded,
        attribute_gain, is_perfect_day_trigger
      )
      VALUES (?, ?, ?, CURRENT_TIMESTAMP, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      userId,
      questId,
      completedSession ? completedSession.id : null,
      finalElapsed,
      quest.xp_reward,
      quest.gold_reward,
      gemsToAward,
      quest.attribute,
      quest.attribute_gain || 2,
      perfectDayBonus ? 1 : 0
    );

    db.exec('COMMIT');

    const finalUser = userModel.findById(userId);
    const updatedQuest = db.prepare('SELECT * FROM user_quests WHERE id = ?').get(questId);

    return {
      quest: updatedQuest,
      user: userModel.sanitizeUser(finalUser),
      rewards: {
        xp: quest.xp_reward,
        gold: quest.gold_reward,
        attribute: quest.attribute,
        attribute_gain: quest.attribute_gain,
        perfect_day: perfectDayBonus ? { bonus_xp: 75, bonus_gems: 10, streak: finalUser.streak } : null
      },
      is_perfect_day: perfectDayBonus
    };
  } catch (err) {
    db.exec('ROLLBACK');
    throw err;
  }
}

/**
 * Delete unstarted quest
 */
function deleteQuest(userId, questId) {
  const quest = getQuestById(userId, questId);

  if (quest.status === 'completed' || quest.status === 'COMPLETED') {
    const error = new Error('Completed quests cannot be deleted.');
    error.statusCode = 400;
    throw error;
  }

  // Delete associated focus sessions first
  db.prepare('DELETE FROM focus_sessions WHERE quest_id = ? AND user_id = ?').run(questId, userId);
  const result = db.prepare('DELETE FROM user_quests WHERE id = ? AND user_id = ?').run(questId, userId);
  return result.changes > 0;
}

/**
 * Get or generate today's Daily Challenge from Life Builder information.
 * Rule-based, deterministic, exactly 1 per user per day.
 */
function getOrCreateDailyChallenge(userId, targetDate = null) {
  const dateStr = targetDate || getTodayDateString();

  const existing = db.prepare(`
    SELECT * FROM daily_challenges 
    WHERE user_id = ? AND challenge_date = ?
    ORDER BY id DESC LIMIT 1
  `).get(userId, dateStr);

  if (existing) {
    try {
      existing.tasks = JSON.parse(existing.tasks_json);
    } catch {
      existing.tasks = [];
    }
    return existing;
  }

  // Generate personalized challenge from user's Life Profile
  const lifeProfile = lifeProfileModel.getLifeProfile(userId);
  const subjects = lifeProfile.subjects || [];
  const interests = lifeProfile.interests || [];

  let title = "The Scholar's Crucible";
  let subtitle = "Academy Focus Trial";
  let description = "Demonstrate balance between intellectual discipline and physical rejuvenation.";
  let tier = "normal";
  let tasks = [];
  let primaryAttr = "intellect";

  const primarySubject = subjects.length > 0
    ? (typeof subjects[0] === 'string' ? subjects[0] : subjects[0].subject_name)
    : 'Core Discipline';

  const secondaryInterest = interests.length > 0
    ? interests[0].activity_name
    : 'Mindful Practice';

  if (subjects.length > 0 && interests.length > 0) {
    title = `The Dual Master's Rite: ${primarySubject} & ${secondaryInterest}`;
    subtitle = "Balanced Mind & Action Trial";
    description = `The Grand Academy commands focus in ${primarySubject} complemented by your passion in ${secondaryInterest}.`;
    tasks = [
      { id: 1, title: `${primarySubject} Deep Expedition`, target_minutes: 45, attribute: 'intellect', icon: '📚' },
      { id: 2, title: `${secondaryInterest} Mastery Sprint`, target_minutes: 30, attribute: 'vitality', icon: '⚡' }
    ];
  } else if (subjects.length > 0) {
    const sub2 = subjects.length > 1
      ? (typeof subjects[1] === 'string' ? subjects[1] : subjects[1].subject_name)
      : 'Knowledge Review';
    title = `The Grand Grimoire: ${primarySubject}`;
    subtitle = "Academic Mastery Trial";
    description = `Channel high concentration across your core studies: ${primarySubject} and ${sub2}.`;
    tasks = [
      { id: 1, title: `${primarySubject} Lecture & Review`, target_minutes: 45, attribute: 'intellect', icon: '📖' },
      { id: 2, title: `${sub2} Focus Session`, target_minutes: 30, attribute: 'mind', icon: '🧠' }
    ];
  } else if (interests.length > 0) {
    const int2 = interests.length > 1 ? interests[1].activity_name : 'Creative Focus';
    title = `The Vanguard's Challenge: ${secondaryInterest}`;
    subtitle = "Passions in Action";
    description = `Sharpen your craft and physical resolve in ${secondaryInterest} and ${int2}.`;
    tasks = [
      { id: 1, title: `${secondaryInterest} Ritual`, target_minutes: 40, attribute: 'strength', icon: '⚔️' },
      { id: 2, title: `${int2} Craft Session`, target_minutes: 30, attribute: 'mind', icon: '🎨' }
    ];
    primaryAttr = 'strength';
  } else {
    title = "The Initiate's Awakening";
    subtitle = "First Daily Challenge";
    description = "Complete two focus sprints today to prove your dedication to the Power Puff RPG realm.";
    tasks = [
      { id: 1, title: "Deep Knowledge Sprint", target_minutes: 30, attribute: 'intellect', icon: '📚' },
      { id: 2, title: "Physical or Mindful Recharge", target_minutes: 20, attribute: 'vitality', icon: '🧘' }
    ];
  }

  const result = db.prepare(`
    INSERT INTO daily_challenges (
      user_id, title, subtitle, description, challenge_tier,
      tasks_json, xp_reward, gold_reward, gems_reward, attribute, attribute_gain,
      status, challenge_date
    )
    VALUES (?, ?, ?, ?, ?, ?, 120, 60, 15, ?, 5, 'ready', ?)
  `).run(
    userId,
    title,
    subtitle,
    description,
    tier,
    JSON.stringify(tasks),
    primaryAttr,
    dateStr
  );

  const created = db.prepare('SELECT * FROM daily_challenges WHERE id = ?').get(result.lastInsertRowid);
  created.tasks = tasks;
  return created;
}

/**
 * Accept a Daily Challenge
 */
function acceptDailyChallenge(userId, challengeId) {
  const challenge = db.prepare('SELECT * FROM daily_challenges WHERE id = ? AND user_id = ?').get(challengeId, userId);
  if (!challenge) {
    const error = new Error('Daily challenge not found.');
    error.statusCode = 404;
    throw error;
  }

  if (challenge.status === 'completed') {
    const error = new Error('Challenge is already completed.');
    error.statusCode = 400;
    throw error;
  }

  db.prepare(`
    UPDATE daily_challenges 
    SET status = 'in_progress', updated_at = CURRENT_TIMESTAMP
    WHERE id = ? AND user_id = ?
  `).run(challengeId, userId);

  const updated = db.prepare('SELECT * FROM daily_challenges WHERE id = ?').get(challengeId);
  try {
    updated.tasks = JSON.parse(updated.tasks_json);
  } catch {
    updated.tasks = [];
  }
  return updated;
}

/**
 * Complete Daily Challenge with atomic database transaction
 */
function completeDailyChallenge(userId, challengeId) {
  const challenge = db.prepare('SELECT * FROM daily_challenges WHERE id = ? AND user_id = ?').get(challengeId, userId);
  if (!challenge) {
    const error = new Error('Daily challenge not found.');
    error.statusCode = 404;
    throw error;
  }

  if (challenge.status === 'completed') {
    const error = new Error('Daily challenge is already completed. Duplicate rewards prevented.');
    error.statusCode = 400;
    throw error;
  }

  db.exec('BEGIN IMMEDIATE TRANSACTION');
  try {
    db.prepare(`
      UPDATE daily_challenges
      SET status = 'completed',
          completed_at = CURRENT_TIMESTAMP,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ? AND user_id = ?
    `).run(challengeId, userId);

    const currentUser = userModel.findById(userId);
    const currentAttr = currentUser[challenge.attribute] || 10;
    const newAttr = currentAttr + (challenge.attribute_gain || 5);

    userModel.updateStats(userId, {
      xp_gain: challenge.xp_reward || 120,
      gold_gain: challenge.gold_reward || 60,
      gems_gain: challenge.gems_reward || 15,
      [challenge.attribute]: newAttr
    });

    db.exec('COMMIT');

    const updatedUser = userModel.findById(userId);
    const updatedChallenge = db.prepare('SELECT * FROM daily_challenges WHERE id = ?').get(challengeId);
    try {
      updatedChallenge.tasks = JSON.parse(updatedChallenge.tasks_json);
    } catch {
      updatedChallenge.tasks = [];
    }

    return {
      challenge: updatedChallenge,
      user: userModel.sanitizeUser(updatedUser),
      rewards: {
        xp: challenge.xp_reward,
        gold: challenge.gold_reward,
        gems: challenge.gems_reward,
        attribute: challenge.attribute,
        attribute_gain: challenge.attribute_gain
      }
    };
  } catch (err) {
    db.exec('ROLLBACK');
    throw err;
  }
}

/**
 * Get historical completion logs for streaks and statistics
 */
function getQuestHistory(userId, limit = 50) {
  const safeLimit = Math.min(Math.max(Number(limit) || 20, 1), 100);
  return db.prepare(`
    SELECT l.*, q.title as quest_title, q.category as quest_category, q.difficulty
    FROM quest_completion_logs l
    JOIN user_quests q ON l.quest_id = q.id
    WHERE l.user_id = ?
    ORDER BY l.completed_at DESC
    LIMIT ?
  `).all(userId, safeLimit);
}

module.exports = {
  getTodayDateString,
  inferAttributes,
  calculateRewards,
  getTodayQuests,
  getQuestById,
  createQuest,
  startQuest,
  pauseQuest,
  resumeQuest,
  abandonQuest,
  completeQuest,
  deleteQuest,
  getOrCreateDailyChallenge,
  acceptDailyChallenge,
  completeDailyChallenge,
  getQuestHistory
};
