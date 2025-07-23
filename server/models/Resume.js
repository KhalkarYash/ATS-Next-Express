const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema(
  {
    filename: { type: String, required: true },
    path: { type: String, required: true },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    parsedContent: {
      skills: [String],
      education: [String],
      rawText: String
    }
  },
  { timestamps: true }
);

// Create text index for search
resumeSchema.index({ 'parsedContent.rawText': 'text', 'parsedContent.skills': 'text' });

module.exports = mongoose.model("Resume", resumeSchema);
