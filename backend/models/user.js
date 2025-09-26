import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: String,
  password: { 
    type: String, 
    required: true 
  },
  joinDate: {
    type: Date,
    default: Date.now
  },
  stats: {
    totalEntries: { type: Number, default: 0 },
    longestStreak: { type: Number, default: 0 },
    favoriteTime: { type: String, default: null },
    wordsWritten: { type: Number, default: 0 },
  },
  badges: [{
    name: String,
    description: String,
    earned: { type: Boolean, default: false },
    icon: String,
  }],
  settings: {
    notifications: {
      dailyReminders: { type: Boolean, default: true },
      weeklyInsights: { type: Boolean, default: true },
      milestoneAlerts: { type: Boolean, default: true },
      smartReminders: { type: Boolean, default: false },
    },
    privacy: {
      dataEncryption: { type: Boolean, default: true },
      localStorage: { type: Boolean, default: true },
      analytics: { type: Boolean, default: false },
    },
  },
  onboardingPreferences: {
    experience: String,
    topics: [String],
    frequency: String,
    notifications: { type: Boolean, default: false },
    reminderTime: String,
  },
});

const User = mongoose.model('User', userSchema);
export default User;