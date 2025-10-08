const express = require("express");
const router = express.Router();
const Manager = require("../models/Manager");

router.post("/", async (req, res) => {
  try {
    const manager = new Manager(req.body);
    await manager.save();
    res.json(manager);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
