
import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema(
  {
    employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    heading: { type: String, required: true },
    details: { type: String },
    createdAt: { type: Date, default: Date.now },
    status: { type: String, enum: ['Resolved', 'Escalated'], default: 'Escalated' },
    escalatedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    resolutionNotes: { type: String }
  },
  { timestamps: true }
);

ticketSchema.index({ managerId: 1, status: 1 });
ticketSchema.index({ employeeId: 1 });

export default mongoose.model('Ticket', ticketSchema);

