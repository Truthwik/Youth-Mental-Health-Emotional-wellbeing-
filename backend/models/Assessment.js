import mongoose from 'mongoose';

const assessmentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['GAD-7', 'PHQ-9', 'RQ-10', 'SCS-8'],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  answers: {
    type: Array,
    required: true
  },
  totalScore: {
    type: Number,
    required: true
  },
  severity: {
    type: String,
    enum: ['None-Minimal', 'Mild', 'Moderate', 'Moderately Severe', 'Severe', 'Fragile', 'Developing', 'Strong', 'Champion', 'Isolated', 'At-Risk', 'Connected', 'Thriving'],
    required: true
  },
  clinicalInterpretation: {
    type: String,
    required: true
  },
  aiInsight: {
    type: String,
    default: ''
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

const Assessment = mongoose.model('Assessment', assessmentSchema);
export default Assessment;
