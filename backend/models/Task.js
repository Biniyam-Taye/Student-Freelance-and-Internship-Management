const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    opportunity: { // Optional: The specific internship this task belongs to
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Opportunity'
    },
    recruiter: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    // Optional: when a supervisor is the middleman handling this task
    supervisor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    student: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    title: {
        type: String,
        required: [true, 'Please add a task title'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Please add a task description']
    },
    deadline: {
        type: Date,
        required: true
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium'
    },
    status: {
        type: String,
        enum: ['pending', 'in_progress', 'completed'],
        default: 'pending'
    },
    progress: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    // Student Submission Fields
    submissionNotes: {
        type: String
    },
    submissionFiles: {
        type: [String] // Array of file URLs
    },
    submissionDate: {
        type: Date
    },
    // Recruiter Review Fields
    rating: {
        type: Number,
        min: 1,
        max: 5
    },
    feedback: {
        type: String
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Task', taskSchema);
