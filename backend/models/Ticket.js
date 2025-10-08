const mongoose = require("mongoose");

const TicketSchema = new mongoose.Schema({
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: true,
  },
  description: { type: String, required: true },
  status: { type: String, enum: ["Open", "Resolved"], default: "Open" },
  createdAt: { type: Date, default: Date.now },
  resolvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "HQAdmin" },
});

module.exports = mongoose.model("Ticket", TicketSchema);
