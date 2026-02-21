import apiClient from './axiosConfig';

export const bookingApi = {
    getMyBookings: async () => {
        // Real call: return apiClient.get('/bookings/my');
        
        // Dummy implementation
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    data: [
                        { id: 1, character: 'Spider-Man', date: '2026-03-25', status: 'confirmed', client: 'Alice Smith' },
                        { id: 2, character: 'Cinderella', date: '2026-03-28', status: 'completed', client: 'Bob Jones' },
                    ]
                });
            }, 800);
        });
    },

    getBookingRequests: async () => {
        // Real call: return apiClient.get('/bookings/requests');
        
        // Dummy implementation
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    data: [
                        { id: 101, character: 'Batman', requestedDate: '2026-04-05', location: 'New York', price: '$150' },
                        { id: 102, character: 'Elsa', requestedDate: '2026-04-10', location: 'Los Angeles', price: '$200' },
                    ]
                });
            }, 800);
        });
    },

    respondToRequest: async (id, action) => {
        // Action: 'accept' or 'reject'
        // Real call: return apiClient.post(`/bookings/requests/${id}/${action}`);
        
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({ data: { message: `Request ${action}ed successfully` } });
            }, 1000);
        });
    }
};
