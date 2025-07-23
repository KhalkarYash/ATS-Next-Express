const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  getPipelineHistory,
  updatePipelineStatus,
  getPipelineStats,
} = require("../controllers/pipelineController");

// Get pipeline statistics (for admin dashboard)
router.get("/stats", auth, getPipelineStats);

// Get pipeline history for an application
router.get("/:appId", auth, getPipelineHistory);

// Update application status in pipeline
router.post("/:appId/update", auth, updatePipelineStatus);

module.exports = router;
