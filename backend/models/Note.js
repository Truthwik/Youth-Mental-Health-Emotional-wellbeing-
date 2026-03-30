import mongoose from 'mongoose';

const recommendationItemSchema = new mongoose.Schema({
  title: String,
  author: String,
  artist: String,
  channel: String,
  reason: String,
}, { _id: false });

const noteSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, default: '' },
  content: { type: String, required: true },
  // AI-generated fields
  mood: { type: String, default: '' },
  moodScore: { type: Number, default: 5 },
  moodEmoji: { type: String, default: '💭' },
  categories: { type: [String], default: [] },
  aiInsight: { type: String, default: '' },
  suggestions: { type: [String], default: [] },
  recommendations: {
    movies: { type: [recommendationItemSchema], default: [] },
    books: { type: [recommendationItemSchema], default: [] },
    songs: { type: [recommendationItemSchema], default: [] },
    youtube: { type: [recommendationItemSchema], default: [] },
    podcasts: { type: [recommendationItemSchema], default: [] },
  },
  analysisComplete: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model('Note', noteSchema);
