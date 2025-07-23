const Job = require("../models/Job");

// Create a new job post
const createJobPost = async (req, res) => {
    try {
        // Verify HR or Admin access
        if (req.user.role !== 'hr' && req.user.role !== 'admin') {
            return res.status(403).json({ message: "Not authorized" });
        }

        const job = new Job({
            ...req.body,
            postedBy: req.user.id
        });

        await job.save();
        res.status(201).json(job);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all jobs with advanced filters
const getJobs = async (req, res) => {
    try {
        const {
            search,
            location,
            employmentType,
            remote,
            minSalary,
            maxSalary,
            skills,
            page = 1,
            limit = 10,
            sortBy = 'createdAt',
            sortOrder = -1
        } = req.query;

        const query = { status: 'published' };
        const sort = {};
        sort[sortBy] = sortOrder;

        // Text search across multiple fields
        if (search) {
            query.$text = { $search: search };
        }

        // Location filter
        if (location) {
            query.location = { $regex: location, $options: 'i' };
        }

        // Employment type filter
        if (employmentType) {
            query.employmentType = employmentType;
        }

        // Remote work filter
        if (remote) {
            query.remote = remote === 'true';
        }

        // Salary range filter
        if (minSalary || maxSalary) {
            query.salaryRange = {};
            if (minSalary) query.salaryRange.min = { $gte: parseInt(minSalary) };
            if (maxSalary) query.salaryRange.max = { $lte: parseInt(maxSalary) };
        }

        // Skills filter
        if (skills) {
            query.skills = { 
                $in: skills.split(',').map(skill => new RegExp(skill.trim(), 'i'))
            };
        }

        const total = await Job.countDocuments(query);
        const jobs = await Job.find(query)
            .sort(sort)
            .skip((page - 1) * limit)
            .limit(parseInt(limit))
            .populate('postedBy', 'name')
            .populate('applicationsCount');

        res.json({
            jobs,
            total,
            pages: Math.ceil(total / limit),
            currentPage: parseInt(page)
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get job details by ID
const getJobDetails = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id)
            .populate('postedBy', 'name email')
            .populate('applicationsCount');

        if (!job) {
            return res.status(404).json({ message: "Job not found" });
        }

        res.json(job);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Edit a job post
const editJobPost = async (req, res) => {
    try {
        // Verify HR or Admin access
        if (req.user.role !== 'hr' && req.user.role !== 'admin') {
            return res.status(403).json({ message: "Not authorized" });
        }

        const job = await Job.findById(req.params.id);
        if (!job) {
            return res.status(404).json({ message: "Job not found" });
        }

        // Update allowed fields
        const allowedUpdates = [
            'title', 'description', 'location', 'company',
            'employmentType', 'experience', 'salaryRange',
            'skills', 'status', 'applicationDeadline',
            'department', 'remote'
        ];

        allowedUpdates.forEach(field => {
            if (req.body[field] !== undefined) {
                job[field] = req.body[field];
            }
        });

        await job.save();
        res.json(job);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete a job post
const deleteJobPost = async (req, res) => {
    try {
        // Verify HR or Admin access
        if (req.user.role !== 'hr' && req.user.role !== 'admin') {
            return res.status(403).json({ message: "Not authorized" });
        }

        const job = await Job.findById(req.params.id);
        if (!job) {
            return res.status(404).json({ message: "Job not found" });
        }

        await job.deleteOne();
        res.json({ message: "Job deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get job statistics
const getJobStats = async (req, res) => {
    try {
        // Verify HR or Admin access
        if (req.user.role !== 'hr' && req.user.role !== 'admin') {
            return res.status(403).json({ message: "Not authorized" });
        }

        const stats = await Job.aggregate([
            {
                $facet: {
                    'byStatus': [
                        { $group: { _id: '$status', count: { $sum: 1 } } }
                    ],
                    'byEmploymentType': [
                        { $group: { _id: '$employmentType', count: { $sum: 1 } } }
                    ],
                    'byLocation': [
                        { $group: { _id: '$location', count: { $sum: 1 } } }
                    ],
                    'byDepartment': [
                        { $group: { _id: '$department', count: { $sum: 1 } } }
                    ]
                }
            }
        ]);

        res.json(stats[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createJobPost,
    getJobs,
    getJobDetails,
    editJobPost,
    deleteJobPost,
    getJobStats
};
