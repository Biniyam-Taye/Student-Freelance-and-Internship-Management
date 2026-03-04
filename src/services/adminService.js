import api from './api';

const adminService = {
    getAllUsers: () => api.get('/admin/users'),
    getUserById: (id) => api.get(`/admin/users/${id}`),
    verifyRecruiter: (id) => api.put(`/admin/users/${id}/verify`),
    updateUserStatus: (id, status) => api.put(`/admin/users/${id}/status`, { status }),
    deleteUser: (id) => api.delete(`/admin/users/${id}`),
    getAnalytics: () => api.get('/admin/analytics'),
};

export default adminService;
