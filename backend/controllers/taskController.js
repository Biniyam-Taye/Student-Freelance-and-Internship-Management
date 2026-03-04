const asyncHandler = require('express-async-handler');
const Task = require('../models/Task');
const User = require('../models/User');

// @desc    Assign a new task to a student
// @route   POST /api/tasks
// @access  Private/Recruiter
const assignTask = asyncHandler(async (req, res) => {
    const { studentId, title, description, deadline, priority, opportunityId } = req.body;

    // Verify student exists and is actually a student
    const student = await User.findById(studentId);
    if (!student || student.role !== 'student') {
        res.status(404);
        throw new Error('Valid student not found');
    }

    const task = await Task.create({
        recruiter: req.user._id,
        student: studentId,
        opportunity: opportunityId,
        title,
        description,
        deadline,
        priority
    });

    res.status(201).json(task);
});

// @desc    Get all tasks assigned to the logged in student
// @route   GET /api/tasks/my-tasks
// @access  Private/Student
const getMyTasks = asyncHandler(async (req, res) => {
    const tasks = await Task.find({ student: req.user._id })
        .populate('recruiter', 'name company avatar')
        .sort({ deadline: 1 }); // Sort by closest deadline

    res.json(tasks);
});

// @desc    Get all tasks assigned by the logged in recruiter
// @route   GET /api/tasks/assigned-tasks
// @access  Private/Recruiter
const getAssignedTasks = asyncHandler(async (req, res) => {
    const tasks = await Task.find({ recruiter: req.user._id })
        .populate('student', 'name email avatar')
        .sort({ createdAt: -1 });

    res.json(tasks);
});

// @desc    Update task status (e.g. from pending to in_progress)
// @route   PUT /api/tasks/:id/status
// @access  Private (Both Student and Recruiter can do this)
const updateTaskStatus = asyncHandler(async (req, res) => {
    const { status } = req.body;
    const task = await Task.findById(req.params.id);

    if (!task) {
        res.status(404);
        throw new Error('Task not found');
    }

    // Verify ownership
    if (task.student.toString() !== req.user._id.toString() &&
        task.recruiter.toString() !== req.user._id.toString() &&
        req.user.role !== 'admin') {
        res.status(401);
        throw new Error('Not authorized to update this task');
    }

    task.status = status;
    const updatedTask = await task.save();
    res.json(updatedTask);
});

// @desc    Submit a completed task (Student Action)
// @route   PUT /api/tasks/:id/submit
// @access  Private/Student
const submitTask = asyncHandler(async (req, res) => {
    const { submissionNotes, submissionFiles } = req.body;
    const task = await Task.findById(req.params.id);

    if (!task) {
        res.status(404);
        throw new Error('Task not found');
    }

    // Only the assigned student can submit it
    if (task.student.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error('Not authorized to submit this task');
    }

    task.status = 'completed';
    task.submissionNotes = submissionNotes;
    task.submissionFiles = submissionFiles || [];
    task.submissionDate = Date.now();

    const submittedTask = await task.save();
    res.json(submittedTask);
});

// @desc    Review and rate a submitted task (Recruiter Action)
// @route   PUT /api/tasks/:id/review
// @access  Private/Recruiter
const reviewTask = asyncHandler(async (req, res) => {
    const { rating, feedback } = req.body;
    const task = await Task.findById(req.params.id);

    if (!task) {
        res.status(404);
        throw new Error('Task not found');
    }

    // Only the assigning recruiter can review it
    if (task.recruiter.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        res.status(401);
        throw new Error('Not authorized to review this task');
    }

    if (task.status !== 'completed') {
        res.status(400);
        throw new Error('Cannot review a task that is not completed');
    }

    task.rating = rating;
    task.feedback = feedback;

    const reviewedTask = await task.save();
    res.json(reviewedTask);
});


module.exports = {
    assignTask,
    getMyTasks,
    getAssignedTasks,
    updateTaskStatus,
    submitTask,
    reviewTask
};
