import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const baseOptions = {
  discriminatorKey: 'role',
  collection: 'users',
  timestamps: true,
};

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['youth', 'mentor', 'therapist', 'admin'], default: 'youth' },
  onboardingComplete: { type: Boolean, default: false },
}, baseOptions);

userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

// ── Youth ──────────────────────────────────────────────────────────────
const Youth = User.discriminator('youth', new mongoose.Schema({
  milestones: [{
    id: { type: String, required: true },
    completed: { type: Boolean, default: false },
    completedAt: { type: Date },
    data: { type: Object }
  }],
  xp: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  analysis: {
    result: { type: String },
    generatedAt: { type: Date }
  },
  // Categorization
  primaryCategory: { type: String, default: '' },
  communityTags: { type: [String], default: [] },
  isCrisisRisk: { type: Boolean, default: false },
  onboardingAnswers: { type: Object, default: {} },
}));

// ── Mentor ─────────────────────────────────────────────────────────────
const Mentor = User.discriminator('mentor', new mongoose.Schema({
  specialization: { type: String },
  primaryCategory: { type: String, default: '' },
  experienceCategory: { type: String, default: '' },
  supportAgeGroup: { type: String, default: '' },
  availabilityPerWeek: { type: String, default: '' },
  onboardingAnswers: { type: Object, default: {} },
  ratingAvg: { type: Number, default: 0 },
  ratingCount: { type: Number, default: 0 },
}));

// ── Therapist ──────────────────────────────────────────────────────────
const Therapist = User.discriminator('therapist', new mongoose.Schema({
  licenseNumber: { type: String, required: true },
  specialization: { type: String },
  clinicalSpecialization: { type: String, default: '' },
  yearsExperience: { type: String, default: '' },
  crisisCertified: { type: Boolean, default: false },
  sessionLanguages: { type: [String], default: [] },
  onboardingAnswers: { type: Object, default: {} },
  rating: { type: Number, default: 4.8 },
  ratingAvg: { type: Number, default: 0 },
  ratingCount: { type: Number, default: 0 },
  badges: { type: [String], default: ['Verified Professional'] },
  hourlyRate: { type: Number, default: 1000 },
  availableDays: { type: [String], default: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] }
}));

// ── Admin ──────────────────────────────────────────────────────────────
const Admin = User.discriminator('admin', new mongoose.Schema({}));

export { User, Youth, Mentor, Therapist, Admin };
