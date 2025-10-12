import mongoose from 'mongoose';

const assignmentSchema = new mongoose.Schema(
  {
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    taskHeading: { type: String, required: true },
    taskDetails: { type: String },
    startTime: { type: Date, default: Date.now },
    endTime: { type: Date, required: true },
    status: { type: String, enum: ['Pending', 'Completed', 'Delayed'], default: 'Pending' },
    assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
  },
  { timestamps: true }
);

// record employee updates on an assignment
assignmentSchema.add({
  updates: [
    {
      by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      text: { type: String },
      createdAt: { type: Date, default: Date.now }
    }
  ]
});

assignmentSchema.index({ assignedTo: 1, status: 1 });

export default mongoose.model('Assignment', assignmentSchema);
