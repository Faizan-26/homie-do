import express from 'express';
import * as subjectService from '../services/subjectService.js';
import { authenticateJWT } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticateJWT);

// Subject routes
router.post('/', async (req, res) => {
    try {
        const subject = await subjectService.createSubject({
            ...req.body,
            user: req.user.id
        });
        res.status(201).json(subject);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const subjects = await subjectService.getAllSubjects(req.user.id);
        res.status(200).json(subjects);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const subject = await subjectService.getSubjectById(req.params.id, req.user.id);
        if (!subject) {
            return res.status(404).json({ error: 'Subject not found' });
        }
        res.status(200).json(subject);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const subject = await subjectService.updateSubject(req.params.id, req.user.id, req.body);
        if (!subject) {
            return res.status(404).json({ error: 'Subject not found' });
        }
        res.status(200).json(subject);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        
        const subject = await subjectService.deleteSubject(req.params.id, req.user.id);
        if (!subject) {
            return res.status(404).json({ error: 'Subject not found' });
        }
        res.status(200).json({ message: 'Subject deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Unit routes
router.post('/:id/units', async (req, res) => { // id is subject id
    try {
        
        console.log("ADDING UNIT req.body", req.body);
        const unit = await subjectService.addUnit(req.params.id, req.user.id, req.body);
        res.status(201).json(unit);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/:id/units', async (req, res) => {
    try {
        const units = await subjectService.getUnits(req.params.id, req.user.id);
        res.status(200).json(units);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/:id/units/:unitId', async (req, res) => {
    try {
        const unit = await subjectService.updateUnit(req.params.id, req.user.id, req.params.unitId, req.body);
        res.status(200).json(unit);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/:id/units/:unitId', async (req, res) => {
    try {
        await subjectService.deleteUnit(req.params.id, req.user.id, req.params.unitId);
        res.status(200).json({ message: 'Unit deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Chapter routes
router.post('/:id/units/:unitId/chapters', async (req, res) => {
    try {
        const chapter = await subjectService.addChapter(req.params.id, req.user.id, req.params.unitId, req.body);
        res.status(201).json(chapter);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/:id/units/:unitId/chapters', async (req, res) => {
    try {
        const chapters = await subjectService.getChapters(req.params.id, req.user.id, req.params.unitId);
        res.status(200).json(chapters);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/:id/units/:unitId/chapters/:chapterId', async (req, res) => {
    try {
        const chapter = await subjectService.updateChapter(
            req.params.id,
            req.user.id,
            req.params.unitId,
            req.params.chapterId,
            req.body
        );
        res.status(200).json(chapter);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/:id/units/:unitId/chapters/:chapterId', async (req, res) => {
    try {
        await subjectService.deleteChapter(req.params.id, req.user.id, req.params.unitId, req.params.chapterId);
        res.status(200).json({ message: 'Chapter deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Lecture routes
router.post('/:id/lectures', async (req, res) => {
    try {
        const lecture = await subjectService.addLecture(req.params.id, req.user.id, req.body);
        res.status(201).json(lecture);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/:id/lectures', async (req, res) => {
    try {
        const lectures = await subjectService.getLectures(req.params.id, req.user.id);
        res.status(200).json(lectures);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/:id/lectures/:lectureId', async (req, res) => {
    try {
        const lecture = await subjectService.updateLecture(req.params.id, req.user.id, req.params.lectureId, req.body);
        res.status(200).json(lecture);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/:id/lectures/:lectureId', async (req, res) => {
    try {
        await subjectService.deleteLecture(req.params.id, req.user.id, req.params.lectureId);
        res.status(200).json({ message: 'Lecture deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Reading routes
router.post('/:id/readings', async (req, res) => {
    try {
        const reading = await subjectService.addReading(req.params.id, req.user.id, req.body);
        res.status(201).json(reading);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/:id/readings', async (req, res) => {
    try {
        const readings = await subjectService.getReadings(req.params.id, req.user.id);
        res.status(200).json(readings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/:id/readings/:readingId', async (req, res) => {
    try {
        const reading = await subjectService.updateReading(req.params.id, req.user.id, req.params.readingId, req.body);
        res.status(200).json(reading);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/:id/readings/:readingId', async (req, res) => {
    try {
        await subjectService.deleteReading(req.params.id, req.user.id, req.params.readingId);
        res.status(200).json({ message: 'Reading deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Assignment routes
router.post('/:id/assignments', async (req, res) => {
    try {
        const assignment = await subjectService.addAssignment(req.params.id, req.user.id, req.body);
        res.status(201).json(assignment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/:id/assignments', async (req, res) => {
    try {
        const assignments = await subjectService.getAssignments(req.params.id, req.user.id);
        res.status(200).json(assignments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/:id/assignments/:assignmentId', async (req, res) => {
    try {
        const assignment = await subjectService.updateAssignment(req.params.id, req.user.id, req.params.assignmentId, req.body);
        res.status(200).json(assignment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/:id/assignments/:assignmentId', async (req, res) => {
    try {
        await subjectService.deleteAssignment(req.params.id, req.user.id, req.params.assignmentId);
        res.status(200).json({ message: 'Assignment deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;





