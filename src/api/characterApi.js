import apiClient from './axiosConfig';
import { generateAppToken } from './authApi';
import CryptoJS from 'crypto-js';

const API_PRIVATE_KEY = 'SSeST@ssNWNc1r@et';
const API_SECRET_KEY  = 'Qg1wewKS1A1MTdWERd7r6vldwdxftvd';

function getCurrentTimestamp() {
  const d = new Date();
  const pad = n => String(n).padStart(2, '0');
  return `${d.getUTCFullYear()}${pad(d.getUTCMonth()+1)}${pad(d.getUTCDate())}` +
         `${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}`;
}

export function getAuthHeaders(vAuthKey) {
  const nonce     = generateNonce();
  const timestamp = getCurrentTimestamp();
  const data  = `nonce=${nonce}&timestamp=${timestamp}|${API_SECRET_KEY}`;
  const token = CryptoJS.HmacSHA256(data, API_PRIVATE_KEY).toString(CryptoJS.enc.Hex);
  return { nonce, timestamp, token, vAuthKey };
}

// 6-char alphanumeric nonce — matches Android SecurityUtils exactly
function generateNonce() {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let n = '';
    for (let i = 0; i < 6; i++) n += chars[Math.floor(Math.random() * chars.length)];
    return n;
};

export const characterApi = {

    // POST /character/listallcharacters
    getCharactersList: async (offset = '') => {
        const body = new URLSearchParams();
        body.append('offset', offset);

        const nonce = generateNonce();
        const timestamp = Math.floor(Date.now() / 1000).toString();
        const appToken = generateAppToken(nonce, timestamp);
        const authKey = localStorage.getItem('vAuthKey') || localStorage.getItem('token') || '';

        return apiClient.post('/character/listallcharacters', body.toString(), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'nonce': nonce,
                'timestamp': timestamp,
                'token': appToken,
                'vAuthKey': authKey
            }
        });
    },

    // POST /character/addcharacter
    addCharacter: async (characterData) => {
        const authKey = localStorage.getItem('vAuthKey') || localStorage.getItem('token') || '';
        const headers = getAuthHeaders(authKey);

        return apiClient.post('/character/addcharacter', characterData, {
            headers: {
                'Content-Type': 'application/json',
                ...headers
            }
        });
    },

    // POST /character/editcharacter
    editCharacter: async (characterData) => {
        const authKey = localStorage.getItem('vAuthKey') || localStorage.getItem('token') || '';
        const headers = getAuthHeaders(authKey);

        return apiClient.post('/character/editcharacter', characterData, {
            headers: {
                'Content-Type': 'application/json',
                ...headers
            }
        });
    },

    // POST /character/deletecharacter
    deleteCharacter: async (iArtistCharacterId) => {
        const body = new URLSearchParams();
        body.append('iArtistCharacterId', iArtistCharacterId);

        const nonce = generateNonce();
        const timestamp = Math.floor(Date.now() / 1000).toString();
        const appToken = generateAppToken(nonce, timestamp);
        const authKey = localStorage.getItem('vAuthKey') || localStorage.getItem('token') || '';

        return apiClient.post('/character/deletecharacter', body.toString(), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'nonce': nonce,
                'timestamp': timestamp,
                'token': appToken,
                'vAuthKey': authKey
            }
        });
    },

    // POST /character/characterdetails
    getCharacterDetails: async (iArtistCharacterId) => {
        const body = new URLSearchParams();
        body.append('iArtistCharacterId', iArtistCharacterId);

        const nonce = generateNonce();
        const timestamp = Math.floor(Date.now() / 1000).toString();
        const appToken = generateAppToken(nonce, timestamp);
        const authKey = localStorage.getItem('vAuthKey') || localStorage.getItem('token') || '';

        return apiClient.post('/character/characterdetails', body.toString(), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'nonce': nonce,
                'timestamp': timestamp,
                'token': appToken,
                'vAuthKey': authKey
            }
        });
    },

    // POST /character/characterstyles
    getCharacterStyles: async () => {
        const nonce = generateNonce();
        const timestamp = Math.floor(Date.now() / 1000).toString();
        const appToken = generateAppToken(nonce, timestamp);
        const authKey = localStorage.getItem('vAuthKey') || localStorage.getItem('token') || '';

        return apiClient.post('/character/characterstyles', '', {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'nonce': nonce,
                'timestamp': timestamp,
                'token': appToken,
                'vAuthKey': authKey
            }
        });
    },

    // POST /character/characterslist
    getMyCharactersList: async (offset = '') => {
        const body = new URLSearchParams();
        body.append('offset', offset);

        const nonce = generateNonce();
        const timestamp = Math.floor(Date.now() / 1000).toString();
        const appToken = generateAppToken(nonce, timestamp);
        const authKey = localStorage.getItem('vAuthKey') || localStorage.getItem('token') || '';

        return apiClient.post('/character/characterslist', body.toString(), {
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
