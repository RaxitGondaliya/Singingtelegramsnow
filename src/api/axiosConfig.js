import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api/v2';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

let requestCount = 0;

const showLoader = () => {
    if (requestCount === 0) {
        window.dispatchEvent(new CustomEvent('apiLoadStart'));
    }
    requestCount++;
};

const hideLoader = () => {
    requestCount--;
    if (requestCount <= 0) {
        requestCount = 0; // prevent negative counting just in case
        window.dispatchEvent(new CustomEvent('apiLoadEnd'));
    }
};

apiClient.interceptors.request.use(
    (config) => {
        if (!config.hideLoader) {
            showLoader();
        }
        
        const token = localStorage.getItem('token');
        if (token && token !== 'undefined' && token !== 'null') {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        if (error.config && !error.config.hideLoader) {
            hideLoader();
        }
        return Promise.reject(error);
    }
);

// Response interceptor for handling common errors
apiClient.interceptors.response.use(
    (response) => {
        if (response.config && !response.config.hideLoader) {
            hideLoader();
        }
        return response;
    },
    (error) => {
        if (error.config && !error.config.hideLoader) {
            hideLoader();
        }
        
        if (error.response && error.response.status === 401) {
            // Optional: Handle logout on 401
            localStorage.removeItem('token');
            window.location.href = '/signin';
        }
        return Promise.reject(error);
    }
);

export default apiClient;
