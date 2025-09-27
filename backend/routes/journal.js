const express = require('express');
const { body, validationResult } = require('express-validator');
const { authenticateToken, checkUserExists } = require('../middleware/auth');

const router = express.Router();

// In-memory storage for journal entries (replace with database later)
const journalEntries = new Map();

// Validation rules for journal entries
const entryValidation = [
  body('title').optional().trim().isLength({ max: 200 }).withMessage('Title must be less than 200 characters'),
  body('content').trim().isLength({ min: 1 }).withMessage('Content is required'),
  body('mood').optional().isString().withMessage('Mood must be a string'),
  body('tags').optional().isArray().withMessage('Tags must be an array'),
  body('type').optional().isIn(['text', 'emoji', 'voice', 'quick']).withMessage('Invalid entry type'),
  body('isPrivate').optional().isBoolean().withMessage('isPrivate must be a boolean')
];

// Get all journal entries for the authenticated user
router.get('/entries', authenticateToken, checkUserExists, (req, res) => {
  try {
    const userId = req.user.id;
    const userEntries = Array.from(journalEntries.values())
      .filter(entry => entry.userId === userId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json({
      message: 'Journal entries retrieved successfully',
      entries: userEntries,
      count: userEntries.length
    });
  } catch (error) {
    console.error('Get entries error:', error);
    res.status(500).json({
      message: 'Internal server error while retrieving entries'
    });
  }
});

// Get a specific journal entry
router.get('/entries/:id', authenticateToken, checkUserExists, (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const entry = journalEntries.get(id);

    if (!entry) {
      return res.status(404).json({
        message: 'Journal entry not found'
      });
    }

    if (entry.userId !== userId) {
      return res.status(403).json({
        message: 'Access denied to this journal entry'
      });
    }

    res.json({
      message: 'Journal entry retrieved successfully',
      entry
    });
  } catch (error) {
    console.error('Get entry error:', error);
    res.status(500).json({
      message: 'Internal server error while retrieving entry'
    });
  }
});

// Create a new journal entry
router.post('/entries', authenticateToken, checkUserExists, entryValidation, (req, res) => {
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
    const entryId = require('uuid').v4();
    const now = new Date().toISOString();

    const entry = {
      id: entryId,
      userId,
      title: req.body.title || '',
      content: req.body.content,
      mood: req.body.mood || '',
      tags: req.body.tags || [],
      type: req.body.type || 'text',
      isPrivate: req.body.isPrivate || true,
      wordCount: req.body.content.split(/\s+/).length,
      createdAt: now,
      updatedAt: now
    };

    journalEntries.set(entryId, entry);

    res.status(201).json({
      message: 'Journal entry created successfully',
      entry
    });
  } catch (error) {
    console.error('Create entry error:', error);
    res.status(500).json({
      message: 'Internal server error while creating entry'
    });
  }
});

// Update a journal entry
router.put('/entries/:id', authenticateToken, checkUserExists, entryValidation, (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { id } = req.params;
    const userId = req.user.id;
    const existingEntry = journalEntries.get(id);

    if (!existingEntry) {
      return res.status(404).json({
        message: 'Journal entry not found'
      });
    }

    if (existingEntry.userId !== userId) {
      return res.status(403).json({
        message: 'Access denied to this journal entry'
      });
    }

    const updatedEntry = {
      ...existingEntry,
      title: req.body.title || existingEntry.title,
      content: req.body.content,
      mood: req.body.mood || existingEntry.mood,
      tags: req.body.tags || existingEntry.tags,
      type: req.body.type || existingEntry.type,
      isPrivate: req.body.isPrivate !== undefined ? req.body.isPrivate : existingEntry.isPrivate,
      wordCount: req.body.content.split(/\s+/).length,
      updatedAt: new Date().toISOString()
    };

    journalEntries.set(id, updatedEntry);

    res.json({
      message: 'Journal entry updated successfully',
      entry: updatedEntry
    });
  } catch (error) {
    console.error('Update entry error:', error);
    res.status(500).json({
      message: 'Internal server error while updating entry'
    });
  }
});

// Delete a journal entry
router.delete('/entries/:id', authenticateToken, checkUserExists, (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const entry = journalEntries.get(id);

    if (!entry) {
      return res.status(404).json({
        message: 'Journal entry not found'
      });
    }

    if (entry.userId !== userId) {
      return res.status(403).json({
        message: 'Access denied to this journal entry'
      });
    }

    journalEntries.delete(id);

    res.json({
      message: 'Journal entry deleted successfully'
    });
  } catch (error) {
    console.error('Delete entry error:', error);
    res.status(500).json({
      message: 'Internal server error while deleting entry'
    });
  }
});

// Get journal entries by date range
router.get('/entries/date-range', authenticateToken, checkUserExists, (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const userId = req.user.id;

    if (!startDate || !endDate) {
      return res.status(400).json({
        message: 'Start date and end date are required'
      });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    const userEntries = Array.from(journalEntries.values())
      .filter(entry => {
        const entryDate = new Date(entry.createdAt);
        return entry.userId === userId && 
               entryDate >= start && 
               entryDate <= end;
      })
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json({
      message: 'Journal entries retrieved successfully',
      entries: userEntries,
      count: userEntries.length,
      dateRange: { startDate, endDate }
    });
  } catch (error) {
    console.error('Get entries by date range error:', error);
    res.status(500).json({
      message: 'Internal server error while retrieving entries'
    });
  }
});

// Get journal statistics
router.get('/stats', authenticateToken, checkUserExists, (req, res) => {
  try {
    const userId = req.user.id;
    const userEntries = Array.from(journalEntries.values())
      .filter(entry => entry.userId === userId);

    const totalEntries = userEntries.length;
    const totalWords = userEntries.reduce((sum, entry) => sum + entry.wordCount, 0);
    const averageWords = totalEntries > 0 ? Math.round(totalWords / totalEntries) : 0;

    // Get mood distribution
    const moodCounts = {};
    userEntries.forEach(entry => {
      if (entry.mood) {
        moodCounts[entry.mood] = (moodCounts[entry.mood] || 0) + 1;
      }
    });

    // Get entries by type
    const typeCounts = {};
    userEntries.forEach(entry => {
      typeCounts[entry.type] = (typeCounts[entry.type] || 0) + 1;
    });

    // Get recent activity (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentEntries = userEntries.filter(entry => 
      new Date(entry.createdAt) >= thirtyDaysAgo
    );

    res.json({
      message: 'Journal statistics retrieved successfully',
      stats: {
        totalEntries,
        totalWords,
        averageWords,
        moodDistribution: moodCounts,
        typeDistribution: typeCounts,
        recentActivity: recentEntries.length,
        lastEntry: userEntries.length > 0 ? userEntries[0].createdAt : null
      }
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      message: 'Internal server error while retrieving statistics'
    });
  }
});

module.exports = router;
