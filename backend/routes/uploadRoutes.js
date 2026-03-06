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
        const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
        const apiKey = process.env.CLOUDINARY_API_KEY;
        const apiSecret = process.env.CLOUDINARY_API_SECRET;
        if (!cloudName || !apiKey || !apiSecret) {
            res.status(503);
            throw new Error(
                'Image upload is not configured. Add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET to your backend .env file.'
            );
        }

        const imageData = req.body?.imageData;
        if (!imageData || typeof imageData !== 'string') {
            res.status(400);
            throw new Error('No image file provided. Send a JSON body with "imageData" (base64 data URL).');
        }

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

// @route   POST /api/upload/cv
// @desc    Upload student CV/Resume (PDF, expects base64 "fileData" in JSON body)
// @access  Private
router.post(
    '/cv',
    protect,
    asyncHandler(async (req, res) => {
        const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
        const apiKey = process.env.CLOUDINARY_API_KEY;
        const apiSecret = process.env.CLOUDINARY_API_SECRET;
        if (!cloudName || !apiKey || !apiSecret) {
            res.status(503);
            throw new Error(
                'File upload is not configured. Add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET to your backend .env file.'
            );
        }

        const fileData = req.body?.fileData;
        if (!fileData || typeof fileData !== 'string') {
            res.status(400);
            throw new Error('No file provided. Send a JSON body with "fileData" (base64 data URL).');
        }

        const result = await cloudinary.uploader.upload(fileData, {
            resource_type: 'raw',
            folder: 'freelaunch/cvs',
        });

        if (!result?.secure_url) {
            res.status(500);
            throw new Error('CV upload failed');
        }

        res.json({ url: result.secure_url });
    })
);

// @route   POST /api/upload/post
// @desc    Upload post image (multipart/form-data, field name: image)
// @access  Private
router.post(
    '/post',
    protect,
    (req, res, next) => {
        if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
            res.status(503);
            return next(new Error('Image upload is not configured. Add CLOUDINARY_* to backend .env'));
        }
        next();
    },
    uploadPost.single('image'),
    asyncHandler(async (req, res) => {
        if (!req.file) {
            res.status(400);
            throw new Error('No image file provided');
        }
        const url = req.file.path || req.file.secure_url || req.file.url;
        if (!url) {
            res.status(500);
            throw new Error('Image upload failed');
        }
        res.json({ url });
    })
);

module.exports = router;
