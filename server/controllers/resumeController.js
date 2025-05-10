const Resume = require("../models/Resume");
const { parseResume } = require("../utils/resumeParser");
const path = require("path");
const fs = require("fs").promises;

// Upload and parse resume
const uploadResume = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "Please upload a resume" });
        }

        const fileBuffer = await fs.readFile(req.file.path);
        const parsedData = await parseResume(fileBuffer);

        const resume = new Resume({
            filename: req.file.originalname,
            path: req.file.path,
            uploadedBy: req.user.id,
            parsedContent: {
                skills: parsedData.skills,
                education: parsedData.education,
                rawText: parsedData.rawText
            }
        });

        await resume.save();
        res.status(201).json(resume);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// View a resume
const viewResume = async (req, res) => {
    try {
        const resume = await Resume.findById(req.params.id);
        if (!resume) {
            return res.status(404).json({ message: "Resume not found" });
        }

        // Check permission
        if (resume.uploadedBy.toString() !== req.user.id && 
            req.user.role !== 'hr' && 
            req.user.role !== 'admin') {
            return res.status(403).json({ message: "Not authorized" });
        }

        res.sendFile(path.resolve(resume.path));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Search resumes by skills or content
const searchResumes = async (req, res) => {
    try {
        // Verify HR or Admin access
        if (req.user.role !== 'hr' && req.user.role !== 'admin') {
            return res.status(403).json({ message: "Not authorized" });
        }

        const { skills, keyword } = req.query;
        const query = {};

        if (skills) {
            query['parsedContent.skills'] = { 
                $in: skills.split(',').map(skill => skill.trim().toLowerCase()) 
            };
        }

        if (keyword) {
            query['parsedContent.rawText'] = { 
                $regex: keyword, 
                $options: 'i' 
            };
        }

        const resumes = await Resume.find(query)
            .populate('uploadedBy', 'name email')
            .select('-parsedContent.rawText');

        res.json(resumes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    uploadResume,
    viewResume,
    searchResumes
};
