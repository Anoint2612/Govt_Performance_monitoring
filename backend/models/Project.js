const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  manager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Manager",
    required: true,
  },
  status: {
    type: String,
    enum: ["Not Started", "In Progress", "Completed", "Delayed"],
    default: "Not Started",
  },
  inspectionReport: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "InspectionReport",
  },
  employees: [{ type: mongoose.Schema.Types.ObjectId, ref: "Employee" }],
  alerts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Alert" }],
  targets: [{ name: String, dueDate: Date, completed: Boolean }],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Project", ProjectSchema);
