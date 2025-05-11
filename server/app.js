const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path");
const connectDB = require("./config/db");
const {
  createAccountLimiter,
  loginLimiter,
  apiLimiter,
  helmetConfig,
} = require("./config/security");
const { errorHandler } = require("./middleware/errorHandler");

dotenv.config();

const app = express();

// Security Middleware
app.use(helmet(helmetConfig));
app.use(morgan("dev"));

// CORS configuration
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

// Body parser
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Static folder for resume uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Rate limiting
app.use("/api/", apiLimiter);
app.use("/api/auth/register", createAccountLimiter);
app.use("/api/auth/login", loginLimiter);

// Connect to DB
connectDB();

// Debug log for incoming requests
app.use((req, res, next) => {
  console.log("Route hit:", req.method, req.originalUrl);
  next();
});

// Routes
const authRoutes = require("./routes/authRoutes");
const jobRoutes = require("./routes/jobRoutes");
const resumeRoutes = require("./routes/resumeRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const adminRoutes = require("./routes/adminRoutes");
const pipelineRoutes = require("./routes/pipelineRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/resumes", resumeRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/pipeline", pipelineRoutes);

// Base route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to ATS API" });
});

// Error handling middleware
app.use(errorHandler);

// Handle unhandled routes
app.use((req, res, next) => {
  if (!req.route) {
    // Ensures it only catches undefined routes
    return res.status(404).json({
      status: "error",
      message: `Can't find ${req.originalUrl} on this server!`,
    });
  }
  next();
});

// Global error handling
process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  process.exit(1);
});

process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  process.exit(1);
});

module.exports = app;
