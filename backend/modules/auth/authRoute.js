const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const authController = require('./authController');
const rateLimit = require('express-rate-limit');

// Rate limiting for login attempts
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 attempts per window per IP
    message: { 
        success: false, 
        message: 'Too many login attempts, please try again later' 
    }
});

// Validation middleware
const loginValidation = [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 })
];

const registerValidation = [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }),
    body('employee_name').trim().notEmpty(),
    body('is_admin').optional().isBoolean()
];

// Routes
router.post('/login', loginLimiter, loginValidation, authController.login);
router.post('/register', registerValidation, authController.register);

module.exports = router;