import apiClient from './axiosConfig';
import { generateAppToken } from './authApi';

const getHeaders = () => {
    const nonce = Math.random().toString(36).substring(2, 15);
    const timestamp = Math.floor(Date.now() / 1000).toString();
    const appToken = generateAppToken(nonce, timestamp);
    const authKey = localStorage.getItem('vAuthKey') || localStorage.getItem('token') || '';

    return {
        'Content-Type': 'application/x-www-form-urlencoded',
        'nonce': nonce,
        'timestamp': timestamp,
        'token': appToken,
        'vAuthKey': authKey
    };
};

export const notificationApi = {
    // 1. Get Notification Count
    getNotificationCount: async () => {
        try {
            const response = await apiClient.get('/user/getnotificationcount', {
                headers: getHeaders()
            });
            console.log("Notification API Response:", response.data);
            return response;
        } catch (error) {
            console.error("Notification API Error:", error);
            throw error;
        }
    },

    // 2. Notification List
    getNotificationList: async (offset = 0) => {
        try {
            const response = await apiClient.get(`/user/notificationlist?offset=${offset}`, {
                headers: getHeaders()
            });
            console.log("Notification API Response:", response.data);
            return response;
        } catch (error) {
            console.error("Notification API Error:", error);
            throw error;
        }
    },

    // 3. Update Notification Count
    updateNotificationCount: async (count) => {
        try {
            const body = new URLSearchParams();
            body.append('count', count.toString());

            const response = await apiClient.post('/user/updatenotificationcount', body.toString(), {
                headers: getHeaders()
            });
            console.log("Notification API Response:", response.data);
            return response;
        } catch (error) {
            console.error("Notification API Error:", error);
            throw error;
        }
    },

    // 4. Update Notification Flag
    updateNotificationFlag: async (tiNotification) => {
        try {
            const body = new URLSearchParams();
            body.append('tiNotification', tiNotification.toString());

            const response = await apiClient.post('/user/updatenotificationflag', body.toString(), {
                headers: getHeaders()
            });
            console.log("Notification API Response:", response.data);
            return response;
        } catch (error) {
            console.error("Notification API Error:", error);
            throw error;
        }
    },

    // 5. Update Notification Read Flag
    updateNotificationReadFlag: async (iNotificationId) => {
        try {
            const body = new URLSearchParams();
            body.append('iNotificationId', iNotificationId.toString());

            const response = await apiClient.put('/user/updatenotificationreadflag', body.toString(), {
                headers: getHeaders()
            });
            console.log("Notification API Response:", response.data);
            return response;
        } catch (error) {
            console.error("Notification API Error:", error);
            throw error;
        }
    }
};
