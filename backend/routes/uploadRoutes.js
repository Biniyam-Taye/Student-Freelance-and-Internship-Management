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
        console.log('Upload request received');
        if (!req.file) {
            console.log('No file in request');
            res.status(400);
            throw new Error('No image file provided');
        }
        console.log('File uploaded to Cloudinary:', req.file);
        // multer-storage-cloudinary v4+ → path; v2/v3 → secure_url or url
        const url = req.file.path || req.file.secure_url || req.file.url;
        console.log('Determined URL:', url);
        res.json({ url });
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
