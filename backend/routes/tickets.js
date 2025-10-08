const express = require("express");
const router = express.Router();
const Ticket = require("../models/Ticket");

router.post("/resolve/:ticketId", async (req, res) => {
  try {
    const ticket = await Ticket.findByIdAndUpdate(
      req.params.ticketId,
      { status: "Resolved" },
      { new: true }
    );
    res.json(ticket);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
