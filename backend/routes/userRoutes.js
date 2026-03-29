const express = require('express');
const router = express.Router();
const {
    registerUser,
    authUser,
    getUserProfile,
    forgotPassword,
    resetPassword,
} = require('../controllers/authController');
const { updateUserProfile } = require('../controllers/profileController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/', registerUser);
router.post('/login', authUser);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:resettoken', resetPassword);

router.route('/profile')
    .get(protect, getUserProfile)
    .put(protect, updateUserProfile);

module.exports = router;

