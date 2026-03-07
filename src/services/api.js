import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const api = axios.create({
    baseURL: BASE_URL,
    timeout: 15000,
    headers: { 'Content-Type': 'application/json' },
});

// Request interceptor: attach token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken');
        if (token) config.headers.Authorization = `Bearer ${token}`;
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor: handle errors globally
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Only clear the token — don't force redirect here.
            // The ProtectedRoute component will navigate to /login naturally
            // when Redux state is cleared, preventing flash redirects on
            // legitimate upload/profile requests.
            localStorage.removeItem('authToken');
        }
        return Promise.reject(error);
    }
);

export default api;
