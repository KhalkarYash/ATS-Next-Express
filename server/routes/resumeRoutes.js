const express = require("express");
const router = express.Router();
const { uploadResume, viewResume, searchResumes } = require("../controllers/resumeController");
const auth = require("../middleware/auth");
const multer = require("multer");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});

const upload = multer({ 
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Only PDF files are allowed'));
        }
    },
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

// Upload a resume
router.post("/", auth, upload.single("resume"), uploadResume);

// Search resumes (HR/Admin only)
router.get("/search", auth, searchResumes);

// View a resume
router.get("/:id", auth, viewResume);

module.exports = router;
