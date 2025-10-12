import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    projectId: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    details: { type: String },
    totalBudget: { type: Number, required: true },
    spentBudget: { type: Number, default: 0 },
    deadline: { type: Date, required: true },
    managerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['Ongoing', 'Completed', 'Delayed'], default: 'Ongoing' },
    reports: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ProjectReport' }]
  },
  { timestamps: true }
);

export default mongoose.model('Project', projectSchema);
