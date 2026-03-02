import { createSlice } from '@reduxjs/toolkit';

const MOCK_USERS = {
    student: {
        id: '1', name: 'Abebe Girma', email: 'student@demo.com',
        role: 'student', avatar: null, university: 'Addis Ababa University',
        major: 'Computer Science', skills: ['React', 'Python', 'JavaScript'],
        rating: 4.7, completedTasks: 12, successRate: 85,
    },
    recruiter: {
        id: '2', name: 'Sara Tadesse', email: 'recruiter@demo.com',
        role: 'recruiter', avatar: null, company: 'TechEthiopia',
        industry: 'Technology', hiringRate: 72,
    },
    admin: {
        id: '3', name: 'Admin User', email: 'admin@demo.com',
        role: 'admin', avatar: null,
    },
};

const initialState = {
    user: null,
    token: localStorage.getItem('authToken') || null,
    isAuthenticated: false,
    loading: false,
    error: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginStart: (state) => { state.loading = true; state.error = null; },
        loginSuccess: (state, action) => {
            state.loading = false;
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.isAuthenticated = true;
            localStorage.setItem('authToken', action.payload.token);
        },
        loginFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            localStorage.removeItem('authToken');
        },
        updateUser: (state, action) => {
            state.user = { ...state.user, ...action.payload };
        },
        clearError: (state) => { state.error = null; },
        // Mock login helper
        mockLogin: (state, action) => {
            const role = action.payload;
            const user = MOCK_USERS[role];
            state.user = user;
            state.token = `mock-token-${role}`;
            state.isAuthenticated = true;
            localStorage.setItem('authToken', `mock-token-${role}`);
        },
    },
});

export const { loginStart, loginSuccess, loginFailure, logout, updateUser, clearError, mockLogin } = authSlice.actions;
export default authSlice.reducer;
