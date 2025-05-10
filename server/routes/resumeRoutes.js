const express = require("express");
const router = express.Router();
const { uploadResume, viewResume } = require("../controllers/resumeController");
const auth = require("../middleware/auth");
const multer = require("multer");

const upload = multer({ dest: "uploads/" });

// Upload a resume
router.post("/", auth, upload.single("resume"), uploadResume);

// View a resume
router.get("/:id", auth, viewResume);

module.exports = router;
