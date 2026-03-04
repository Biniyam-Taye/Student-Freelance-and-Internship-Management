import api from './api';

const aiService = {
    getRecommendations: () => api.get('/ai/recommendations'),
    getSkillGapAnalysis: (opportunityId) => api.post('/ai/skill-gap', { opportunityId }),
};

export default aiService;
