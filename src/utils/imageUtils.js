const S3_BASE = 'https://s3.us-east-1.amazonaws.com/stn-deployments-mobilehub-1291405271/';

export const getCharacterImageUrl = (fileName) =>
    fileName ? `${S3_BASE}character_images/${fileName}` : '';

export const getCharacterThumbUrl = (fileName) =>
    fileName ? `${S3_BASE}character_thumb_images/${fileName}` : '';

export const getCharacterVideoUrl = (fileName) =>
    fileName ? `${S3_BASE}character_videos/${fileName}` : '';

export const getImageUrl = (filename, fallback = 'https://placehold.co/100x100') => {
    if (!filename || filename === '') return fallback;

    if (filename.startsWith('http://') || filename.startsWith('https://') || filename.startsWith('blob:') || filename.startsWith('data:')) {
        return filename;
    }

    // Folder-prefixed paths returned by some API endpoints
    if (filename.startsWith('character_images/') || filename.startsWith('character_thumb_images/') || filename.startsWith('character_videos/')) {
        return `${S3_BASE}${filename}`;
    }

    // thumbnail_*.jpg → character_thumb_images/
    if (filename.startsWith('thumbnail_')) return getCharacterThumbUrl(filename);
    // pic_*.jpg → character_images/
    if (filename.startsWith('pic_')) return getCharacterImageUrl(filename);
    // video_* → character_videos/
    if (filename.startsWith('video_')) return getCharacterVideoUrl(filename);

    // Legacy filenames — use configured base URL (character_thumb_images/)
    const baseUrl = import.meta.env.VITE_IMAGE_BASE_URL || `${S3_BASE}character_thumb_images/`;
    return `${baseUrl}${filename}`;
};
