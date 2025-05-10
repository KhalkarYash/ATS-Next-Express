const express = require("express");
const router = express.Router();
const {
  applyForJob,
  getApplications,
  getMyApplications,
  getApplicationDetails,
  updateApplicationStatus,
  deleteApplication,
} = require("../controllers/applicationController");
const auth = require("../middleware/auth");

// Apply for a job
router.post("/", auth, applyForJob);

// Get all applications (Admin/HR)
router.get("/", auth, getApplications);

// Get logged-in user's applications
router.get("/my-applications", auth, getMyApplications);

// Get details of a specific application
router.get("/:id", auth, getApplicationDetails);

// Update application status (HR/Admin)
router.put("/:id", auth, updateApplicationStatus);

// Withdraw/Delete application
router.delete("/:id", auth, deleteApplication);

module.exports = router;
