import mongoose from 'mongoose';

const projectReportSchema = new mongoose.Schema(
  {
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    title: { type: String, required: true },
    description: { type: String },
    reportPdf: { type: String },
    submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    submittedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

export default mongoose.model('ProjectReport', projectReportSchema);
