import mongoose from 'mongoose';

const assignmentSchema = new mongoose.Schema(
  {
    taskHeading: { type: String, required: true },
    taskDetails: { type: String },
    startTime: { type: Date },
    endTime: { type: Date },
    status: { type: String, enum: ['Pending', 'Completed', 'Delayed'], default: 'Pending' },
    assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
  },
  { timestamps: true }
);

assignmentSchema.index({ assignedTo: 1, status: 1 });

export default mongoose.model('Assignment', assignmentSchema);
