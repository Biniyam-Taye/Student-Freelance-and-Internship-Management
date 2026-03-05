const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const { protect } = require('../middlewares/authMiddleware');
const { uploadAvatar, uploadPost, cloudinary } = require('../utils/cloudinary');

// @route   POST /api/upload/avatar
// @desc    Upload profile picture (expects base64 "imageData" in JSON body)
// @access  Private
router.post(
    '/avatar',
    protect,
    asyncHandler(async (req, res) => {
        console.log('Avatar upload request received');

        const imageData = req.body?.imageData;
        if (!imageData) {
            console.log('No imageData in request body');
            res.status(400);
            throw new Error('No image file provided');
        }

        // Upload base64 data directly with Cloudinary SDK
        const result = await cloudinary.uploader.upload(imageData, {
            folder: 'freelaunch/avatars',
            transformation: [{ width: 400, height: 400, crop: 'fill', gravity: 'center' }],
        });

        if (!result?.secure_url) {
            res.status(500);
            throw new Error('Image upload failed');
        }

        res.json({ url: result.secure_url });
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
