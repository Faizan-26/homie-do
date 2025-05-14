import { create } from 'zustand';
import { subjectService } from '../services/subjectServiceV2';
import { SubjectModel } from '../models/subjectModel';
import { toast } from 'sonner';

const useSubjectStore = create((set, get) => ({
    subjects: [],
    favorites: [],
    todo: [],
    loading: false,
    activeSubject: null,

    // Fetch all subjects from API
    fetchSubjects: async () => {
        try {
            set({ loading: true });

            // Fetch subjects from API using our service
            const fetchedSubjects = await subjectService.getAllSubjects();

            // Process subjects to match the UI expected format
            const processedSubjects = fetchedSubjects.map(subject => {
                // Convert backend subject to frontend model first
                const subjectModel = SubjectModel.fromBackend(subject);

                // Prepare the subject object in the format expected by the UI
                return {
                    id: subject._id,
                    name: subject.name,
                    description: subject.description || '',
                    instructor: subject.instructor || '',
                    icon: subject.icon,
                    color: subject.color,
                    courseMaterials: {
                        syllabus: {
                            id: subject._id, // Use subject ID as syllabus ID
                            title: `${subject.name} Syllabus`,
                            content: subject.courseMaterials?.syllabus?.content || '',
                            sections: subject.courseMaterials?.syllabus?.units?.map(unit => ({
                                id: unit._id || `unit_${Date.now()}`,
                                title: unit.title || 'Untitled Unit',
                                weeks: unit.weeks || '',
                                chapters: (unit.chapters || []).map(chapter => ({
                                    id: chapter._id || `chapter_${Date.now()}`,
                                    title: chapter.title || 'Untitled Chapter',
                                    subtopics: (chapter.subtopics || []).map((subtopic, index) => ({
                                        id: `subtopic_${index}_${Date.now()}`,
                                        title: typeof subtopic === 'string' ? subtopic : subtopic.title || 'Untitled Subtopic'
                                    }))
                                }))
                            })) || []
                        },
                        lectures: (subject.courseMaterials?.lectures || []).map(lecture => ({
                            id: lecture.id || lecture._id,
                            title: lecture.title || 'Untitled Lecture',
                            date: lecture.date || new Date().toISOString(),
                            content: lecture.content || '',
                            attachments: (lecture.attachments || []).map(attachment => attachment.name),
                            files: lecture.attachments || []
                        })),
                        readings: (subject.courseMaterials?.readings || []).map(reading => ({
                            id: reading._id,
                            title: reading.title || 'Untitled Reading',
                            author: reading.author || '',
                            type: reading.type || 'ARTICLE',
                            typeFieldOne: reading.typeFieldOne || '',
                            typeFieldTwo: reading.typeFieldTwo || '',
                            files: reading.attachments || []
                        })),
                        assignments: (subject.courseMaterials?.assignments || []).map(assignment => ({
                            id: assignment._id,
                            title: assignment.title || 'Untitled Assignment',
                            dueDate: assignment.dueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
                            points: assignment.points || 100,
                            instructions: assignment.instructions || '',
                            isCompleted: assignment.isCompleted || false,
                            isFavorite: assignment.isFavorite || false,
                            attachments: (assignment.attachments || []).map(attachment => attachment.name),
                            files: assignment.attachments || []
                        }))
                    },
                    notes: (subject.notes || []).map(note => ({
                        id: note.id || note._id,
                        title: note.title || 'Untitled Note',
                        date: note.date || new Date().toISOString(),
                        content: note.content || '',
                        tags: note.tags || []
                    }))
                };
            });

            // Extract favorites and todos
            const allFavorites = processedSubjects.reduce((acc, subject) => {
                const subjectFavorites = [
                    ...subject.courseMaterials.assignments.filter(assignment => assignment.isFavorite).map(assignment => `assignment_${subject.id}_${assignment.id}`),
                    ...subject.courseMaterials.lectures.filter(lecture => lecture.isFavorite).map(lecture => `lecture_${subject.id}_${lecture.id}`),
                    ...subject.courseMaterials.readings.filter(reading => reading.isFavorite).map(reading => `reading_${subject.id}_${reading.id}`)
                ];
                return [...acc, ...subjectFavorites];
            }, []);

            const allAssignments = processedSubjects.reduce((acc, subject) => {
                const subjectAssignments = subject.courseMaterials.assignments.map(assignment => ({
                    id: assignment.id,
                    title: assignment.title,
                    dueDate: assignment.dueDate,
                    points: assignment.points,
                    instructions: assignment.instructions,
                    isCompleted: assignment.isCompleted,
                    isFavorite: assignment.isFavorite,
                    attachments: assignment.attachments || [],
                    subjectId: subject.id
                }));
                return [...acc, ...subjectAssignments];
            }, []);

            set({
                subjects: processedSubjects,
                favorites: allFavorites,
                todo: allAssignments,
                loading: false
            });
        } catch (error) {
            console.error('Error fetching data:', error);
            toast.error('Failed to load data. Please try again later.');
            set({ loading: false });
        }
    },

    // Add a new subject
    addSubject: async (newSubject) => {
        try {
            const uiSubject = await subjectService.createSubject(newSubject.toBackend());
            set(state => ({ subjects: [...state.subjects, uiSubject] }));
            toast.success(`Subject "${newSubject.name}" added successfully!`);
            return uiSubject;
        } catch (error) {
            console.error('Error adding subject:', error);
            toast.error('Failed to add subject. Please try again.');
            return null;
        }
    },

    // Delete a subject
    deleteSubject: async (subjectId) => {
        try {
            await subjectService.deleteSubject(subjectId);
            set(state => ({
                subjects: state.subjects.filter(subject => subject.id !== subjectId),
                // Remove favorites associated with this subject
                favorites: state.favorites.filter(fav => !fav.includes(`_${subjectId}_`)),
                // Remove todos associated with this subject
                todo: state.todo.filter(todo => todo.subjectId !== subjectId)
            }));
            toast.success('Subject deleted successfully');
        } catch (error) {
            console.error('Error deleting subject:', error);
            toast.error('Failed to delete subject. Please try again.');
        }
    },

    // Update a subject
    updateSubject: async (updatedSubject) => {
        try {
            console.log("UPDATED SUBJECT PIK", updatedSubject);
            set(state => {
                const index = state.subjects.findIndex(subject => subject.id === updatedSubject.id);

                // Ensure critical fields are present
                if (!updatedSubject.name || updatedSubject.name === '') {
                    const existingSubject = state.subjects.find(s => s.id === updatedSubject.id);
                    if (existingSubject && existingSubject.name) {
                        updatedSubject.name = existingSubject.name;
                        console.warn('Subject name was missing, restored from existing state');
                    }
                }

                if (!updatedSubject.user) {
                    const existingSubject = state.subjects.find(s => s.id === updatedSubject.id);
                    if (existingSubject && existingSubject.user) {
                        updatedSubject.user = existingSubject.user;
                        console.warn('Subject user was missing, restored from existing state');
                    }
                }

                if (index > -1) {
                    const updatedSubjects = [...state.subjects];
                    updatedSubjects[index] = updatedSubject;
                    return { subjects: updatedSubjects };
                }
                return { subjects: [...state.subjects, updatedSubject] };
            });
            toast.success('Subject updated successfully');
        } catch (error) {
            console.error('Error updating subject:', error);
            toast.error('Failed to update subject. Please try again.');
        }
    },

    // Toggle favorite status
    toggleFavorite: async (docType, subjectId, docId) => {
        const favoriteId = `${docType}_${subjectId}_${docId}`;
        const { favorites, subjects } = get();
        const newFavorites = [...favorites];

        const index = newFavorites.indexOf(favoriteId);
        const isFavorite = index === -1;

        if (index !== -1) {
            newFavorites.splice(index, 1);
        } else {
            newFavorites.push(favoriteId);
        }

        set({ favorites: newFavorites });

        try {
            // Find the subject
            const subject = subjects.find(s => s.id === subjectId);
            if (!subject) {
                console.error(`Subject with ID ${subjectId} not found`);
                return;
            }

            // Create a deep clone of the subject to update
            const updatedSubject = JSON.parse(JSON.stringify(subject));
            let itemFound = false;

            // Update the favorite status based on document type
            switch (docType) {
                case 'lecture':
                    const lectureIndex = updatedSubject.courseMaterials.lectures.findIndex(l => l.id === docId);
                    if (lectureIndex !== -1) {
                        updatedSubject.courseMaterials.lectures[lectureIndex].isFavorite = isFavorite;
                        itemFound = true;

                        // Prepare data for API
                        const lectureData = {
                            ...updatedSubject.courseMaterials.lectures[lectureIndex],
                            isFavorite: isFavorite
                        };

                        // Call the service to update the lecture
                        await subjectService.editLecture(subjectId, docId, lectureData);
                    }
                    break;

                case 'reading':
                    const readingIndex = updatedSubject.courseMaterials.readings.findIndex(r => r.id === docId);
                    if (readingIndex !== -1) {
                        updatedSubject.courseMaterials.readings[readingIndex].isFavorite = isFavorite;
                        itemFound = true;

                        // Prepare data for API
                        const readingData = {
                            ...updatedSubject.courseMaterials.readings[readingIndex],
                            isFavorite: isFavorite
                        };

                        // Call the service to update the reading
                        await subjectService.editReading(subjectId, docId, readingData);
                    }
                    break;

                case 'assignment':
                    const assignmentIndex = updatedSubject.courseMaterials.assignments.findIndex(a => a.id === docId);
                    if (assignmentIndex !== -1) {
                        updatedSubject.courseMaterials.assignments[assignmentIndex].isFavorite = isFavorite;
                        itemFound = true;

                        // Prepare data for API
                        const assignmentData = {
                            ...updatedSubject.courseMaterials.assignments[assignmentIndex],
                            isFavorite: isFavorite
                        };

                        // Call the service to update the assignment
                        await subjectService.editAssignment(subjectId, docId, assignmentData);

                        // Also update the todos list if the assignment is there
                        set(state => ({
                            todo: state.todo.map(todo =>
                                todo.id === docId && todo.subjectId === subjectId
                                    ? { ...todo, isFavorite: isFavorite }
                                    : todo
                            )
                        }));
                    }
                    break;

                case 'note':
                    const noteIndex = updatedSubject.notes.findIndex(n => n.id === docId);
                    if (noteIndex !== -1) {
                        updatedSubject.notes[noteIndex].isFavorite = isFavorite;
                        itemFound = true;

                        // Prepare data for API
                        const noteData = {
                            ...updatedSubject.notes[noteIndex],
                            isFavorite: isFavorite
                        };

                        // Call the service to update the note
                        await subjectService.editNote(subjectId, docId, noteData);
                    }
                    break;

                default:
                    console.error(`Unknown document type: ${docType}`);
                    return;
            }

            if (itemFound) {
                // Update the subjects state with the modified subject
                set(state => ({
                    subjects: state.subjects.map(s => s.id === subjectId ? updatedSubject : s)
                }));
            } else {
                console.error(`Item with ID ${docId} not found in ${docType} collection`);
            }

        } catch (error) {
            console.error(`Error toggling favorite status for ${docType} ${docId}:`, error);
            toast.error('Failed to update favorite status. Please try again.');

            // Revert the UI state on error
            set({ favorites: favorites });
        }
    },

    // Set active subject
    setActiveSubject: (subjectId) => {
        const { subjects } = get();
        const subject = subjects.find(s => s.id === subjectId);
        set({ activeSubject: subject });
    },

    // Clear active subject
    clearActiveSubject: () => {
        set({ activeSubject: null });
    }


}));

export default useSubjectStore; 