import express from 'express';
import Assessment from '../models/Assessment.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

// ── Auth helper ─────────────────────────────────────────────────────────────
const getUserId = (req) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    return decoded.id;
  } catch {
    return null;
  }
};

// ── Scoring Engine ──────────────────────────────────────────────────────────
const calculateSeverity = (type, score) => {
  if (type === 'GAD-7') {
    if (score <= 4)  return { label: 'None-Minimal', text: 'Anxiety levels are within a healthy range. Keep nurturing your calm.' };
    if (score <= 9)  return { label: 'Mild', text: 'Mild anxiety detected. Breathing exercises and journaling can help.' };
    if (score <= 14) return { label: 'Moderate', text: 'Moderate anxiety warrants attention. Consider speaking with a counselor.' };
    return           { label: 'Severe', text: 'Severe anxiety detected. We strongly recommend booking a therapist session.' };
  }
  if (type === 'PHQ-9') {
    if (score <= 4)  return { label: 'None-Minimal', text: 'Mood appears healthy. Continue your self-care routines.' };
    if (score <= 9)  return { label: 'Mild', text: 'Mild depressive symptoms. Daily movement and social connection can help.' };
    if (score <= 14) return { label: 'Moderate', text: 'Moderate depression likely. Please consider professional support.' };
    if (score <= 19) return { label: 'Moderately Severe', text: 'Significant depression detected. A therapist session is highly recommended.' };
    return           { label: 'Severe', text: 'Severe depression warrants urgent clinical support. Please reach out now.' };
  }
  if (type === 'RQ-10') {
    const max = 30; // 10 questions × 3
    const pct = (score / max) * 100;
    if (pct < 30)  return { label: 'Fragile', text: 'Your resilience is still forming. Small daily wins and peer support can rebuild it.' };
    if (pct < 55)  return { label: 'Developing', text: 'You are building resilience. Keep leaning on your support network.' };
    if (pct < 80)  return { label: 'Strong', text: 'You show strong resilience. You are equipped to face most challenges.' };
    return         { label: 'Champion', text: 'Exceptional resilience! You are a source of strength for those around you.' };
  }
  if (type === 'SCS-8') {
    const max = 40; // 8 questions × 5
    const pct = (score / max) * 100;
    if (pct < 30)  return { label: 'Isolated', text: 'You may be feeling deeply alone. Please know — connection is possible. Let us help.' };
    if (pct < 55)  return { label: 'At-Risk', text: 'Some disconnection is present. Joining a peer group or talking to a mentor can help.' };
    if (pct < 80)  return { label: 'Connected', text: 'You have a reasonable sense of belonging. Keep nurturing your relationships.' };
    return         { label: 'Thriving', text: 'You feel deeply connected and seen. This is a wonderful foundation for wellbeing.' };
  }
  return { label: 'Mild', text: 'Assessment completed.' };
};

// ── Gemini AI Insight Generator ─────────────────────────────────────────────
const generateAIInsight = async (type, score, severity, title) => {
  try {
    const API_KEY = process.env.GEMINI_API_KEY;
    if (!API_KEY) return '';

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;
    const prompt = `You are a compassionate wellbeing coach for youth on a mental health platform called Svasthya.

A young person just completed the "${title}" assessment (${type}).
Their score: ${score}
Their result band: ${severity}

Write a warm, personal, empathetic "Insight Letter" of exactly 3 sentences:
1. Acknowledge their result without judgment.
2. Offer one specific, actionable tip relevant to their score band.
3. End with an encouraging statement about their journey.

Keep it human, warm, and youth-friendly. No clinical jargon. Do not use bullet points.`;

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    });

    const data = await res.json();
    return data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';
  } catch {
    return '';
  }
};

// ── POST /api/assessments ────────────────────────────────────────────────────
router.post('/', async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ message: 'Unauthorized — please log in again.' });

    const { type, answers, title } = req.body;
    if (!type || !answers || !Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({ message: 'Invalid assessment data.' });
    }

    const totalScore = answers.reduce((sum, val) => sum + parseInt(val ?? 0), 0);
    const { label, text } = calculateSeverity(type, totalScore);

    // Generate AI insight asynchronously but include it in the response
    const aiInsight = await generateAIInsight(type, totalScore, label, title);

    const assessment = await Assessment.create({
      userId,
      type,
      title,
      answers,
      totalScore,
      severity: label,
      clinicalInterpretation: text,
      aiInsight
    });

    res.status(201).json(assessment);
  } catch (err) {
    console.error('[Assessment POST Error]', err.message);
    res.status(500).json({ message: err.message });
  }
});

// ── GET /api/assessments ─────────────────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const assessments = await Assessment.find({ userId }).sort({ timestamp: 1 });
    res.json(assessments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
