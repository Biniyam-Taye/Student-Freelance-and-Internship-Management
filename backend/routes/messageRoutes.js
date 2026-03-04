const express = require('express');
const router = express.Router();
const {
    sendMessage,
    getConversation,
    getConversationsList
} = require('../controllers/messageController');
const { protect } = require('../middlewares/authMiddleware');

// All message routes are private
router.post('/', protect, sendMessage);
router.get('/conversations/list', protect, getConversationsList);
router.get('/:otherUserId', protect, getConversation);

module.exports = router;
