const db = require('../config/db');

class Testimonial {
    static async getAll() {
        try {
            const [rows] = await db.query(
                'SELECT * FROM testimonials ORDER BY created_at DESC'
            );
            return rows;
        } catch (error) {
            console.error('Error fetching testimonials:', error);
            throw error;
        }
    }

    static async create(testimonialData) {
        try {
            const { name, role, content, avatar } = testimonialData;
            const [result] = await db.query(
                'INSERT INTO testimonials (name, role, content, avatar) VALUES (?, ?, ?, ?)',
                [name, role, content, avatar]
            );
            return result.insertId;
        } catch (error) {
            console.error('Error creating testimonial:', error);
            throw error;
        }
    }

    static async findById(id) {
        try {
            const [rows] = await db.query(
                'SELECT * FROM testimonials WHERE id = ?',
                [id]
            );
            return rows[0] || null;
        } catch (error) {
            console.error('Error finding testimonial:', error);
            throw error;
        }
    }
}

module.exports = Testimonial;
