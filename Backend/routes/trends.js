const express = require('express');
const router = express.Router();

// We will create the controller logic in the next file
const { getTrends } = require('../controllers/trendsController');
const { protect } = require('../middleware/authMiddleware');
const rateLimit = require('../middleware/rateLimit');

const trendsRateLimit = rateLimit({ windowMs: 15 * 60 * 1000, max: 30, message: 'Trend request limit reached. Please try again later.' });

// Route to get trends
router.route('/').get(protect, getTrends);
router.route('/').get(protect, trendsRateLimit, getTrends);

module.exports = router;