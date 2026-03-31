import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

// CRITICAL DEBUG LISTENERS
process.on('uncaughtException', (err) => {
  console.error('SERVER CRASH [Uncaught Exception]:', err.stack);
  process.exit(1);
});
process.on('unhandledRejection', (reason, promise) => {
  console.error('SERVER CRASH [Unhandled Rejection]:', reason);
  process.exit(1);
});

import authRoutes from './routes/auth.js';
import milestoneRoutes from './routes/milestone.js';
import chatRoutes from './routes/chat.js';
import onboardingRoutes from './routes/onboarding.js';
import notesRoutes from './routes/notes.js';
import communityRoutes from './routes/community.js';
import bookingsRoutes from './routes/bookings.js';
import paymentRoutes from './routes/payment.js';
import adminRoutes from './routes/admin.js';
import donationRoutes from './routes/donations.js';
import personalEventRoutes from './routes/personalEvents.js';
import assessmentRoutes from './routes/assessments.js';
import ratingsRoutes from './routes/ratings.js';

const app = express();

// Middleware
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173' }));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/milestones', milestoneRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/onboarding', onboardingRoutes);
app.use('/api/notes', notesRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/bookings', bookingsRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/personal-events', personalEventRoutes);
app.use('/api/assessments', assessmentRoutes);
app.use('/api/ratings', ratingsRoutes);

// Serve frontend static files in production
if (process.env.NODE_ENV === 'production') {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  app.use(express.static(path.join(__dirname, '../dist')));
  app.use((req, res, next) => {
    if (req.method === 'GET' && !req.path.startsWith('/api')) {
      return res.sendFile(path.join(__dirname, '../dist/index.html'));
    }
    next();
  });
}

// Database Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('MongoDB connected successfully');
    const PORT = process.env.PORT || 5050;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
