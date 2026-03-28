import api from './api';

const taskService = {
    assignTask: (data) => api.post('/tasks', data),
    getMyTasks: () => api.get('/tasks/my-tasks'),
    getAssignedTasks: () => api.get('/tasks/assigned-tasks'),
    updateStatus: (id, payload) => api.put(`/tasks/${id}/status`, payload),
    submitTask: (id, submission) => api.put(`/tasks/${id}/submit`, submission),
    reviewTask: (id, review) => api.put(`/tasks/${id}/review`, review),
};

export default taskService;
