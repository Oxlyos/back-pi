const Question = require('../models/Question');
const Reply = require('../models/Reply');

class QuestionController {
    // Get all questions
    static async getAllQuestions(req, res) {
        try {
            const questions = await Question.getAll();

            res.status(200).json({
                success: true,
                questions: questions
            });

        } catch (error) {
            console.error('Get questions error:', error);
            res.status(500).json({
                success: false,
                message: 'Server error'
            });
        }
    }

    // Get single question with replies
    static async getQuestion(req, res) {
        try {
            const { id } = req.params;
            const question = await Question.findById(id);

            if (!question) {
                return res.status(404).json({
                    success: false,
                    message: 'Question not found'
                });
            }

            res.status(200).json({
                success: true,
                question: question
            });

        } catch (error) {
            console.error('Get question error:', error);
            res.status(500).json({
                success: false,
                message: 'Server error'
            });
        }
    }

    // Create question
    static async createQuestion(req, res) {
        try {
            const { content } = req.body;
            const user_id = req.user.userId;

            if (!content || content.trim() === '') {
                return res.status(400).json({
                    success: false,
                    message: 'Question content is required'
                });
            }

            const questionId = await Question.create({
                user_id,
                content
            });

            res.status(201).json({
                success: true,
                message: 'Question posted successfully',
                questionId: questionId
            });

        } catch (error) {
            console.error('Create question error:', error);
            res.status(500).json({
                success: false,
                message: 'Server error'
            });
        }
    }

    // Reply to question
    static async replyToQuestion(req, res) {
        try {
            const { id } = req.params;
            const { content } = req.body;
            const user_id = req.user.userId;

            if (!content || content.trim() === '') {
                return res.status(400).json({
                    success: false,
                    message: 'Reply content is required'
                });
            }

            const question = await Question.findById(id);
            if (!question) {
                return res.status(404).json({
                    success: false,
                    message: 'Question not found'
                });
            }

            const replyId = await Reply.create({
                question_id: id,
                user_id,
                content
            });

            res.status(201).json({
                success: true,
                message: 'Reply posted successfully',
                replyId: replyId
            });

        } catch (error) {
            console.error('Reply error:', error);
            res.status(500).json({
                success: false,
                message: 'Server error'
            });
        }
    }
}

module.exports = QuestionController;
