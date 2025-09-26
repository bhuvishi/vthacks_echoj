import mongoose from 'mongoose';

const entrySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  type: {
    type: String,
    enum: ["write", "quick", "emojis", "voice"],
    required: true
  },
  mood: String,
  moodColor: String,
  preview: String,
  wordCount: { type: Number, default: 0 },
  tags: [String],
  textContent: String,
  quickAnswers: {
    feeling: String,
    grateful: String,
    challenges: String,
  },
  emojiContent: [String],
  voiceNoteUrl: String,
});

const Entry = mongoose.model('Entry', entrySchema);
export default Entry;