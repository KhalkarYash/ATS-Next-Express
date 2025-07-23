const User = require('../models/User');
const Job = require('../models/Job');
const Application = require('../models/Application');
const Pipeline = require('../models/Pipeline');
const { cacheWrapper } = require('../utils/cache');

// Get admin dashboard overview
const getAdminOverview = async (req, res) => {
    try {
        const dashboardData = await cacheWrapper('admin_dashboard', async () => {
            const [
                totalUsers,
                totalJobs,
                totalApplications,
                applicantsCount,
                hrCount
            ] = await Promise.all([
                User.countDocuments(),
                Job.countDocuments(),
                Application.countDocuments(),
                User.countDocuments({ role: 'applicant' }),
                User.countDocuments({ role: 'hr' })
            ]);

            const recentApplications = await Application.find()
                .sort({ createdAt: -1 })
                .limit(5)
                .populate('applicant', 'name email')
                .populate('job', 'title company');

            const applicationStats = await Application.aggregate([
                {
                    $group: {
                        _id: '$status',
                        count: { $sum: 1 }
                    }
                }
            ]);

            return {
                counts: {
                    totalUsers,
                    totalJobs,
                    totalApplications,
                    applicantsCount,
                    hrCount
                },
                recentApplications,
                applicationStats
            };
        }, 300);

        res.json(dashboardData);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all users with filtering and pagination
const getAllUsers = async (req, res) => {
    try {
        const { 
            role, 
            search,
            page = 1,
            limit = 10,
            sortBy = 'createdAt',
            sortOrder = -1
        } = req.query;

        const query = {};
        const sort = {};
        sort[sortBy] = parseInt(sortOrder, 10); // Convert sortOrder to a number

        if (role) {
            query.role = role;
        }

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }

        const total = await User.countDocuments(query);
        const users = await User.find(query)
            .sort(sort)
            .skip((page - 1) * limit)
            .limit(parseInt(limit))
            .select('-password');

        res.json({
            users,
            total,
            pages: Math.ceil(total / limit),
            currentPage: parseInt(page)
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get applicants with advanced filtering
const getApplicants = async (req, res) => {
    try {
        const { 
            search,
            jobId,
            status,
            page = 1,
            limit = 10
        } = req.query;

        const query = { role: 'applicant' };

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }

        const total = await User.countDocuments(query);
        let applicants = await User.find(query)
            .skip((page - 1) * limit)
            .limit(parseInt(limit))
            .select('-password');

        if (jobId) {
            applicants = await Promise.all(
                applicants.map(async (applicant) => {
                    const application = await Application.findOne({
                        applicant: applicant._id,
                        job: jobId
                    }).select('status createdAt');
                    
                    return {
                        ...applicant.toJSON(),
                        application
                    };
                })
            );
        }

        res.json({
            applicants,
            total,
            pages: Math.ceil(total / limit),
            currentPage: parseInt(page)
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get user activity logs (applications, status changes)
const getUserActivityLogs = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const { userId } = req.params;
        
        const applications = await Application.find({ applicant: userId })
            .populate('job', 'title company')
            .sort({ createdAt: -1 });

        const pipelines = await Pipeline.find({ 
            'updates.updatedBy': userId 
        }).populate('application');

        res.json({
            applications,
            statusUpdates: pipelines
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Dashboard search functionality
const searchDashboard = async (req, res) => {
    try {
        const { query, type, page = 1, limit = 10 } = req.query;
        const skip = (page - 1) * limit;

        if (!query) {
            return res.status(400).json({ message: 'Search query is required' });
        }

        let results = {};
        
        if (!type || type === 'all') {
            const [users, jobs, applications] = await Promise.all([
                User.find({ 
                    $or: [
                        { name: { $regex: query, $options: 'i' } },
                        { email: { $regex: query, $options: 'i' } }
                    ]
                }).select('-password').limit(parseInt(limit)),
                
                Job.find({
                    $or: [
                        { title: { $regex: query, $options: 'i' } },
                        { description: { $regex: query, $options: 'i' } },
                        { skills: { $regex: query, $options: 'i' } }
                    ]
                }).populate('postedBy', 'name').limit(parseInt(limit)),
                
                Application.find({
                    $or: [
                        { status: { $regex: query, $options: 'i' } },
                        { comments: { $regex: query, $options: 'i' } }
                    ]
                }).populate('applicant', 'name email')
                  .populate('job', 'title company')
                  .limit(parseInt(limit))
            ]);

            results = { users, jobs, applications };
        } else {
            switch (type) {
                case 'users':
                    results = await User.find({
                        $or: [
                            { name: { $regex: query, $options: 'i' } },
                            { email: { $regex: query, $options: 'i' } }
                        ]
                    }).select('-password')
                      .skip(skip)
                      .limit(parseInt(limit));
                    break;
                    
                case 'jobs':
                    results = await Job.find({
                        $or: [
                            { title: { $regex: query, $options: 'i' } },
                            { description: { $regex: query, $options: 'i' } }
                        ]
                    }).populate('postedBy', 'name')
                      .skip(skip)
                      .limit(parseInt(limit));
                    break;
                    
                case 'applications':
                    results = await Application.find({
                        $or: [
                            { status: { $regex: query, $options: 'i' } },
                            { comments: { $regex: query, $options: 'i' } }
                        ]
                    }).populate('applicant', 'name email')
                      .populate('job', 'title company')
                      .skip(skip)
                      .limit(parseInt(limit));
                    break;
            }
        }

        res.json(results);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get dashboard analytics with caching
const getDashboardAnalytics = async (req, res) => {
    try {
        const analytics = await cacheWrapper('dashboard_analytics', async () => {
            const now = new Date();
            const lastMonth = new Date(now.setMonth(now.getMonth() - 1));

            const [applicationTrends, statusDistribution, jobMetrics] = await Promise.all([
                // Monthly application trends
                Application.aggregate([
                    {
                        $match: {
                            createdAt: { $gte: lastMonth }
                        }
                    },
                    {
                        $group: {
                            _id: {
                                year: { $year: "$createdAt" },
                                month: { $month: "$createdAt" },
                                day: { $dayOfMonth: "$createdAt" }
                            },
                            count: { $sum: 1 }
                        }
                    },
                    { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } }
                ]),

                // Applications by status
                Application.aggregate([
                    {
                        $group: {
                            _id: "$status",
                            count: { $sum: 1 }
                        }
                    }
                ]),

                // Job metrics
                Job.aggregate([
                    {
                        $facet: {
                            byDepartment: [
                                { $group: { _id: "$department", count: { $sum: 1 } } }
                            ],
                            byLocation: [
                                { $group: { _id: "$location", count: { $sum: 1 } } }
                            ],
                            byType: [
                                { $group: { _id: "$employmentType", count: { $sum: 1 } } }
                            ]
                        }
                    }
                ])
            ]);

            return {
                applicationTrends,
                statusDistribution,
                jobMetrics: jobMetrics[0]
            };
        }, 900); // Cache for 15 minutes

        res.json(analytics);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAdminOverview,
    getAllUsers,
    getApplicants,
    getUserActivityLogs,
    searchDashboard,
    getDashboardAnalytics
};