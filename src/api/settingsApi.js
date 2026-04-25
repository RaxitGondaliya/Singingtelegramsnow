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
    },


    // Update Google Calendar Auth Token
    updateSyncCalendarToken: async (googleCode) => {
        const body = new URLSearchParams();
        body.append('txGoogleToken', googleCode || '');

        const nonce = Math.random().toString(36).substring(2, 15);
        const timestamp = Math.floor(Date.now() / 1000).toString();
        const appToken = generateAppToken(nonce, timestamp);
        const authKey = localStorage.getItem('vAuthKey') || localStorage.getItem('token') || '';

        return apiClient.put('/availability/updatesynccalendertoken', body.toString(), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'nonce': nonce,
                'timestamp': timestamp,
                'token': appToken,
                'vAuthKey': authKey
            }
        });
    },

    // Update Sync Flag (Enable/Disable Google Calendar Sync)
    updateSyncCalendarFlag: async (flagValue, googleCode = '') => {
        const body = new URLSearchParams();
        body.append('tiSyncGoogleCalender', flagValue); // "1" for Enable, "0" for Disable
        body.append('tiSyncICalender', '0'); // Default 0 for iCal
        body.append('txGoogleToken', googleCode);

        const nonce = Math.random().toString(36).substring(2, 15);
        const timestamp = Math.floor(Date.now() / 1000).toString();
        const appToken = generateAppToken(nonce, timestamp);
        const authKey = localStorage.getItem('vAuthKey') || localStorage.getItem('token') || '';

        return apiClient.put('/availability/updatesynccalenderflag', body.toString(), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'nonce': nonce,
                'timestamp': timestamp,
                'token': appToken,
                'vAuthKey': authKey
            }
        });
    },

    updateNotificationFlag: async (flagValue) => {
        const body = new URLSearchParams();
        body.append('tiNotification', flagValue);

        const nonce = Math.random().toString(36).substring(2, 15);
        const timestamp = Math.floor(Date.now() / 1000).toString();
        const appToken = generateAppToken(nonce, timestamp);
        const authKey = localStorage.getItem('vAuthKey') || localStorage.getItem('token') || '';

        return apiClient.post('/user/updatenotificationflag', body.toString(), {
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
