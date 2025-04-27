import UserNote from '../models/schemas/userNoteSchema.js';
import Subject from '../models/schemas/subjectSchema.js';
import mongoose from 'mongoose';

// Create a new user note
export const createUserNote = async (req, res) => {
    try {
        // Check if the subject exists
        const subject = await Subject.findById(req.body.subjectId);
        if (!subject) {
            return res.status(404).json({ message: 'Subject not found' });
        }

        const userNote = new UserNote(req.body);
        await userNote.save();

        // Add the note to the subject's notes array
        subject.notes.push(userNote._id);
        await subject.save();

        res.status(201).json(userNote);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all user notes
export const getAllUserNotes = async (req, res) => {
    try {
        const userNotes = await UserNote.find();
        res.status(200).json(userNotes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get user notes by user ID
export const getUserNotesByUser = async (req, res) => {
    try {
        const userNotes = await UserNote.find({ userId: req.params.userId });
        res.status(200).json(userNotes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get user notes by subject ID
export const getUserNotesBySubject = async (req, res) => {
    try {
        const userNotes = await UserNote.find({ subjectId: req.params.subjectId });
        res.status(200).json(userNotes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get user notes by user ID and subject ID
export const getUserNotesByUserAndSubject = async (req, res) => {
    try {
        const userNotes = await UserNote.find({
            userId: req.params.userId,
            subjectId: req.params.subjectId
        });
        res.status(200).json(userNotes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a user note by ID
export const getUserNoteById = async (req, res) => {
    try {
        const userNote = await UserNote.findById(req.params.id);
        if (!userNote) {
            return res.status(404).json({ message: 'User note not found' });
        }
        res.status(200).json(userNote);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a user note
export const updateUserNote = async (req, res) => {
    try {
        const userNote = await UserNote.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!userNote) {
            return res.status(404).json({ message: 'User note not found' });
        }

        res.status(200).json(userNote);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a user note
export const deleteUserNote = async (req, res) => {
    try {
        const userNote = await UserNote.findById(req.params.id);
        if (!userNote) {
            return res.status(404).json({ message: 'User note not found' });
        }

        // Get the associated subject
        const subject = await Subject.findById(userNote.subjectId);
        if (subject) {
            // Remove the note ID from the subject's notes array
            subject.notes = subject.notes.filter(
                noteId => noteId.toString() !== req.params.id
            );
            await subject.save();
        }

        await UserNote.findByIdAndDelete(req.params.id);

        res.status(200).json({ message: 'User note deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}; 