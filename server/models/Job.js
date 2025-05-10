const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    company: { type: String, required: true },
    employmentType: {
      type: String,
      enum: ['full-time', 'part-time', 'contract', 'internship'],
      required: true
    },
    experience: {
      min: { type: Number },
      max: { type: Number }
    },
    salaryRange: {
      min: { type: Number },
      max: { type: Number },
      currency: { type: String, default: 'USD' }
    },
    skills: [String],
    status: {
      type: String,
      enum: ['draft', 'published', 'closed'],
      default: 'published'
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    applicationDeadline: Date,
    department: String,
    remote: {
      type: Boolean,
      default: false
    }
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Create indexes for search
jobSchema.index({ 
  title: 'text', 
  description: 'text', 
  skills: 'text',
  location: 'text',
  company: 'text'
});

// Virtual for applications count
jobSchema.virtual('applicationsCount', {
  ref: 'Application',
  localField: '_id',
  foreignField: 'job',
  count: true
});

module.exports = mongoose.model("Job", jobSchema);
