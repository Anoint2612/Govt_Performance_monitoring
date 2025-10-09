import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['HQAdmin', 'Manager', 'Employee'], required: true },
    dept: { type: String },
    level: { type: String },
    age: { type: Number },
    managerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    hqAdminId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
);

userSchema.index({ email: 1 }, { unique: true });

export default mongoose.model('User', userSchema);
