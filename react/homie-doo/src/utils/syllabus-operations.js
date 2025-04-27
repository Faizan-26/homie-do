// Utility functions for syllabus operations

export const addUnit = (subject, newUnit) => {
    const updatedSyllabus = { ...subject.courseMaterials.syllabus };
    if (!updatedSyllabus.sections) {
        updatedSyllabus.sections = [];
    }

    // Add unique ID if not provided
    if (!newUnit.id) {
        newUnit.id = `unit_${Date.now()}`;
    }

    updatedSyllabus.sections.push({
        ...newUnit,
        chapters: []
    });

    return {
        ...subject,
        courseMaterials: {
            ...subject.courseMaterials,
            syllabus: updatedSyllabus
        }
    };
};

/**
 * Updates an existing unit in the syllabus
 */
export const updateUnit = (subject, updatedUnit) => {
    const updatedSyllabus = { ...subject.courseMaterials.syllabus };
    const unitIndex = updatedSyllabus.sections.findIndex(unit => unit.id === updatedUnit.id);

    if (unitIndex !== -1) {
        updatedSyllabus.sections[unitIndex] = {
            ...updatedSyllabus.sections[unitIndex],
            title: updatedUnit.title,
            weeks: updatedUnit.weeks
        };
    }

    return {
        ...subject,
        courseMaterials: {
            ...subject.courseMaterials,
            syllabus: updatedSyllabus
        }
    };
};

/**
 * Deletes a unit from the syllabus
 */
export const deleteUnit = (subject, unitId) => {
    const updatedSyllabus = { ...subject.courseMaterials.syllabus };
    updatedSyllabus.sections = updatedSyllabus.sections.filter(unit => unit.id !== unitId);

    return {
        ...subject,
        courseMaterials: {
            ...subject.courseMaterials,
            syllabus: updatedSyllabus
        }
    };
};

/**
 * Adds a new chapter to a unit
 */
export const addChapter = (subject, unitId, newChapter) => {
    const updatedSyllabus = { ...subject.courseMaterials.syllabus };
    const unitIndex = updatedSyllabus.sections.findIndex(unit => unit.id === unitId);

    if (unitIndex !== -1) {
        // Add unique ID if not provided
        if (!newChapter.id) {
            newChapter.id = `chapter_${Date.now()}`;
        }

        if (!updatedSyllabus.sections[unitIndex].chapters) {
            updatedSyllabus.sections[unitIndex].chapters = [];
        }

        updatedSyllabus.sections[unitIndex].chapters.push({
            ...newChapter,
            subtopics: []
        });
    }

    return {
        ...subject,
        courseMaterials: {
            ...subject.courseMaterials,
            syllabus: updatedSyllabus
        }
    };
};

/**
 * Updates an existing chapter in a unit
 */
export const updateChapter = (subject, unitId, updatedChapter) => {
    const updatedSyllabus = { ...subject.courseMaterials.syllabus };
    const unitIndex = updatedSyllabus.sections.findIndex(unit => unit.id === unitId);

    if (unitIndex !== -1) {
        const chapterIndex = updatedSyllabus.sections[unitIndex].chapters.findIndex(
            chapter => chapter.id === updatedChapter.id
        );

        if (chapterIndex !== -1) {
            updatedSyllabus.sections[unitIndex].chapters[chapterIndex] = {
                ...updatedSyllabus.sections[unitIndex].chapters[chapterIndex],
                title: updatedChapter.title
            };
        }
    }

    return {
        ...subject,
        courseMaterials: {
            ...subject.courseMaterials,
            syllabus: updatedSyllabus
        }
    };
};

/**
 * Deletes a chapter from a unit
 */
export const deleteChapter = (subject, unitId, chapterId) => {
    const updatedSyllabus = { ...subject.courseMaterials.syllabus };
    const unitIndex = updatedSyllabus.sections.findIndex(unit => unit.id === unitId);

    if (unitIndex !== -1) {
        updatedSyllabus.sections[unitIndex].chapters = updatedSyllabus.sections[unitIndex].chapters.filter(
            chapter => chapter.id !== chapterId
        );
    }

    return {
        ...subject,
        courseMaterials: {
            ...subject.courseMaterials,
            syllabus: updatedSyllabus
        }
    };
};

/**
 * Adds a new subtopic to a chapter
 */
export const addSubtopic = (subject, unitId, chapterId, newSubtopic) => {
    const updatedSyllabus = { ...subject.courseMaterials.syllabus };
    const unitIndex = updatedSyllabus.sections.findIndex(unit => unit.id === unitId);

    if (unitIndex !== -1) {
        const chapterIndex = updatedSyllabus.sections[unitIndex].chapters.findIndex(
            chapter => chapter.id === chapterId
        );

        if (chapterIndex !== -1) {
            if (!updatedSyllabus.sections[unitIndex].chapters[chapterIndex].subtopics) {
                updatedSyllabus.sections[unitIndex].chapters[chapterIndex].subtopics = [];
            }

            // For subtopics, we'll store them with an ID and title
            const subtopicId = `subtopic_${Date.now()}`;
            updatedSyllabus.sections[unitIndex].chapters[chapterIndex].subtopics.push({
                id: subtopicId,
                title: newSubtopic.title
            });
        }
    }

    return {
        ...subject,
        courseMaterials: {
            ...subject.courseMaterials,
            syllabus: updatedSyllabus
        }
    };
};

/**
 * Updates an existing subtopic in a chapter
 */
export const updateSubtopic = (subject, unitId, chapterId, subtopicId, updatedTitle) => {
    const updatedSyllabus = { ...subject.courseMaterials.syllabus };
    const unitIndex = updatedSyllabus.sections.findIndex(unit => unit.id === unitId);

    if (unitIndex !== -1) {
        const chapterIndex = updatedSyllabus.sections[unitIndex].chapters.findIndex(
            chapter => chapter.id === chapterId
        );

        if (chapterIndex !== -1) {
            const subtopicIndex = updatedSyllabus.sections[unitIndex].chapters[chapterIndex].subtopics.findIndex(
                subtopic => subtopic.id === subtopicId
            );

            if (subtopicIndex !== -1) {
                updatedSyllabus.sections[unitIndex].chapters[chapterIndex].subtopics[subtopicIndex].title = updatedTitle;
            }
        }
    }

    return {
        ...subject,
        courseMaterials: {
            ...subject.courseMaterials,
            syllabus: updatedSyllabus
        }
    };
};

/**
 * Deletes a subtopic from a chapter
 */
export const deleteSubtopic = (subject, unitId, chapterId, subtopicId) => {
    const updatedSyllabus = { ...subject.courseMaterials.syllabus };
    const unitIndex = updatedSyllabus.sections.findIndex(unit => unit.id === unitId);

    if (unitIndex !== -1) {
        const chapterIndex = updatedSyllabus.sections[unitIndex].chapters.findIndex(
            chapter => chapter.id === chapterId
        );

        if (chapterIndex !== -1) {
            updatedSyllabus.sections[unitIndex].chapters[chapterIndex].subtopics =
                updatedSyllabus.sections[unitIndex].chapters[chapterIndex].subtopics.filter(
                    subtopic => subtopic.id !== subtopicId
                );
        }
    }

    return {
        ...subject,
        courseMaterials: {
            ...subject.courseMaterials,
            syllabus: updatedSyllabus
        }
    };
};

// Additional operations for course materials
export const addLecture = (subject, lectureData) => {
    const lectureId = `lecture_${Date.now()}`;
    const newLecture = {
        id: lectureId,
        title: lectureData.title,
        date: lectureData.date,
        content: lectureData.content,
        attachments: lectureData.attachments || [],
        files: lectureData.files || []
    };

    let updatedCourseMaterials = { ...subject.courseMaterials };
    if (!updatedCourseMaterials.lectures) {
        updatedCourseMaterials.lectures = [];
    }

    updatedCourseMaterials.lectures = [...updatedCourseMaterials.lectures, newLecture];

    return { ...subject, courseMaterials: updatedCourseMaterials };
};

export const updateLecture = (subject, updatedLecture) => {
    const updatedCourseMaterials = { ...subject.courseMaterials };
    const lectureIndex = updatedCourseMaterials.lectures.findIndex(lecture => lecture.id === updatedLecture.id);

    if (lectureIndex !== -1) {
        updatedCourseMaterials.lectures[lectureIndex] = {
            ...updatedCourseMaterials.lectures[lectureIndex],
            title: updatedLecture.title,
            date: updatedLecture.date,
            content: updatedLecture.content,
            attachments: updatedLecture.attachments || [],
            files: updatedLecture.files || []
        };
    }

    return { ...subject, courseMaterials: updatedCourseMaterials };
};

export const deleteLecture = (subject, lectureId) => {
    const updatedCourseMaterials = { ...subject.courseMaterials };
    updatedCourseMaterials.lectures = updatedCourseMaterials.lectures.filter(lecture => lecture.id !== lectureId);

    return { ...subject, courseMaterials: updatedCourseMaterials };
};

export const addReading = (subject, readingData) => {
    const readingId = `reading_${Date.now()}`;
    const newReading = {
        id: readingId,
        title: readingData.title,
        author: readingData.author,
        type: readingData.type,
        chapters: readingData.chapters,
        source: readingData.source,
        length: readingData.length,
        files: readingData.files || []
    };

    let updatedCourseMaterials = { ...subject.courseMaterials };
    if (!updatedCourseMaterials.readings) {
        updatedCourseMaterials.readings = [];
    }

    updatedCourseMaterials.readings = [...updatedCourseMaterials.readings, newReading];

    return { ...subject, courseMaterials: updatedCourseMaterials };
};

export const updateReading = (subject, updatedReading) => {
    const updatedCourseMaterials = { ...subject.courseMaterials };
    const readingIndex = updatedCourseMaterials.readings.findIndex(reading => reading.id === updatedReading.id);

    if (readingIndex !== -1) {
        updatedCourseMaterials.readings[readingIndex] = {
            ...updatedCourseMaterials.readings[readingIndex],
            title: updatedReading.title,
            author: updatedReading.author,
            type: updatedReading.type,
            chapters: updatedReading.chapters,
            source: updatedReading.source,
            length: updatedReading.length,
            files: updatedReading.files || []
        };
    }

    return { ...subject, courseMaterials: updatedCourseMaterials };
};

export const deleteReading = (subject, readingId) => {
    const updatedCourseMaterials = { ...subject.courseMaterials };
    updatedCourseMaterials.readings = updatedCourseMaterials.readings.filter(reading => reading.id !== readingId);

    return { ...subject, courseMaterials: updatedCourseMaterials };
};

export const addAssignment = (subject, assignmentData) => {
    const assignmentId = `assignment_${Date.now()}`;
    const newAssignment = {
        id: assignmentId,
        title: assignmentData.title,
        dueDate: assignmentData.dueDate,
        points: assignmentData.points,
        instructions: assignmentData.instructions,
        attachments: assignmentData.attachments || [],
        files: assignmentData.files || []
    };

    let updatedCourseMaterials = { ...subject.courseMaterials };
    if (!updatedCourseMaterials.assignments) {
        updatedCourseMaterials.assignments = [];
    }

    updatedCourseMaterials.assignments = [...updatedCourseMaterials.assignments, newAssignment];

    return { ...subject, courseMaterials: updatedCourseMaterials };
};

export const updateAssignment = (subject, updatedAssignment) => {
    const updatedCourseMaterials = { ...subject.courseMaterials };
    const assignmentIndex = updatedCourseMaterials.assignments.findIndex(assignment => assignment.id === updatedAssignment.id);

    if (assignmentIndex !== -1) {
        updatedCourseMaterials.assignments[assignmentIndex] = {
            ...updatedCourseMaterials.assignments[assignmentIndex],
            title: updatedAssignment.title,
            dueDate: updatedAssignment.dueDate,
            points: updatedAssignment.points,
            instructions: updatedAssignment.instructions,
            attachments: updatedAssignment.attachments || [],
            files: updatedAssignment.files || []
        };
    }

    return { ...subject, courseMaterials: updatedCourseMaterials };
};

export const deleteAssignment = (subject, assignmentId) => {
    const updatedCourseMaterials = { ...subject.courseMaterials };
    updatedCourseMaterials.assignments = updatedCourseMaterials.assignments.filter(assignment => assignment.id !== assignmentId);

    return { ...subject, courseMaterials: updatedCourseMaterials };
};

export const addNote = (subject, noteData) => {
    const noteId = `note_${Date.now()}`;
    const newNote = {
        id: noteId,
        title: noteData.title,
        content: noteData.content,
        date: new Date().toISOString().split('T')[0]
    };

    let updatedSubject = { ...subject };
    if (!updatedSubject.notes) {
        updatedSubject.notes = [];
    }

    updatedSubject.notes = [...updatedSubject.notes, newNote];

    return updatedSubject;
};

export const updateNote = (subject, updatedNote) => {
    let updatedSubject = { ...subject };
    const noteIndex = updatedSubject.notes.findIndex(note => note.id === updatedNote.id);

    if (noteIndex !== -1) {
        updatedSubject.notes[noteIndex] = {
            ...updatedSubject.notes[noteIndex],
            title: updatedNote.title,
            content: updatedNote.content
        };
    }

    return updatedSubject;
};

export const deleteNote = (subject, noteId) => {
    let updatedSubject = { ...subject };
    updatedSubject.notes = updatedSubject.notes.filter(note => note.id !== noteId);

    return updatedSubject;
}; 