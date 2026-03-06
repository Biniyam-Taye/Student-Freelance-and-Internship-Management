const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const https = require('https');
const http = require('http');
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

// @route   GET /api/upload/cv/download
// @desc    Proxy CV download with correct filename (fixes browser saving as Cloudinary ID)
// @access  Private
router.get(
    '/cv/download',
    protect,
    asyncHandler(async (req, res) => {
        const { url, filename } = req.query;
        if (!url || typeof url !== 'string') {
            res.status(400);
            throw new Error('Missing url parameter');
        }
        const decodedUrl = decodeURIComponent(url);
        if (!decodedUrl.startsWith('https://res.cloudinary.com/') && !decodedUrl.startsWith('http://res.cloudinary.com/')) {
            res.status(400);
            throw new Error('Invalid CV URL');
        }
        const safeFilename = (filename || 'CV.pdf').replace(/[^a-zA-Z0-9._-]/g, '_').replace(/\.{2,}/g, '.') || 'CV.pdf';
        const finalFilename = safeFilename.endsWith('.pdf') ? safeFilename : `${safeFilename}.pdf`;

        const protocol = decodedUrl.startsWith('https') ? https : http;
        protocol.get(decodedUrl, (proxyRes) => {
            if (proxyRes.statusCode !== 200) {
                res.status(proxyRes.statusCode || 500);
                return res.json({ message: 'Failed to fetch CV' });
            }
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename="${finalFilename}"`);
            proxyRes.pipe(res);
        }).on('error', (err) => {
            console.error('CV download proxy error:', err);
            res.status(502);
            res.json({ message: 'Failed to fetch CV' });
        });
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
