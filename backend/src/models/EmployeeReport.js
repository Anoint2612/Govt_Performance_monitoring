
import mongoose from 'mongoose';

const employeeReportSchema = new mongoose.Schema(
  {
    empId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    managerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    score: { type: Number, required: true },
    comments: { type: String }
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export default mongoose.model('EmployeeReport', employeeReportSchema);

