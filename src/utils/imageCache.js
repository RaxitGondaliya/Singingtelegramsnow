const DB_NAME = 'stn_image_cache';
const STORE = 'char_images';
const VERSION = 1;

function openDB() {
    return new Promise((resolve, reject) => {
        const req = indexedDB.open(DB_NAME, VERSION);
        req.onupgradeneeded = (e) => {
            e.target.result.createObjectStore(STORE);
        };
        req.onsuccess = (e) => resolve(e.target.result);
        req.onerror = () => reject(req.error);
    });
}

export async function cacheCharacterImage(charId, dataUrl) {
    if (!charId || !dataUrl) return;
    try {
        const db = await openDB();
        const tx = db.transaction(STORE, 'readwrite');
        tx.objectStore(STORE).put(dataUrl, String(charId));
    } catch (e) {
        console.warn('imageCache write failed', e);
    }
}

export async function getCachedCharacterImage(charId) {
    if (!charId) return null;
    try {
        const db = await openDB();
        return await new Promise((resolve) => {
            const req = db.transaction(STORE, 'readonly').objectStore(STORE).get(String(charId));
            req.onsuccess = () => resolve(req.result || null);
            req.onerror = () => resolve(null);
        });
    } catch (e) {
        return null;
    }
}

export async function getAllCachedImages() {
    try {
        const db = await openDB();
        return await new Promise((resolve) => {
            const result = {};
            const req = db.transaction(STORE, 'readonly').objectStore(STORE).openCursor();
            req.onsuccess = (e) => {
                const cursor = e.target.result;
                if (cursor) {
                    result[cursor.key] = cursor.value;
                    cursor.continue();
                } else {
                    resolve(result);
                }
            };
            req.onerror = () => resolve({});
        });
    } catch (e) {
        return {};
    }
}
