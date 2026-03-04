const express = require('express');
const router = express.Router();
const {
    getAllUsers,
    getUserById,
    verifyRecruiter,
    updateUserStatus,
    deleteUser,
    getAnalytics
} = require('../controllers/adminController');
const { protect, admin } = require('../middlewares/authMiddleware');

// All routes are Private/Admin
router.use(protect, admin);

router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.put('/users/:id/verify', verifyRecruiter);
router.put('/users/:id/status', updateUserStatus);
router.delete('/users/:id', deleteUser);
router.get('/analytics', getAnalytics);

module.exports = router;
