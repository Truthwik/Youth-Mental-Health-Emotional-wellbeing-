import Note from '../models/Note.js';
import { Youth } from '../models/User.js';
import jwt from 'jsonwebtoken';

const getUserId = (req) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return null;
  const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
  return decoded.id;
};

// ── AI Analysis via Gemini ─────────────────────────────────────────────────

async function analyzeNote(content, title) {
  const API_KEY = process.env.GEMINI_API_KEY;
  // Use gemini-2.5-flash for better JSON and safety handling
  const url = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

  const prompt = `You are a compassionate mental health AI. Analyze this personal journal entry.
Journal entry: "${title ? `Title: ${title}\n` : ''}${content}"

Respond ONLY with a JSON object matching this schema exactly:
{
  "mood": "<choose exactly one from: Happy, Sad, Anxious, Calm, Angry, Hopeful, Overwhelmed, Lonely, Confused, Grateful>",
  "moodScore": <number 1-10>,
  "moodEmoji": "<single emoji>",
  "categories": ["<1-3 category tags>"],
  "aiInsight": "<2-3 warm, empathetic sentences>",
  "suggestions": ["<3 coping suggestions>"],
  "recommendations": {
    "movies": [{"title": "movie", "reason": "reason"}],
    "books": [{"title": "book", "author": "author", "reason": "reason"}],
    "songs": [{"title": "song", "artist": "artist", "reason": "reason"}],
    "youtube": [{"title": "video", "channel": "channel", "reason": "reason"}],
    "podcasts": [{"title": "podcast", "reason": "reason"}]
  }
}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      safetySettings: [
        { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
        { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
        { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
        { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" }
      ]
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    if (response.status === 429) {
      console.warn('AI Quota Exceeded (429). Using fallback defaults.');
      return {
        mood: 'Calm',
        moodScore: 5,
        moodEmoji: '💭',
        categories: ['General'],
        aiInsight: "I'm processing a lot of thoughts right now! Let's take a deep breath together. Your words are safe here.",
        suggestions: ["Take 3 deep breaths", "Write one thing you're grateful for", "Listen to some calming music"],
        recommendations: { movies: [], books: [], songs: [], youtube: [], podcasts: [] }
      };
    }
    throw new Error(data.error?.message || "Google API Error");
  }

  const raw = data.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
  try {
    return JSON.parse(raw);
  } catch (err) {
    const cleaned = raw.replace(/```json|```/g, '').trim();
    return JSON.parse(cleaned);
  }
}

// ── CRUD Controllers ──────────────────────────────────────────────────────

export const createNote = async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ message: 'Not authorized' });

    const { title, content } = req.body;
    if (!content?.trim()) return res.status(400).json({ message: 'Note content is required' });

    // Save immediately, then analyze
    const note = await Note.create({ userId, title, content });

    // AI analysis (non-blocking response — update note after)
    analyzeNote(content, title)
      .then(async (analysis) => {
        await Note.findByIdAndUpdate(note._id, {
          mood: analysis.mood || 'Calm',
          moodScore: analysis.moodScore || 5,
          moodEmoji: analysis.moodEmoji || '💭',
          categories: analysis.categories || [],
          aiInsight: analysis.aiInsight || '',
          suggestions: analysis.suggestions || [],
          recommendations: analysis.recommendations || {},
          analysisComplete: true,
        });
      })
      .catch((err) => console.error('AI analysis failed:', err.message));

    res.status(201).json(note);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getNotes = async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ message: 'Not authorized' });

    const notes = await Note.find({ userId }).sort({ createdAt: -1 }).limit(50);
    res.json(notes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getNote = async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ message: 'Not authorized' });

    const note = await Note.findOne({ _id: req.params.id, userId });
    if (!note) return res.status(404).json({ message: 'Note not found' });
    res.json(note);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteNote = async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ message: 'Not authorized' });

    await Note.findOneAndDelete({ _id: req.params.id, userId });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const analyzeUserHistory = async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ message: 'Not authorized' });

    // Fetch recent notes
    const notes = await Note.find({ userId }).sort({ createdAt: -1 }).limit(15);
    // Fetch milestones
    const user = await Youth.findById(userId);

    if (!notes.length && (!user || !user.milestones || !user.milestones.length)) {
      return res.json({
         summary: "You haven't added any journal entries or completed milestones yet. Start tracking your journey to receive a wellbeing analysis!",
         consistency: "N/A",
         resilience: "N/A",
         mindfulness: "N/A",
         generatedAt: new Date()
      });
    }

    // Format data for AI
    const notesText = notes.map((n, i) => `Entry ${i+1} (Mood: ${n.mood}, Score: ${n.moodScore}/10):\n${n.content}\n`).join('\n');
    const milestonesText = user?.milestones?.map(m => `Milestone: ${m.id}, Completed: ${m.completed}, Data: ${JSON.stringify(m.data || {})}`).join('\n') || 'None yet';

    const prompt = `You are a compassionate mental health AI. Evaluate this user's overall wellbeing based on their recent journal entries and milestone progress.

Recent Journal Entries:
${notesText || 'None'}

Recent Milestones:
${milestonesText}

Based on this data, provide a structured holistic wellbeing report.
Follow this exact JSON structure (raw JSON only, no markdown, no code fences):
{
  "summary": "<2-3 sentence deeply empathetic overview of their recent mental state, acknowledging their struggles and growth. Talk directly to the user using 'You'>",
  "consistency": "<1-2 words like 'Excellent', 'Growing', 'Needs Focus'>",
  "resilience": "<1-2 words like 'Strong', 'Developing', 'Vulnerable'>",
  "mindfulness": "<1-2 words like 'High', 'Improving', 'Low'>"
}`;

    const API_KEY = process.env.GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        safetySettings: [
          { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
          { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
          { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
          { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" }
        ]
      }),
    });

    const data = await response.json();
    if (!response.ok) {
        if (response.status === 429) {
          return res.json({
            summary: "I'm experiencing high traffic right now, but I want you to know that your progress is being recorded. Please check back in a few minutes for a deep-dive analysis of your journey!",
            consistency: "Growing",
            resilience: "Developing",
            mindfulness: "Improving",
            generatedAt: new Date()
          });
        }
        throw new Error(data.error?.message || "Google API Error");
    }

    const raw = data.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
    let analysis = {};
    try {
        analysis = JSON.parse(raw);
    } catch (e) {
        const cleaned = raw.replace(/```json|```/g, '').trim();
        analysis = JSON.parse(cleaned);
    }
    
    analysis.generatedAt = new Date();
    
    res.json(analysis);
  } catch (err) {
    console.error('AI History Analysis failed:', err.message);
    res.status(500).json({ message: 'Failed to generate analysis' });
  }
};
