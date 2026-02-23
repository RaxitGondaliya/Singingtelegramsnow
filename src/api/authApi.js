import apiClient from './axiosConfig';

export const authApi = {
    login: async (credentials) => {
        const body = new URLSearchParams();
        body.append('tiUserType', credentials.userType || '1');
        body.append('vDeviceToken', credentials.deviceToken || 'dummy_device_token');
        body.append('tiDeviceType', credentials.deviceType || '3'); // 3 for Web
        body.append('vEmailId', credentials.email);
        body.append('vPassword', credentials.password);
        body.append('vISDCode', credentials.isdCode || '');
        body.append('vMobileNumber', credentials.mobileNumber || '');
        body.append('vTimezoneOffset', new Date().getTimezoneOffset().toString());
        body.append('vTimezone', Intl.DateTimeFormat().resolvedOptions().timeZone);

        const nonce = Math.random().toString(36).substring(2, 15);
        const timestamp = Math.floor(Date.now() / 1000).toString();
        
        // This 'token' header is often a fixed app-level token for the login endpoint
        // You should replace this with the actual token provided in your environment
        const appToken = import.meta.env.VITE_APP_LOGIN_TOKEN || ''; 

        return apiClient.post('/oauth/signin', body, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'nonce': nonce,
                'timestamp': timestamp,
                'token': appToken
            }
        });
    },

    signup: async (userData) => {
        const body = new URLSearchParams();
        body.append('vFirstName', userData.firstName);
        body.append('vLastName', userData.lastName);
        body.append('vEmailId', userData.email);
        body.append('vMobileNumber', userData.mobileNumber);
        body.append('vZipCode', userData.zipCode);
        body.append('tiGender', userData.gender || '1'); 
        body.append('tiUserType', userData.userType || '1');
        body.append('tiDeviceType', '3'); 
        body.append('vDeviceToken', userData.deviceToken || 'web_device_token');
        body.append('vStreetAddress', userData.streetAddress || '');
        body.append('vPassword', userData.password);
        body.append('vTimezoneOffset', new Date().getTimezoneOffset().toString());
        body.append('vTimezone', Intl.DateTimeFormat().resolvedOptions().timeZone);

        const nonce = Math.random().toString(36).substring(2, 15);
        const timestamp = Math.floor(Date.now() / 1000).toString();
        
        // This 'token' header is mandatory. 
        // If VITE_APP_LOGIN_TOKEN is empty, the API returns "Token cannot be blank."
        // Check your .env file or the Postman environment for the real value.
        const appToken = import.meta.env.VITE_APP_LOGIN_TOKEN || ''; 
        
        console.log("API Headers:", { nonce, timestamp, token: appToken });

        return apiClient.post('/oauth/signup', body, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'nonce': nonce,
                'timestamp': timestamp,
                'token': appToken
            }
        });
    },

    forgotPassword: async (data) => {
        const body = new URLSearchParams();
        body.append('vEmailId', data.email);

        const nonce = Math.random().toString(36).substring(2, 15);
        const timestamp = Math.floor(Date.now() / 1000).toString();
        const appToken = import.meta.env.VITE_APP_LOGIN_TOKEN || '';

        return apiClient.post('/oauth/forgotpassword', body, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'nonce': nonce,
                'timestamp': timestamp,
                'token': appToken
            }
        });
    },

    logout: () => {
        localStorage.removeItem('token');
    }
};
