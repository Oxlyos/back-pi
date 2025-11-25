const express = require('express');
const router = express.Router();
const AnnouncementController = require('../controllers/announcementController');
const { authenticateToken } = require('../middlewares/auth');

// Create announcement for a course (protected route)
router.post('/:courseId/announcements', authenticateToken, AnnouncementController.createAnnouncement);

// Get all announcements for a course
router.get('/:courseId/announcements', AnnouncementController.getAnnouncementsByCourse);

module.exports = router;
