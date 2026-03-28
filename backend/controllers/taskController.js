const asyncHandler = require('express-async-handler');
const Task = require('../models/Task');
const User = require('../models/User');

// @desc    Assign a new task to a student
// @route   POST /api/tasks
// @access  Private/Recruiter or Supervisor
const assignTask = asyncHandler(async (req, res) => {
    const { studentId, title, description, deadline, priority, opportunityId } = req.body;

    // Verify student exists and is actually a student
    const student = await User.findById(studentId);
    if (!student || student.role !== 'student') {
        res.status(404);
        throw new Error('Valid student not found');
    }

    // Determine who owns this task:
    // - If a recruiter assigns it directly, recruiter is req.user
    // - If a supervisor assigns it, recruiter comes from supervisor.managerRecruiter
    let recruiterId = req.user._id;
    let supervisorId = null;

    if (req.user.role === 'supervisor') {
        const supervisor = await User.findById(req.user._id);
        if (!supervisor || !supervisor.managerRecruiter) {
            res.status(400);
            throw new Error('Supervisor is not linked to a recruiter');
        }

        // BACKEND ENFORCEMENT: A supervisor can ONLY assign a task if the manager specifically assigned this student to them
        const Application = require('../models/Application');
        const application = await Application.findOne({ student: studentId, opportunity: opportunityId });
        
        if (!application || !application.assignedSupervisor || application.assignedSupervisor.toString() !== req.user._id.toString()) {
            res.status(403);
            throw new Error('Not authorized to assign tasks to this student. The manager must assign them to you first.');
        }

        recruiterId = supervisor.managerRecruiter;
        supervisorId = supervisor._id;
    }

    const taskPayload = {
        recruiter: recruiterId,
        student: studentId,
        opportunity: opportunityId,
        title,
        description,
        deadline,
        priority
    };

    if (supervisorId) {
        taskPayload.supervisor = supervisorId;
    }

    const task = await Task.create(taskPayload);

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

// @desc    Get all tasks assigned by the logged in recruiter/supervisor
// @route   GET /api/tasks/assigned-tasks
// @access  Private/Recruiter or Supervisor
const getAssignedTasks = asyncHandler(async (req, res) => {
    const filter = {};

    if (req.user.role === 'supervisor') {
        filter.supervisor = req.user._id;
    } else {
        filter.recruiter = req.user._id;
    }

    const tasks = await Task.find(filter)
        .populate('student', 'name email avatar')
        .populate('opportunity', 'position company')
        .sort({ createdAt: -1 });

    res.json(tasks);
});

// @desc    Update task status (e.g. from pending to in_progress)
// @route   PUT /api/tasks/:id/status
// @access  Private (Both Student and Recruiter can do this)
const updateTaskStatus = asyncHandler(async (req, res) => {
    const { status, progress } = req.body;
    const task = await Task.findById(req.params.id);

    if (!task) {
        res.status(404);
        throw new Error('Task not found');
    }

    // Verify ownership
    if (
        task.student.toString() !== req.user._id.toString() &&
        task.recruiter.toString() !== req.user._id.toString() &&
        (!task.supervisor || task.supervisor.toString() !== req.user._id.toString()) &&
        req.user.role !== 'admin'
    ) {
        res.status(401);
        throw new Error('Not authorized to update this task');
    }

    if (status) task.status = status;
    if (progress !== undefined) task.progress = Number(progress);
    if (task.status === 'completed') task.progress = 100; // Auto 100% on completion

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
    task.progress = 100;
    task.submissionNotes = submissionNotes;
    task.submissionFiles = submissionFiles || [];
    task.submissionDate = Date.now();

    const submittedTask = await task.save();
    res.json(submittedTask);
});

// @desc    Review and rate a submitted task (Recruiter/Supervisor Action)
// @route   PUT /api/tasks/:id/review
// @access  Private/Recruiter or Supervisor
const reviewTask = asyncHandler(async (req, res) => {
    const { rating, feedback } = req.body;
    const task = await Task.findById(req.params.id);

    if (!task) {
        res.status(404);
        throw new Error('Task not found');
    }

    // Only the assigning recruiter/supervisor (or admin) can review it
    const isRecruiterOwner = task.recruiter.toString() === req.user._id.toString();
    const isSupervisorOwner = task.supervisor && task.supervisor.toString() === req.user._id.toString();

    if (!isRecruiterOwner && !isSupervisorOwner && req.user.role !== 'admin') {
        res.status(401);
        throw new Error('Not authorized to review this task');
    }

    if (task.status !== 'completed') {
        res.status(400);
        throw new Error('Cannot review a task that is not completed');
    }

    const numRating = rating != null ? Number(rating) : null;
    if (numRating != null && (numRating < 1 || numRating > 5)) {
        res.status(400);
        throw new Error('Rating must be between 1 and 5');
    }

    task.rating = numRating;
    task.feedback = feedback != null ? String(feedback).trim() : '';

    await task.save();
    const reviewedTask = await Task.findById(task._id).populate('student', 'name email avatar');
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
