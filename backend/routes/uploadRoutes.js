const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const { protect } = require('../middlewares/authMiddleware');
const { uploadAvatar, uploadPost } = require('../utils/cloudinary');

// @route   POST /api/upload/avatar
// @desc    Upload profile picture
// @access  Private
router.post(
    '/avatar',
    protect,
    uploadAvatar.single('image'),
    asyncHandler(async (req, res) => {
        if (!req.file) {
            res.status(400);
            throw new Error('No image file provided');
        }
        res.json({ url: req.file.path });
    })
);

// @route   POST /api/upload/post
// @desc    Upload post image
// @access  Private
router.post(
    '/post',
    protect,
    uploadPost.single('image'),
    asyncHandler(async (req, res) => {
        if (!req.file) {
            res.status(400);
            throw new Error('No image file provided');
        }
        res.json({ url: req.file.path });
    })
);

module.exports = router;
