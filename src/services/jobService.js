import api from './api';

const jobService = {
    getOpportunities: (params) => api.get('/opportunities', { params }),
    getOpportunityById: (id) => api.get(`/opportunities/${id}`),
    createOpportunity: (data) => api.post('/opportunities', data),
    updateOpportunity: (id, data) => api.put(`/opportunities/${id}`, data),
    deleteOpportunity: (id) => api.delete(`/opportunities/${id}`),
    applyToOpportunity: (id) => api.post(`/opportunities/${id}/apply`),
    getApplications: (params) => api.get('/applications', { params }),
    updateApplicationStatus: (id, status) => api.patch(`/applications/${id}/status`, { status }),
    getMyApplications: () => api.get('/applications/me'),
};

export default jobService;
