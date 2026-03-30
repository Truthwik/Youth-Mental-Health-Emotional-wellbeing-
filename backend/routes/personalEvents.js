import express from 'express';
import PersonalEvent from '../models/PersonalEvent.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

const getUserId = (req) => {
  const token = req.headers.authorization?.split(' ')[1];
  console.log(`[Diagnostic] Incoming Token: ${token ? token.substring(0, 10) + '...' : 'MISSING'}`);
  if (!token || token === 'undefined') return null;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    console.log(`[Diagnostic] Auth Success for ID: ${decoded.id}`);
    return decoded.id;
  } catch (err) {
    console.error(`[Diagnostic] Auth Failure: ${err.message}`);
    return null;
  }
};

router.get('/', async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ message: 'Not authorized' });

    const events = await PersonalEvent.find({ userId }).sort({ date: 1, timeSlot: 1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ message: 'Not authorized' });

    const { title, date, timeSlot, type, notes } = req.body;
    const event = await PersonalEvent.create({
      userId,
      title,
      date,
      timeSlot,
      type,
      notes
    });

    res.status(201).json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const userId = getUserId(req);
    const event = await PersonalEvent.findOneAndDelete({ _id: req.params.id, userId });
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json({ message: 'Event deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
