import api from './api';

const opportunityService = {
    getAll: (keyword = '', type = '') => api.get(`/opportunities?keyword=${keyword}&type=${type}`),
    getById: (id) => api.get(`/opportunities/${id}`),
    create: (data) => api.post('/opportunities', data),
    update: (id, data) => api.put(`/opportunities/${id}`, data),
    remove: (id) => api.delete(`/opportunities/${id}`),
};

export default opportunityService;
