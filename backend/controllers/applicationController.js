const asyncHandler = require('express-async-handler');
const Application = require('../models/Application');
const Opportunity = require('../models/Opportunity');

// @desc    Apply to an Opportunity
// @route   POST /api/applications/:opportunityId
// @access  Private/Student
const applyForOpportunity = asyncHandler(async (req, res) => {
    const { coverLetter, resumeUrl } = req.body;
    const opportunityId = req.params.opportunityId;

    const opportunity = await Opportunity.findById(opportunityId);

    if (!opportunity) {
        res.status(404);
        throw new Error('Opportunity not found');
    }

    if (opportunity.status !== 'open') {
        res.status(400);
        throw new Error('This opportunity is closed');
    }

    // Check if the student has already applied
    const alreadyApplied = await Application.findOne({
        opportunity: opportunityId,
        student: req.user._id
    });

    if (alreadyApplied) {
        res.status(400);
        throw new Error('You have already applied to this opportunity');
    }

    const application = await Application.create({
        opportunity: opportunityId,
        student: req.user._id,
        recruiter: opportunity.recruiter, // store recruiter ID to easily query applications for them
        coverLetter,
        resumeUrl
    });

    // Increment applicant count for the opportunity
    opportunity.applicantsCount += 1;
    await opportunity.save();

    res.status(201).json(application);
});

// @desc    Get current student's applications
// @route   GET /api/applications/myapplications
// @access  Private/Student
const getMyApplications = asyncHandler(async (req, res) => {
    const applications = await Application.find({ student: req.user._id })
        .populate({
            path: 'opportunity',
            select: 'position company location stipend type'
        })
        .sort({ createdAt: -1 });

    res.json(applications);
});

// @desc    Get applications for a specific job (Recruiter view)
// @route   GET /api/applications/job/:opportunityId
// @access  Private/Recruiter
const getApplicationsForJob = asyncHandler(async (req, res) => {
    const opportunity = await Opportunity.findById(req.params.opportunityId);

    if (!opportunity) {
        res.status(404);
        throw new Error('Opportunity not found');
    }

    // Verify this recruiter owns the job
    if (opportunity.recruiter.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        res.status(401);
        throw new Error('Not authorized to view these applications');
    }

    const applications = await Application.find({ opportunity: req.params.opportunityId })
        .populate('student', 'name email university major skills avatar')
        .sort({ createdAt: -1 });

    res.json(applications);
});

// @desc    Update application status (Recruiter Action)
// @route   PUT /api/applications/:id/status
// @access  Private/Recruiter
const updateApplicationStatus = asyncHandler(async (req, res) => {
    const { status } = req.body;

    // Validate status
    if (!['pending', 'shortlisted', 'accepted', 'rejected'].includes(status)) {
        res.status(400);
        throw new Error('Invalid status update');
    }

    const application = await Application.findById(req.params.id);

    if (!application) {
        res.status(404);
        throw new Error('Application not found');
    }

    // Verify authorized recruiter
    if (application.recruiter.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        res.status(401);
        throw new Error('Not authorized to change this application status');
    }

    application.status = status;
    const updatedApplication = await application.save();

    res.json(updatedApplication);
});

module.exports = {
    applyForOpportunity,
    getMyApplications,
    getApplicationsForJob,
    updateApplicationStatus
};
