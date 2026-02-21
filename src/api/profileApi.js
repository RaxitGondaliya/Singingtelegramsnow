import apiClient from './axiosConfig';

export const profileApi = {
    getProfile: async () => {
        // Real call: return apiClient.get('/profile');
        
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    data: {
                        id: 1,
                        name: 'John Doe',
                        email: 'john@example.com',
                        phone: '+1 234 567 8900',
                        rating: 4.8,
                        avatar: null
                    }
                });
            }, 500);
        });
    },

    updateProfile: async (profileData) => {
        // Real call: return apiClient.put('/profile', profileData);
        
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({ data: { ...profileData, message: 'Profile updated successfully' } });
            }, 1000);
        });
    },

    getEarnings: async () => {
        // Real call: return apiClient.get('/profile/earnings');
        
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    data: {
                        totalEarnings: 1250.50,
                        monthlyEarnings: [
                            { month: 'January', amount: 450.00 },
                            { month: 'February', amount: 800.50 }
                        ]
                    }
                });
            }, 700);
        });
    },

    getCharacters: async () => {
        // Real call: return apiClient.get('/profile/characters');
        
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    data: [
                        { id: 1, name: 'Spider-Man', description: 'Friendly neighborhood hero' },
                        { id: 2, name: 'Batman', description: 'The dark knight' }
                    ]
                });
            }, 800);
        });
    },

    addCharacter: async (charData) => {
        // Real call: return apiClient.post('/profile/characters', charData);
        
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({ data: { id: Date.now(), ...charData, message: 'Character added' } });
            }, 1200);
        });
    }
};
