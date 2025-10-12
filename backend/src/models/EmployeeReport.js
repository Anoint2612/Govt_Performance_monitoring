
import mongoose from 'mongoose';

const employeeReportSchema = new mongoose.Schema(
  {
    employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    score: { type: Number, required: true },
    comments: { type: String }
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

export default mongoose.model('EmployeeReport', employeeReportSchema);

