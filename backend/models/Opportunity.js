const mongoose = require('mongoose');

const opportunitySchema = new mongoose.Schema({
    recruiter: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    position: {
        type: String,
        required: [true, 'Please add a position title'],
        trim: true
    },
    company: {
        type: String,
        required: [true, 'Please add a company name']
    },
    description: {
        type: String,
        required: [true, 'Please add a description']
    },
    type: {
        type: String,
        required: true,
        enum: ['internship', 'freelance', 'part-time', 'full-time']
    },
    location: {
        type: String,
        required: true
    },
    stipend: {
        type: String,
        required: false,
        default: ''
    },
    duration: {
        type: String,
        required: false,
        default: ''
    },
    deadline: {
        type: Date,
        required: true
    },
    skills: {
        type: [String],
        required: true
    },
    applicantsCount: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['open', 'closed'],
        default: 'open'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Opportunity', opportunitySchema);
