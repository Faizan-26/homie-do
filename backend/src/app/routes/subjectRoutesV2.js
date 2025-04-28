import express from 'express';
import * as subjectService  from '../services/subjectServiceV2.js';
import { authenticateJWT } from '../middleware/authMiddleware.js';

const subjectRouterV2 = express.Router();

// Apply authentication middleware to all routes
subjectRouterV2.use(authenticateJWT);

// get all subjects for a user
subjectRouterV2.get('/', async(req, res) =>{
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

// edit syllabus of a subject by id
// takes { title and content of syllabus} in body
subjectRouterV2.put('/:id/syllabus', async (req, res) => {
    try {
        const subjectId = req.params.id;
        const syllabusData = req.body;
        
        console.log('Updating syllabus for subject with ID:', subjectId);
        console.log('Syllabus data:', syllabusData);
        const updatedSubject = await subjectService.updateSyllabus(req.user.id, subjectId, syllabusData);
        console.log('Updated subject:', updatedSubject);
        res.status(200).json(updatedSubject);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

// add unit to a subject by id
subjectRouterV2.post('/:id/unit', async (req, res) => {
    try {
        const subjectId = req.params.id;
        const unitData = req.body; // contains title and weeks
        console.log('Adding unit to subject with ID:', subjectId);

        const updatedSubject = await subjectService.addUnit(req.user.id, subjectId, unitData);
        console.log('Updated subject with new unit:', updatedSubject);

        res.status(201).json(updatedSubject);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// edit unit of a subject by id-> subjectId/unit/unitId
// expect 
subjectRouterV2.put('/:id/unit/:unitId', async (req, res) => {
    try {
        const subjectId = req.params.id;
        const unitId = req.params.unitId;
        const unitData = req.body; // contains title and weeks
        console.log('Editing unit of subject with ID:', subjectId);

        const updatedSubject = await subjectService.editUnit(req.user.id, subjectId, unitId, unitData);
        console.log('Updated subject with edited unit:', updatedSubject);

        res.status(200).json(updatedSubject);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// delete unit of a subject by id-> subjectId/unit/unitId
subjectRouterV2.delete('/:id/unit/:unitId', async (req, res) => {
    try {
        const subjectId = req.params.id;
        const unitId = req.params.unitId;
        console.log('Deleting unit of subject with ID:', subjectId);

        const updatedSubject = await subjectService.deleteUnit(req.user.id, subjectId, unitId);
        console.log('Updated subject after deleting unit:', updatedSubject);

        res.status(200).json(updatedSubject);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// add chapter to a unit of a subject by id-> subjectId/unit/unitId/chapter
subjectRouterV2.post('/:id/unit/:unitId/chapter', async (req, res) => {
    try {
        const subjectId = req.params.id;
        const unitId = req.params.unitId;
        const chapterData = req.body; // contains title and subtopics subtopic is list of strings may be empty or contains subtopics
        console.log('Adding chapter to unit of subject with ID:', subjectId);

        const updatedSubject = await subjectService.addChapter(req.user.id, subjectId, unitId, chapterData);
        console.log('Updated subject with new chapter:', updatedSubject);

        res.status(201).json(updatedSubject);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// edit chapter of a unit of a subject by id-> subjectId/unit/unitId/chapter/chapterId
// expect chapterData: { title: "Chapter 1", subtopics: [] } subtopics should be an array of strings may be empty or contains subtopics
subjectRouterV2.put('/:id/unit/:unitId/chapter/:chapterId', async (req, res) => {
    try {
        const subjectId = req.params.id;
        const unitId = req.params.unitId;
        const chapterId = req.params.chapterId;
        const chapterData = req.body; // contains title and subtopics
        console.log('Editing chapter of unit in subject with ID:', subjectId);

        const updatedSubject = await subjectService.editChapter(req.user.id, subjectId, unitId, chapterId, chapterData);
        console.log('Updated subject with edited chapter:', updatedSubject);

        res.status(200).json(updatedSubject);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// delete chapter of a unit of a subject by id-> subjectId/unit/unitId/chapter/chapterId
subjectRouterV2.delete('/:id/unit/:unitId/chapter/:chapterId', async (req, res) => {
    try {
        const subjectId = req.params.id;
        const unitId = req.params.unitId;
        const chapterId = req.params.chapterId;
        console.log('Deleting chapter of unit in subject with ID:', subjectId);

        const updatedSubject = await subjectService.deleteChapter(req.user.id, subjectId, unitId, chapterId);
        console.log('Updated subject after deleting chapter:', updatedSubject);

        res.status(200).json(updatedSubject);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// add lecture to a subject by id
/*
Lecture DataStructure:
{
    title: "Lecture 1",
    date: "2023-10-01",
    content: "Lecture content goes here",
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