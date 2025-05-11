const express = require("express");
const router = express.Router();
const {
  createJobPost,
  getJobs,
  getJobDetails,
  editJobPost,
  deleteJobPost,
  getJobStats
} = require("../controllers/jobController");
const auth = require("../middleware/auth");

// Create a new job post (Admin only)
router.post("/", auth, createJobPost);

// Get all jobs with filters
router.get("/", getJobs);

// Get job statistics (Admin only)
router.get("/stats", auth, getJobStats);

// Get job details by ID (must come after other GET routes)
router.get("/:id", getJobDetails);

// Edit a job post (Admin only)
router.put("/:id", auth, editJobPost);

// Delete a job post (Admin only)
router.delete("/:id", auth, deleteJobPost);

module.exports = router;
