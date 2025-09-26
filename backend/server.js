import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from './models/user.js';
import Entry from './models/entry.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const MONGODB_URI = process.env.MONGODB_URI;
const JWT_SECRET = process.env.JWT_SECRET;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

// --- Auth Endpoints ---

// POST: User Registration (for creating an account from scratch)
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, password } = req.body;
    const existingUser = await User.findOne({ name });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST: User Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { name, password } = req.body;
    const user = await User.findOne({ name });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ token, userId: user._id });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// --- JWT Middleware (protects routes) ---
const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ error: 'Authentication failed' });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// --- API Endpoints ---

// POST: Onboard a new user
app.post('/api/users/onboard', async (req, res) => {
  try {
    const { name, onboardingPreferences } = req.body;
    // For a real app, you would also collect and hash a password here.
    const newUser = new User({
      name,
      onboardingPreferences
    });
    const savedUser = await newUser.save();
    // For simplicity, we'll return the user ID. In a real app, you'd generate a token here.
    res.status(201).json(savedUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to onboard user' });
  }
});

// GET: User profile
app.get('/api/users/:userId', authMiddleware, async (req, res) => {
  try {
    const { userId } = req.params;
    if (req.userId !== userId) {
        return res.status(403).json({ error: 'Access denied' });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
});

// PUT: Update user settings
app.put('/api/users/:userId/settings', authMiddleware, async (req, res) => {
  try {
    const { userId } = req.params;
    if (req.userId !== userId) {
        return res.status(403).json({ error: 'Access denied' });
    }
    const { notifications, privacy } = req.body;
    
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { 'settings.notifications': notifications, 'settings.privacy': privacy },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.status(200).json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

// POST: Create a new journal entry
app.post('/api/entries', authMiddleware, async (req, res) => {
  try {
    const { userId, type, textContent, quickAnswers, emojiContent, mood, tags } = req.body;
    if (req.userId !== userId) {
        return res.status(403).json({ error: 'Access denied' });
    }
    
    // Create entry based on type
    const newEntry = new Entry({
      userId,
      type,
      textContent,
      quickAnswers,
      emojiContent,
      mood,
      tags
    });

    const savedEntry = await newEntry.save();

    // Update user stats
    const user = await User.findById(userId);
    if (user) {
      user.stats.totalEntries = (user.stats.totalEntries || 0) + 1;
      if (textContent) {
        user.stats.wordsWritten = (user.stats.wordsWritten || 0) + textContent.split(/\s+/).length;
      }
      // You would also calculate and update streak, favorite time, etc., here
      await user.save();
    }

    res.status(201).json(savedEntry);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create entry' });
  }
});

// GET: Retrieve all journal entries for a user with filters
app.get('/api/entries', authMiddleware, async (req, res) => {
  try {
    const { userId, searchQuery } = req.query;
    if (req.userId !== userId) {
        return res.status(403).json({ error: 'Access denied' });
    }

    const query = { userId };
    if (searchQuery) {
      const searchRegex = new RegExp(searchQuery, 'i');
      query.$or = [
        { textContent: searchRegex },
        { 'quickAnswers.feeling': searchRegex },
        { 'quickAnswers.grateful': searchRegex },
        { 'quickAnswers.challenges': searchRegex },
        { mood: searchRegex },
        { tags: searchRegex },
      ];
    }
    
    const entries = await Entry.find(query).sort({ date: -1 });
    res.status(200).json(entries);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch entries' });
  }
});

// GET: Growth and analytics data
app.get('/api/entries/growth', authMiddleware, async (req, res) => {
  try {
    const { userId } = req.query;
    if (req.userId !== userId) {
        return res.status(403).json({ error: 'Access denied' });
    }
    
    const entries = await Entry.find({ userId }).sort({ date: 1 });

    const spiritData = entries.slice(-7).map(entry => {
      // Dummy logic for the spirit chart. A real implementation would use AI/NLP.
      const moodMap = { 'grateful': 8, 'peaceful': 7, 'excited': 9, 'thoughtful': 5 };
      const spirit = moodMap[entry.mood] || 5;
      return { day: new Date(entry.date).toLocaleDateString('en-US', { weekday: 'short' }), spirit };
    });

    const insights = [
      {
        title: "Your most reflective times",
        description: "You tend to journal most between 7-9 PM",
        icon: 'Calendar',
        color: "from-blue-400/20 to-indigo-400/20",
      },
      {
        title: "Words that define your journey",
        description: "Growth, gratitude, and peace appear most often",
        icon: 'Heart',
        color: "from-pink-400/20 to-rose-400/20",
      },
      {
        title: "Growth themes",
        description: "Self-compassion and mindfulness are trending",
        icon: 'TrendingUp',
        color: "from-teal-400/20 to-green-400/20",
      },
    ];

    const timeCapsule = entries.find(entry => {
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
      return entry.date < oneYearAgo;
    });

    res.status(200).json({
      spiritData,
      insights,
      timeCapsule,
      journeyStats: { totalEntries: entries.length, longestStreak: 7 }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch growth data' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});