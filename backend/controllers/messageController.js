const asyncHandler = require('express-async-handler');
const Message = require('../models/Message');
const User = require('../models/User');

// @desc    Send a message
// @route   POST /api/messages
// @access  Private
const sendMessage = asyncHandler(async (req, res) => {
    const { receiverId, content } = req.body;

    // Verify receiver exists
    const receiver = await User.findById(receiverId);
    if (!receiver) {
        res.status(404);
        throw new Error('User not found');
    }

    if (receiverId.toString() === req.user._id.toString()) {
        res.status(400);
        throw new Error('You cannot send a message to yourself');
    }

    const message = await Message.create({
        sender: req.user._id,
        receiver: receiverId,
        content
    });

    res.status(201).json(message);
});

// @desc    Get conversation between logged-in user and another specific user
// @route   GET /api/messages/:otherUserId
// @access  Private
const getConversation = asyncHandler(async (req, res) => {
    const otherUserId = req.params.otherUserId;

    // Find all messages where I am sender and they are receiver OR I am receiver and they are sender
    const messages = await Message.find({
        $or: [
            { sender: req.user._id, receiver: otherUserId },
            { sender: otherUserId, receiver: req.user._id }
        ]
    })
        .sort({ createdAt: 1 }) // Retrieve oldest first (chronological order)
        .populate('sender', 'name avatar')
        .populate('receiver', 'name avatar');

    // Mark messages from the other user as read
    await Message.updateMany(
        { sender: otherUserId, receiver: req.user._id, read: false },
        { $set: { read: true } }
    );

    res.json(messages);
});

// @desc    Get list of unique users the logged in user has conversed with
// @route   GET /api/messages/conversations/list
// @access  Private
const getConversationsList = asyncHandler(async (req, res) => {
    // Find all unique senders to me
    const senders = await Message.distinct('sender', { receiver: req.user._id });

    // Find all unique receivers from me
    const receivers = await Message.distinct('receiver', { sender: req.user._id });

    // Merge and deduplicate, ignoring my own ID
    const contactIds = [...new Set([...senders, ...receivers].map(id => id.toString()))]
        .filter(id => id !== req.user._id.toString());

    // Fetch the User profiles for these IDs
    const contacts = await User.find({ _id: { $in: contactIds } })
        .select('name avatar role company university');

    res.json(contacts);
});

// @desc    Get count of unread messages for logged in user
// @route   GET /api/messages/unread/count
// @access  Private
const getUnreadCount = asyncHandler(async (req, res) => {
    const count = await Message.countDocuments({
        receiver: req.user._id,
        read: false,
    });

    res.json({ count });
});

module.exports = {
    sendMessage,
    getConversation,
    getConversationsList,
    getUnreadCount,
};
