/**
 * Constructs the full image URL from a filename.
 * If the value is already a full URL (http/https/blob), it returns it as-is.
 * If it's just a filename (e.g. "20220209092640thumb.jpeg"), it prepends the base URL from env.
 *
 * @param {string} filename - The image filename or URL
 * @param {string} fallback - Fallback URL if filename is empty/null
 * @returns {string} The full image URL
 */
export const getImageUrl = (filename, fallback = 'https://placehold.co/100x100') => {
    if (!filename || filename === '') return fallback;

    // Already a full URL or blob → return as-is
    if (filename.startsWith('http://') || filename.startsWith('https://') || filename.startsWith('blob:') || filename.startsWith('data:')) {
        return filename;
    }

    // Prepend the base image URL from env
    const baseUrl = import.meta.env.VITE_IMAGE_BASE_URL || 'https://s3.us-east-1.amazonaws.com/stn-deployments-mobilehub-1291405271/character_thumb_images/';
    return `${baseUrl}${filename}`;
};
