import api from './api';

const messageService = {
    // Send a message to another user
    sendMessage: (receiverId, content) => api.post('/messages', { receiverId, content }),

    // Get all messages in a conversation with another user
    getConversation: (otherUserId) => api.get(`/messages/${otherUserId}`),

    // Get list of contacts the user has conversed with
    getConversationsList: () => api.get('/messages/conversations/list'),

    // Get total unread messages for the current user
    getUnreadCount: () => api.get('/messages/unread/count'),
};

export default messageService;
