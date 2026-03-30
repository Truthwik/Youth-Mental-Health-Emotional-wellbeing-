import express from 'express';
import { User, Youth, Mentor, Therapist } from '../models/User.js';
import Appointment from '../models/Appointment.js';
import Donation from '../models/Donation.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Middleware to protect admin routes
const isAdmin = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    const user = await User.findById(decoded.id);
    if (user && user.role === 'admin') {
      req.user = user;
      next();
    } else {
      res.status(403).json({ message: 'Admin access required' });
    }
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

router.get('/stats', isAdmin, async (req, res) => {
  try {
    const totalYouth = await User.countDocuments({ role: 'youth' });
    const totalMentors = await User.countDocuments({ role: 'mentor' });
    const totalTherapists = await User.countDocuments({ role: 'therapist' });
    
    const appointments = await Appointment.find();
    const donations = await Donation.find();
    
    const sessionRevenue = appointments.reduce((sum, a) => sum + (a.amount || 0), 0);
    const donationRevenue = donations.reduce((sum, d) => sum + (d.amount || 0), 0);
    const totalRevenue = sessionRevenue + donationRevenue;
    
    console.log(`Revenue Aggregation [Sessions: ₹${sessionRevenue}] [Donations: ₹${donationRevenue}] [Total: ₹${totalRevenue}]`);

    res.json({
      totalYouth,
      totalMentors,
      totalTherapists,
      paidSessions: appointments.filter(a => !a.isFree).length,
      freeSessions: appointments.filter(a => a.isFree).length,
      sessionRevenue,
      donationRevenue,
      totalRevenue
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/users', isAdmin, async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/sessions', isAdmin, async (req, res) => {
  try {
    const sessions = await Appointment.find()
      .populate('userId', 'name email')
      .populate('therapistId', 'name email')
      .sort({ createdAt: -1 });
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
