const express = require('express');
const router = express.Router();
const questController = require('../controllers/questController');

// Today's Quests Board & Summary
router.get('/today', questController.getToday);

// Historical Completion Logs
router.get('/history', questController.getHistory);

// Quest Creation
router.post('/', questController.createQuest);

// Academy Daily Challenge endpoints
router.get('/daily-challenge', questController.getDailyChallenge);
router.post('/daily-challenge/:id/accept', questController.acceptDailyChallenge);
router.post('/daily-challenge/:id/complete', questController.completeDailyChallenge);

// Single Quest Detail
router.get('/:id', questController.getQuest);

// Quest Lifecycle & Focus Session State Transitions
router.post('/:id/start', questController.startQuest);
router.patch('/:id/start', questController.startQuest);

router.post('/:id/pause', questController.pauseQuest);
router.patch('/:id/pause', questController.pauseQuest);

router.post('/:id/resume', questController.resumeQuest);
router.patch('/:id/resume', questController.resumeQuest);

router.post('/:id/abandon', questController.abandonQuest);

router.post('/:id/complete', questController.completeQuest);
router.delete('/:id', questController.deleteQuest);

module.exports = router;
