const express = require("express");
const router = express.Router();
const Project = require("../models/Project");
const Manager = require("../models/Manager");
const Alert = require("../models/Alert");
const Ticket = require("../models/Ticket");

router.get("/", async (req, res) => {
  try {
    const projects = await Project.find()
      .populate("manager", "name")
      .populate("alerts")
      .populate("tickets");
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
