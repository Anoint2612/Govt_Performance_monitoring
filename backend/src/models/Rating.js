import mongoose from 'mongoose';

const ratingSchema = new mongoose.Schema(
  {
    employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    managerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    score: { type: Number, required: true, min: 1, max: 5 },
    notes: { type: String }
  },
  { timestamps: true }
);

export default mongoose.model('Rating', ratingSchema);
