const db = require('../config/db');

class Question {
    // Get all questions with user and reply info
    static async getAll() {
        const [rows] = await db.query(
            `SELECT q.*, 
                    CONCAT(u.first_name, ' ', u.last_name) as author_name,
                    u.role as author_role,
                    COUNT(r.id) as reply_count
             FROM questions q
             JOIN users u ON q.user_id = u.id
             LEFT JOIN replies r ON q.id = r.question_id
             GROUP BY q.id
             ORDER BY q.created_at DESC`
        );
        return rows;
    }

    // Get question by ID with replies
    static async findById(id) {
        const [questions] = await db.query(
            `SELECT q.*, 
                    CONCAT(u.first_name, ' ', u.last_name) as author_name,
                    u.role as author_role
             FROM questions q
             JOIN users u ON q.user_id = u.id
             WHERE q.id = ?`,
            [id]
        );
        
        if (questions.length === 0) return null;
        
        const question = questions[0];
        
        // Get replies
        const [replies] = await db.query(
            `SELECT r.*, 
                    CONCAT(u.first_name, ' ', u.last_name) as author_name,
                    u.role as author_role
             FROM replies r
             JOIN users u ON r.user_id = u.id
             WHERE r.question_id = ?
             ORDER BY r.created_at ASC`,
            [id]
        );
        
        question.replies = replies;
        return question;
    }

    // Create new question
    static async create(questionData) {
        const { user_id, content } = questionData;
        const [result] = await db.query(
            'INSERT INTO questions (user_id, content) VALUES (?, ?)',
            [user_id, content]
        );
        return result.insertId;
    }
}

module.exports = Question;