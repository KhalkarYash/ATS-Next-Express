const Resume = require("../models/Resume");

// Upload a resume (file upload)
const uploadResume = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "Please upload a resume" });
  }

  const resume = new Resume({ userId: req.user.id, file: req.file.path });
  await resume.save();
  res.status(201).json(resume);
};

// View a resume PDF
const viewResume = async (req, res) => {
  const resume = await Resume.findById(req.params.id);
  if (!resume) {
    return res.status(404).json({ message: "Resume not found" });
  }

  res.sendFile(resume.file);
};

module.exports = { uploadResume, viewResume };
