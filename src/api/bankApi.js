import apiClient from './axiosConfig';
import { generateAppToken } from './authApi';

export const bankApi = {

    // GET /artist-bank/info/
    getBankInfo: async () => {
        const nonce = Math.random().toString(36).substring(2, 15);
        const timestamp = Math.floor(Date.now() / 1000).toString();
        const appToken = generateAppToken(nonce, timestamp);
        const authKey = localStorage.getItem('vAuthKey') || localStorage.getItem('token') || '';

        return apiClient.get('/artist-bank/info/', {
            headers: {
                'nonce': nonce,
                'timestamp': timestamp,
                'token': appToken,
                'vAuthKey': authKey
            }
        });
    },

    // POST /artist-bank  (Add new bank details)
    addBankDetails: async (bankData) => {
        const body = new URLSearchParams();
        body.append('iRoutingNumber', bankData.routingNumber || '');
        body.append('iAccountNumber', bankData.accountNumber || '');
        body.append('vBankName', bankData.bankName || '');
        body.append('vBranchLocation', bankData.branchLocation || '');
        body.append('vAccountHolderName', bankData.accountHolderName || '');

        const nonce = Math.random().toString(36).substring(2, 15);
        const timestamp = Math.floor(Date.now() / 1000).toString();
        const appToken = generateAppToken(nonce, timestamp);
        const authKey = localStorage.getItem('vAuthKey') || localStorage.getItem('token') || '';

        return apiClient.post('/artist-bank', body.toString(), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'nonce': nonce,
                'timestamp': timestamp,
                'token': appToken,
                'vAuthKey': authKey
            }
        });
    },

    // PUT /artist-bank  (Edit existing bank details)
    editBankDetails: async (bankData) => {
        const body = new URLSearchParams();
        body.append('iRoutingNumber', bankData.routingNumber || '');
        body.append('iAccountNumber', bankData.accountNumber || '');
        body.append('vBankName', bankData.bankName || '');
        body.append('vBranchLocation', bankData.branchLocation || '');
        body.append('vAccountHolderName', bankData.accountHolderName || '');

        const nonce = Math.random().toString(36).substring(2, 15);
        const timestamp = Math.floor(Date.now() / 1000).toString();
        const appToken = generateAppToken(nonce, timestamp);
        const authKey = localStorage.getItem('vAuthKey') || localStorage.getItem('token') || '';

        return apiClient.put('/artist-bank', body.toString(), {
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
