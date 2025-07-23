const express = require("express");
const router = express.Router();
const {
    getAdminOverview,
    getAllUsers,
    getApplicants,
    getUserActivityLogs,
    searchDashboard,
    getDashboardAnalytics
} = require("../controllers/adminController");
const auth = require("../middleware/auth");
const adminAuth = require("../middleware/adminAuth");
const { cacheMiddleware } = require("../utils/cache");

// Admin overview (stats) - cached for 5 minutes
router.get("/overview", [auth, adminAuth, cacheMiddleware(300)], getAdminOverview);

// Get all users (Admin)
router.get("/users", [auth, adminAuth], getAllUsers);

// Get all applicants (Admin)
router.get("/applicants", [auth, adminAuth], getApplicants);

// Dashboard search functionality
router.get("/search", [auth, adminAuth], searchDashboard);

// Get analytics data - cached for 15 minutes
router.get("/analytics", [auth, adminAuth, cacheMiddleware(900)], getDashboardAnalytics);

// Get user activity logs (must come after other GET routes)
router.get("/users/:userId/activity", [auth, adminAuth], getUserActivityLogs);

module.exports = router;
