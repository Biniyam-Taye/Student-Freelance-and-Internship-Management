import { createSlice } from '@reduxjs/toolkit';

const notificationSlice = createSlice({
    name: 'notifications',
    initialState: {
        items: [
            { id: 1, title: 'Application Update', message: 'Your application to TechEthiopia has been shortlisted!', time: '2m ago', read: false, type: 'success' },
            { id: 2, title: 'New Message', message: 'Sara Tadesse sent you a message.', time: '1h ago', read: false, type: 'info' },
            { id: 3, title: 'Task Deadline', message: 'Task "UI Design" is due tomorrow.', time: '3h ago', read: true, type: 'warning' },
        ],
        unreadCount: 2,
    },
    reducers: {
        markAsRead: (state, action) => {
            const notif = state.items.find((n) => n.id === action.payload);
            if (notif && !notif.read) {
                notif.read = true;
                state.unreadCount = Math.max(0, state.unreadCount - 1);
            }
        },
        markAllAsRead: (state) => {
            state.items.forEach((n) => { n.read = true; });
            state.unreadCount = 0;
        },
        addNotification: (state, action) => {
            state.items.unshift(action.payload);
            state.unreadCount += 1;
        },
        removeNotification: (state, action) => {
            state.items = state.items.filter((n) => n.id !== action.payload);
        },
    },
});

export const { markAsRead, markAllAsRead, addNotification, removeNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
