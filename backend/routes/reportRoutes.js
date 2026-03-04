const express = require('express');
const router = express.Router();
const { getAllReports, createReport, updateReportStatus } = require('../controllers/reportController');
const { protect, admin } = require('../middlewares/authMiddleware');

router.route('/')
    .get(protect, admin, getAllReports)
    .post(protect, createReport);

router.route('/:id')
    .put(protect, admin, updateReportStatus);

module.exports = router;
