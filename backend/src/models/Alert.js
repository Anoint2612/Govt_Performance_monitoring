import mongoose from 'mongoose';

const alertSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ['Delay', 'Performance', 'TicketEscalation'], required: true },
    message: { type: String, required: true },
    relatedId: { type: mongoose.Schema.Types.ObjectId },
    seenBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export default mongoose.model('Alert', alertSchema);
