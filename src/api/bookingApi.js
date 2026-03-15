import apiClient from './axiosConfig';
import { generateAppToken } from './authApi';

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
        const nonce = Math.random().toString(36).substring(2, 15);
        const timestamp = Math.floor(Date.now() / 1000).toString();
        const appToken = generateAppToken(nonce, timestamp);
        const authKey = localStorage.getItem('vAuthKey') || localStorage.getItem('token') || '';

        return apiClient.get('/booking/bookingrequests', {
            headers: {
                'nonce': nonce,
                'timestamp': timestamp,
                'token': appToken,
                'vAuthKey': authKey
            }
        });
    },

    cancelBooking: async (iBookingId, iReasonId, txDescription) => {
        const nonce = Math.random().toString(36).substring(2, 15);
        const timestamp = Math.floor(Date.now() / 1000).toString();
        const appToken = generateAppToken(nonce, timestamp);
        const authKey = localStorage.getItem('vAuthKey') || localStorage.getItem('token') || '';

        const payload = {
            iBookingId,
            iReasonId,
            txDescription
        };

        const params = new URLSearchParams();
        params.append('iBookingId', iBookingId);
        params.append('iReasonId', iReasonId);
        params.append('txDescription', txDescription);

        console.log("Cancel Booking Payload:", payload);

        return apiClient.put('/booking/cancelbooking', params.toString(), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'nonce': nonce,
                'timestamp': timestamp,
                'token': appToken,
                'vAuthKey': authKey
            }
        });
    },

    confirmBooking: async (iBookingId) => {
        const nonce = Math.random().toString(36).substring(2, 15);
        const timestamp = Math.floor(Date.now() / 1000).toString();
        const appToken = generateAppToken(nonce, timestamp);
        const authKey = localStorage.getItem('vAuthKey') || localStorage.getItem('token') || '';

        const payload = {
            iBookingId
        };

        const params = new URLSearchParams();
        params.append('iBookingId', iBookingId);

        console.log("Confirm Booking Payload:", payload);

        //API temporarily disabled for testing
        return apiClient.put('/booking/confirmbooking', params.toString(), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'nonce': nonce,
                'timestamp': timestamp,
                'token': appToken,
                'vAuthKey': authKey
            }
        });
    },


    getBookingHistory: async (offset = '') => {
        const nonce = Math.random().toString(36).substring(2, 15);
        const timestamp = Math.floor(Date.now() / 1000).toString();
        const appToken = generateAppToken(nonce, timestamp);
        const authKey = localStorage.getItem('vAuthKey') || localStorage.getItem('token') || '';

        return apiClient.get(`/booking/bookinghistory?offset=${offset}`, {
            headers: {
                'nonce': nonce,
                'timestamp': timestamp,
                'token': appToken,
                'vAuthKey': authKey
            }
        });
    },

    getBookingDetails: async (iBookingId) => {
        const nonce = Math.random().toString(36).substring(2, 15);
        const timestamp = Math.floor(Date.now() / 1000).toString();
        const appToken = generateAppToken(nonce, timestamp);
        const authKey = localStorage.getItem('vAuthKey') || localStorage.getItem('token') || '';

        return apiClient.get(`/booking/${iBookingId}`, {
            headers: {
                'nonce': nonce,
                'timestamp': timestamp,
                'token': appToken,
                'vAuthKey': authKey
            }
        });
    },

    getReportCustomerReasonsList: async () => {
        const nonce = Math.random().toString(36).substring(2, 15);
        const timestamp = Math.floor(Date.now() / 1000).toString();
        const appToken = generateAppToken(nonce, timestamp);
        const authKey = localStorage.getItem('vAuthKey') || localStorage.getItem('token') || '';

        return apiClient.get('/booking/reportcustomerreasonslist', {
            headers: {
                'nonce': nonce,
                'timestamp': timestamp,
                'token': appToken,
                'vAuthKey': authKey
            }
        });
    },

    reportCustomer: async (iBookingId, iReasonId, txDescription) => {
        const nonce = Math.random().toString(36).substring(2, 15);
        const timestamp = Math.floor(Date.now() / 1000).toString();
        const appToken = generateAppToken(nonce, timestamp);
        const authKey = localStorage.getItem('vAuthKey') || localStorage.getItem('token') || '';

        const params = new URLSearchParams();
        params.append('iBookingId', iBookingId);
        params.append('iReasonId', iReasonId);
        params.append('txDescription', txDescription);

        return apiClient.post('/booking/reportcustomer', params.toString(), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'nonce': nonce,
                'timestamp': timestamp,
                'token': appToken,
                'vAuthKey': authKey
            }
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
    },

    getMyEarnings: async (month = '', year = '') => {
        const nonce = Math.random().toString(36).substring(2, 15);
        const timestamp = Math.floor(Date.now() / 1000).toString();
        const appToken = generateAppToken(nonce, timestamp);
        const authKey = localStorage.getItem('vAuthKey') || localStorage.getItem('token') || '';

        return apiClient.get(`/booking/myearnings?month=${month}&year=${year}`, {
            headers: {
                'nonce': nonce,
                'timestamp': timestamp,
                'token': appToken,
                'vAuthKey': authKey
            }
        });
    }
};

