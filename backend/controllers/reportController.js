const asyncHandler = require('express-async-handler');
const Report = require('../models/Report');

// @desc    Get all reports (admin only)
// @route   GET /api/reports
// @access  Private/Admin
const getAllReports = asyncHandler(async (req, res) => {
    const reports = await Report.find()
        .populate('reportedBy', 'name email role')
        .sort({ createdAt: -1 });
    res.json(reports);
});

// @desc    Create a report
// @route   POST /api/reports
// @access  Private
const createReport = asyncHandler(async (req, res) => {
    const { type, target, description } = req.body;

    if (!type || !target || !description) {
        res.status(400);
        throw new Error('Please provide type, target, and description');
    }

    const report = await Report.create({
        type,
        target,
        description,
        reportedBy: req.user._id
    });

    res.status(201).json(report);
});

// @desc    Update report status (admin only)
// @route   PUT /api/reports/:id
// @access  Private/Admin
const updateReportStatus = asyncHandler(async (req, res) => {
    const report = await Report.findById(req.params.id);

    if (!report) {
        res.status(404);
        throw new Error('Report not found');
    }

    report.status = req.body.status || report.status;
    await report.save();

    res.json(report);
});

module.exports = { getAllReports, createReport, updateReportStatus };
