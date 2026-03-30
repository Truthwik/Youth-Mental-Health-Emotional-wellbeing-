import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const baseOptions = {
  discriminatorKey: 'role', // what determines the schema shape
  collection: 'users', // they all physically live in the "users" collection
  timestamps: true,
};

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
}, baseOptions);

// Hash password before saving
userSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Base Model
const User = mongoose.model('User', userSchema);

// Discriminators
const Youth = User.discriminator('youth', new mongoose.Schema({
  milestones: [{
    id: { type: String, required: true },
    completed: { type: Boolean, default: false },
    completedAt: { type: Date },
    data: { type: Object } // feedback or metrics from activity
  }],
  analysis: {
    result: { type: String },
    generatedAt: { type: Date }
  }
}));

const Mentor = User.discriminator('mentor', new mongoose.Schema({
  specialization: { type: String }
}));

const Therapist = User.discriminator('therapist', new mongoose.Schema({
  licenseNumber: { type: String, required: true },
  specialization: { type: String }
}));

const Admin = User.discriminator('admin', new mongoose.Schema({}));

export { User, Youth, Mentor, Therapist, Admin };
