import Subject from '../models/schemas/subjectSchema.js';
import UserSubject from '../models/schemas/userSubjectSchema.js';
import mongoose from 'mongoose';

// Create a new subject
export const createSubject = async (req, res) => {
    console.log('createSubject controller called');
    console.log('Request body:', req.body);
    try {
        const subject = new Subject(req.body);
        await subject.save();

        // If a userId is provided, associate the user with this subject
        if (req.body.userId) {
            const userSubject = new UserSubject({
                userId: req.body.userId,
                subjectId: subject._id
            });
            await userSubject.save();
        }

        console.log('Subject created successfully:', subject);
        res.status(201).json(subject);
    } catch (error) {
        console.error('Error creating subject:', error);
        res.status(400).json({ message: error.message });
    }
};

// Get all subjects
export const getAllSubjects = async (req, res) => {
    console.log('getAllSubjects controller called');
    try {
        const subjects = await Subject.find();
        console.log(`Found ${subjects.length} subjects`);
        res.status(200).json(subjects);
    } catch (error) {
        console.error('Error getting all subjects:', error);
        res.status(500).json({ message: error.message });
    }
};

// Get a subject by ID
export const getSubjectById = async (req, res) => {
    console.log('getSubjectById controller called with ID:', req.params.id);
    try {
        const subject = await Subject.findById(req.params.id);
        if (!subject) {
            console.log('Subject not found');
            return res.status(404).json({ message: 'Subject not found' });
        }
        console.log('Subject found:', subject);
        res.status(200).json(subject);
    } catch (error) {
        console.error('Error getting subject by ID:', error);
        res.status(500).json({ message: error.message });
    }
};

// Update a subject
export const updateSubject = async (req, res) => {
    console.log('updateSubject controller called with ID:', req.params.id);
    console.log('Update data:', req.body);
    try {
        // Make sure we're preserving any fields that aren't in the request
        // This is important for nested references like syllabus, assignments, etc.
        const existingSubject = await Subject.findById(req.params.id);
        if (!existingSubject) {
            console.log('Subject not found for update');
            return res.status(404).json({ message: 'Subject not found' });
        }

        // Create an update object that includes all existing fields
        // that might not be included in the request body
        const updateData = {
            ...req.body,
            // Preserve these fields if they exist and aren't in the request
            syllabus: req.body.syllabus !== undefined ? req.body.syllabus : existingSubject.syllabus,
            notes: req.body.notes !== undefined ? req.body.notes : existingSubject.notes,
            assignments: req.body.assignments !== undefined ? req.body.assignments : existingSubject.assignments,
            lectureNotes: req.body.lectureNotes !== undefined ? req.body.lectureNotes : existingSubject.lectureNotes,
            readingMaterials: req.body.readingMaterials !== undefined ? req.body.readingMaterials : existingSubject.readingMaterials,
            documents: req.body.documents !== undefined ? req.body.documents : existingSubject.documents
        };

        console.log('Complete update data:', updateData);

        const subject = await Subject.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );

        console.log('Subject updated successfully:', subject);
        res.status(200).json(subject);
    } catch (error) {
        console.error('Error updating subject:', error);
        res.status(400).json({ message: error.message });
    }
};

// Delete a subject
export const deleteSubject = async (req, res) => {
    console.log('deleteSubject controller called with ID:', req.params.id);
    try {
        const subject = await Subject.findById(req.params.id);
        if (!subject) {
            console.log('Subject not found for deletion');
            return res.status(404).json({ message: 'Subject not found' });
        }

        // Delete subject
        await Subject.findByIdAndDelete(req.params.id);

        // Delete associated user-subject relationships
        await UserSubject.deleteMany({ subjectId: req.params.id });

        console.log('Subject deleted successfully');
        res.status(200).json({ message: 'Subject deleted successfully' });
    } catch (error) {
        console.error('Error deleting subject:', error);
        res.status(500).json({ message: error.message });
    }
};

// Get subjects for a specific user
export const getUserSubjects = async (req, res) => {
    console.log('getUserSubjects controller called for userId:', req.params.userId);
    try {
        const userId = req.params.userId;

        // Find all user-subject associations for this user
        const userSubjects = await UserSubject.find({ userId });
        console.log(`Found ${userSubjects.length} user-subject associations`);

        // Extract subject IDs
        const subjectIds = userSubjects.map(us => us.subjectId);

        // Fetch the actual subjects
        const subjects = await Subject.find({
            _id: { $in: subjectIds }
        });
        console.log(`Found ${subjects.length} subjects for user`);

        res.status(200).json(subjects);
    } catch (error) {
        console.error('Error getting user subjects:', error);
        res.status(500).json({ message: error.message });
    }
};

// Enroll a user in a subject
export const enrollUserInSubject = async (req, res) => {
    console.log('enrollUserInSubject controller called with data:', req.body);
    try {
        const { userId, subjectId } = req.body;

        // Check if the subject exists
        const subject = await Subject.findById(subjectId);
        if (!subject) {
            console.log('Subject not found for enrollment');
            return res.status(404).json({ message: 'Subject not found' });
        }

        // Create the association
        const userSubject = new UserSubject({
            userId,
            subjectId
        });

        await userSubject.save();
        console.log('User enrolled in subject successfully');

        res.status(201).json({ message: 'User enrolled in subject successfully' });
    } catch (error) {
        // If it's a duplicate key error, the user is already enrolled
        if (error.code === 11000) {
            console.log('User is already enrolled in this subject');
            return res.status(400).json({ message: 'User is already enrolled in this subject' });
        }
        console.error('Error enrolling user in subject:', error);
        res.status(400).json({ message: error.message });
    }
};

// Unenroll a user from a subject
export const unenrollUserFromSubject = async (req, res) => {
    console.log('unenrollUserFromSubject controller called with userId:', req.params.userId, 'subjectId:', req.params.subjectId);
    try {
        const { userId, subjectId } = req.params;

        const result = await UserSubject.findOneAndDelete({
            userId,
            subjectId
        });

        if (!result) {
            console.log('User is not enrolled in this subject');
            return res.status(404).json({ message: 'User is not enrolled in this subject' });
        }

        console.log('User unenrolled from subject successfully');
        res.status(200).json({ message: 'User unenrolled from subject successfully' });
    } catch (error) {
        console.error('Error unenrolling user from subject:', error);
        res.status(500).json({ message: error.message });
    }
}; 