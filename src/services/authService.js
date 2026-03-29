import api from './api';

const authService = {
    login: (credentials) => api.post('/users/login', credentials),
    register: (userData) => api.post('/users', userData),
    logout: () => api.post('/users/logout'), // Optionally implement this on backend or just remove token locally
    getProfile: () => api.get('/users/profile'),
    updateProfile: (data) => api.put('/users/profile', data),
    forgotPassword: (email) => api.post('/users/forgotpassword', { email }),
    resetPassword: (token, password) => api.put(`/users/resetpassword/${token}`, { password })
};

export default authService;
