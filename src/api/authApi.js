import apiClient from './axiosConfig';
import CryptoJS from 'crypto-js';

const generateAppToken = (nonce, timestamp) => {
    const rawToken = import.meta.env.VITE_APP_LOGIN_TOKEN || '';
    if (rawToken && rawToken.length > 0 && rawToken !== 'undefined') {
        return rawToken;
    }
    
    // Generate token using HMAC-SHA256 if static token is not provided
    const privateKey = import.meta.env.VITE_PRIVATE_KEY || 'SSeST@ssNWNc1r@et';
    const secret = import.meta.env.VITE_SECRET || 'Qg1wewKS1A1MTdWERd7r6vldwdxftvd';
    
    // Message to hash perfectly matches the backend Yii2 logic:
    // $hash_str = "nonce=" . $header['nonce'] . "&timestamp=" . $header['timestamp'] . "|" . $secret;
    const messageToHash = `nonce=${nonce}&timestamp=${timestamp}|${secret}`;
    
    // Use privateKey as the HMAC key
    return CryptoJS.HmacSHA256(messageToHash, privateKey).toString();
};

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
        
        const appToken = generateAppToken(nonce, timestamp);

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
        body.append('vFirstName', userData.firstName || '');
        body.append('vLastName', userData.lastName || '');
        body.append('vEmailId', userData.email || '');
        body.append('vISDCode', userData.isdCode || '+1');
        body.append('vMobileNumber', userData.mobileNumber || '');
        body.append('vZipCode', userData.zipCode || '');
        body.append('tiGender', userData.gender || '1'); 
        body.append('tiUserType', userData.userType || '1');
        body.append('tiDeviceType', userData.deviceType || '3'); 
        body.append('vDeviceToken', userData.deviceToken || 'web_device_token');
        body.append('vStreetAddress', userData.streetAddress || '');
        body.append('dLatitude', userData.dLatitude || '0.000000');
        body.append('dLongitude', userData.dLongitude || '0.000000');
        body.append('vCity', userData.vCity || 'Unknown');
        body.append('vState', userData.vState || 'Unknown');
        body.append('vCountry', userData.vCountry || 'Unknown');
        body.append('vCountryCode', userData.vCountryCode || 'US');
        body.append('vPassword', userData.password || '');
        body.append('iCityId', userData.iCityId || '0');
        body.append('txProfilePic', userData.txProfilePic || '');
        body.append('tiMobileVerified', userData.tiMobileVerified || '0');
        body.append('txProfileThumb', userData.txProfileThumb || '');
        body.append('vAuthKey', userData.vAuthKey || '');
        body.append('vTimezoneOffset', new Date().getTimezoneOffset().toString());
        body.append('vTimezone', Intl.DateTimeFormat().resolvedOptions().timeZone);

        const nonce = Math.random().toString(36).substring(2, 15);
        const timestamp = Math.floor(Date.now() / 1000).toString();
        
        const appToken = generateAppToken(nonce, timestamp);
        
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
        const appToken = generateAppToken(nonce, timestamp);

        return apiClient.post('/oauth/forgotpassword', body, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'nonce': nonce,
                'timestamp': timestamp,
                'token': appToken
            }
        });
    },

    verifyOtp: async (data) => {
        const body = new URLSearchParams();
        body.append('vOtpCode', data.otpCode);

        const nonce = Math.random().toString(36).substring(2, 15);
        const timestamp = Math.floor(Date.now() / 1000).toString();
        const appToken = generateAppToken(nonce, timestamp);
        const authKey = localStorage.getItem('vAuthKey') || localStorage.getItem('token') || '';

        return apiClient.post('/user/verifyotp', body, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'nonce': nonce,
                'timestamp': timestamp,
                'token': appToken,
                'vAuthKey': authKey
            }
        });
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('vAuthKey');
    }
};
