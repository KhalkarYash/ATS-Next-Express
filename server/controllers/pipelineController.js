const Pipeline = require('../models/Pipeline');
const Application = require('../models/Application');

// Get pipeline history for an application
const getPipelineHistory = async (req, res) => {
    try {
        const pipeline = await Pipeline.findOne({ application: req.params.appId })
            .populate('application');
        
        if (!pipeline) {
            return res.status(404).json({ message: 'Pipeline history not found' });
        }

        res.json(pipeline);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update application status in pipeline
const updatePipelineStatus = async (req, res) => {
    try {
        const { status, note } = req.body;
        let pipeline = await Pipeline.findOne({ application: req.params.appId });
        const application = await Application.findById(req.params.appId);

        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        // Check if user has permission (HR or Admin)
        if (req.user.role !== 'hr' && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const previousStatus = application.status;
        application.status = status;
        await application.save();

        if (!pipeline) {
            pipeline = new Pipeline({
                application: req.params.appId,
                updates: []
            });
        }

        pipeline.updates.push({
            status,
            note,
            timestamp: new Date(),
            updatedBy: req.user.id
        });

        await pipeline.save();

        res.json({ pipeline, application });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get pipeline statistics for dashboard
const getPipelineStats = async (req, res) => {
    try {
        // Verify admin/HR access
        if (req.user.role !== 'hr' && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const stats = await Application.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);

        const totalApplications = await Application.countDocuments();
        
        const pipelineOverview = {
            total: totalApplications,
            byStatus: stats.reduce((acc, curr) => {
                acc[curr._id] = curr.count;
                return acc;
            }, {})
        };

        res.json(pipelineOverview);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getPipelineHistory,
    updatePipelineStatus,
    getPipelineStats
};