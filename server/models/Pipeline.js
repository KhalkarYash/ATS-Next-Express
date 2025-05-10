const mongoose = require("mongoose");

const pipelineSchema = new mongoose.Schema({
  application: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Application",
    required: true,
  },
  updates: [
    {
      status: String,
      note: String,
      timestamp: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

module.exports = mongoose.model("Pipeline", pipelineSchema);
