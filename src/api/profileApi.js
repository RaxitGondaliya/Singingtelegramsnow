import apiClient from './axiosConfig';
import { generateAppToken } from './authApi';

export const profileApi = {

    getProfile: async () => {
        const body = new URLSearchParams();
        body.append("vTimezoneOffset", new Date().getTimezoneOffset().toString());
        body.append("vTimezone", Intl.DateTimeFormat().resolvedOptions().timeZone);

        const nonce = Math.random().toString(36).substring(2, 15);
        const timestamp = Math.floor(Date.now() / 1000).toString();
        const appToken = generateAppToken(nonce, timestamp);
        const authKey = localStorage.getItem('vAuthKey') || localStorage.getItem('token') || '';

        return apiClient.post('/user/userprofile', body.toString(), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'nonce': nonce,
                'timestamp': timestamp,
                'token': appToken,
                'vAuthKey': authKey
            }
        });
    },

    updateProfile: async (formData) => {

        const body = new URLSearchParams();

        body.append("vFirstName", formData.firstName || '');
        body.append("vLastName", formData.lastName || '');
        body.append("vEmailId", formData.email || '');
        body.append("vZipCode", formData.zipCode || '');
        body.append("tiGender",
            formData.gender === "Male" ? "1" :
            formData.gender === "Female" ? "2" : "3"
        );
        body.append("vStreetAddress", formData.streetAddress || '');
        body.append("dLatitude", formData.dLatitude || '0.000000');
        body.append("dLongitude", formData.dLongitude || '0.000000');
        body.append("vDob", formData.dob || '');
        body.append("vSsnNumber", formData.ssn || '');
        body.append("iRadius", formData.radius || '0');
        body.append("vCity", formData.vCity || '');
        body.append("vState", formData.vState || '');
        body.append("vCountry", formData.vCountry || '');
        body.append("vCountryCode", formData.vCountryCode || '');
        body.append("iCityId", formData.iCityId || '0');
        body.append("txProfilePic", formData.txProfilePic || '');
        body.append("txProfileThumb", formData.txProfileThumb || '');

        const nonce = Math.random().toString(36).substring(2, 15);
        const timestamp = Math.floor(Date.now() / 1000).toString();
        const appToken = generateAppToken(nonce, timestamp);
        const authKey = localStorage.getItem('vAuthKey') || localStorage.getItem('token') || '';

        return apiClient.post('/user/editprofile', body.toString(), {
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