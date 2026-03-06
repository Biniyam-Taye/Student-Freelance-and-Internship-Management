import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

/**
 * Upload a profile avatar to Cloudinary via the backend.
 * Sends base64 image data so the backend doesn't depend on multipart parsing.
 * @param {File} file - The image file to upload.
 * @returns {Promise<string>} The Cloudinary URL of the uploaded image.
 */
export const uploadAvatar = async (file) => {
    const toBase64 = (f) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(f);
        });

    const imageData = await toBase64(file);
    const token = localStorage.getItem('authToken');
    const response = await axios.post(
        `${BASE_URL}/upload/avatar`,
        { imageData },
        {
            headers: {
                'Content-Type': 'application/json',
                ...(token && { Authorization: `Bearer ${token}` }),
            },
            timeout: 20000,
        }
    );
    return response.data.url;
};

/**
 * Upload a post image to Cloudinary via the backend.
 * Uses multipart/form-data via FormData.
 * @param {File} file - The image file to upload.
 * @returns {Promise<string>} The Cloudinary URL of the uploaded image.
 */
/**
 * Upload student CV/Resume (PDF) to Cloudinary via the backend.
 * @param {File} file - The PDF file to upload (max 5MB).
 * @returns {Promise<string>} The URL of the uploaded file.
 */
export const uploadCV = async (file) => {
    const toBase64 = (f) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(f);
        });

    const fileData = await toBase64(file);
    const token = localStorage.getItem('authToken');
    const response = await axios.post(
        `${BASE_URL}/upload/cv`,
        { fileData },
        {
            headers: {
                'Content-Type': 'application/json',
                ...(token && { Authorization: `Bearer ${token}` }),
            },
            timeout: 30000,
        }
    );
    return response.data.url;
};

/**
 * Download student CV as PDF with correct filename (via backend proxy).
 * @param {string} cvUrl - The Cloudinary URL of the CV.
 * @param {string} filename - Desired filename (e.g. "Biniyam_Taye_CV.pdf").
 */
export const downloadCV = async (cvUrl, filename = 'CV.pdf') => {
    const token = localStorage.getItem('authToken');
    const safeFilename = (filename || 'CV').replace(/\s+/g, '_').replace(/[^a-zA-Z0-9._-]/g, '') || 'CV';
    const finalFilename = safeFilename.endsWith('.pdf') ? safeFilename : `${safeFilename}_CV.pdf`;
    const url = `${BASE_URL}/upload/cv/download?url=${encodeURIComponent(cvUrl)}&filename=${encodeURIComponent(finalFilename)}`;
    const response = await axios.get(url, {
        responseType: 'blob',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        timeout: 60000,
    });
    const blob = new Blob([response.data], { type: 'application/pdf' });
    const objectUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = objectUrl;
    a.download = finalFilename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(objectUrl);
};

export const uploadPostImage = async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    const token = localStorage.getItem('authToken');
    const response = await axios.post(`${BASE_URL}/upload/post`, formData, {
        headers: {
            ...(token && { Authorization: `Bearer ${token}` }),
        },
        timeout: 20000,
    });
    return response.data.url;
};
