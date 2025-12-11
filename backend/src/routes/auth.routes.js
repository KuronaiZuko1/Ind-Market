const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth.middleware');
const {
  validateRegistration,
  validateLogin,
  validate,
} = require('../middleware/validation.middleware');

// Public routes
router.post('/register', validateRegistration, validate, authController.register);
router.post('/login', validateLogin, validate, authController.login);

// Protected routes
router.get('/profile', authenticateToken, authController.getProfile);

module.exports = router;
