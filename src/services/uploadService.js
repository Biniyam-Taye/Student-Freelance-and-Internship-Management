import api from './api';

/**
 * Upload a profile avatar to Cloudinary via the backend.
 * @param {File} file - The image file to upload.
 * @returns {Promise<string>} The Cloudinary URL of the uploaded image.
 */
export const uploadAvatar = async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    const response = await api.post('/upload/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.url;
};

/**
 * Upload a post image to Cloudinary via the backend.
 * @param {File} file - The image file to upload.
 * @returns {Promise<string>} The Cloudinary URL of the uploaded image.
 */
export const uploadPostImage = async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    const response = await api.post('/upload/post', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.url;
};
