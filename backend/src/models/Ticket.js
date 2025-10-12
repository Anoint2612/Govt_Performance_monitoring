
import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema(
  {
    employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    heading: { type: String, required: true },
    details: { type: String },
    startTime: { type: Date },
    endTime: { type: Date },
    status: { type: String, enum: ['Open', 'Resolved', 'Escalated'], default: 'Open' },
    escalatedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    resolutionNotes: { type: String }
  },
  { timestamps: true }
);

ticketSchema.index({ managerId: 1, status: 1 });
ticketSchema.index({ employeeId: 1 });

export default mongoose.model('Ticket', ticketSchema);

