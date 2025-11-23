const db = require('../config/db');

class Announcement {
    // Get all announcements for a course
    static async getByCourse(courseId) {
        const [rows] = await db.query(
            'SELECT * FROM announcements WHERE course_id = ? ORDER BY created_at DESC',
            [courseId]
        );
        return rows;
    }

    // Create new announcement
    static async create(announcementData) {
        const { course_id, title, content } = announcementData;
        const [result] = await db.query(
            'INSERT INTO announcements (course_id, title, content) VALUES (?, ?, ?)',
            [course_id, title, content]
        );
        return result.insertId;
    }
}

module.exports = Announcement;