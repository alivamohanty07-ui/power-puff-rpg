const questModel = require('../models/questModel');

/**
 * GET /api/quests/today
 */
exports.getToday = (req, res) => {
  try {
    const data = questModel.getTodayQuests(req.user.id);
    return res.json(data);
  } catch (err) {
    console.error('Error fetching today quests:', err);
    return res.status(err.statusCode || 500).json({ detail: err.message || 'Failed to retrieve today quests.' });
  }
};

/**
 * GET /api/quests/history
 */
exports.getHistory = (req, res) => {
  try {
    const limit = Number(req.query.limit) || 20;
    const history = questModel.getQuestHistory(req.user.id, limit);
    return res.json(history);
  } catch (err) {
    return res.status(err.statusCode || 500).json({ detail: err.message || 'Failed to retrieve quest history.' });
  }
};

/**
 * GET /api/quests/:id
 */
exports.getQuest = (req, res) => {
  try {
    const questId = Number(req.params.id);
    const quest = questModel.getQuestById(req.user.id, questId);
    return res.json(quest);
  } catch (err) {
    return res.status(err.statusCode || 404).json({ detail: err.message || 'Quest not found.' });
  }
};

/**
 * POST /api/quests
 */
exports.createQuest = (req, res) => {
  try {
    const { 
      title, 
      category, 
      attribute, 
      primary_attribute, 
      secondary_attribute, 
      difficulty, 
      duration_minutes,
      durationMinutes,
      source_type,
      sourceType,
      source_reference,
      planned_date
    } = req.body;

    const quest = questModel.createQuest(req.user.id, {
      title,
      category,
      attribute,
      primary_attribute,
      secondary_attribute,
      difficulty,
      duration_minutes,
      durationMinutes,
      source_type,
      sourceType,
      source_reference,
      planned_date
    });

    return res.status(201).json(quest);
  } catch (err) {
    return res.status(err.statusCode || 400).json({ detail: err.message || 'Failed to create quest.' });
  }
};

/**
 * POST or PATCH /api/quests/:id/start
 */
exports.startQuest = (req, res) => {
  try {
    const questId = Number(req.params.id);
    const result = questModel.startQuest(req.user.id, questId);
    // Returns quest and session details
    return res.json(result.quest ? { ...result.quest, session: result.session } : result);
  } catch (err) {
    return res.status(err.statusCode || 400).json({ detail: err.message || 'Failed to start quest.' });
  }
};

/**
 * POST or PATCH /api/quests/:id/pause
 */
exports.pauseQuest = (req, res) => {
  try {
    const questId = Number(req.params.id);
    const clientElapsed = req.body.elapsed_seconds;
    const result = questModel.pauseQuest(req.user.id, questId, clientElapsed);
    return res.json(result.quest ? { ...result.quest, session: result.session } : result);
  } catch (err) {
    return res.status(err.statusCode || 400).json({ detail: err.message || 'Failed to pause quest.' });
  }
};

/**
 * POST /api/quests/:id/resume
 */
exports.resumeQuest = (req, res) => {
  try {
    const questId = Number(req.params.id);
    const result = questModel.resumeQuest(req.user.id, questId);
    return res.json(result.quest ? { ...result.quest, session: result.session } : result);
  } catch (err) {
    return res.status(err.statusCode || 400).json({ detail: err.message || 'Failed to resume quest.' });
  }
};

/**
 * POST /api/quests/:id/abandon
 */
exports.abandonQuest = (req, res) => {
  try {
    const questId = Number(req.params.id);
    const updated = questModel.abandonQuest(req.user.id, questId);
    return res.json({
      success: true,
      message: 'Quest abandoned. No rewards awarded.',
      quest: updated
    });
  } catch (err) {
    return res.status(err.statusCode || 400).json({ detail: err.message || 'Failed to abandon quest.' });
  }
};

/**
 * POST /api/quests/:id/complete
 */
exports.completeQuest = (req, res) => {
  try {
    const questId = Number(req.params.id);

    // Development/Testing accommodations
    const options = {};
    if (req.headers['x-test-fast-forward-seconds']) {
      options.test_fast_forward_seconds = Number(req.headers['x-test-fast-forward-seconds']);
    } else if (req.body && req.body.test_fast_forward_seconds) {
      options.test_fast_forward_seconds = Number(req.body.test_fast_forward_seconds);
    }
    if (req.headers['x-test-bypass-timer'] === 'true' || (req.body && req.body.test_bypass_timer === true)) {
      options.bypass_timer = true;
    }

    const result = questModel.completeQuest(req.user.id, questId, options);
    return res.json({
      success: true,
      message: 'Quest completed! Rewards granted.',
      ...result
    });
  } catch (err) {
    return res.status(err.statusCode || 400).json({ 
      detail: err.message || 'Failed to complete quest.',
      details: err.details || null
    });
  }
};

/**
 * DELETE /api/quests/:id
 */
exports.deleteQuest = (req, res) => {
  try {
    const questId = Number(req.params.id);
    const deleted = questModel.deleteQuest(req.user.id, questId);
    if (!deleted) {
      return res.status(404).json({ detail: 'Quest not found.' });
    }
    return res.json({ success: true, message: 'Quest deleted successfully.' });
  } catch (err) {
    return res.status(err.statusCode || 400).json({ detail: err.message || 'Failed to delete quest.' });
  }
};

/**
 * GET /api/daily-challenge/today & GET /api/quests/daily-challenge
 */
exports.getDailyChallenge = (req, res) => {
  try {
    const challenge = questModel.getOrCreateDailyChallenge(req.user.id);
    return res.json(challenge);
  } catch (err) {
    console.error('Error getting daily challenge:', err);
    return res.status(err.statusCode || 500).json({ detail: 'Failed to retrieve daily challenge.' });
  }
};

/**
 * POST /api/daily-challenge/:id/accept
 */
exports.acceptDailyChallenge = (req, res) => {
  try {
    const challengeId = Number(req.params.id);
    const updated = questModel.acceptDailyChallenge(req.user.id, challengeId);
    return res.json({
      success: true,
      message: 'Daily challenge accepted! Good luck, adventurer.',
      challenge: updated
    });
  } catch (err) {
    return res.status(err.statusCode || 400).json({ detail: err.message || 'Failed to accept daily challenge.' });
  }
};

/**
 * POST /api/daily-challenge/:id/complete & POST /api/quests/daily-challenge/:id/complete
 */
exports.completeDailyChallenge = (req, res) => {
  try {
    const challengeId = Number(req.params.id);
    const result = questModel.completeDailyChallenge(req.user.id, challengeId);
    return res.json({
      success: true,
      message: 'Daily challenge conquered! Special rewards granted.',
      ...result
    });
  } catch (err) {
    return res.status(err.statusCode || 400).json({ detail: err.message || 'Failed to complete daily challenge.' });
  }
};
