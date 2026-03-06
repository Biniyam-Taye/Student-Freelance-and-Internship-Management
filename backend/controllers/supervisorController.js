const asyncHandler = require('express-async-handler');
const User = require('../models/User');

// Ensure only recruiters/admins can manage supervisors
const assertRecruiterManager = (req) => {
    if (!req.user || (req.user.role !== 'recruiter' && req.user.role !== 'admin')) {
        const err = new Error('Not authorized to manage supervisors');
        err.statusCode = 401;
        throw err;
    }
};

// @desc    List pending supervisors (not yet assigned to any recruiter)
// @route   GET /api/supervisors/pending
// @access  Private/Recruiter
const getPendingSupervisors = asyncHandler(async (req, res) => {
    assertRecruiterManager(req);

    const supervisors = await User.find({
        role: 'supervisor',
        // Consider "pending" any supervisor who is not yet assigned to a recruiter,
        // regardless of current status/isVerified flags.
        $or: [
            { managerRecruiter: { $exists: false } },
            { managerRecruiter: null },
        ],
        status: { $ne: 'suspended' },
    })
        .select('-password')
        .sort({ createdAt: -1 });

    res.json(supervisors);
});

// @desc    List supervisors assigned to this recruiter
// @route   GET /api/supervisors/mine
// @access  Private/Recruiter
const getMySupervisors = asyncHandler(async (req, res) => {
    assertRecruiterManager(req);

    const recruiterId = req.user._id;

    const supervisors = await User.find({
        role: 'supervisor',
        managerRecruiter: recruiterId,
    })
        .select('-password')
        .sort({ createdAt: -1 });

    res.json(supervisors);
});

// @desc    Approve a supervisor (link to recruiter and activate)
// @route   PUT /api/supervisors/:id/approve
// @access  Private/Recruiter
const approveSupervisor = asyncHandler(async (req, res) => {
    assertRecruiterManager(req);

    const supervisor = await User.findById(req.params.id);

    if (!supervisor) {
        res.status(404);
        throw new Error('Supervisor not found');
    }

    if (supervisor.role !== 'supervisor') {
        res.status(400);
        throw new Error('User is not a supervisor');
    }

    // If this supervisor is already linked to a different recruiter, block
    if (
        supervisor.managerRecruiter &&
        supervisor.managerRecruiter.toString() !== req.user._id.toString() &&
        req.user.role !== 'admin'
    ) {
        res.status(401);
        throw new Error('Supervisor already assigned to another recruiter');
    }

    supervisor.managerRecruiter = req.user._id;
    supervisor.isVerified = true;
    supervisor.status = 'active';
    await supervisor.save();

    res.json({ message: 'Supervisor approved successfully', user: supervisor });
});

// @desc    Reject a supervisor (detach from this recruiter and suspend)
// @route   PUT /api/supervisors/:id/reject
// @access  Private/Recruiter
const rejectSupervisor = asyncHandler(async (req, res) => {
    assertRecruiterManager(req);

    const supervisor = await User.findById(req.params.id);

    if (!supervisor) {
        res.status(404);
        throw new Error('Supervisor not found');
    }

    if (supervisor.role !== 'supervisor') {
        res.status(400);
        throw new Error('User is not a supervisor');
    }

    // Only allow rejecting if unassigned or assigned to this recruiter (or admin)
    if (
        supervisor.managerRecruiter &&
        supervisor.managerRecruiter.toString() !== req.user._id.toString() &&
        req.user.role !== 'admin'
    ) {
        res.status(401);
        throw new Error('Not authorized to reject this supervisor');
    }

    supervisor.managerRecruiter = undefined;
    supervisor.isVerified = false;
    supervisor.status = 'suspended';
    await supervisor.save();

    res.json({ message: 'Supervisor rejected', user: supervisor });
});

module.exports = {
    getPendingSupervisors,
    getMySupervisors,
    approveSupervisor,
    rejectSupervisor,
};

