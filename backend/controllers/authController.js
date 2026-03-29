const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const asyncHandler = require('express-async-handler');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, role, university, major, company, position, managerRecruiter } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }

    // Optional: link supervisor to a recruiter at registration time
    let recruiterRef = undefined;
    if (role === 'supervisor' && managerRecruiter) {
        const recruiter = await User.findById(managerRecruiter);
        if (!recruiter || recruiter.role !== 'recruiter') {
            res.status(400);
            throw new Error('Selected recruiter is invalid');
        }
        recruiterRef = recruiter._id;
    }

    const user = await User.create({
        name,
        email,
        password,
        role: role || 'student', // default to student if not provided
        university,
        major,
        company,
        position,
        managerRecruiter: recruiterRef,
    });

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            status: user.status,
            isVerified: user.isVerified,
            managerRecruiter: user.managerRecruiter,
            token: generateToken(user._id),
        });
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }
});

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Need to explicitly select password because we hide it by default in the schema
    const user = await User.findOne({ email }).select('+password');

    if (user && (await user.matchPassword(password))) {

        // If it's a recruiter or supervisor and they are pending / not verified
        if ((user.role === 'recruiter' || user.role === 'supervisor') && !user.isVerified) {
            res.status(401);
            throw new Error('Account pending approval');
        }

        // Only non-admin users can be blocked by suspension
        if (user.role !== 'admin' && user.status === 'suspended') {
            res.status(403);
            throw new Error('Your account is suspended.');
        }

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            avatar: user.avatar,
            cv: user.cv,
            status: user.status,
            isVerified: user.isVerified,
            bio: user.bio,
            university: user.university,
            major: user.major,
            company: user.company,
            position: user.position,
            skills: user.skills,
            phone: user.phone,
            location: user.location,
            linkedin: user.linkedin,
            github: user.github,
            website: user.website,
            industries: user.industries,
            companySize: user.companySize,
            managerRecruiter: user.managerRecruiter,
            token: generateToken(user._id),
        });
    } else {
        res.status(401);
        throw new Error('Invalid email or password');
    }
});

// @desc    Get user profile (Current logged in)
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        res.json(user);
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Forgot Password
// @route   POST /api/users/forgotpassword
// @access  Public
const forgotPassword = asyncHandler(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        res.status(404);
        throw new Error('There is no user with that email');
    }

    // Get reset token
    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false });

    // Create reset url using FRONTEND_URL from env
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const resetUrl = `${frontendUrl}/reset-password/${resetToken}`;

    const message = `Hello ${user.name},\n\nYou requested a password reset for your Frelaunch account.\n\nClick the link below to set a new password (this link expires in 10 minutes):\n\n${resetUrl}\n\nIf you did not request this, please ignore this email and your password will remain unchanged.\n\nRegards,\nThe Frelaunch Team`;

    try {
        await sendEmail({
            email: user.email,
            subject: 'Password reset token',
            message
        });

        res.status(200).json({ success: true, data: 'Email sent' });
    } catch (err) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({ validateBeforeSave: false });

        res.status(500);
        throw new Error('Email could not be sent');
    }
});

// @desc    Reset Password
// @route   PUT /api/users/resetpassword/:resettoken
// @access  Public
const resetPassword = asyncHandler(async (req, res, next) => {
    // Get hashed token
    const resetPasswordToken = crypto
        .createHash('sha256')
        .update(req.params.resettoken)
        .digest('hex');

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
        res.status(400);
        throw new Error('Invalid token');
    }

    // Set new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(200).json({
        success: true,
        token: generateToken(user._id)
    });
});

module.exports = {
    registerUser,
    authUser,
    getUserProfile,
    forgotPassword,
    resetPassword
};
