import mongoose from 'mongoose';

const personalEventSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  date: {
    type: String, // YYYY-MM-DD
    required: true
  },
  timeSlot: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['Meditation', 'Study', 'Social', 'Reflection', 'Exercise', 'Other'],
    default: 'Other'
  },
  notes: {
    type: String,
    trim: true
  },
  isCompleted: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

const PersonalEvent = mongoose.model('PersonalEvent', personalEventSchema);
export default PersonalEvent;
