const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  updateUserProfile,
  deleteUserAccount,
} = require("../controllers/authController");
const auth = require("../middleware/auth");

// Register a new user
router.post("/register", registerUser);

// Login
router.post("/login", loginUser);

// Logout
router.post("/logout", auth, logoutUser);

// Get current user details
router.get("/me", auth, getCurrentUser);

// Update user profile
router.put("/users/:id", auth, updateUserProfile);

// Delete user account
router.delete("/users/:id", auth, deleteUserAccount);

module.exports = router;
