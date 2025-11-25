const express = require('express');
const router = express.Router();
const CourseController = require('../controllers/courseController');
const { authenticateToken } = require('../middlewares/auth');
const upload = require('../middlewares/upload');

// Get all courses (public)
router.get('/', CourseController.getAllCourses);

// Get professor's courses (requires authentication)
router.get('/my-courses', authenticateToken, CourseController.getMyCourses);

// Create new course (requires authentication and file upload)
router.post('/',
    authenticateToken,
    upload.fields([
        { name: 'thumbnail', maxCount: 1 },
        { name: 'coursePdfFiles', maxCount: 10 }
    ]),
    CourseController.createCourse
);

// Add announcement to course (requires authentication)
router.post('/:id/announcements', authenticateToken, CourseController.addAnnouncement);

// Add video to course (requires authentication)
router.post('/:id/videos', authenticateToken, CourseController.addVideo);

// Add file to course (requires authentication)
router.post('/:id/files', authenticateToken, CourseController.addFile);

// Get single course by ID
router.get('/:id', CourseController.getCourse);

module.exports = router;