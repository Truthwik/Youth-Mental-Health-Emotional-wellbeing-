import express from 'express';
import Donation from '../models/Donation.js';
import { User } from '../models/User.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.post('/record', async (req, res) => {
  try {
    const { amount, razorpayOrderId, razorpayPaymentId, donorName } = req.body;
    
    // Check for optional user token
    let userId = null;
    const authHeader = req.headers.authorization;
    if (authHeader) {
      try {
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
        userId = decoded.id;
      } catch (err) {
        // Log but continue as anonymous
        console.error('Invalid donation token:', err.message);
      }
    }

    console.log(`Donation Record Attempt: ₹${amount} - ${donorName}`);

    const donation = new Donation({
      userId,
      amount,
      razorpayOrderId,
      razorpayPaymentId,
      donorName: donorName || 'Anonymous',
      status: 'completed'
    });

    await donation.save();
    res.status(201).json({ success: true, donation });
  } catch (err) {
    console.error('Donation record error:', err);
    res.status(500).json({ message: err.message });
  }
});

export default router;
