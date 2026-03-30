import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import milestoneRoutes from './routes/milestone.js';
import chatRoutes from './routes/chat.js';
import onboardingRoutes from './routes/onboarding.js';
import notesRoutes from './routes/notes.js';
import communityRoutes from './routes/community.js';
import bookingsRoutes from './routes/bookings.js';
import paymentRoutes from './routes/payment.js';

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

// Database Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.log('MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
