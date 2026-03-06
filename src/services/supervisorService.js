import api from './api';

const supervisorService = {
    getPending: () => api.get('/supervisors/pending'),
    getMine: () => api.get('/supervisors/mine'),
    approve: (id) => api.put(`/supervisors/${id}/approve`),
    reject: (id) => api.put(`/supervisors/${id}/reject`),
};

export default supervisorService;

