import Syllabus from '../models/schemas/syllabusSchema.js';
import Subject from '../models/schemas/subjectSchema.js';
import mongoose from 'mongoose';

// Create a new syllabus
export const createSyllabus = async (req, res) => {
    console.log('createSyllabus controller called');
    console.log('Request body:', req.body);
    try {
        // Create a new syllabus from the request body
        const syllabus = new Syllabus(req.body);
        await syllabus.save();

        // If a subjectId is provided, update the subject to reference this syllabus
        if (req.body.subjectId) {
            // Find the subject
            const subject = await Subject.findById(req.body.subjectId);
            if (subject) {
                // Update the subject to reference this syllabus
                subject.syllabus = syllabus._id;
                await subject.save();
                console.log(`Updated subject ${subject._id} to reference syllabus ${syllabus._id}`);
            }
        }

        console.log('Syllabus created successfully:', syllabus);
        res.status(201).json(syllabus);
    } catch (error) {
        console.error('Error creating syllabus:', error);
        res.status(400).json({ message: error.message });
    }
};

// Get all syllabi
export const getAllSyllabi = async (req, res) => {
    console.log('getAllSyllabi controller called');
    try {
        const syllabi = await Syllabus.find();
        console.log(`Found ${syllabi.length} syllabi`);
        res.status(200).json(syllabi);
    } catch (error) {
        console.error('Error getting all syllabi:', error);
        res.status(500).json({ message: error.message });
    }
};

// Get a syllabus by ID
export const getSyllabusById = async (req, res) => {
    console.log('getSyllabusById controller called with ID:', req.params.id);
    try {
        const syllabus = await Syllabus.findById(req.params.id);
        if (!syllabus) {
            console.log('Syllabus not found');
            return res.status(404).json({ message: 'Syllabus not found' });
        }
        console.log('Syllabus found:', syllabus);
        res.status(200).json(syllabus);
    } catch (error) {
        console.error('Error getting syllabus by ID:', error);
        res.status(500).json({ message: error.message });
    }
};

// Get syllabus by subject ID
export const getSyllabusBySubjectId = async (req, res) => {
    console.log('getSyllabusBySubjectId controller called with subjectId:', req.params.subjectId);
    try {
        // Make sure we're using the right field to query
        const syllabus = await Syllabus.findOne({ subjectId: req.params.subjectId });

        if (!syllabus) {
            console.log('No syllabus found for subject');

            // Optional: Create a default syllabus for this subject
            const subject = await Subject.findById(req.params.subjectId);
            if (subject) {
                console.log('Creating a default syllabus for subject');

                // Create new syllabus
                const newSyllabus = new Syllabus({
                    title: `${subject.name} Syllabus`,
                    description: `Syllabus for ${subject.name}`,
                    subjectId: subject._id,
                    topics: []
                });

                await newSyllabus.save();

                // Update subject reference
                subject.syllabus = newSyllabus._id;
                await subject.save();

                console.log('Default syllabus created:', newSyllabus);
                return res.status(200).json(newSyllabus);
            }

            return res.status(404).json({ message: 'No syllabus found for this subject' });
        }

        console.log('Syllabus found for subject:', syllabus);
        res.status(200).json(syllabus);
    } catch (error) {
        console.error('Error getting syllabus by subject ID:', error);
        res.status(500).json({ message: error.message });
    }
};

// Update a syllabus
export const updateSyllabus = async (req, res) => {
    console.log('updateSyllabus controller called with ID:', req.params.id);
    console.log('Update data:', req.body);
    try {
        // Get existing syllabus to preserve fields not included in the request
        const existingSyllabus = await Syllabus.findById(req.params.id);
        if (!existingSyllabus) {
            console.log('Syllabus not found for update');
            return res.status(404).json({ message: 'Syllabus not found' });
        }

        // Merge request body with existing syllabus data
        const updateData = {
            ...req.body,
            topics: req.body.topics !== undefined ? req.body.topics : existingSyllabus.topics,
            documentFiles: req.body.documentFiles !== undefined ? req.body.documentFiles : existingSyllabus.documentFiles
        };

        // Update the syllabus
        const syllabus = await Syllabus.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );

        console.log('Syllabus updated successfully:', syllabus);
        res.status(200).json(syllabus);
    } catch (error) {
        console.error('Error updating syllabus:', error);
        res.status(400).json({ message: error.message });
    }
};

// Delete a syllabus
export const deleteSyllabus = async (req, res) => {
    console.log('deleteSyllabus controller called with ID:', req.params.id);
    try {
        const syllabus = await Syllabus.findById(req.params.id);
        if (!syllabus) {
            console.log('Syllabus not found for deletion');
            return res.status(404).json({ message: 'Syllabus not found' });
        }

        // Delete the syllabus
        await Syllabus.findByIdAndDelete(req.params.id);

        // Update associated subject to remove reference to this syllabus
        if (syllabus.subjectId) {
            const subject = await Subject.findById(syllabus.subjectId);
            if (subject && subject.syllabus && subject.syllabus.toString() === req.params.id) {
                subject.syllabus = null;
                await subject.save();
                console.log(`Updated subject ${subject._id} to remove reference to syllabus ${req.params.id}`);
            }
        }

        console.log('Syllabus deleted successfully');
        res.status(200).json({ message: 'Syllabus deleted successfully' });
    } catch (error) {
        console.error('Error deleting syllabus:', error);
        res.status(500).json({ message: error.message });
    }
};

// Add a unit (topic) to a syllabus
export const addUnit = async (req, res) => {
    console.log('addUnit controller called for syllabus ID:', req.params.syllabusId);
    console.log('Unit data:', req.body);
    try {
        let syllabus;

        // First, check if this is a MongoDB ObjectId
        const isValidObjectId = mongoose.isValidObjectId(req.params.syllabusId);

        if (isValidObjectId) {
            // Try to find the syllabus by ID
            syllabus = await Syllabus.findById(req.params.syllabusId);
        }

        if (!syllabus) {
            console.log('Syllabus not found, checking if this is a subject ID');

            // Check if the ID is a subject ID and create a syllabus for that subject
            if (isValidObjectId) {
                const subject = await Subject.findById(req.params.syllabusId);

                if (subject) {
                    console.log('Found subject, creating syllabus for it');

                    // Create a new syllabus for this subject
                    syllabus = new Syllabus({
                        title: `${subject.name} Syllabus`,
                        description: `Syllabus for ${subject.name}`,
                        subjectId: subject._id,
                        topics: []
                    });

                    await syllabus.save();

                    // Update the subject to reference this syllabus
                    subject.syllabus = syllabus._id;
                    await subject.save();

                    console.log(`Created new syllabus ${syllabus._id} for subject ${subject._id}`);
                } else {
                    console.log('Subject not found');
                    return res.status(404).json({ message: 'Subject not found' });
                }
            } else {
                console.log('Invalid ID format');
                return res.status(400).json({ message: 'Invalid syllabus or subject ID' });
            }
        }

        // Create a new unit with order based on existing units
        const newUnit = {
            title: req.body.title,
            description: req.body.description || '',
            order: syllabus.topics ? syllabus.topics.length : 0
        };

        // Add the unit to the syllabus
        syllabus.topics.push(newUnit);
        await syllabus.save();

        console.log('Unit added successfully to syllabus');
        res.status(201).json(syllabus);
    } catch (error) {
        console.error('Error adding unit to syllabus:', error);
        res.status(400).json({ message: error.message });
    }
};

// Update a unit in a syllabus
export const updateUnit = async (req, res) => {
    console.log('updateUnit controller called for syllabus ID:', req.params.syllabusId, 'unit ID:', req.params.unitId);
    console.log('Update data:', req.body);
    try {
        const syllabus = await Syllabus.findById(req.params.syllabusId);
        if (!syllabus) {
            console.log('Syllabus not found');
            return res.status(404).json({ message: 'Syllabus not found' });
        }

        // Find the unit in the syllabus
        const unitIndex = syllabus.topics.findIndex(unit => unit._id.toString() === req.params.unitId);
        if (unitIndex === -1) {
            console.log('Unit not found in syllabus');
            return res.status(404).json({ message: 'Unit not found in syllabus' });
        }

        // Update the unit with the request body data
        if (req.body.title) syllabus.topics[unitIndex].title = req.body.title;
        if (req.body.description !== undefined) syllabus.topics[unitIndex].description = req.body.description;
        if (req.body.order !== undefined) syllabus.topics[unitIndex].order = req.body.order;

        await syllabus.save();

        console.log('Unit updated successfully');
        res.status(200).json(syllabus);
    } catch (error) {
        console.error('Error updating unit in syllabus:', error);
        res.status(400).json({ message: error.message });
    }
};

// Delete a unit from a syllabus
export const deleteUnit = async (req, res) => {
    console.log('deleteUnit controller called for syllabus ID:', req.params.syllabusId, 'unit ID:', req.params.unitId);
    try {
        const syllabus = await Syllabus.findById(req.params.syllabusId);
        if (!syllabus) {
            console.log('Syllabus not found');
            return res.status(404).json({ message: 'Syllabus not found' });
        }

        // Find and remove the unit
        const unitIndex = syllabus.topics.findIndex(unit => unit._id.toString() === req.params.unitId);
        if (unitIndex === -1) {
            console.log('Unit not found in syllabus');
            return res.status(404).json({ message: 'Unit not found in syllabus' });
        }

        // Remove the unit
        syllabus.topics.splice(unitIndex, 1);

        // Re-order remaining units
        syllabus.topics.forEach((unit, index) => {
            unit.order = index;
        });

        await syllabus.save();

        console.log('Unit deleted successfully');
        res.status(200).json(syllabus);
    } catch (error) {
        console.error('Error deleting unit from syllabus:', error);
        res.status(500).json({ message: error.message });
    }
}; 