const express = require('express');
const router = express.Router();

const { 
  generateStrategy, 
  getStrategies, 
  getStrategyById,
  updateCalendarItem,
  generatePersona, // <-- IMPORT new controller
  generateIdeas, // <-- Import
  deleteStrategy,
    expandIdea
} = require('../controllers/strategyController');

const { protect } = require('../middleware/authMiddleware');
const rateLimit = require('../middleware/rateLimit');

const aiRateLimit = rateLimit({ windowMs: 60 * 60 * 1000, max: 20, message: 'AI request limit reached. Please try again later.' });

router.route('/generate').post(protect, aiRateLimit, generateStrategy);
router.route('/generate-persona').post(protect, aiRateLimit, generatePersona);

router.route('/').get(protect, getStrategies);
router.route('/:id')
  .get(protect, getStrategyById)
  .delete(protect, deleteStrategy);
router.route('/:strategyId/calendar/:day').put(protect, updateCalendarItem);
router.route('/generate-ideas').post(protect, aiRateLimit, generateIdeas);
router.route('/expand-idea').post(protect, aiRateLimit, expandIdea);
module.exports = router;