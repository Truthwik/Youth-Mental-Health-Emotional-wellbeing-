import mongoose from 'mongoose';

const groupSchema = new mongoose.Schema({
  name: { type: String, required: true },
  topic: { type: String, required: true, unique: true }, // e.g. "Anxiety"
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

export default mongoose.model('Group', groupSchema);
