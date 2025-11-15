const express = require('express');
const router = express.Router();
const {
  createFeedback,
  getFeedbacks,
  getFeedbackStats
} = require('../controllers/feedbackController');

// Routes
router.route('/')
  .post(createFeedback)
  .get(getFeedbacks);

router.route('/stats')
  .get(getFeedbackStats);

module.exports = router;
