const asyncHandler = require('express-async-handler');
const User = require('../models/User');

// @desc    Update current user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    if (req.body.name !== undefined) user.name = req.body.name;
    if (req.body.bio !== undefined) user.bio = req.body.bio;
    if (req.body.university !== undefined) user.university = req.body.university;
    if (req.body.major !== undefined) user.major = req.body.major;
    if (req.body.company !== undefined) user.company = req.body.company;
    if (req.body.position !== undefined) user.position = req.body.position;
    if (req.body.skills !== undefined) user.skills = req.body.skills;
    if (req.body.avatar !== undefined) user.avatar = req.body.avatar;
    if (req.body.cv !== undefined) user.cv = req.body.cv;
    // Extended fields
    if (req.body.phone !== undefined) user.phone = req.body.phone;
    if (req.body.location !== undefined) user.location = req.body.location;
    if (req.body.linkedin !== undefined) user.linkedin = req.body.linkedin;
    if (req.body.github !== undefined) user.github = req.body.github;
    if (req.body.website !== undefined) user.website = req.body.website;
    if (req.body.industries !== undefined) user.industries = req.body.industries;
    if (req.body.companySize !== undefined) user.companySize = req.body.companySize;

    // Only update password if a new one has been provided
    if (req.body.password) {
        user.password = req.body.password; // bcrypt pre-save hook handles hashing
    }

    const updatedUser = await user.save();

    res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        bio: updatedUser.bio,
        university: updatedUser.university,
        major: updatedUser.major,
        company: updatedUser.company,
        position: updatedUser.position,
        skills: updatedUser.skills,
        avatar: updatedUser.avatar,
        cv: updatedUser.cv,
        phone: updatedUser.phone,
        location: updatedUser.location,
        linkedin: updatedUser.linkedin,
        github: updatedUser.github,
        website: updatedUser.website,
        industries: updatedUser.industries,
        companySize: updatedUser.companySize,
        isVerified: updatedUser.isVerified,
        status: updatedUser.status,
        token: require('../utils/generateToken')(updatedUser._id)
    });
});

module.exports = { updateUserProfile };
