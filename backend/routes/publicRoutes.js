const express = require('express');
const router = express.Router();
const { getPublicRecruiters } = require('../controllers/publicController');

// Public, read-only endpoints
router.get('/recruiters', getPublicRecruiters);

module.exports = router;

