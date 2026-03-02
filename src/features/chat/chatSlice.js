import { createSlice } from '@reduxjs/toolkit';

const MOCK_CONVERSATIONS = [
    {
        id: 'conv1', user: { id: 'u2', name: 'Sara Tadesse', role: 'recruiter', online: true },
        lastMessage: 'Looking forward to your submission!', time: '2m ago', unread: 2,
        messages: [
            { id: 'm1', senderId: 'u2', text: 'Hi! We reviewed your profile and are impressed.', time: '10:00 AM' },
            { id: 'm2', senderId: 'u1', text: 'Thank you so much! I am very interested in the opportunity.', time: '10:05 AM' },
            { id: 'm3', senderId: 'u2', text: 'Great! We would like to assign you a small task to evaluate your skills.', time: '10:10 AM' },
            { id: 'm4', senderId: 'u1', text: 'Sure, I am ready!', time: '10:12 AM' },
            { id: 'm5', senderId: 'u2', text: 'Looking forward to your submission!', time: '10:15 AM' },
        ],
    },
    {
        id: 'conv2', user: { id: 'u3', name: 'Yonas Bekele', role: 'recruiter', online: false },
        lastMessage: 'We will get back to you soon.', time: '1h ago', unread: 0,
        messages: [
            { id: 'm6', senderId: 'u3', text: 'Hello, we received your application.', time: '9:00 AM' },
            { id: 'm7', senderId: 'u1', text: 'Thank you for considering my application!', time: '9:05 AM' },
            { id: 'm8', senderId: 'u3', text: 'We will get back to you soon.', time: '9:08 AM' },
        ],
    },
    {
        id: 'conv3', user: { id: 'u4', name: 'Hana Mekonnen', role: 'student', online: true },
        lastMessage: 'Can you review my portfolio?', time: '3h ago', unread: 1,
        messages: [
            { id: 'm9', senderId: 'u4', text: 'Hi! I noticed you are working on a similar project.', time: '7:00 AM' },
            { id: 'm10', senderId: 'u1', text: 'Yes! Happy to collaborate.', time: '7:20 AM' },
            { id: 'm11', senderId: 'u4', text: 'Can you review my portfolio?', time: '7:30 AM' },
        ],
    },
];

const chatSlice = createSlice({
    name: 'chat',
    initialState: {
        conversations: MOCK_CONVERSATIONS,
        activeConversationId: 'conv1',
        totalUnread: 3,
    },
    reducers: {
        setActiveConversation: (state, action) => {
            state.activeConversationId = action.payload;
            const conv = state.conversations.find((c) => c.id === action.payload);
            if (conv) {
                state.totalUnread = Math.max(0, state.totalUnread - conv.unread);
                conv.unread = 0;
            }
        },
        sendMessage: (state, action) => {
            const { conversationId, message } = action.payload;
            const conv = state.conversations.find((c) => c.id === conversationId);
            if (conv) {
                conv.messages.push(message);
                conv.lastMessage = message.text;
                conv.time = 'Just now';
            }
        },
    },
});

export const { setActiveConversation, sendMessage } = chatSlice.actions;
export default chatSlice.reducer;
