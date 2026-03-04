const express = require('express');
const router = express.Router();
const {
    getOpportunities,
    getOpportunityById,
    createOpportunity,
    updateOpportunity,
    deleteOpportunity
} = require('../controllers/opportunityController');
const { protect, recruiter } = require('../middlewares/authMiddleware');

router.route('/')
    .get(getOpportunities)
    .post(protect, recruiter, createOpportunity); // Only verified recruiters can POST

router.route('/:id')
    .get(getOpportunityById)
    .put(protect, recruiter, updateOpportunity) // Only original recruiter/admin
    .delete(protect, recruiter, deleteOpportunity);

module.exports = router;
