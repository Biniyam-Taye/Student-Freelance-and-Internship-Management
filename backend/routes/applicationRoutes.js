const express = require('express');
const router = express.Router();
const {
    applyForOpportunity,
    getMyApplications,
    getApplicationsForJob,
    getRecruiterApplications,
    updateApplicationStatus,
    assignSupervisor
} = require('../controllers/applicationController');
const { protect, recruiter } = require('../middlewares/authMiddleware');

// Student Routes
router.post('/:opportunityId', protect, applyForOpportunity);
router.get('/myapplications', protect, getMyApplications);

// Recruiter Routes
router.get('/recruiter', protect, recruiter, getRecruiterApplications);
router.get('/job/:opportunityId', protect, recruiter, getApplicationsForJob);
router.put('/:id/status', protect, recruiter, updateApplicationStatus);
router.put('/:id/assign', protect, recruiter, assignSupervisor);

module.exports = router;
