import express from 'express';
import Rating from '../models/Rating.js';
import { User, Mentor, Therapist } from '../models/User.js';
import Assessment from '../models/Assessment.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

const getUserId = (req) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return null;
  try {
    return jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret').id;
  } catch { return null; }
};

// ── POST /api/ratings ─────────────────────────────────────────────────────
// Youth submits a rating for a mentor or therapist
router.post('/', async (req, res) => {
  try {
    const fromUserId = getUserId(req);
    if (!fromUserId) return res.status(401).json({ message: 'Unauthorized' });

    const { toUserId, role, stars, comment, sessionId } = req.body;
    if (!toUserId || !role || !stars) {
      return res.status(400).json({ message: 'toUserId, role, and stars are required.' });
    }

    // Upsert: one rating per (from, to, session) combo
    const rating = await Rating.findOneAndUpdate(
      { fromUserId, toUserId, sessionId: sessionId || null },
      { fromUserId, toUserId, role, stars, comment: comment?.trim() || '' },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    // Recompute average on the target user's document
    const allRatings = await Rating.find({ toUserId });
    const avg = allRatings.reduce((s, r) => s + r.stars, 0) / allRatings.length;
    const rounded = Math.round(avg * 10) / 10;

    if (role === 'mentor') {
      await Mentor.findByIdAndUpdate(toUserId, { ratingAvg: rounded, ratingCount: allRatings.length });
    } else {
      await Therapist.findByIdAndUpdate(toUserId, { ratingAvg: rounded, ratingCount: allRatings.length });
    }

    res.status(201).json({ rating, newAvg: rounded, count: allRatings.length });
  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ message: 'You have already rated this session.' });
    res.status(500).json({ message: err.message });
  }
});

// ── GET /api/ratings/:userId ──────────────────────────────────────────────
// Get all reviews + computed average for a mentor/therapist profile
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const ratings = await Rating.find({ toUserId: userId })
      .populate('fromUserId', 'name role')
      .sort({ createdAt: -1 })
      .limit(20);

    const avg = ratings.length
      ? Math.round((ratings.reduce((s, r) => s + r.stars, 0) / ratings.length) * 10) / 10
      : 0;

    const dist = [5, 4, 3, 2, 1].map(star => ({
      star,
      count: ratings.filter(r => r.stars === star).length,
    }));

    res.json({ ratings, avg, count: ratings.length, distribution: dist });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── GET /api/ratings/mentees/progress ────────────────────────────────────
// Phase 4: Mentor sees aggregated wellness data for their mentees
router.get('/mentees/progress', async (req, res) => {
  try {
    const mentorId = getUserId(req);
    if (!mentorId) return res.status(401).json({ message: 'Unauthorized' });

    // Find all youth who have ever booked with this mentor
    const { default: Appointment } = await import('../models/Appointment.js');
    const bookings = await Appointment.find({ therapistId: mentorId })
      .populate('userId', 'name email isCrisisRisk primaryCategory milestones xp level')
      .lean();

    // Deduplicate by userId
    const seen = new Set();
    const mentees = bookings
      .filter(b => b.userId && !seen.has(String(b.userId._id)) && seen.add(String(b.userId._id)))
      .map(b => b.userId);

    // For each mentee, fetch their latest assessment + note mood
    const enriched = await Promise.all(mentees.map(async (m) => {
      const latestAssessment = await Assessment.findOne({ userId: m._id })
        .sort({ timestamp: -1 }).lean();

      const milestoneCount = m.milestones?.length || 0;
      const completedMilestones = m.milestones?.filter(ms => ms.completed).length || 0;

      return {
        _id: m._id,
        name: m.name,
        email: m.email,
        isCrisisRisk: m.isCrisisRisk || false,
        primaryCategory: m.primaryCategory || 'general_wellness',
        xp: m.xp || 0,
        level: m.level || 1,
        milestoneCount,
        completedMilestones,
        milestonePercent: milestoneCount ? Math.round((completedMilestones / milestoneCount) * 100) : 0,
        latestAssessment: latestAssessment ? {
          type: latestAssessment.type,
          score: latestAssessment.totalScore,
          severity: latestAssessment.severity,
          date: latestAssessment.timestamp,
        } : null,
      };
    }));

    res.json(enriched);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
