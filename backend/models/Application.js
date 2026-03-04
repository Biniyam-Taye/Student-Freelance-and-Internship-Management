const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
    opportunity: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Opportunity'
    },
    student: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    recruiter: { // Duplicate ref to make querying by recruiter easier
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    coverLetter: {
        type: String,
        trim: true
    },
    resumeUrl: {
        type: String,
        default: ''
    },
    status: {
        type: String,
        enum: ['pending', 'shortlisted', 'accepted', 'rejected'],
        default: 'pending'
    },
    aiMatchScore: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Prevent a student from applying to the same opportunity twice
applicationSchema.index({ opportunity: 1, student: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);
