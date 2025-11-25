const Testimonial = require('../models/Testimonial');

class TestimonialController {
    // Get all testimonials
    static async getAllTestimonials(req, res) {
        try {
            const testimonials = await Testimonial.getAll();

            res.status(200).json({
                success: true,
                testimonials: testimonials
            });

        } catch (error) {
            console.error('Get testimonials error:', error);
            res.status(500).json({
                success: false,
                message: 'Server error'
            });
        }
    }

    // Create new testimonial (optional - for admin use)
    static async createTestimonial(req, res) {
        try {
            const { name, role, content, avatar } = req.body;

            if (!name || !role || !content) {
                return res.status(400).json({
                    success: false,
                    message: 'Name, role, and content are required'
                });
            }

            const testimonialId = await Testimonial.create({
                name,
                role,
                content,
                avatar: avatar || null
            });

            res.status(201).json({
                success: true,
                message: 'Testimonial created successfully',
                testimonialId: testimonialId
            });

        } catch (error) {
            console.error('Create testimonial error:', error);
            res.status(500).json({
                success: false,
                message: 'Server error'
            });
        }
    }
}

module.exports = TestimonialController;
