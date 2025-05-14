import { create } from 'zustand';
import { toast } from 'sonner';
import {
    addLectureHandler,
    updateLectureHandler,
    deleteLectureHandler,
    addReadingHandler,
    updateReadingHandler,
    deleteReadingHandler,
    addAssignmentHandler,
    updateAssignmentHandler,
    deleteAssignmentHandler,
    addNoteHandler,
    updateNoteHandler,
    deleteNoteHandler
} from '../utils/subject-integration-v2';

import useSubjectStore from './subjectStore';
import {
    AttachmentModel,
    LectureModel,
    ReadingModel,
    AssignmentModel,
    NoteModel
} from '../models/subjectModel';

const useSubjectContentStore = create((set, get) => ({
    // State
    selectedTab: 'lectures',
    workingSubject: null,
    loading: false,
    dialogs: {
        addLecture: false,
        editLecture: false,
        addReading: false,
        editReading: false,
        addAssignment: false,
        editAssignment: false,
        addNote: false,
        editNote: false,
    },
    selected: {
        lecture: null,
        reading: null,
        assignment: null,
        note: null,
    },

    // Actions
    setSelectedTab: (tab) => set({ selectedTab: tab }),
    setWorkingSubject: (subject) => set({ workingSubject: subject }),
    setLoading: (loading) => set({ loading }),

    // Dialog controls
    toggleDialog: (dialogName, isOpen) =>
        set(state => ({
            dialogs: { ...state.dialogs, [dialogName]: isOpen }
        })),

    // Selection controls
    setSelected: (type, item) =>
        set(state => ({
            selected: { ...state.selected, [type]: item }
        })),

    // Lecture Operations
    addLecture: async (newLecture) => {
        const { workingSubject } = get();
        set({ loading: true });
        try {
            const updatedSubject = await addLectureHandler(workingSubject.id, newLecture);
            if (updatedSubject) {
                const { updateSubject } = useSubjectStore.getState();

                // Update the global subject store
                updateSubject(updatedSubject);

                // Set the working subject directly
                set({
                    workingSubject: updatedSubject,
                    loading: false
                });

                toast.success(`Lecture "${newLecture.title}" added successfully!`);
            }
        } catch (error) {
            console.error('Add lecture error:', error);
            toast.error('Failed to add lecture');
            set({ loading: false });
        }
    },

    updateLecture: async (lectureId, updatedLecture) => {
        console.log("UPDATED LECTURE: ", updatedLecture);
        console.log("LECTURE ID: ", lectureId);
        const { workingSubject } = get();
        set({ loading: true });

        // Create a backup of the current lectures
        const lecturesCopy = workingSubject?.courseMaterials?.lectures ?
            JSON.parse(JSON.stringify(workingSubject.courseMaterials.lectures)) : [];

        try {
            // Ensure we have a valid ID string (not an object)
            const actualLectureId = typeof lectureId === 'object' ? lectureId.id || lectureId._id : lectureId;

            if (!actualLectureId) {
                console.error('Invalid lecture ID:', lectureId);
                toast.error('Invalid lecture ID');
                set({ loading: false });
                return;
            }

            // Ensure updatedLecture has all required fields
            if (!updatedLecture) {
                updatedLecture = {};
            }

            // Make sure we have all required lecture fields
            const originalLecture = workingSubject?.courseMaterials?.lectures?.find(l =>
                l.id === actualLectureId || l._id === actualLectureId
            );

            if (originalLecture) {
                // Preserve original fields if they're not in the updated data
                if (!updatedLecture.title) updatedLecture.title = originalLecture.title;
                if (!updatedLecture.content) updatedLecture.content = originalLecture.content;
                if (!updatedLecture.date) updatedLecture.date = originalLecture.date;
                if (updatedLecture.isFavorite === undefined) updatedLecture.isFavorite = originalLecture.isFavorite;
            }

            if (!updatedLecture.attachments) {
                updatedLecture.attachments = [];
            }

            // Make sure attachments are proper AttachmentModel objects before sending to backend
            if (updatedLecture.attachments.length > 0 && (!updatedLecture.attachments[0] || updatedLecture.attachments[0].constructor?.name !== 'AttachmentModel')) {
                console.log('Converting attachments to AttachmentModel in updateLecture');
                updatedLecture.attachments = updatedLecture.attachments.map(att =>
                    att.constructor?.name === 'AttachmentModel' ?
                        att :
                        new AttachmentModel(att)
                );
            }

            console.log('Updating lecture with ID:', actualLectureId);
            console.log('Lecture data being sent:', updatedLecture);

            const updatedSubject = await updateLectureHandler(workingSubject.id, actualLectureId, updatedLecture);

            if (updatedSubject) {
                // Ensure all critical fields are preserved
                if (!updatedSubject.name && workingSubject.name) {
                    updatedSubject.name = workingSubject.name;
                }

                if (!updatedSubject.user && workingSubject.user) {
                    updatedSubject.user = workingSubject.user;
                }

                if (!updatedSubject.id && workingSubject.id) {
                    updatedSubject.id = workingSubject.id;
                    updatedSubject._id = workingSubject._id || workingSubject.id;
                }

                // Preserve syllabus if it's missing
                if ((!updatedSubject.courseMaterials?.syllabus?.units || updatedSubject.courseMaterials.syllabus.units.length === 0) &&
                    workingSubject.courseMaterials?.syllabus?.units) {
                    updatedSubject.courseMaterials.syllabus.units = workingSubject.courseMaterials.syllabus.units;
                    updatedSubject.courseMaterials.syllabus.sections = workingSubject.courseMaterials.syllabus.units;
                }

                // Check if lectures were lost in the update
                if (!updatedSubject.courseMaterials?.lectures || updatedSubject.courseMaterials.lectures.length === 0) {
                    // If lectures are missing, restore them from backup with the updated lecture
                    const updatedLectures = lecturesCopy.map(lecture => {
                        if (lecture.id === actualLectureId || lecture._id === actualLectureId) {
                            // Create a proper merged lecture with correct attachment models

                            // Ensure attachments are proper AttachmentModel objects
                            const attachments = updatedLecture.attachments && updatedLecture.attachments.length > 0
                                ? updatedLecture.attachments.map(att =>
                                    att.constructor?.name === 'AttachmentModel' ?
                                        att :
                                        new AttachmentModel(att)
                                )
                                : []; // Default to empty array if no attachments

                            // Create new lecture with all properties
                            return new LectureModel({
                                ...lecture,
                                ...updatedLecture,
                                attachments
                            });
                        }
                        return lecture;
                    });

                    updatedSubject.courseMaterials.lectures = updatedLectures;
                }

                const { updateSubject } = useSubjectStore.getState();

                // Update the global subject store
                updateSubject(updatedSubject);

                // Set the working subject directly
                set({
                    workingSubject: updatedSubject,
                    loading: false
                });

                toast.success('Lecture updated successfully!');
            }
        } catch (error) {
            console.error('Update lecture error:', error);
            toast.error('Failed to update lecture');
            set({ loading: false });
        }
    },

    deleteLecture: async (lectureId) => {
        const { workingSubject } = get();
        set({ loading: true });
        try {
            const updatedSubject = await deleteLectureHandler(workingSubject.id, lectureId);
            if (updatedSubject) {
                const { updateSubject } = useSubjectStore.getState();

                // Update the global subject store
                updateSubject(updatedSubject);

                // Set the working subject directly
                set({
                    workingSubject: updatedSubject,
                    loading: false
                });

                toast.success('Lecture deleted successfully!');
            }
        } catch (error) {
            console.error('Delete lecture error:', error);
            toast.error('Failed to delete lecture');
            set({ loading: false });
        }
    },

    // Reading Operations
    addReading: async (newReading) => {
        const { workingSubject } = get();
        set({ loading: true });
        try {
            const updatedSubject = await addReadingHandler(workingSubject.id, newReading);
            if (updatedSubject) {
                const { updateSubject } = useSubjectStore.getState();

                // Update the global subject store
                updateSubject(updatedSubject);

                // Set the working subject directly
                set({
                    workingSubject: updatedSubject,
                    loading: false
                });

                toast.success(`Reading "${newReading.title}" added successfully!`);
            }
        } catch (error) {
            console.error('Add reading error:', error);
            toast.error('Failed to add reading');
            set({ loading: false });
        }
    },

    updateReading: async (readingId, updatedReading) => {
        const { workingSubject } = get();
        set({ loading: true });

        // Create a backup of the current readings
        const readingsCopy = workingSubject?.courseMaterials?.readings ?
            JSON.parse(JSON.stringify(workingSubject.courseMaterials.readings)) : [];

        try {
            // Ensure we have a valid ID string (not an object)
            const actualReadingId = typeof readingId === 'object' ? readingId.id || readingId._id : readingId;

            if (!actualReadingId) {
                console.error('Invalid reading ID:', readingId);
                toast.error('Invalid reading ID');
                set({ loading: false });
                return;
            }

            // Ensure updatedReading has all required fields
            if (!updatedReading) {
                updatedReading = {};
            }

            // Make sure we have all required reading fields
            const originalReading = workingSubject?.courseMaterials?.readings?.find(r =>
                r.id === actualReadingId || r._id === actualReadingId
            );

            if (originalReading) {
                // Preserve original fields if they're not in the updated data
                if (!updatedReading.title) updatedReading.title = originalReading.title;
                if (!updatedReading.author) updatedReading.author = originalReading.author;
                if (!updatedReading.type) updatedReading.type = originalReading.type;
                if (updatedReading.isFavorite === undefined) updatedReading.isFavorite = originalReading.isFavorite;
                // Preserve other type-specific fields
                if (originalReading.chapters && !updatedReading.chapters) updatedReading.chapters = originalReading.chapters;
                if (originalReading.source && !updatedReading.source) updatedReading.source = originalReading.source;
                if (originalReading.length && !updatedReading.length) updatedReading.length = originalReading.length;
                if (originalReading.url && !updatedReading.url) updatedReading.url = originalReading.url;
            }

            if (!updatedReading.attachments) {
                updatedReading.attachments = [];
            }

            // Make sure attachments are proper AttachmentModel objects before sending to backend
            if (updatedReading.attachments.length > 0 && (!updatedReading.attachments[0] || updatedReading.attachments[0].constructor?.name !== 'AttachmentModel')) {
                console.log('Converting attachments to AttachmentModel in updateReading');
                updatedReading.attachments = updatedReading.attachments.map(att =>
                    att.constructor?.name === 'AttachmentModel' ?
                        att :
                        new AttachmentModel(att)
                );
            }

            console.log('Updating reading with ID:', actualReadingId);
            console.log('Reading data being sent:', updatedReading);

            const updatedSubject = await updateReadingHandler(workingSubject.id, actualReadingId, updatedReading);

            if (updatedSubject) {
                // Ensure all critical fields are preserved
                if (!updatedSubject.name && workingSubject.name) {
                    updatedSubject.name = workingSubject.name;
                }

                if (!updatedSubject.user && workingSubject.user) {
                    updatedSubject.user = workingSubject.user;
                }

                if (!updatedSubject.id && workingSubject.id) {
                    updatedSubject.id = workingSubject.id;
                    updatedSubject._id = workingSubject._id || workingSubject.id;
                }

                // Preserve syllabus if it's missing
                if ((!updatedSubject.courseMaterials?.syllabus?.units || updatedSubject.courseMaterials.syllabus.units.length === 0) &&
                    workingSubject.courseMaterials?.syllabus?.units) {
                    updatedSubject.courseMaterials.syllabus.units = workingSubject.courseMaterials.syllabus.units;
                    updatedSubject.courseMaterials.syllabus.sections = workingSubject.courseMaterials.syllabus.units;
                }

                // Preserve lectures if they're missing
                if ((!updatedSubject.courseMaterials?.lectures || updatedSubject.courseMaterials.lectures.length === 0) &&
                    workingSubject.courseMaterials?.lectures) {
                    updatedSubject.courseMaterials.lectures = workingSubject.courseMaterials.lectures;
                }

                // Check if readings were lost in the update
                if (!updatedSubject.courseMaterials?.readings || updatedSubject.courseMaterials.readings.length === 0) {
                    // If readings are missing, restore them from backup with the updated reading
                    const updatedReadings = readingsCopy.map(reading => {
                        if (reading.id === actualReadingId || reading._id === actualReadingId) {
                            // Create a proper merged reading with correct attachment models

                            // Ensure attachments are proper AttachmentModel objects
                            const attachments = updatedReading.attachments && updatedReading.attachments.length > 0
                                ? updatedReading.attachments.map(att =>
                                    att.constructor?.name === 'AttachmentModel' ?
                                        att :
                                        new AttachmentModel(att)
                                )
                                : []; // Default to empty array if no attachments

                            // Create new reading with all properties
                            return new ReadingModel({
                                ...reading,
                                ...updatedReading,
                                attachments
                            });
                        }
                        return reading;
                    });

                    updatedSubject.courseMaterials.readings = updatedReadings;
                }

                const { updateSubject } = useSubjectStore.getState();

                // Update the global subject store
                updateSubject(updatedSubject);

                // Set the working subject directly
                set({
                    workingSubject: updatedSubject,
                    loading: false
                });

                toast.success('Reading updated successfully!');
            }
        } catch (error) {
            console.error('Update reading error:', error);
            toast.error('Failed to update reading');
            set({ loading: false });
        }
    },

    deleteReading: async (readingId) => {
        const { workingSubject } = get();
        set({ loading: true });
        try {
            const updatedSubject = await deleteReadingHandler(workingSubject.id, readingId);
            if (updatedSubject) {
                const { updateSubject } = useSubjectStore.getState();

                // Update the global subject store
                updateSubject(updatedSubject);

                // Set the working subject directly
                set({
                    workingSubject: updatedSubject,
                    loading: false
                });

                toast.success('Reading deleted successfully!');
            }
        } catch (error) {
            console.error('Delete reading error:', error);
            toast.error('Failed to delete reading');
            set({ loading: false });
        }
    },

    // Assignment Operations
    addAssignment: async (newAssignment) => {
        const { workingSubject } = get();
        set({ loading: true });
        try {
            const updatedSubject = await addAssignmentHandler(workingSubject.id, newAssignment);
            if (updatedSubject) {
                const { updateSubject } = useSubjectStore.getState();

                // Update the global subject store
                updateSubject(updatedSubject);

                // Set the working subject directly
                set({
                    workingSubject: updatedSubject,
                    loading: false
                });

                toast.success(`Assignment "${newAssignment.title}" added successfully!`);
            }
        } catch (error) {
            console.error('Add assignment error:', error);
            toast.error('Failed to add assignment');
            set({ loading: false });
        }
    },

    updateAssignment: async (assignmentId, updatedAssignment) => {
        const { workingSubject } = get();
        set({ loading: true });

        // Create a backup of the current assignments
        const assignmentsCopy = workingSubject?.courseMaterials?.assignments ?
            JSON.parse(JSON.stringify(workingSubject.courseMaterials.assignments)) : [];

        try {
            // Ensure we have a valid ID string (not an object)
            const actualAssignmentId = typeof assignmentId === 'object' ? assignmentId.id || assignmentId._id : assignmentId;

            if (!actualAssignmentId) {
                console.error('Invalid assignment ID:', assignmentId);
                toast.error('Invalid assignment ID');
                set({ loading: false });
                return;
            }

            // Ensure updatedAssignment has all required fields
            if (!updatedAssignment) {
                updatedAssignment = {};
            }

            // Make sure we have all required assignment fields
            const originalAssignment = workingSubject?.courseMaterials?.assignments?.find(a =>
                a.id === actualAssignmentId || a._id === actualAssignmentId
            );

            if (originalAssignment) {
                // Preserve original fields if they're not in the updated data
                if (!updatedAssignment.title) updatedAssignment.title = originalAssignment.title;
                if (!updatedAssignment.dueDate) updatedAssignment.dueDate = originalAssignment.dueDate;
                if (updatedAssignment.points === undefined) updatedAssignment.points = originalAssignment.points;
                if (!updatedAssignment.instructions) updatedAssignment.instructions = originalAssignment.instructions;
                if (updatedAssignment.isCompleted === undefined) updatedAssignment.isCompleted = originalAssignment.isCompleted;
                if (updatedAssignment.isFavorite === undefined) updatedAssignment.isFavorite = originalAssignment.isFavorite;
            }

            if (!updatedAssignment.attachments) {
                updatedAssignment.attachments = [];
            }

            // Make sure attachments are proper AttachmentModel objects before sending to backend
            if (updatedAssignment.attachments.length > 0 && (!updatedAssignment.attachments[0] || updatedAssignment.attachments[0].constructor?.name !== 'AttachmentModel')) {
                console.log('Converting attachments to AttachmentModel in updateAssignment');
                updatedAssignment.attachments = updatedAssignment.attachments.map(att =>
                    att.constructor?.name === 'AttachmentModel' ?
                        att :
                        new AttachmentModel(att)
                );
            }

            console.log('Updating assignment with ID:', actualAssignmentId);
            console.log('Assignment data being sent:', updatedAssignment);

            const updatedSubject = await updateAssignmentHandler(workingSubject.id, actualAssignmentId, updatedAssignment);

            if (updatedSubject) {
                // Ensure all critical fields are preserved
                if (!updatedSubject.name && workingSubject.name) {
                    updatedSubject.name = workingSubject.name;
                }

                if (!updatedSubject.user && workingSubject.user) {
                    updatedSubject.user = workingSubject.user;
                }

                if (!updatedSubject.id && workingSubject.id) {
                    updatedSubject.id = workingSubject.id;
                    updatedSubject._id = workingSubject._id || workingSubject.id;
                }

                // Preserve syllabus if it's missing
                if ((!updatedSubject.courseMaterials?.syllabus?.units || updatedSubject.courseMaterials.syllabus.units.length === 0) &&
                    workingSubject.courseMaterials?.syllabus?.units) {
                    updatedSubject.courseMaterials.syllabus.units = workingSubject.courseMaterials.syllabus.units;
                    updatedSubject.courseMaterials.syllabus.sections = workingSubject.courseMaterials.syllabus.units;
                }

                // Preserve lectures if they're missing
                if ((!updatedSubject.courseMaterials?.lectures || updatedSubject.courseMaterials.lectures.length === 0) &&
                    workingSubject.courseMaterials?.lectures) {
                    updatedSubject.courseMaterials.lectures = workingSubject.courseMaterials.lectures;
                }

                // Preserve readings if they're missing
                if ((!updatedSubject.courseMaterials?.readings || updatedSubject.courseMaterials.readings.length === 0) &&
                    workingSubject.courseMaterials?.readings) {
                    updatedSubject.courseMaterials.readings = workingSubject.courseMaterials.readings;
                }

                // Check if assignments were lost in the update
                if (!updatedSubject.courseMaterials?.assignments || updatedSubject.courseMaterials.assignments.length === 0) {
                    // If assignments are missing, restore them from backup with the updated assignment
                    const updatedAssignments = assignmentsCopy.map(assignment => {
                        if (assignment.id === actualAssignmentId || assignment._id === actualAssignmentId) {
                            // Create a proper merged assignment with correct attachment models

                            // Ensure attachments are proper AttachmentModel objects
                            const attachments = updatedAssignment.attachments && updatedAssignment.attachments.length > 0
                                ? updatedAssignment.attachments.map(att =>
                                    att.constructor?.name === 'AttachmentModel' ?
                                        att :
                                        new AttachmentModel(att)
                                )
                                : []; // Default to empty array if no attachments

                            // Create new assignment with all properties
                            return new AssignmentModel({
                                ...assignment,
                                ...updatedAssignment,
                                attachments
                            });
                        }
                        return assignment;
                    });

                    updatedSubject.courseMaterials.assignments = updatedAssignments;
                }

                const { updateSubject } = useSubjectStore.getState();

                // Update the global subject store
                updateSubject(updatedSubject);

                // Set the working subject directly
                set({
                    workingSubject: updatedSubject,
                    loading: false
                });

                toast.success('Assignment updated successfully!');
            }
        } catch (error) {
            console.error('Update assignment error:', error);
            toast.error('Failed to update assignment');
            set({ loading: false });
        }
    },

    deleteAssignment: async (assignmentId) => {
        const { workingSubject } = get();
        set({ loading: true });
        try {
            const updatedSubject = await deleteAssignmentHandler(workingSubject.id, assignmentId);
            if (updatedSubject) {
                const { updateSubject } = useSubjectStore.getState();

                // Update the global subject store
                updateSubject(updatedSubject);

                // Set the working subject directly
                set({
                    workingSubject: updatedSubject,
                    loading: false
                });

                toast.success('Assignment deleted successfully!');
            }
        } catch (error) {
            console.error('Delete assignment error:', error);
            toast.error('Failed to delete assignment');
            set({ loading: false });
        }
    },

    // Note Operations
    addNote: async (newNote) => {
        const { workingSubject } = get();
        set({ loading: true });
        try {
            const updatedSubject = await addNoteHandler(workingSubject.id, newNote);
            if (updatedSubject) {
                const { updateSubject } = useSubjectStore.getState();

                // Update the global subject store
                updateSubject(updatedSubject);

                // Set the working subject directly
                set({
                    workingSubject: updatedSubject,
                    loading: false
                });

                toast.success(`Note "${newNote.title}" added successfully!`);
            }
        } catch (error) {
            console.error('Add note error:', error);
            toast.error('Failed to add note');
            set({ loading: false });
        }
    },

    updateNote: async (noteId, updatedNote) => {
        const { workingSubject } = get();
        set({ loading: true });

        // Create a backup of the current notes
        const notesCopy = workingSubject?.notes ?
            JSON.parse(JSON.stringify(workingSubject.notes)) : [];

        try {
            // We no longer need this special case for favorite toggling since handleToggleFavorite handles persistence
            const updatedSubject = await updateNoteHandler(workingSubject.id, noteId, updatedNote);

            if (updatedSubject) {
                // Ensure all critical fields are preserved
                if (!updatedSubject.name && workingSubject.name) {
                    updatedSubject.name = workingSubject.name;
                }

                if (!updatedSubject.user && workingSubject.user) {
                    updatedSubject.user = workingSubject.user;
                }

                if (!updatedSubject.id && workingSubject.id) {
                    updatedSubject.id = workingSubject.id;
                    updatedSubject._id = workingSubject._id || workingSubject.id;
                }

                // Preserve syllabus if it's missing
                if ((!updatedSubject.courseMaterials?.syllabus?.units || updatedSubject.courseMaterials.syllabus.units.length === 0) &&
                    workingSubject.courseMaterials?.syllabus?.units) {
                    updatedSubject.courseMaterials.syllabus.units = workingSubject.courseMaterials.syllabus.units;
                    updatedSubject.courseMaterials.syllabus.sections = workingSubject.courseMaterials.syllabus.units;
                }

                // Preserve course materials if they're missing
                if (!updatedSubject.courseMaterials && workingSubject.courseMaterials) {
                    updatedSubject.courseMaterials = workingSubject.courseMaterials;
                } else {
                    // Preserve individual course material collections if missing
                    if ((!updatedSubject.courseMaterials?.lectures || updatedSubject.courseMaterials.lectures.length === 0) &&
                        workingSubject.courseMaterials?.lectures) {
                        updatedSubject.courseMaterials.lectures = workingSubject.courseMaterials.lectures;
                    }

                    if ((!updatedSubject.courseMaterials?.readings || updatedSubject.courseMaterials.readings.length === 0) &&
                        workingSubject.courseMaterials?.readings) {
                        updatedSubject.courseMaterials.readings = workingSubject.courseMaterials.readings;
                    }

                    if ((!updatedSubject.courseMaterials?.assignments || updatedSubject.courseMaterials.assignments.length === 0) &&
                        workingSubject.courseMaterials?.assignments) {
                        updatedSubject.courseMaterials.assignments = workingSubject.courseMaterials.assignments;
                    }
                }

                // Check if notes were lost in the update
                if (!updatedSubject.notes || updatedSubject.notes.length === 0) {
                    // If notes are missing, restore them from backup with the updated note
                    const updatedNotes = notesCopy.map(note => {
                        if (note.id === noteId) {
                            // Create a proper merged note with the NoteModel

                            // Create new note with all properties
                            return new NoteModel({
                                ...note,
                                ...updatedNote
                            });
                        }
                        return note;
                    });

                    updatedSubject.notes = updatedNotes;
                }

                const { updateSubject } = useSubjectStore.getState();

                // Update the global subject store
                updateSubject(updatedSubject);

                // Set the working subject directly
                set({
                    workingSubject: updatedSubject,
                    loading: false
                });

                toast.success('Note updated successfully!');
            }
        } catch (error) {
            console.error('Update note error:', error);
            toast.error('Failed to update note');
            set({ loading: false });
        }
    },

    deleteNote: async (noteId) => {
        const { workingSubject } = get();
        set({ loading: true });
        try {
            const updatedSubject = await deleteNoteHandler(workingSubject.id, noteId);
            if (updatedSubject) {
                const { updateSubject } = useSubjectStore.getState();

                // Update the global subject store
                updateSubject(updatedSubject);

                // Set the working subject directly
                set({
                    workingSubject: updatedSubject,
                    loading: false
                });

                toast.success('Note deleted successfully!');
            }
        } catch (error) {
            console.error('Delete note error:', error);
            toast.error('Failed to delete note');
            set({ loading: false });
        }
    },

    // Utility functions
    isFavorited: (type, subjectId, id) => {
        const { favorites } = useSubjectStore.getState();
        return favorites?.includes(`${type}_${subjectId}_${id}`);
    },

    handleToggleFavorite: (type, subjectId, id) => {
        const { workingSubject } = get();
        const { toggleFavorite } = useSubjectStore.getState();

        // Use provided subjectId or fall back to workingSubject.id
        const targetSubjectId = subjectId || (workingSubject ? workingSubject.id : null);

        // First, make sure we have a valid subject ID and item ID
        if (!targetSubjectId || !id) return;

        // Toggle in Zustand store first for immediate UI feedback
        toggleFavorite(type, targetSubjectId, id);

        // If we're toggling a favorite for a subject that's not the working subject,
        // we can't update the item's isFavorite property
        if (!workingSubject || workingSubject.id !== targetSubjectId) {
            return;
        }

        // Find the item and toggle its isFavorite property
        let item, updateHandler;

        switch (type) {
            case 'lecture':
                item = workingSubject.courseMaterials?.lectures?.find(l => l.id === id);
                updateHandler = updateLectureHandler;
                break;
            case 'reading':
                item = workingSubject.courseMaterials?.readings?.find(r => r.id === id);
                updateHandler = updateReadingHandler;
                break;
            case 'assignment':
                item = workingSubject.courseMaterials?.assignments?.find(a => a.id === id);
                updateHandler = updateAssignmentHandler;
                break;
            case 'note':
                item = workingSubject.notes?.find(n => n.id === id);
                updateHandler = updateNoteHandler;
                break;
            default:
                return;
        }

        if (item) {
            // Toggle the isFavorite status
            const newStatus = !item.isFavorite;
            item.isFavorite = newStatus;

            // Create a complete object copy to send to the backend
            const completeObject = { ...item };

            // Ensure we have all required fields based on type
            if (type === 'lecture' && !completeObject.content) {
                completeObject.content = '';
            }

            if (type === 'reading' && !completeObject.author) {
                completeObject.author = '';
            }

            if (type === 'assignment') {
                if (!completeObject.instructions) completeObject.instructions = '';
                if (!completeObject.points) completeObject.points = 0;
            }

            if (type === 'note' && !completeObject.content) {
                completeObject.content = '';
            }

            // Update the backend with the full object
            updateHandler(workingSubject.id, id, completeObject)
                .then(() => {
                    // Success was already reflected in UI, so just confirm quietly
                    console.log(`Updated ${type} favorite status to ${newStatus}`);
                })
                .catch(error => {
                    // If there's an error, revert the UI change
                    console.error(`Error updating ${type} favorite status:`, error);
                    item.isFavorite = !newStatus; // Revert
                    toggleFavorite(type, workingSubject.id, id); // Toggle back in store
                    toast.error(`Failed to update favorite status. Please try again.`);
                });
        }
    }
}));

export default useSubjectContentStore; 