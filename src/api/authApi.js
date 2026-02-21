import apiClient from './axiosConfig';

// Simulated dummy API calls
export const authApi = {
    login: async (credentials) => {
        // Real call: return apiClient.post('/auth/login', credentials);
        
        // Dummy implementation
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (credentials.email === 'test@example.com' && credentials.password === 'password') {
                    resolve({
                        data: {
                            token: 'dummy-token-123',
                            user: { id: 1, name: 'John Doe', email: 'test@example.com' }
                        }
                    });
                } else {
                    reject({ response: { data: { message: 'Invalid credentials' } } });
                }
            }, 1000);
        });
    },

    signup: async (userData) => {
        
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    data: {
                        token: 'dummy-token-456',
                        user: { id: 2, ...userData }
                    }
                });
            }, 1000);
        });
    },

    logout: () => {
        localStorage.removeItem('token');
    }
};
