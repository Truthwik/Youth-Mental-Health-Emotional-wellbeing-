import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  therapistId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: String, required: true }, // Format "YYYY-MM-DD"
  timeSlot: { type: String, required: true }, // e.g., "14:00"
  amount: { type: Number },
  status: { type: String, enum: ['Scheduled', 'Completed', 'Cancelled'], default: 'Scheduled' },
  razorpayOrderId: { type: String },
  razorpayPaymentId: { type: String },
  isFree: { type: Boolean, default: false },
  meetingLink: { type: String, default: 'https://meet.google.com/mock-svasthya-room' }
}, { timestamps: true });

export default mongoose.model('Appointment', appointmentSchema);
