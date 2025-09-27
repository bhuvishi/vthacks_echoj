const express = require('express');
const { body, validationResult } = require('express-validator');
const { authenticateToken, checkUserExists, updateUser, deleteUser } = require('../middleware/auth');

const router = express.Router();

// Validation rules for user updates
const updateUserValidation = [
  body('name').optional().trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email').optional().isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('preferences').optional().isObject().withMessage('Preferences must be an object'),
  body('journalFrequency').optional().isIn(['daily', 'weekly', 'bi-weekly', 'monthly']).withMessage('Invalid journal frequency'),
  body('notifications').optional().isBoolean().withMessage('Notifications must be a boolean'),
  body('reminderTime').optional().matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Reminder time must be in HH:MM format')
];

// Get user profile
router.get('/profile', authenticateToken, checkUserExists, (req, res) => {
  try {
    const { password: _, ...userWithoutPassword } = req.userData;
    res.json({
      message: 'User profile retrieved successfully',
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      message: 'Internal server error while retrieving profile'
    });
  }
});

// Update user profile
router.put('/profile', authenticateToken, checkUserExists, updateUserValidation, (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const userId = req.user.id;
    const updateData = {};

    // Only include fields that are provided
    if (req.body.name !== undefined) updateData.name = req.body.name;
    if (req.body.email !== undefined) updateData.email = req.body.email;
    if (req.body.preferences !== undefined) updateData.preferences = req.body.preferences;
    if (req.body.journalFrequency !== undefined) updateData.journalFrequency = req.body.journalFrequency;
    if (req.body.notifications !== undefined) updateData.notifications = req.body.notifications;
    if (req.body.reminderTime !== undefined) updateData.reminderTime = req.body.reminderTime;

    const updatedUser = updateUser(userId, updateData);

    if (!updatedUser) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    const { password: _, ...userWithoutPassword } = updatedUser;

    res.json({
      message: 'User profile updated successfully',
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      message: 'Internal server error while updating profile'
    });
  }
});

// Delete user account
router.delete('/account', authenticateToken, checkUserExists, (req, res) => {
  try {
    const userId = req.user.id;
    const deleted = deleteUser(userId);

    if (!deleted) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    res.json({
      message: 'User account deleted successfully'
    });
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({
      message: 'Internal server error while deleting account'
    });
  }
});

// Update user preferences
router.put('/preferences', authenticateToken, checkUserExists, (req, res) => {
  try {
    const userId = req.user.id;
    const preferences = req.body;

    const updatedUser = updateUser(userId, { preferences });

    if (!updatedUser) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    const { password: _, ...userWithoutPassword } = updatedUser;

    res.json({
      message: 'User preferences updated successfully',
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Update preferences error:', error);
    res.status(500).json({
      message: 'Internal server error while updating preferences'
    });
  }
});

// Get user dashboard data
router.get('/dashboard', authenticateToken, checkUserExists, (req, res) => {
  try {
    const userId = req.user.id;
    const user = req.userData;

    // This would typically fetch data from the journal entries
    // For now, we'll return mock data
    const dashboardData = {
      user: {
        name: user.name,
        email: user.email,
        journalFrequency: user.journalFrequency || 'daily',
        streak: 7, // This would be calculated from journal entries
        totalEntries: 42, // This would be calculated from journal entries
        lastEntryDate: new Date().toISOString()
      },
      todayPrompt: {
        id: 'prompt-1',
        text: "What brought you joy today, and how did it make you feel in the moment? Sometimes the smallest moments carry the greatest meaning.",
        category: 'reflection'
      },
      recentMoods: [
        { day: 'Mon', emoji: '🕊️' },
        { day: 'Tue', emoji: '🙏' },
        { day: 'Wed', emoji: '⚡' },
        { day: 'Thu', emoji: '🌙' },
        { day: 'Fri', emoji: '✨' },
        { day: 'Sat', emoji: '🌊' },
        { day: 'Sun', emoji: '🌟' }
      ],
      weeklyStats: {
        wordCount: 1250,
        entriesCount: 5,
        averageWords: 250,
        growthRate: 12.5
      }
    };

    res.json({
      message: 'Dashboard data retrieved successfully',
      dashboard: dashboardData
    });
  } catch (error) {
    console.error('Get dashboard error:', error);
    res.status(500).json({
      message: 'Internal server error while retrieving dashboard data'
    });
  }
});

// Update journal frequency preference
router.put('/journal-frequency', authenticateToken, checkUserExists, (req, res) => {
  try {
    const { frequency } = req.body;
    const validFrequencies = ['daily', 'weekly', 'bi-weekly', 'monthly'];

    if (!validFrequencies.includes(frequency)) {
      return res.status(400).json({
        message: 'Invalid journal frequency. Must be one of: daily, weekly, bi-weekly, monthly'
      });
    }

    const userId = req.user.id;
    const updatedUser = updateUser(userId, { journalFrequency: frequency });

    if (!updatedUser) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    const { password: _, ...userWithoutPassword } = updatedUser;

    res.json({
      message: 'Journal frequency updated successfully',
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Update journal frequency error:', error);
    res.status(500).json({
      message: 'Internal server error while updating journal frequency'
    });
  }
});

module.exports = router;
