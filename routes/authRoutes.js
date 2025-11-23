const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');
const { authenticateToken } = require('../middlewares/auth');

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.get('/profile', authenticateToken, AuthController.getProfile);

// Protected routes
router.put('/profile', authenticateToken, AuthController.updateProfile);
router.get('/users/:id', authenticateToken, AuthController.getProfileById);  
module.exports = router;