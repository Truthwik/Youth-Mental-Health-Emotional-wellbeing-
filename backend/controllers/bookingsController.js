import Appointment from '../models/Appointment.js';
import jwt from 'jsonwebtoken';

const getUserId = (req) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    return decoded.id;
  } catch (err) {
    return null;
  }
};

export const getBookings = async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ message: 'Not authorized' });

    // Since we don't have deeply protected role middleware right here, 
    // we'll fetch where the user is EITHER the client or the therapist.
    const appointments = await Appointment.find({
      $or: [{ userId }, { therapistId: userId }]
    })
      .populate('therapistId', 'name clinicalSpecialization')
      .populate('userId', 'name')
      .sort({ date: 1, timeSlot: 1 });

    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getAvailability = async (req, res) => {
  try {
    const { therapistId } = req.query;
    if (!therapistId) return res.status(400).json({ message: 'Therapist ID required' });

    const reserved = await Appointment.find({ therapistId }, 'date timeSlot');
    res.json(reserved);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createBooking = async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ message: 'Not authorized' });

    const { therapistId, date, timeSlot, amount, razorpayOrderId, razorpayPaymentId, isFree } = req.body;

    // Optional Check: verify slot isn't already taken
    const existing = await Appointment.findOne({ therapistId, date, timeSlot });
    if (existing) {
       return res.status(400).json({ message: 'Slot already booked' });
    }

    // Validation: if it's not a free session, we need payment details
    if (!isFree && (!razorpayPaymentId || !razorpayOrderId)) {
      return res.status(400).json({ message: 'Payment details required for paid sessions' });
    }

    const appointment = await Appointment.create({
      userId,
      therapistId,
      date,
      timeSlot,
      amount: isFree ? 0 : amount,
      razorpayOrderId: isFree ? 'FREE' : razorpayOrderId,
      razorpayPaymentId: isFree ? 'FREE' : razorpayPaymentId,
      isFree,
      status: 'Scheduled'
    });

    res.status(201).json(appointment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
