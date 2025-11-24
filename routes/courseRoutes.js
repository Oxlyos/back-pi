const express = require('express');
const router = express.Router();
const CourseController = require('../controllers/courseController');

router.get('/:id', CourseController.getCourse);

module.exports = router;