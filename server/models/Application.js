const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    resume: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resume",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "shortlisted", "interview", "rejected", "selected"],
      default: "pending",
    },
    rating: Number,
    comments: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Application", applicationSchema);
