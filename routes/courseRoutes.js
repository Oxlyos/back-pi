const express = require('express');
const router = express.Router();
const CourseController = require('../controllers/courseController');
const { authenticateToken, checkRole } = require('../middlewares/auth');

// IMPORTANT: Routes spécifiques AVANT les routes dynamiques
router.get('/my-courses', authenticateToken, checkRole('professor'), CourseController.getMyCourses);
router.post('/', authenticateToken, checkRole('professor'), CourseController.createCourse);
router.post('/:id/videos', authenticateToken, checkRole('professor'), CourseController.addVideo);
router.post('/:id/announcements', authenticateToken, checkRole('professor'), CourseController.addAnnouncement);
router.post('/:id/files', authenticateToken, checkRole('professor'), CourseController.addFile);

// Routes dynamiques EN DERNIER
router.get('/', authenticateToken, CourseController.getAllCourses);
router.get('/:id', authenticateToken, CourseController.getCourse);

module.exports = router;