import { User, Youth, Mentor, Therapist, Admin } from '../models/User.js';
import jwt from 'jsonwebtoken';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '30d' });
};

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, licenseNumber, specialization, adminCode } = req.body;

    // Reject therapist if licenseNumber is missing
    if (role === 'therapist' && !licenseNumber) {
      return res.status(400).json({ message: 'License number is required for therapists' });
    }

    // Verify admin code
    if (role === 'admin') {
      if (adminCode !== process.env.ADMIN_SECRET) {
        return res.status(403).json({ message: 'Invalid admin code' });
      }
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    let user;
    
    // Create using specific discriminator
    switch (role) {
      case 'mentor':
        user = await Mentor.create({ name, email, password, specialization });
        break;
      case 'therapist':
        user = await Therapist.create({ name, email, password, licenseNumber, specialization });
        break;
      case 'admin':
        user = await Admin.create({ name, email, password });
        break;
      case 'youth':
      default:
        user = await Youth.create({ name, email, password });
        break;
    }

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role, // Mongoose assigns discriminatorKey automatically
        token: generateToken(user._id)
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Secure, single DB lookup across ALL collections
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role, // Exposes youth/therapist status securely to Login page
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
