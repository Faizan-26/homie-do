import api from './api';
import { toast } from 'react-hot-toast';
import cloudinaryService from '../utils/cloudinaryService';

const documentService = {
    /**
     * Upload a document to the server
     * @param {Object} documentData - Document data with file information
     * @param {File} file - The file to upload
     * @returns {Promise<Object>} - Uploaded document data
     */
    uploadDocument: async (documentData, file) => {
        try {
            // First upload the file to cloudinary
            const uploadResult = await cloudinaryService.uploadFile(file);

            // Create document record with file information
            const documentPayload = {
                ...documentData,
                fileUrl: uploadResult.secure_url,
                fileName: file.name,
                fileType: file.type,
                fileSize: file.size,
                cloudinaryPublicId: uploadResult.public_id,
                cloudinaryResourceType: uploadResult.resource_type
            };

            const response = await api.post('/documents', documentPayload);
            return response.data;
        } catch (error) {
            console.error('Error uploading document:', error);
            throw error;
        }
    },

    /**
     * Get all documents for a subject
     * @param {string} subjectId - Subject ID
     * @returns {Promise<Array>} - Array of documents
     */
    getDocumentsBySubject: async (subjectId) => {
        try {
            const response = await api.get(`/subjects/${subjectId}/documents`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching documents for subject ${subjectId}:`, error);
            throw error;
        }
    },

    /**
     * Delete a document
     * @param {string} documentId - Document ID to delete
     * @returns {Promise<boolean>} - True if deleted successfully
     */
    deleteDocument: async (documentId) => {
        try {
            await api.delete(`/documents/${documentId}`);
            return true;
        } catch (error) {
            console.error(`Error deleting document ${documentId}:`, error);
            throw error;
        }
    },

    /**
     * Download a document file
     * @param {string} docId - Document ID
     * @param {string} fileName - File name for download
     */
    downloadDocument: async (docId, fileName) => {
        try {
            // Get document data first to get cloudinary information
            const response = await api.get(`/documents/${docId}`);
            const document = response.data;

            if (document.cloudinaryPublicId && document.cloudinaryResourceType) {
                // Use cloudinary service to generate download URL
                const downloadUrl = cloudinaryService.getDownloadUrl(
                    document.cloudinaryPublicId,
                    document.cloudinaryResourceType
                );

                // Open download URL in new tab
                window.open(downloadUrl, '_blank');
                return;
            }

            if (document.fileUrl) {
                // Handle direct file URL download
                window.open(document.fileUrl, '_blank');
                return;
            }

            throw new Error('Document has no file URL');
        } catch (error) {
            console.error(`Error downloading document ${docId}:`, error);
            toast.error('Failed to download document');
            throw error;
        }
    },

    /**
     * Get a document by ID
     * @param {string} documentId - Document ID
     * @returns {Promise<Object>} - Document data
     */
    getDocumentById: async (documentId) => {
        try {
            const response = await api.get(`/documents/${documentId}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching document ${documentId}:`, error);
            throw error;
        }
    },

    /**
     * Update document metadata
     * @param {string} documentId - Document ID
     * @param {Object} updateData - Data to update
     * @returns {Promise<Object>} - Updated document
     */
    updateDocument: async (documentId, updateData) => {
        try {
            const response = await api.put(`/documents/${documentId}`, updateData);
            return response.data;
        } catch (error) {
            console.error(`Error updating document ${documentId}:`, error);
            throw error;
        }
    }
};

export default documentService; 