const Application = require("../models/Application");
const Job = require("../models/Job");
const User = require("../models/User");

// @desc    Apply for a job
// @route   POST /api/applications
// @access  Private
const applyForJob = async (req, res) => {
  try {
    const { jobId, resumeId } = req.body;

    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: "Job not found" });

    const existingApplication = await Application.findOne({
      job: jobId,
      applicant: req.user.id,
    });

    if (existingApplication)
      return res.status(400).json({ message: "Already applied to this job" });

    const application = new Application({
      job: jobId,
      applicant: req.user.id,
      resume: resumeId,
    });

    await application.save();
    res.status(201).json(application);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get all applications (Admin/HR)
// @route   GET /api/applications
// @access  Private
const getApplications = async (req, res) => {
  try {
    const applications = await Application.find()
      .populate("applicant", "name email")
      .populate("job", "title company");
    res.status(200).json(applications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get applications of logged-in user
// @route   GET /api/applications/my-applications
// @access  Private
const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({
      applicant: req.user.id,
    }).populate("job");
    res.status(200).json(applications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get specific application details
// @route   GET /api/applications/:id
// @access  Private
const getApplicationDetails = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate("job")
      .populate("applicant", "name email");

    if (!application)
      return res.status(404).json({ message: "Application not found" });

    // Allow only applicant or admin to view
    if (
      application.applicant._id.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to view this application" });
    }

    res.status(200).json(application);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Update application (HR/admin only)
// @route   PUT /api/applications/:id
// @access  Private
const updateApplicationStatus = async (req, res) => {
  try {
    const { status, rating, comments } = req.body;
    const application = await Application.findById(req.params.id);

    if (!application)
      return res.status(404).json({ message: "Application not found" });

    application.status = status || application.status;
    application.rating = rating || application.rating;
    application.comments = comments || application.comments;

    await application.save();
    res.status(200).json(application);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Delete application (applicant only)
// @route   DELETE /api/applications/:id
// @access  Private
const deleteApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);
    if (!application)
      return res.status(404).json({ message: "Application not found" });

    // Only applicant can delete their application
    if (application.applicant.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this application" });
    }

    await application.deleteOne();
    res.status(200).json({ message: "Application deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  applyForJob,
  getApplications,
  getMyApplications,
  getApplicationDetails,
  updateApplicationStatus,
  deleteApplication,
};
