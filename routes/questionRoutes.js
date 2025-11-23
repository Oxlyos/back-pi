const express = require('express');
const router = express.Router();
const QuestionController = require('../controllers/questionController');
const { authenticateToken } = require('../middlewares/auth');

router.get('/', authenticateToken, QuestionController.getAllQuestions);
router.get('/:id', authenticateToken, QuestionController.getQuestion);
router.post('/', authenticateToken, QuestionController.createQuestion);
router.post('/:id/reply', authenticateToken, QuestionController.replyToQuestion);

module.exports = router;