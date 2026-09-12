const lifeProfileModel = require('../models/lifeProfileModel');

/**
 * GET /api/life-profile
 */
exports.getProfile = (req, res) => {
  try {
    const profile = lifeProfileModel.getLifeProfile(req.user.id);
    return res.json(profile);
  } catch (err) {
    console.error('Error fetching life profile:', err);
    return res.status(500).json({ detail: 'Failed to retrieve life profile.' });
  }
};

/**
 * PUT /api/life-profile/path
 */
exports.updatePath = (req, res) => {
  try {
    const { path_type, custom_path } = req.body;
    if (!path_type) {
      return res.status(400).json({ detail: 'path_type is required.' });
    }

    const updated = lifeProfileModel.savePath(req.user.id, { path_type, custom_path });
    return res.json({ success: true, profile: updated });
  } catch (err) {
    console.error('Error updating path:', err);
    return res.status(400).json({ detail: err.message || 'Failed to update path.' });
  }
};

/**
 * PUT /api/life-profile/education
 */
exports.updateEducation = (req, res) => {
  try {
    const { education_data, subjects } = req.body;
    const updated = lifeProfileModel.saveEducation(req.user.id, {
      education_data: education_data || req.body,
      subjects: subjects || req.body.subjects
    });
    return res.json({ success: true, profile: updated });
  } catch (err) {
    console.error('Error updating education:', err);
    return res.status(400).json({ detail: err.message || 'Failed to update education information.' });
  }
};

/**
 * Subjects Endpoints
 */
exports.getSubjects = (req, res) => {
  try {
    const subjects = lifeProfileModel.getSubjects(req.user.id);
    return res.json(subjects);
  } catch (err) {
    return res.status(500).json({ detail: 'Failed to retrieve subjects.' });
  }
};

exports.createSubject = (req, res) => {
  try {
    // Check if batch array was passed
    if (Array.isArray(req.body.subjects)) {
      const subjects = lifeProfileModel.syncSubjects(req.user.id, req.body.subjects);
      return res.status(201).json(subjects);
    }

    const subjectName = req.body.subject_name || req.body.name;
    if (!subjectName) {
      return res.status(400).json({ detail: 'subject_name is required.' });
    }

    const created = lifeProfileModel.createSubject(req.user.id, subjectName);
    return res.status(201).json(created);
  } catch (err) {
    return res.status(400).json({ detail: err.message || 'Failed to create subject.' });
  }
};

exports.updateSubject = (req, res) => {
  try {
    const subjectId = Number(req.params.id);
    const subjectName = req.body.subject_name || req.body.name;
    if (!subjectName) {
      return res.status(400).json({ detail: 'subject_name is required.' });
    }

    const updated = lifeProfileModel.updateSubject(req.user.id, subjectId, subjectName);
    if (!updated) {
      return res.status(404).json({ detail: 'Subject not found.' });
    }
    return res.json(updated);
  } catch (err) {
    return res.status(400).json({ detail: err.message || 'Failed to update subject.' });
  }
};

exports.deleteSubject = (req, res) => {
  try {
    const subjectId = Number(req.params.id);
    const deleted = lifeProfileModel.deleteSubject(req.user.id, subjectId);
    if (!deleted) {
      return res.status(404).json({ detail: 'Subject not found.' });
    }
    return res.json({ success: true, message: 'Subject deleted successfully.' });
  } catch (err) {
    return res.status(400).json({ detail: 'Failed to delete subject.' });
  }
};

/**
 * Interests Endpoints
 */
exports.getInterests = (req, res) => {
  try {
    const interests = lifeProfileModel.getInterests(req.user.id);
    return res.json(interests);
  } catch (err) {
    return res.status(500).json({ detail: 'Failed to retrieve interests.' });
  }
};

exports.createInterest = (req, res) => {
  try {
    // Check if batch array was passed
    if (Array.isArray(req.body.interests)) {
      const interests = lifeProfileModel.syncInterests(req.user.id, req.body.interests);
      return res.status(201).json(interests);
    }

    const { activity_name, name, category, frequency, approximate_duration } = req.body;
    const finalName = activity_name || name;
    if (!finalName) {
      return res.status(400).json({ detail: 'activity_name is required.' });
    }

    const created = lifeProfileModel.createInterest(req.user.id, {
      activity_name: finalName,
      category,
      frequency,
      approximate_duration
    });
    return res.status(201).json(created);
  } catch (err) {
    return res.status(400).json({ detail: err.message || 'Failed to create interest.' });
  }
};

exports.updateInterest = (req, res) => {
  try {
    const interestId = Number(req.params.id);
    const updated = lifeProfileModel.updateInterest(req.user.id, interestId, req.body);
    if (!updated) {
      return res.status(404).json({ detail: 'Interest not found.' });
    }
    return res.json(updated);
  } catch (err) {
    return res.status(400).json({ detail: err.message || 'Failed to update interest.' });
  }
};

exports.deleteInterest = (req, res) => {
  try {
    const interestId = Number(req.params.id);
    const deleted = lifeProfileModel.deleteInterest(req.user.id, interestId);
    if (!deleted) {
      return res.status(404).json({ detail: 'Interest not found.' });
    }
    return res.json({ success: true, message: 'Interest deleted successfully.' });
  } catch (err) {
    return res.status(400).json({ detail: 'Failed to delete interest.' });
  }
};

/**
 * Schedule Endpoints
 */
exports.getSchedule = (req, res) => {
  try {
    const schedule = lifeProfileModel.getSchedule(req.user.id);
    return res.json(schedule);
  } catch (err) {
    return res.status(500).json({ detail: 'Failed to retrieve schedule.' });
  }
};

exports.createScheduleBlock = (req, res) => {
  try {
    // Check if batch array was passed
    if (Array.isArray(req.body.schedule)) {
      const schedule = lifeProfileModel.syncSchedule(req.user.id, req.body.schedule);
      return res.status(201).json(schedule);
    }

    const { activity_name, title, name, category, start_time, end_time, sort_order } = req.body;
    const finalName = activity_name || title || name;
    if (!finalName) {
      return res.status(400).json({ detail: 'activity_name is required.' });
    }

    const created = lifeProfileModel.createScheduleBlock(req.user.id, {
      activity_name: finalName,
      category,
      start_time,
      end_time,
      sort_order
    });
    return res.status(201).json(created);
  } catch (err) {
    return res.status(400).json({ detail: err.message || 'Failed to create schedule block.' });
  }
};

exports.updateScheduleBlock = (req, res) => {
  try {
    const blockId = Number(req.params.id);
    const updated = lifeProfileModel.updateScheduleBlock(req.user.id, blockId, req.body);
    if (!updated) {
      return res.status(404).json({ detail: 'Schedule block not found.' });
    }
    return res.json(updated);
  } catch (err) {
    return res.status(400).json({ detail: err.message || 'Failed to update schedule block.' });
  }
};

exports.deleteScheduleBlock = (req, res) => {
  try {
    const blockId = Number(req.params.id);
    const deleted = lifeProfileModel.deleteScheduleBlock(req.user.id, blockId);
    if (!deleted) {
      return res.status(404).json({ detail: 'Schedule block not found.' });
    }
    return res.json({ success: true, message: 'Schedule block deleted successfully.' });
  } catch (err) {
    return res.status(400).json({ detail: 'Failed to delete schedule block.' });
  }
};

/**
 * POST /api/life-profile/complete
 */
exports.completeProfile = (req, res) => {
  try {
    const completed = lifeProfileModel.completeLifeProfile(req.user.id);
    return res.json({
      success: true,
      message: 'Your world has taken shape! Life profile successfully forged.',
      profile: completed
    });
  } catch (err) {
    console.error('Error completing life profile:', err);
    return res.status(500).json({ detail: 'Failed to complete life profile.' });
  }
};
