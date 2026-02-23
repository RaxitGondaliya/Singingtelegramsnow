import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api/v2';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor for adding auth token
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for handling common errors
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Optional: Handle logout on 401
            localStorage.removeItem('token');
            window.location.href = '/signin';
        }
        return Promise.reject(error);
    }
);

export default apiClient;
