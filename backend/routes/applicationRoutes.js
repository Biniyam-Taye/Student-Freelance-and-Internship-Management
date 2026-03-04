const express = require('express');
const router = express.Router();
const {
    applyForOpportunity,
    getMyApplications,
    getApplicationsForJob,
    updateApplicationStatus
} = require('../controllers/applicationController');
const { protect, recruiter } = require('../middlewares/authMiddleware');

// Student Routes
router.post('/:opportunityId', protect, applyForOpportunity);
router.get('/myapplications', protect, getMyApplications);

// Recruiter Routes
router.get('/job/:opportunityId', protect, recruiter, getApplicationsForJob);
router.put('/:id/status', protect, recruiter, updateApplicationStatus);

module.exports = router;
