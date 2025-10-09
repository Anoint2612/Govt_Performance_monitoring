import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    details: { type: String },
    budget: { type: Number },
    deadline: { type: Date },
    managerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['Ongoing', 'Completed', 'Delayed'], default: 'Ongoing' },
    reports: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ProjectReport' }]
  },
  { timestamps: true }
);

export default mongoose.model('Project', projectSchema);
