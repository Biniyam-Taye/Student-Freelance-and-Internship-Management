const express = require('express');
const router = express.Router();
const {
    sendMessage,
    getConversation,
    getConversationsList,
    getUnreadCount
} = require('../controllers/messageController');
const { protect } = require('../middlewares/authMiddleware');

// All message routes are private
router.post('/', protect, sendMessage);
router.get('/conversations/list', protect, getConversationsList);
router.get('/unread/count', protect, getUnreadCount);
router.get('/:otherUserId', protect, getConversation);

module.exports = router;
