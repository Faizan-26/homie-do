import axios from 'axios';
import config from '../config';


const cloudinaryService = {
    /**
     * Upload a file to Cloudinary with progress tracking
     * 
     * @param {File} file - The file to upload
     * @param {string} resourceType - The type of resource ('image', 'raw', 'video', etc.)
     * @param {Function} onProgress - Callback function for tracking upload progress
     * @param {FormData} customFormData - Optional custom FormData to use instead of creating a new one
     * @returns {Promise<Object>} - Cloudinary response data
     */
    async uploadFile(file, resourceType = 'auto', onProgress = () => { }, customFormData = null) {
        try {
            // Use provided formData or create new one
            const formData = customFormData || new FormData();

            // Only append these if we're creating a new FormData
            if (!customFormData) {
                formData.append('file', file);
                formData.append('upload_preset', config.cloudinary.uploadPreset);
                formData.append('cloud_name', config.cloudinary.cloudName);

                // Store the original filename for better tracking
                if (file.name) {
                    formData.append('filename', file.name);
                }
            }

            // Log the request data for debugging
            console.log('Uploading file:', {
                fileName: file.name,
                fileType: file.type,
                fileSize: file.size,
                resourceType,
                cloudName: config.cloudinary.cloudName,
                uploadPreset: config.cloudinary.uploadPreset
            });

            const response = await axios.post(
                `https://api.cloudinary.com/v1_1/${config.cloudinary.cloudName}/${resourceType}/upload`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                    onUploadProgress: (progressEvent) => {
                        if (onProgress) {
                            const percentCompleted = Math.round(
                                (progressEvent.loaded * 100) / progressEvent.total
                            );
                            onProgress(percentCompleted);
                        }
                    },
                }
            );

            console.log('Upload success:', response.data);

            // Get the original filename from file object, fallback to response
            const originalFilename = file.name || response.data.original_filename || 'file';

            return {
                publicId: response.data.public_id,
                url: response.data.secure_url,
                resourceType: response.data.resource_type,
                format: response.data.format,
                originalFilename: originalFilename,
                original_filename: originalFilename, // Include both for compatibility
                bytes: response.data.bytes,
                size: response.data.bytes
            };
        } catch (error) {
            console.error('Upload error:', error.response?.data || error.message);

            let errorMessage = 'Failed to upload file';

            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                errorMessage = `Server error: ${error.response.status} - ${error.response.data?.error?.message || 'Unknown error'}`;
                console.error('Response data:', error.response.data);
                console.error('Response status:', error.response.status);
                console.error('Response headers:', error.response.headers);
            } else if (error.request) {
                // The request was made but no response was received
                errorMessage = 'No response from server. Please check your internet connection.';
                console.error('Request:', error.request);
            } else {
                // Something happened in setting up the request that triggered an Error
                errorMessage = error.message;
            }

            throw new Error(errorMessage);
        }
    },

    /**
     * Generate a Cloudinary URL for a file with transformation options
     * 
     * @param {string} publicId - The public ID of the file in Cloudinary
     * @param {Object} options - Transformation options
     * @returns {string} - Transformed Cloudinary URL
     */
    getFileUrl(publicId, options = {}) {
        // Base URL structure
        let url = `https://res.cloudinary.com/${config.cloudinary.cloudName}/`;

        // Add resource type
        const resourceType = options.resourceType || 'image';
        url += `${resourceType}/upload/`;

        // Add transformations if any
        if (options.transformations) {
            url += options.transformations + '/';
        }

        // Add public ID
        url += publicId;

        return url;
    },

    /**
     * Generate a secure download URL for a file
     * 
     * @param {string} publicId - The public ID of the file in Cloudinary
     * @param {string} resourceType - The type of resource ('image', 'raw', 'video', etc.)
     * @returns {string} - Download URL
     */
    getDownloadUrl(publicId, resourceType = 'image') {
        return `https://res.cloudinary.com/${config.cloudinary.cloudName}/${resourceType}/upload/fl_attachment/${publicId}`;
    },

    /**
     * Determine the file type category based on MIME type
     * 
     * @param {string} mimeType - The MIME type of the file
     * @returns {string} - File type category
     */
    getFileTypeCategory(mimeType) {
        for (const [category, types] of Object.entries(config.supportedFileTypes)) {
            if (types.includes(mimeType)) {
                return category;
            }
        }
        return 'other';
    },

    /**
     * Check if file size is within allowed limit
     * 
     * @param {number} fileSize - Size of the file in bytes
     * @returns {boolean} - True if file size is acceptable
     */
    isFileSizeValid(fileSize) {
        return fileSize <= config.maxFileSize;
    }
};

export default cloudinaryService; 