const express = require("express");
const router = express.Router();
const {
  getCurrentUser,
  updateUserProfile,
  deleteUserAccount,
} = require("../controllers/authController");
const auth = require("../middleware/auth");

// Get current user details
router.get("/me", auth, getCurrentUser);

// Update user profile
router.put("/:id", auth, updateUserProfile);

// Delete user account
router.delete("/:id", auth, deleteUserAccount);

module.exports = router;
