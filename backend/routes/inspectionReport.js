const express = require("express");
const router = express.Router();
const InspectionReport = require("../models/InspectionReport");

router.get("/:projectId", async (req, res) => {
  try {
    const report = await InspectionReport.findOne({
      project: req.params.projectId,
    });
    res.json(report);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
