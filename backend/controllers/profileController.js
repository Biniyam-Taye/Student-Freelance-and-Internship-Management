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

    user.name = req.body.name || user.name;
    user.bio = req.body.bio || user.bio;
    user.university = req.body.university || user.university;
    user.major = req.body.major || user.major;
    user.company = req.body.company || user.company;
    user.position = req.body.position || user.position;
    user.skills = req.body.skills || user.skills;
    user.avatar = req.body.avatar || user.avatar;

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
        token: require('../utils/generateToken')(updatedUser._id)
    });
});

module.exports = { updateUserProfile };
