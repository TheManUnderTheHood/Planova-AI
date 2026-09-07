const express = require('express');
const router = express.Router();
const { register, login, googleLogin } = require('../controllers/authController');
const rateLimit = require('../middleware/rateLimit');

const authRateLimit = rateLimit({ windowMs: 15 * 60 * 1000, max: 10, message: 'Too many authentication attempts. Please try again later.' });

router.post('/register', authRateLimit, register);
router.post('/login', authRateLimit, login);
router.post('/google', authRateLimit, googleLogin);

module.exports = router;