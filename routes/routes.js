const express = require('express');
const { registerSchema, loginSchema, forgotPasswordSchema } = require('../utils/validations/auth.validation');
const AuthController = require('../controllers/auth/auth.controller');
const validate = require('../middleware/validate.middleware');
const globalRateLimiter = require('../middleware/rateLimiter.middleware');
const authenticate = require('../middleware/auth.middleware');


const router = express.Router();

// Auth Routes
router.post('/auth/register', globalRateLimiter(10, 3600), validate(registerSchema), AuthController.register);
router.post('/auth/login', globalRateLimiter(20, 3600), validate(loginSchema), AuthController.login);
router.post('/auth/refresh', authenticate, AuthController.refresh);
router.post('/auth/logout', globalRateLimiter(10, 3600), authenticate, AuthController.logout);

module.exports = router;