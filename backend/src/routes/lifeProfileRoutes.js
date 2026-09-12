const express = require('express');
const router = express.Router();
const lifeProfileController = require('../controllers/lifeProfileController');

// Overall Life Profile
router.get('/', lifeProfileController.getProfile);
router.put('/path', lifeProfileController.updatePath);
router.put('/education', lifeProfileController.updateEducation);
router.post('/complete', lifeProfileController.completeProfile);

// Subjects CRUD
router.get('/subjects', lifeProfileController.getSubjects);
router.post('/subjects', lifeProfileController.createSubject);
router.put('/subjects/:id', lifeProfileController.updateSubject);
router.delete('/subjects/:id', lifeProfileController.deleteSubject);

// Interests CRUD
router.get('/interests', lifeProfileController.getInterests);
router.post('/interests', lifeProfileController.createInterest);
router.put('/interests/:id', lifeProfileController.updateInterest);
router.delete('/interests/:id', lifeProfileController.deleteInterest);

// Schedule CRUD
router.get('/schedule', lifeProfileController.getSchedule);
router.post('/schedule', lifeProfileController.createScheduleBlock);
router.put('/schedule/:id', lifeProfileController.updateScheduleBlock);
router.delete('/schedule/:id', lifeProfileController.deleteScheduleBlock);

module.exports = router;
