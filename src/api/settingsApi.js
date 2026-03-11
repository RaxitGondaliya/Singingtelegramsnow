import apiClient from './axiosConfig';
import { generateAppToken } from './authApi';

export const settingsApi = {
    contactUs: async (data) => {
        const body = new URLSearchParams();
        body.append('vSubject', data.subject || '');
        body.append('txMessage', data.message || '');

        const nonce = Math.random().toString(36).substring(2, 15);
        const timestamp = Math.floor(Date.now() / 1000).toString();
        const appToken = generateAppToken(nonce, timestamp);
        const authKey = localStorage.getItem('vAuthKey') || localStorage.getItem('token') || '';

        return apiClient.post('/user/contactus', body.toString(), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'nonce': nonce,
                'timestamp': timestamp,
                'token': appToken,
                'vAuthKey': authKey
            }
        });
    },

    changePassword: async (data) => {
        const body = new URLSearchParams();
        body.append('vPassword', data.newPassword || '');
        body.append('vOldPassword', data.oldPassword || '');

        const nonce = Math.random().toString(36).substring(2, 15);
        const timestamp = Math.floor(Date.now() / 1000).toString();
        const appToken = generateAppToken(nonce, timestamp);
        const authKey = localStorage.getItem('vAuthKey') || localStorage.getItem('token') || '';

        return apiClient.post('/user/changepassword', body.toString(), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'nonce': nonce,
                'timestamp': timestamp,
                'token': appToken,
                'vAuthKey': authKey
            }
        });
    }
};
