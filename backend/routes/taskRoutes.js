const express = require('express');
const router = express.Router();
const {
    assignTask,
    getMyTasks,
    getAssignedTasks,
    updateTaskStatus,
    submitTask,
    reviewTask
} = require('../controllers/taskController');
const { protect, recruiter } = require('../middlewares/authMiddleware');

// Student Routes
router.get('/my-tasks', protect, getMyTasks);
router.put('/:id/submit', protect, submitTask);

// Recruiter Routes
router.post('/', protect, recruiter, assignTask);
router.get('/assigned-tasks', protect, recruiter, getAssignedTasks);
router.put('/:id/review', protect, recruiter, reviewTask);

// Shared Routes
router.put('/:id/status', protect, updateTaskStatus);

module.exports = router;
