import apiClient from './axiosConfig';
import { generateAppToken } from './authApi';

export const ratingApi = {
    getRatingsAndReviews: async (offset = '') => {
        const nonce = Math.random().toString(36).substring(2, 15);
        const timestamp = Math.floor(Date.now() / 1000).toString();
        const appToken = generateAppToken(nonce, timestamp);
        const authKey = localStorage.getItem('vAuthKey') || localStorage.getItem('token') || '';

        return apiClient.get(`/user/getratingandreviews?offset=${offset}`, {
            headers: {
                'nonce': nonce,
                'timestamp': timestamp,
                'token': appToken,
                'vAuthKey': authKey
            }
        });
    }
};
