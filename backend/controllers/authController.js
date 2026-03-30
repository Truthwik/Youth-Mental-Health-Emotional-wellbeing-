import { User, Youth, Mentor, Therapist, Admin } from '../models/User.js';
import jwt from 'jsonwebtoken';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '30d' });
};

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, adminCode, licenseNumber, specialization } = req.body;
    const role = req.body.role ? req.body.role.toLowerCase().trim() : 'youth';

    console.log(`[Registration] Name: ${name}, Role: ${role}`);

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

    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMe = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1] || req.body.token || req.query.token;
    if (!token) return res.status(401).json({ message: 'Not authorized' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    const user = await User.findById(decoded.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user);
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Invalid or expired token. Please log in again.' });
    }
    res.status(500).json({ message: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token || token === 'undefined') return res.status(401).json({ message: 'Not authorized' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    const user = await User.findById(decoded.id);

    if (!user) return res.status(404).json({ message: 'User not found' });

    const { name, specialization, clinicalSpecialization, bio, hourlyRate, availableDays } = req.body;

    if (name) user.name = name;
    
    // Role-specific updates
    if (user.role === 'mentor' || user.role === 'therapist') {
      if (specialization) user.specialization = specialization;
    }
    
    if (user.role === 'therapist') {
      if (clinicalSpecialization) user.clinicalSpecialization = clinicalSpecialization;
      if (hourlyRate) user.hourlyRate = hourlyRate;
      if (availableDays) user.availableDays = availableDays;
    }

    const updatedUser = await user.save();
    res.json(updatedUser);
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Invalid session. Please log in again.' });
    }
    res.status(500).json({ message: error.message });
  }
};
