import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import themeReducer from '../features/theme/themeSlice';
import languageReducer from '../features/language/languageSlice';
import notificationReducer from '../features/notifications/notificationSlice';
import chatReducer from '../features/chat/chatSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        theme: themeReducer,
        language: languageReducer,
        notifications: notificationReducer,
        chat: chatReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({ serializableCheck: false }),
});

export default store;
