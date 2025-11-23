const db = require('../config/db');

class Course {
    // Get all courses
    static async getAll() {
        const [rows] = await db.query(
            `SELECT c.*, 
                    CONCAT(u.first_name, ' ', u.last_name) as professor_name,
                    u.bio as professor_bio,
                    u.profile_image as professor_image,
                    u.years_experience as professor_years_experience,
                    u.specialization as professor_specialization
             FROM courses c
             LEFT JOIN users u ON c.professor_id = u.id
             ORDER BY c.created_at DESC`
        );
        return rows;
    }

    // Get course by ID
    static async findById(id) {
        const [rows] = await db.query(
            `SELECT c.*, 
                    CONCAT(u.first_name, ' ', u.last_name) as professor_name,
                    u.bio as professor_bio,
                    u.profile_image as professor_image,
                    u.years_experience as professor_years_experience,
                    u.specialization as professor_specialization
             FROM courses c
             LEFT JOIN users u ON c.professor_id = u.id
             WHERE c.id = ?`,
            [id]
        );
        return rows[0];
    }

    // Create new course
    static async create(courseData) {
        const { title, description, professor_id, professor_introduction, image_url } = courseData;
        const [result] = await db.query(
            'INSERT INTO courses (title, description, professor_id, professor_introduction, image_url) VALUES (?, ?, ?, ?, ?)',
            [title, description, professor_id, professor_introduction, image_url]
        );
        return result.insertId;
    }

    // Get courses by professor
    static async getByProfessor(professorId) {
        const [rows] = await db.query(
            'SELECT * FROM courses WHERE professor_id = ? ORDER BY created_at DESC',
            [professorId]
        );
        return rows;
    }
}

module.exports = Course;