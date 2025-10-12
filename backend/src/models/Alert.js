import mongoose from 'mongoose';

const alertSchema = new mongoose.Schema(
  {
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    type: { type: String, enum: ['Delay', 'Performance', 'TicketEscalation'], required: true },
    message: { type: String, required: true },
    seenBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export default mongoose.model('Alert', alertSchema);
