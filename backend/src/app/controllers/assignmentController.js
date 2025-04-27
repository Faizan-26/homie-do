import Assignment from '../models/schemas/assignmentSchema.js';
import Subject from '../models/schemas/subjectSchema.js';
import mongoose from 'mongoose';


export const createAssignment = async (req, res) => {
    try {
        const subject = await Subject.findById(req.body.subjectId);
        if (!subject) {
            return res.status(404).json({ message: 'Subject not found' });
        }

        const assignment = new Assignment(req.body);
        await assignment.save();

        // Add the assignment to the subject's assignments array
        subject.assignments.push(assignment._id);
        await subject.save();

        res.status(201).json(assignment);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all assignments
export const getAllAssignments = async (req, res) => {
    try {
        const assignments = await Assignment.find();
        res.status(200).json(assignments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get assignments by subject ID
export const getAssignmentsBySubject = async (req, res) => {
    try {
        const assignments = await Assignment.find({ subjectId: req.params.subjectId });
        res.status(200).json(assignments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get an assignment by ID
export const getAssignmentById = async (req, res) => {
    try {
        const assignment = await Assignment.findById(req.params.id);
        if (!assignment) {
            return res.status(404).json({ message: 'Assignment not found' });
        }
        res.status(200).json(assignment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update an assignment
export const updateAssignment = async (req, res) => {
    try {
        const assignment = await Assignment.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!assignment) {
            return res.status(404).json({ message: 'Assignment not found' });
        }

        res.status(200).json(assignment);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete an assignment
export const deleteAssignment = async (req, res) => {
    try {
        const assignment = await Assignment.findById(req.params.id);
        if (!assignment) {
            return res.status(404).json({ message: 'Assignment not found' });
        }

        // Get the associated subject
        const subject = await Subject.findById(assignment.subjectId);
        if (subject) {
            // Remove the assignment ID from the subject's assignments array
            subject.assignments = subject.assignments.filter(
                assignmentId => assignmentId.toString() !== req.params.id
            );
            await subject.save();
        }

        await Assignment.findByIdAndDelete(req.params.id);

        res.status(200).json({ message: 'Assignment deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}; 