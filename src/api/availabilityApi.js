import apiClient from './axiosConfig';
import { generateAppToken } from './authApi';

export const availabilityApi = {
    manageAvailability: async (txAvailability) => {
        const nonce = Math.random().toString(36).substring(2, 15);
        const timestamp = Math.floor(Date.now() / 1000).toString();
        const appToken = generateAppToken(nonce, timestamp);
        const authKey = localStorage.getItem('vAuthKey') || localStorage.getItem('token') || '';

        // HARDCODED for testing Philadelphia timezone as requested by user
        // Philadelphia is America/New_York. 
        // Current EDT is GMT-4. JS offset would be 240.
        const offsetVal = "240"; 
        const timezoneName = "America/New_York";
        const formattedOffset = "-04:00"; 

        return apiClient.post('/availability/manageavailability', {
            ...txAvailability,
            vTimezoneOffset: offsetVal,
            vTimezone: timezoneName,
            vFormattedOffset: formattedOffset
        }, {
            headers: {
                'Content-Type': 'application/json',
                'nonce': nonce,
                'timestamp': timestamp,
                'token': appToken,
                'vAuthKey': authKey
            }
        });
    },

    confirmDailyAvailability: async (payload) => {
        const nonce = Math.random().toString(36).substring(2, 15);
        const timestamp = Math.floor(Date.now() / 1000).toString();
        const appToken = generateAppToken(nonce, timestamp);
        const authKey = localStorage.getItem('vAuthKey') || localStorage.getItem('token') || '';

        const offset = new Date().getTimezoneOffset();
        const absOffset = Math.abs(offset);
        const sign = offset <= 0 ? '+' : '-';
        const hours = Math.floor(absOffset / 60).toString().padStart(2, '0');
        const minutes = (absOffset % 60).toString().padStart(2, '0');
        const formattedOffset = `${sign}${hours}:${minutes}`;

        return apiClient.post('/user/confirmdailyavailability', {
            ...payload,
            vTimezoneOffset: offset.toString(),
            vTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            vFormattedOffset: formattedOffset
        }, {
            headers: {
                'Content-Type': 'application/json',
                'nonce': nonce,
                'timestamp': timestamp,
                'token': appToken,
                'vAuthKey': authKey
            }
        });
    }
};
