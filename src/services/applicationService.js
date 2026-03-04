import api from './api';

const applicationService = {
    applyForOpportunity: (opportunityId, data) => api.post(`/applications/${opportunityId}`, data),
    getMyApplications: () => api.get('/applications/myapplications'),
    getRecruiterApplications: () => api.get('/applications/recruiter'),
    getApplicationsForJob: (opportunityId) => api.get(`/applications/job/${opportunityId}`),
    updateStatus: (applicationId, status) => api.put(`/applications/${applicationId}/status`, { status }),
};

export default applicationService;
