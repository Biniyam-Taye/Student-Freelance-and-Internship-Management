const express = require('express');
const router = express.Router();
const { getRecommendations, getSkillGapAnalysis } = require('../controllers/aiController');
const { protect } = require('../middlewares/authMiddleware');

router.get('/recommendations', protect, getRecommendations);
router.post('/skill-gap', protect, getSkillGapAnalysis);

module.exports = router;
