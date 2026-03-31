import mongoose from 'mongoose';

const ratingSchema = new mongoose.Schema({
  fromUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  toUserId:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  role:       { type: String, enum: ['mentor', 'therapist'], required: true },
  stars:      { type: Number, min: 1, max: 5, required: true },
  comment:    { type: String, maxlength: 500, default: '' },
  sessionId:  { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment', default: null },
}, { timestamps: true });

// Prevent duplicate rating for same session
ratingSchema.index({ fromUserId: 1, toUserId: 1, sessionId: 1 }, { unique: true, sparse: true });

const Rating = mongoose.model('Rating', ratingSchema);
export default Rating;
