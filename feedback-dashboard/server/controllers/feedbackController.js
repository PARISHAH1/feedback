const Feedback = require('../models/Feedback');

// @desc    Create new feedback
// @route   POST /api/feedback
// @access  Public
exports.createFeedback = async (req, res) => {
  try {
    const { name, email, message, rating } = req.body;
    
    const feedback = await Feedback.create({
      name,
      email,
      message,
      rating
    });

    res.status(201).json({
      success: true,
      data: feedback
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        error: messages
      });
    }
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Get all feedback
// @route   GET /api/feedback
// @access  Public
exports.getFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: feedbacks.length,
      data: feedbacks
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Get feedback stats
// @route   GET /api/feedback/stats
// @access  Public
exports.getFeedbackStats = async (req, res) => {
  try {
    const stats = await Feedback.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          averageRating: { $avg: '$rating' },
          positive: {
            $sum: { $cond: [{ $gte: ['$rating', 4] }, 1, 0] }
          },
          negative: {
            $sum: { $cond: [{ $lt: ['$rating', 3] }, 1, 0] }
          }
        }
      }
    ]);

    // If no feedbacks exist, return default values
    if (stats.length === 0) {
      return res.status(200).json({
        success: true,
        data: {
          total: 0,
          averageRating: 0,
          positive: 0,
          negative: 0
        }
      });
    }

    res.status(200).json({
      success: true,
      data: {
        total: stats[0].total,
        averageRating: parseFloat(stats[0].averageRating.toFixed(1)),
        positive: stats[0].positive,
        negative: stats[0].negative
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};
