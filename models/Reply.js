const db = require('../config/db');

class Reply {
    // Create new reply
    static async create(replyData) {
        const { question_id, user_id, content } = replyData;
        const [result] = await db.query(
            'INSERT INTO replies (question_id, user_id, content) VALUES (?, ?, ?)',
            [question_id, user_id, content]
        );
        return result.insertId;
    }

    // Get replies by question ID
    static async getByQuestion(questionId) {
        const [rows] = await db.query(
            `SELECT r.*, 
                    CONCAT(u.first_name, ' ', u.last_name) as author_name,
                    u.role as author_role
             FROM replies r
             JOIN users u ON r.user_id = u.id
             WHERE r.question_id = ?
             ORDER BY r.created_at ASC`,
            [questionId]
        );
        return rows;
    }
}

module.exports = Reply;