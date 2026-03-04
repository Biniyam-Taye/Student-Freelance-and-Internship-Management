const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Opportunity = require('../models/Opportunity');
const Application = require('../models/Application');
const Task = require('../models/Task');

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = asyncHandler(async (req, res) => {
    const { role, status, search } = req.query;

    let filter = {};
    if (role && role !== 'all') filter.role = role;
    if (status) filter.status = status;
    if (search) {
        filter.$or = [
            { name: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } }
        ];
    }

    const users = await User.find(filter).sort({ createdAt: -1 });
    res.json(users);
});

// @desc    Get single user by ID
// @route   GET /api/admin/users/:id
// @access  Private/Admin
const getUserById = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).select('-password');
    if (user) {
        res.json(user);
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Approve / verify recruiter
// @route   PUT /api/admin/users/:id/verify
// @access  Private/Admin
const verifyRecruiter = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }
    if (user.role !== 'recruiter') {
        res.status(400);
        throw new Error('User is not a recruiter');
    }
    user.isVerified = true;
    user.status = 'active';
    await user.save();
    res.json({ message: 'Recruiter verified successfully', user });
});

// @desc    Suspend or activate a user account
// @route   PUT /api/admin/users/:id/status
// @access  Private/Admin
const updateUserStatus = asyncHandler(async (req, res) => {
    const { status } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }
    user.status = status;
    await user.save();
    res.json({ message: `User status updated to ${status}`, user });
});

// @desc    Delete a user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }
    if (user.role === 'admin') {
        res.status(400);
        throw new Error('Cannot delete admin account');
    }
    await User.deleteOne({ _id: user._id });
    res.json({ message: 'User removed successfully' });
});

// @desc    Get platform analytics
// @route   GET /api/admin/analytics
// @access  Private/Admin
const getAnalytics = asyncHandler(async (req, res) => {
    const [totalUsers, totalOpportunities, totalApplications, totalTasks] = await Promise.all([
        User.countDocuments(),
        Opportunity.countDocuments(),
        Application.countDocuments(),
        Task.countDocuments()
    ]);

    const studentCount = await User.countDocuments({ role: 'student' });
    const recruiterCount = await User.countDocuments({ role: 'recruiter' });
    const pendingRecruiters = await User.countDocuments({ role: 'recruiter', isVerified: false });

    const applicationsByStatus = await Application.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    const tasksByStatus = await Task.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    // User growth: count signups per month for past 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const userGrowth = await User.aggregate([
        { $match: { createdAt: { $gte: sixMonthsAgo } } },
        {
            $group: {
                _id: { month: { $month: '$createdAt' }, year: { $year: '$createdAt' } },
                count: { $sum: 1 }
            }
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    res.json({
        totalUsers,
        totalOpportunities,
        totalApplications,
        totalTasks,
        studentCount,
        recruiterCount,
        pendingRecruiters,
        applicationsByStatus,
        tasksByStatus,
        userGrowth
    });
});

module.exports = {
    getAllUsers,
    getUserById,
    verifyRecruiter,
    updateUserStatus,
    deleteUser,
    getAnalytics
};
