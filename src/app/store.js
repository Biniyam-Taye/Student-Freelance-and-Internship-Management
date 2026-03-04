import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import themeReducer from '../features/theme/themeSlice';
import languageReducer from '../features/language/languageSlice';
import notificationReducer from '../features/notifications/notificationSlice';
import chatReducer from '../features/chat/chatSlice';
import opportunityReducer from '../features/opportunities/opportunitySlice';
import applicationReducer from '../features/applications/applicationSlice';
import taskReducer from '../features/tasks/taskSlice';
import adminReducer from '../features/admin/adminSlice';
import aiReducer from '../features/ai/aiSlice';
import postReducer from '../features/feed/postSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        theme: themeReducer,
        language: languageReducer,
        notifications: notificationReducer,
        chat: chatReducer,
        opportunities: opportunityReducer,
        applications: applicationReducer,
        tasks: taskReducer,
        admin: adminReducer,
        ai: aiReducer,
        feed: postReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({ serializableCheck: false }),
});

export default store;
