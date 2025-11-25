const express = require('express');
const router = express.Router();
const TestimonialController = require('../controllers/testimonialController');
const { authenticateToken } = require('../middlewares/auth');

// Public route - get all testimonials
router.get('/', TestimonialController.getAllTestimonials);

// Protected route - create testimonial (optional, for admin use)
router.post('/', authenticateToken, TestimonialController.createTestimonial);

module.exports = router;
