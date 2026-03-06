const express = require('express');
const router = express.Router();
const {
    getPendingSupervisors,
    getMySupervisors,
    approveSupervisor,
    rejectSupervisor,
} = require('../controllers/supervisorController');
const { protect, recruiter } = require('../middlewares/authMiddleware');

// All supervisor management routes are private and restricted to recruiters/admins
router.get('/pending', protect, recruiter, getPendingSupervisors);
router.get('/mine', protect, recruiter, getMySupervisors);
router.put('/:id/approve', protect, recruiter, approveSupervisor);
router.put('/:id/reject', protect, recruiter, rejectSupervisor);

module.exports = router;

