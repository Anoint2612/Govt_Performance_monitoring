const mongoose = require("mongoose");

const AlertSchema = new mongoose.Schema({
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: true,
  },
  type: { type: String, enum: ["Delay", "Missed Target"], required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  resolved: { type: Boolean, default: false },
});

module.exports = mongoose.model("Alert", AlertSchema);
