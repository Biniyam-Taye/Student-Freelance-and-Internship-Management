const asyncHandler = require('express-async-handler');
const User = require('../models/User');

// @desc    Public list of verified, active recruiters (for signup dropdowns, etc.)
// @route   GET /api/public/recruiters
// @access  Public
const getPublicRecruiters = asyncHandler(async (req, res) => {
    const recruiters = await User.find({
        role: 'recruiter',
        isVerified: true,
        status: 'active',
    })
        .select('name company email avatar')
        .sort({ company: 1, name: 1 });

    res.json(recruiters);
});

module.exports = {
    getPublicRecruiters,
};

