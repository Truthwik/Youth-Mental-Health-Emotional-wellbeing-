import mongoose from 'mongoose';

const donationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Allow anonymous donations if needed
  },
  amount: {
    type: Number,
    required: true
  },
  razorpayOrderId: {
    type: String,
    required: true
  },
  razorpayPaymentId: {
    type: String,
    required: true
  },
  status: {
    type: String,
    default: 'completed'
  },
  donorName: {
     type: String,
     default: 'Anonymous'
  }
}, { timestamps: true });

const Donation = mongoose.model('Donation', donationSchema);
export default Donation;
