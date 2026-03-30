import express from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import 'dotenv/config';

const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_mock_id',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'rzp_test_mock_secret',
});

// Get Public Key ID
router.get('/key', (req, res) => {
  res.json({ key: process.env.RAZORPAY_KEY_ID || 'rzp_test_mock_id' });
});

// Create Order
router.post('/order', async (req, res) => {
  try {
    const { amount, currency = 'INR', receipt = 'receipt_123' } = req.body;

    const options = {
      amount: amount * 100, // Amount in paise
      currency,
      receipt,
    };

    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    console.error('Razorpay Order Error:', error);
    res.status(500).json({ message: 'Failed to create order' });
  }
});

// Verify Payment
router.post('/verify', async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || 'rzp_test_mock_secret')
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      return res.json({ success: true, message: "Payment verified successfully" });
    } else {
      return res.status(400).json({ success: false, message: "Invalid signature sent!" });
    }
  } catch (error) {
    console.error('Razorpay Verify Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

export default router;
