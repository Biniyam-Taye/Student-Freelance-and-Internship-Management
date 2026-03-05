const asyncHandler = require('express-async-handler');
const Opportunity = require('../models/Opportunity');

// @desc    Fetch all active opportunities
// @route   GET /api/opportunities
// @access  Public (or protected if only logged-in can view)
const getOpportunities = asyncHandler(async (req, res) => {
    // Basic search/filter functionality
    const keyword = req.query.keyword
        ? {
            $or: [
                { position: { $regex: req.query.keyword, $options: 'i' } },
                { company: { $regex: req.query.keyword, $options: 'i' } },
            ],
        }
        : {};

    const type = req.query.type && req.query.type !== 'All'
        ? { type: req.query.type.toLowerCase() }
        : {};

    // Only return open opportunities
    const filter = { ...keyword, ...type, status: 'open' };

    const opportunities = await Opportunity.find(filter)
        .populate('recruiter', 'name avatar') // Get recruiter details
        .sort({ createdAt: -1 }); // Sort by newest by default

    res.json(opportunities);
});

// @desc    Fetch single opportunity
// @route   GET /api/opportunities/:id
// @access  Public
const getOpportunityById = asyncHandler(async (req, res) => {
    const opportunity = await Opportunity.findById(req.params.id)
        .populate('recruiter', 'name avatar');

    if (opportunity) {
        res.json(opportunity);
    } else {
        res.status(404);
        throw new Error('Opportunity not found');
    }
});

// @desc    Create a new opportunity
// @route   POST /api/opportunities
// @access  Private/Recruiter
const createOpportunity = asyncHandler(async (req, res) => {
    let { position, company, description, type, location, stipend, duration, deadline, skills } = req.body;

    // Fallback: if company isn't explicitly provided in the request,
    // derive it from the authenticated recruiter profile so opportunities
    // are always associated with a visible company name.
    if (!company) {
        company = req.user.company || req.user.name || 'Unknown Company';
    }

    const opportunity = new Opportunity({
        recruiter: req.user._id, // Assign logged in recruiter
        position,
        company,
        description,
        type,
        location,
        stipend,
        duration,
        deadline,
        skills
    });

    const createdOpportunity = await opportunity.save();
    res.status(201).json(createdOpportunity);
});

// @desc    Update an opportunity
// @route   PUT /api/opportunities/:id
// @access  Private/Recruiter
const updateOpportunity = asyncHandler(async (req, res) => {
    const { position, company, description, type, location, stipend, duration, deadline, skills, status } = req.body;

    const opportunity = await Opportunity.findById(req.params.id);

    if (opportunity) {
        // Ensure ONLY the original recruiter (or an admin) can update their job post
        if (opportunity.recruiter.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            res.status(401);
            throw new Error('You are not authorized to update this opportunity');
        }

        opportunity.position = position || opportunity.position;
        opportunity.company = company || opportunity.company;
        opportunity.description = description || opportunity.description;
        opportunity.type = type || opportunity.type;
        opportunity.location = location || opportunity.location;
        opportunity.stipend = stipend || opportunity.stipend;
        opportunity.duration = duration || opportunity.duration;
        opportunity.deadline = deadline || opportunity.deadline;
        opportunity.skills = skills || opportunity.skills;
        opportunity.status = status || opportunity.status;

        const updatedOpportunity = await opportunity.save();
        res.json(updatedOpportunity);
    } else {
        res.status(404);
        throw new Error('Opportunity not found');
    }
});

// @desc    Delete an opportunity
// @route   DELETE /api/opportunities/:id
// @access  Private/Recruiter
const deleteOpportunity = asyncHandler(async (req, res) => {
    const opportunity = await Opportunity.findById(req.params.id);

    if (opportunity) {
        if (opportunity.recruiter.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            res.status(401);
            throw new Error('You are not authorized to delete this opportunity');
        }

        await Opportunity.deleteOne({ _id: opportunity._id });
        res.json({ message: 'Opportunity removed successfully' });
    } else {
        res.status(404);
        throw new Error('Opportunity not found');
    }
});

module.exports = {
    getOpportunities,
    getOpportunityById,
    createOpportunity,
    updateOpportunity,
    deleteOpportunity
};
