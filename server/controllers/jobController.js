const Job = require("../models/Job");

// Create a new job post
const createJobPost = async (req, res) => {
  const { title, description, company, location } = req.body;
  const job = new Job({ title, description, company, location });
  await job.save();
  res.status(201).json(job);
};

// Get all jobs (with filters)
const getJobs = async (req, res) => {
  const { title, location, company } = req.query;
  const filters = {};

  if (title) filters.title = { $regex: title, $options: "i" };
  if (location) filters.location = { $regex: location, $options: "i" };
  if (company) filters.company = { $regex: company, $options: "i" };

  const jobs = await Job.find(filters);
  res.json(jobs);
};

// Get job details by ID
const getJobDetails = async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) {
    return res.status(404).json({ message: "Job not found" });
  }
  res.json(job);
};

// Edit a job post
const editJobPost = async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) {
    return res.status(404).json({ message: "Job not found" });
  }

  job.title = req.body.title || job.title;
  job.description = req.body.description || job.description;
  job.company = req.body.company || job.company;
  job.location = req.body.location || job.location;

  await job.save();
  res.json(job);
};

// Delete a job post
const deleteJobPost = async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) {
    return res.status(404).json({ message: "Job not found" });
  }

  await job.remove();
  res.json({ message: "Job deleted successfully" });
};

module.exports = {
  createJobPost,
  getJobs,
  getJobDetails,
  editJobPost,
  deleteJobPost,
};
