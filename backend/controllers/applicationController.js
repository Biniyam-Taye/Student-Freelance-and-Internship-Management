const asyncHandler = require('express-async-handler');
const Application = require('../models/Application');
const Opportunity = require('../models/Opportunity');

// @desc    Apply to an Opportunity
// @route   POST /api/applications/:opportunityId
// @access  Private/Student
const applyForOpportunity = asyncHandler(async (req, res) => {
    const { coverLetter, resumeUrl } = req.body;
    const opportunityId = req.params.opportunityId;

    const opportunity = await Opportunity.findById(opportunityId);

    if (!opportunity) {
        res.status(404);
        throw new Error('Opportunity not found');
    }

    if (opportunity.status !== 'open') {
        res.status(400);
        throw new Error('This opportunity is closed');
    }

    // Check if the student has already applied
    const alreadyApplied = await Application.findOne({
        opportunity: opportunityId,
        student: req.user._id
    });

    if (alreadyApplied) {
        res.status(400);
        throw new Error('You have already applied to this opportunity');
    }

    const application = await Application.create({
        opportunity: opportunityId,
        student: req.user._id,
        recruiter: opportunity.recruiter, // store recruiter ID to easily query applications for them
        coverLetter,
        resumeUrl
    });

    // Increment applicant count for the opportunity
    opportunity.applicantsCount += 1;
    await opportunity.save();

    res.status(201).json(application);
});

// @desc    Get current student's applications
// @route   GET /api/applications/myapplications
// @access  Private/Student
const getMyApplications = asyncHandler(async (req, res) => {
    const applications = await Application.find({ student: req.user._id })
        .populate({
            path: 'opportunity',
            select: 'position company location stipend type'
        })
        .sort({ createdAt: -1 });

    res.json(applications);
});

// Helper: compute skill match between a job and a student (deterministic + explainable)
// Returns { matchScore: number|null, details: { matchedSkills, missingSkills, matchedCount, requiredCount, reason } }
const computeSkillMatch = (jobSkills = [], studentSkills = []) => {
    const normalize = (s) =>
        s
            .toString()
            .toLowerCase()
            .trim()
            .replace(/[()]/g, ' ')
            .replace(/[\s]+/g, ' ')
            .replace(/[.+]/g, '.'); // keep node.js style dots

    // Common aliases so "js" matches "javascript", etc.
    const alias = new Map([
        ['js', 'javascript'],
        ['java script', 'javascript'],
        ['ts', 'typescript'],
        ['node', 'node.js'],
        ['nodejs', 'node.js'],
        ['reactjs', 'react'],
        ['nextjs', 'next.js'],
        ['expressjs', 'express'],
        ['mongo', 'mongodb'],
        ['postgres', 'postgresql'],
        ['py', 'python'],
        ['c sharp', 'c#'],
        ['dotnet', '.net'],
    ]);

    const splitSkillString = (value) => {
        const str = normalize(value);
        // Handle "React, Node, MongoDB" or "React / Node" inside a single entry
        return str
            .split(/[,/|]/g)
            .map((t) => t.trim())
            .filter(Boolean);
    };

    const canonicalize = (raw) => {
        const n = normalize(raw);
        return alias.get(n) || n;
    };

    const rawJob = Array.isArray(jobSkills) ? jobSkills : [];
    const rawStudent = Array.isArray(studentSkills) ? studentSkills : [];

    const jobTokens = rawJob.flatMap(splitSkillString).map(canonicalize).filter(Boolean);
    const studentTokens = rawStudent.flatMap(splitSkillString).map(canonicalize).filter(Boolean);

    if (jobTokens.length === 0) {
        return {
            matchScore: null,
            details: {
                matchedSkills: [],
                missingSkills: [],
                matchedCount: 0,
                requiredCount: 0,
                reason: 'missing_job_skills',
            },
        };
    }
    if (studentTokens.length === 0) {
        return {
            matchScore: null,
            details: {
                matchedSkills: [],
                missingSkills: [...new Set(jobTokens)],
                matchedCount: 0,
                requiredCount: jobTokens.length,
                reason: 'missing_student_skills',
            },
        };
    }

    const studentSet = new Set(studentTokens);

    // Match rule:
    // - exact canonical match, OR
    // - substring match for multi-word skills (e.g., "react native" matches "react")
    const isMatched = (jobSkill) => {
        if (studentSet.has(jobSkill)) return true;
        for (const s of studentSet) {
            if (!s || !jobSkill) continue;
            if (s.includes(jobSkill) || jobSkill.includes(s)) return true;
        }
        return false;
    };

    const uniqueJob = [...new Set(jobTokens)];
    const matched = uniqueJob.filter(isMatched);
    const missing = uniqueJob.filter((s) => !matched.includes(s));

    const requiredCount = uniqueJob.length;
    const matchedCount = matched.length;
    const ratio = requiredCount === 0 ? 0 : matchedCount / requiredCount;
    const matchScore = Math.round(ratio * 100);

    return {
        matchScore,
        details: {
            matchedSkills: matched,
            missingSkills: missing,
            matchedCount,
            requiredCount,
            reason: 'ok',
        },
    };
};

// @desc    Get all applications for the recruiter across all their jobs
// @route   GET /api/applications/recruiter
// @access  Private/Recruiter
const getRecruiterApplications = asyncHandler(async (req, res) => {
    const applications = await Application.find({ recruiter: req.user._id })
        .populate('student', 'name email university major skills avatar')
        .populate('opportunity', 'position company type skills')
        .sort({ createdAt: -1 });

    const withMatch = applications.map(app => {
        const obj = app.toObject();
        const jobSkills = obj.opportunity?.skills || [];
        const studentSkills = obj.student?.skills || [];
        const { matchScore, details } = computeSkillMatch(jobSkills, studentSkills);
        return {
            ...obj,
            matchScore,
            matchDetails: details,
        };
    });

    res.json(withMatch);
});

// @desc    Get applications for a specific job (Recruiter view)
// @route   GET /api/applications/job/:opportunityId
// @access  Private/Recruiter
const getApplicationsForJob = asyncHandler(async (req, res) => {
    const opportunity = await Opportunity.findById(req.params.opportunityId);

    if (!opportunity) {
        res.status(404);
        throw new Error('Opportunity not found');
    }

    // Verify this recruiter owns the job
    if (opportunity.recruiter.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        res.status(401);
        throw new Error('Not authorized to view these applications');
    }

    const applications = await Application.find({ opportunity: req.params.opportunityId })
        .populate('student', 'name email university major skills avatar')
        .populate('opportunity', 'position company type skills')
        .sort({ createdAt: -1 });

    const withMatch = applications.map(app => {
        const obj = app.toObject();
        const jobSkills = obj.opportunity?.skills || [];
        const studentSkills = obj.student?.skills || [];
        const { matchScore, details } = computeSkillMatch(jobSkills, studentSkills);
        return {
            ...obj,
            matchScore,
            matchDetails: details,
        };
    });

    res.json(withMatch);
});

// @desc    Update application status (Recruiter Action)
// @route   PUT /api/applications/:id/status
// @access  Private/Recruiter
const updateApplicationStatus = asyncHandler(async (req, res) => {
    const { status } = req.body;

    // Validate status
    if (!['pending', 'shortlisted', 'accepted', 'rejected'].includes(status)) {
        res.status(400);
        throw new Error('Invalid status update');
    }

    const application = await Application.findById(req.params.id);

    if (!application) {
        res.status(404);
        throw new Error('Application not found');
    }

    // Verify authorized recruiter
    if (application.recruiter.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        res.status(401);
        throw new Error('Not authorized to change this application status');
    }

    application.status = status;
    const updatedApplication = await application.save();

    res.json(updatedApplication);
});

module.exports = {
    applyForOpportunity,
    getMyApplications,
    getApplicationsForJob,
    getRecruiterApplications,
    updateApplicationStatus
};
