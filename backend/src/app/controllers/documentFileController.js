import DocumentFile from '../models/schemas/documentFileSchema.js';
import mongoose from 'mongoose';

// Create a new document file
export const createDocumentFile = async (req, res) => {
    try {
        const documentFile = new DocumentFile(req.body);
        await documentFile.save();
        res.status(201).json(documentFile);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all document files
export const getAllDocumentFiles = async (req, res) => {
    try {
        const documentFiles = await DocumentFile.find();
        res.status(200).json(documentFiles);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get document files by user ID
export const getDocumentFilesByUser = async (req, res) => {
    try {
        const documentFiles = await DocumentFile.find({ userId: req.params.userId });
        res.status(200).json(documentFiles);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a document file by ID
export const getDocumentFileById = async (req, res) => {
    try {
        const documentFile = await DocumentFile.findById(req.params.id);
        if (!documentFile) {
            return res.status(404).json({ message: 'Document file not found' });
        }
        res.status(200).json(documentFile);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a document file
export const updateDocumentFile = async (req, res) => {
    try {
        const documentFile = await DocumentFile.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!documentFile) {
            return res.status(404).json({ message: 'Document file not found' });
        }

        res.status(200).json(documentFile);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a document file
export const deleteDocumentFile = async (req, res) => {
    try {
        const documentFile = await DocumentFile.findById(req.params.id);
        if (!documentFile) {
            return res.status(404).json({ message: 'Document file not found' });
        }

        await DocumentFile.findByIdAndDelete(req.params.id);

        res.status(200).json({ message: 'Document file deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}; 