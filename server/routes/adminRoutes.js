const express = require("express");
const router = express.Router();
const {
  getAdminOverview,
  getAllUsers,
  getApplicants,
} = require("../controllers/adminController");
const auth = require("../middleware/auth");

// Admin overview (stats)
router.get("/overview", auth, getAdminOverview);

// Get all users (Admin)
router.get("/users", auth, getAllUsers);

// Get all applicants (Admin)
router.get("/applicants", auth, getApplicants);

module.exports = router;
