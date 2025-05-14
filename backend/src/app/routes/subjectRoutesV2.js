import express from 'express';
import * as subjectService from '../services/subjectServiceV2.js';
import { authenticateJWT } from '../middleware/authMiddleware.js';

const subjectRouterV2 = express.Router();

// Apply authentication middleware to all routes
subjectRouterV2.use(authenticateJWT);

// get all subjects for a user
subjectRouterV2.get('/', async (req, res) => {
    try {
        const subjects = await subjectService.getAllSubjects(req.user.id);
        console.log('Fetched subjects:', subjects);
        res.status(200).json(subjects);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
})

// create a new subject
subjectRouterV2.post('/', async (req, res) => {
    try {
        console.log('Creating subject with data:', req.body);
        console.log('User ', req.user);
        console.log('User ID:', req.body);
        const subject = await subjectService.createSubject(req.user.id, req.body);
        console.log('Created subject:', subject);
        console.log('Request body:', req.body);
        res.status(201).json(subject);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// delete a subject by id
subjectRouterV2.delete('/:id', async (req, res) => {
    try {
        const subjectId = req.params.id;
        console.log('Deleting subject with ID:', subjectId);
        const result = await subjectService.deleteSubject(req.user.id, subjectId);
        console.log('Delete result:', result);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

subjectRouterV2.post('/:id/lecture', async (req, res) => {
    try {
        const subjectId = req.params.id;
        const lectureData = req.body; // contains title, date, content and attachments
        console.log('Adding lecture to subject with ID:', subjectId);

        const updatedSubject = await subjectService.addLecture(req.user.id, subjectId, lectureData);
        console.log('Updated subject with new lecture:', updatedSubject);

        res.status(201).json(updatedSubject);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// edit lecture of a subject by id-> subjectId/lecture/lectureId
// expect lectureData: { title: "Lecture 1", date: "2023-10-01", content: "Lecture content", attachments: [] } attachments should be an array of objects with id, name, type, size, url
subjectRouterV2.put('/:id/lecture/:lectureId', async (req, res) => {
    try {
        const subjectId = req.params.id;
        const lectureId = req.params.lectureId;
        const lectureData = req.body; // contains title, date, content and attachments
        console.log('Editing lecture of subject with ID:', subjectId);

        const updatedSubject = await subjectService.editLecture(req.user.id, subjectId, lectureId, lectureData);
        console.log('Updated subject with edited lecture:', updatedSubject);

        res.status(200).json(updatedSubject);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// delete lecture of a subject by id-> subjectId/lecture/lectureId
subjectRouterV2.delete('/:id/lecture/:lectureId', async (req, res) => {
    try {
        const subjectId = req.params.id;
        const lectureId = req.params.lectureId;
        console.log('Deleting lecture of subject with ID:', subjectId);

        const updatedSubject = await subjectService.deleteLecture(req.user.id, subjectId, lectureId);
        console.log('Updated subject after deleting lecture:', updatedSubject);

        res.status(200).json(updatedSubject);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// toggle favorite status of a lecture
subjectRouterV2.patch('/:id/lecture/:lectureId/favorite', async (req, res) => {
    try {
        const subjectId = req.params.id;
        const lectureId = req.params.lectureId;
        console.log('Toggling favorite status of lecture with ID:', lectureId);

        const updatedSubject = await subjectService.toggleLectureFavorite(req.user.id, subjectId, lectureId);
        console.log('Updated subject with toggled lecture favorite:', updatedSubject);

        res.status(200).json(updatedSubject);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// add reading to a subject by id
/*
Reading DataStructure:
{
    title: "Reading 1",
    type: "TEXTBOOK", // TEXTBOOK, ARTICLE, VIDEO, etc.
    typeFieldOne: "Author",
    typeFieldTwo: "Publisher",
    attachments: [
        {
            id: "attachment1",
            name: "file.pdf",
            type: "pdf",
            size: 123456,
            url: "CLOUDINARY_URL"
        }
    ]
}
*/
subjectRouterV2.post('/:id/reading', async (req, res) => {
    try {
        const subjectId = req.params.id;
        const readingData = req.body; // contains title, type, typeFieldOne, typeFieldTwo and attachments
        console.log('Adding reading to subject with ID:', subjectId);

        const updatedSubject = await subjectService.addReading(req.user.id, subjectId, readingData);
        console.log('Updated subject with new reading:', updatedSubject);

        res.status(201).json(updatedSubject);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// edit reading of a subject by id-> subjectId/reading/readingId
// expect readingData: { title: "Reading 1", type: "TEXTBOOK", typeFieldOne: "Author", typeFieldTwo: "Publisher", attachments: [] } 
subjectRouterV2.put('/:id/reading/:readingId', async (req, res) => {
    try {
        const subjectId = req.params.id;
        const readingId = req.params.readingId;
        const readingData = req.body;
        console.log('Editing reading of subject with ID:', subjectId);

        const updatedSubject = await subjectService.editReading(req.user.id, subjectId, readingId, readingData);
        console.log('Updated subject with edited reading:', updatedSubject);

        res.status(200).json(updatedSubject);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// toggle favorite status of a reading
subjectRouterV2.patch('/:id/reading/:readingId/favorite', async (req, res) => {
    try {
        const subjectId = req.params.id;
        const readingId = req.params.readingId;
        console.log('Toggling favorite status of reading with ID:', readingId);

        const updatedSubject = await subjectService.toggleReadingFavorite(req.user.id, subjectId, readingId);
        console.log('Updated subject with toggled reading favorite:', updatedSubject);

        res.status(200).json(updatedSubject);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// delete reading of a subject by id-> subjectId/reading/readingId
subjectRouterV2.delete('/:id/reading/:readingId', async (req, res) => {
    try {
        const subjectId = req.params.id;
        const readingId = req.params.readingId;
        console.log('Deleting reading of subject with ID:', subjectId);

        const updatedSubject = await subjectService.deleteReading(req.user.id, subjectId, readingId);
        console.log('Updated subject after deleting reading:', updatedSubject);

        res.status(200).json(updatedSubject);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// add assignment to a subject by id
/*
Assignment DataStructure:
{
    title: "Assignment 1",
    dueDate: "2023-10-01", 
    points: 10,
    instructions: "Assignment instructions",
    isCompleted: false,
    isFavorite: false,
    attachments: [
        {
            id: "attachment1",
            name: "file.pdf",
            type: "pdf",
            size: 123456,
            url: "CLOUDINARY_URL"
        }
    ]
}
*/
subjectRouterV2.post('/:id/assignment', async (req, res) => {
    try {
        const subjectId = req.params.id;
        const assignmentData = req.body;
        console.log('Adding assignment to subject with ID:', subjectId);

        const updatedSubject = await subjectService.addAssignment(req.user.id, subjectId, assignmentData);
        console.log('Updated subject with new assignment:', updatedSubject);

        res.status(201).json(updatedSubject);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// edit assignment of a subject by id-> subjectId/assignment/assignmentId
// expect assignmentData: { title: "Assignment 1", dueDate: "2023-10-01", points: 10, instructions: "Assignment instructions", isCompleted: false, isFavorite: false, attachments: [] }
subjectRouterV2.put('/:id/assignment/:assignmentId', async (req, res) => {
    try {
        const subjectId = req.params.id;
        const assignmentId = req.params.assignmentId;
        const assignmentData = req.body;
        console.log('Editing assignment of subject with ID:', subjectId);

        const updatedSubject = await subjectService.editAssignment(req.user.id, subjectId, assignmentId, assignmentData);
        console.log('Updated subject with edited assignment:', updatedSubject);

        res.status(200).json(updatedSubject);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// toggle favorite status of an assignment
subjectRouterV2.patch('/:id/assignment/:assignmentId/favorite', async (req, res) => {
    try {
        const subjectId = req.params.id;
        const assignmentId = req.params.assignmentId;
        console.log('Toggling favorite status of assignment with ID:', assignmentId);

        const updatedSubject = await subjectService.toggleAssignmentFavorite(req.user.id, subjectId, assignmentId);
        console.log('Updated subject with toggled assignment favorite:', updatedSubject);

        res.status(200).json(updatedSubject);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// delete assignment of a subject by id-> subjectId/assignment/assignmentId
subjectRouterV2.delete('/:id/assignment/:assignmentId', async (req, res) => {
    try {
        const subjectId = req.params.id;
        const assignmentId = req.params.assignmentId;
        console.log('Deleting assignment of subject with ID:', subjectId);

        const updatedSubject = await subjectService.deleteAssignment(req.user.id, subjectId, assignmentId);
        console.log('Updated subject after deleting assignment:', updatedSubject);

        res.status(200).json(updatedSubject);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// add note to a subject by id
/*
Note DataStructure:
{
    title: "Note 1",
    date: "2023-10-01",
    content: "Note content",
    tags: ["tag1", "tag2"]
}
*/
subjectRouterV2.post('/:id/note', async (req, res) => {
    try {
        const subjectId = req.params.id;
        const noteData = req.body;
        console.log('Adding note to subject with ID:', subjectId);

        const updatedSubject = await subjectService.addNote(req.user.id, subjectId, noteData);
        console.log('Updated subject with new note:', updatedSubject);

        res.status(201).json(updatedSubject);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// edit note of a subject by id-> subjectId/note/noteId
// expect noteData: { title: "Note 1", date: "2023-10-01", content: "Note content", tags: ["tag1", "tag2"] }
subjectRouterV2.put('/:id/note/:noteId', async (req, res) => {
    try {
        const subjectId = req.params.id;
        const noteId = req.params.noteId;
        const noteData = req.body;
        console.log('Editing note of subject with ID:', subjectId);

        const updatedSubject = await subjectService.editNote(req.user.id, subjectId, noteId, noteData);
        console.log('Updated subject with edited note:', updatedSubject);

        res.status(200).json(updatedSubject);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// toggle favorite status of a note
subjectRouterV2.patch('/:id/note/:noteId/favorite', async (req, res) => {
    try {
        const subjectId = req.params.id;
        const noteId = req.params.noteId;
        console.log('Toggling favorite status of note with ID:', noteId);

        const updatedSubject = await subjectService.toggleNoteFavorite(req.user.id, subjectId, noteId);
        console.log('Updated subject with toggled note favorite:', updatedSubject);

        res.status(200).json(updatedSubject);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// delete note of a subject by id-> subjectId/note/noteId
subjectRouterV2.delete('/:id/note/:noteId', async (req, res) => {
    try {
        const subjectId = req.params.id;
        const noteId = req.params.noteId;
        console.log('Deleting note of subject with ID:', subjectId);

        const updatedSubject = await subjectService.deleteNote(req.user.id, subjectId, noteId);
        console.log('Updated subject after deleting note:', updatedSubject);

        res.status(200).json(updatedSubject);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default subjectRouterV2;