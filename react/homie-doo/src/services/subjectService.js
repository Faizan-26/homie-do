import { subjectApi } from './api';
import { v4 as uuidv4 } from 'uuid';
/**
 * Subject Service
 * Provides methods for interacting with subject data through the API
 */
export const subjectService = {
    // Subject CRUD
    getAllSubjects: async () => {
        try {
            const response = await subjectApi.getAll();
            console.log("Response from getAllSubjects", response.data);
            return response.data;
        } catch (error) {
            console.error('Error fetching subjects:', error);
            throw error;
        }
    },

    getSubjectById: async (id) => {
        try {
            const response = await subjectApi.getById(id);
            console.log("Response from getSubjectById", response.data);
            return response.data;
        } catch (error) {
            console.error(`Error fetching subject ${id}:`, error);
            throw error;
        }
    },

    createSubject: async (subjectData) => {
        try {
            subjectData._id = uuidv4();
            console.log("Subject Data PIK", subjectData);
            const response = await subjectApi.create(subjectData);
            console.log("Response from createSubject", response.data);
            return response.data;
        } catch (error) {
            console.error('Error creating subject:', error);
            throw error;
        }
    },

    updateSubject: async (id, updateData) => {
        try {
            // Validate ID before making API call
            if (!id || id === 'null' || id === null) {
                console.error(`Invalid subject ID: ${id}`);
                throw new Error('Invalid subject ID. Subject must be saved before updating.');
            }
            const response = await subjectApi.update(id, updateData);
            console.log("Response from updateSubject", response.data);
            return response.data;
        } catch (error) {
            console.error(`Error updating subject ${id}:`, error);
            throw error;
        }
    },

    deleteSubject: async (id) => {
        try {
            await subjectApi.delete(id);
            console.log("Response from deleteSubject", true);
            return true;
        } catch (error) {
            console.error(`Error deleting subject ${id}:`, error);
            throw error;
        }
    },

    // Syllabus operations
    getSyllabusById: async (syllabusId) => {
        try {
            const response = await subjectApi.getSyllabus(syllabusId);
            console.log("Response from getSyllabusById", response.data);
            return response.data;
        } catch (error) {
            console.error(`Error fetching syllabus ${syllabusId}:`, error);
            throw error;
        }
    },

    // Unit operations
    getUnits: async (subjectId) => {
        try {
            const response = await subjectApi.getUnits(subjectId);
            console.log("Response from getUnits", response.data);
            return response.data;
        } catch (error) {
            console.error(`Error fetching units for subject ${subjectId}:`, error);
            throw error;
        }
    },

    addUnit: async (subjectId, unitData) => {
        try {
            // Validate subjectId before making the API call
            if (!subjectId || subjectId === 'null' || subjectId === null) {
                console.error(`Invalid subject ID: ${subjectId}`);
                throw new Error('Invalid subject ID. Subject must be saved before adding units.');
            }

            const response = await subjectApi.addUnit(subjectId, unitData);
            console.log("Response from addUnit", response.data);
            return response.data;
        } catch (error) {
            console.error(`Error adding unit to subject ${subjectId}:`, error);
            throw error;
        }
    },

    updateUnit: async (subjectId, unitId, unitData) => {
        try {
            const response = await subjectApi.updateUnit(subjectId, unitId, unitData);
            console.log("Response from updateUnit", response.data);
            return response.data;
        } catch (error) {
            console.error(`Error updating unit ${unitId} in subject ${subjectId}:`, error);
            throw error;
        }
    },

    deleteUnit: async (subjectId, unitId) => {
        try {
            await subjectApi.deleteUnit(subjectId, unitId);
            console.log("Response from deleteUnit", true);
            return true;
        } catch (error) {
            console.error(`Error deleting unit ${unitId} from subject ${subjectId}:`, error);
            throw error;
        }
    },

    // Chapter operations
    getChapters: async (subjectId, unitId) => {
        try {
            const response = await subjectApi.getChapters(subjectId, unitId);
            console.log("Response from getChapters", response.data);
            return response.data;
        } catch (error) {
            console.error(`Error fetching chapters for unit ${unitId} in subject ${subjectId}:`, error);
            throw error;
        }
    },

    addChapter: async (subjectId, unitId, chapterData) => {
        try {
            // No longer stripping IDs - backend will handle this correctly
            const response = await subjectApi.addChapter(subjectId, unitId, chapterData);
            console.log("Response from addChapter", response.data);
            return response.data;
        } catch (error) {
            console.error(`Error adding chapter to unit ${unitId} in subject ${subjectId}:`, error);
            throw error;
        }
    },

    updateChapter: async (subjectId, unitId, chapterId, chapterData) => {
        try {
            const response = await subjectApi.updateChapter(subjectId, unitId, chapterId, chapterData);
            console.log("Response from updateChapter", response.data);
            return response.data;
        } catch (error) {
            console.error(`Error updating chapter ${chapterId} in unit ${unitId} of subject ${subjectId}:`, error);
            throw error;
        }
    },

    deleteChapter: async (subjectId, unitId, chapterId) => {
        try {
            await subjectApi.deleteChapter(subjectId, unitId, chapterId);
            console.log("Response from deleteChapter", true);
            return true;
        } catch (error) {
            console.error(`Error deleting chapter ${chapterId} from unit ${unitId}:`, error);
            throw error;
        }
    },

    // Lecture operations
    getLectures: async (subjectId) => {
        try {
            const response = await subjectApi.getLectures(subjectId);
            console.log("Response from getLectures", response.data);
            return response.data;
        } catch (error) {
            console.error(`Error fetching lectures for subject ${subjectId}:`, error);
            throw error;
        }
    },

    addLecture: async (subjectId, lectureData) => {
        try {
            // No longer stripping IDs - backend will handle this correctly
            const response = await subjectApi.addLecture(subjectId, lectureData);
            console.log("Response from addLecture", response.data);
            return response.data;
        } catch (error) {
            console.error(`Error adding lecture to subject ${subjectId}:`, error);
            throw error;
        }
    },

    updateLecture: async (subjectId, lectureId, lectureData) => {
        try {
            const response = await subjectApi.updateLecture(subjectId, lectureId, lectureData);
            console.log("Response from updateLecture", response.data);
            return response.data;
        } catch (error) {
            console.error(`Error updating lecture ${lectureId} in subject ${subjectId}:`, error);
            throw error;
        }
    },

    deleteLecture: async (subjectId, lectureId) => {
        try {
            await subjectApi.deleteLecture(subjectId, lectureId);
            console.log("Response from deleteLecture", true);
            return true;
        } catch (error) {
            console.error(`Error deleting lecture ${lectureId} from subject ${subjectId}:`, error);
            throw error;
        }
    },

    // Reading operations
    getReadings: async (subjectId) => {
        try {
            const response = await subjectApi.getReadings(subjectId);
            console.log("Response from getReadings", response.data);
            return response.data;
        } catch (error) {
            console.error(`Error fetching readings for subject ${subjectId}:`, error);
            throw error;
        }
    },

    addReading: async (subjectId, readingData) => {
        try {
            // No longer stripping IDs - backend will handle this correctly
            const response = await subjectApi.addReading(subjectId, readingData);
            console.log("Response from addReading", response.data);
            return response.data;
        } catch (error) {
            console.error(`Error adding reading to subject ${subjectId}:`, error);
            throw error;
        }
    },

    updateReading: async (subjectId, readingId, readingData) => {
        try {
            const response = await subjectApi.updateReading(subjectId, readingId, readingData);
            console.log("Response from updateReading", response.data);
            return response.data;
        } catch (error) {
            console.error(`Error updating reading ${readingId} in subject ${subjectId}:`, error);
            throw error;
        }
    },

    deleteReading: async (subjectId, readingId) => {
        try {
            await subjectApi.deleteReading(subjectId, readingId);
            console.log("Response from deleteReading", true);
            return true;
        } catch (error) {
            console.error(`Error deleting reading ${readingId} from subject ${subjectId}:`, error);
            throw error;
        }
    },

    // Assignment operations
    getAssignments: async (subjectId) => {
        try {
            const response = await subjectApi.getAssignments(subjectId);
            console.log("Response from getAssignments", response.data);
            return response.data;
        } catch (error) {
            console.error(`Error fetching assignments for subject ${subjectId}:`, error);
            throw error;
        }
    },

    addAssignment: async (subjectId, assignmentData) => {
        try {
            // No longer stripping IDs - backend will handle this correctly
            const response = await subjectApi.addAssignment(subjectId, assignmentData);
            console.log("Response from addAssignment", response.data);
            return response.data;
        } catch (error) {
            console.error(`Error adding assignment to subject ${subjectId}:`, error);
            throw error;
        }
    },

    updateAssignment: async (subjectId, assignmentId, assignmentData) => {
        try {
            const response = await subjectApi.updateAssignment(subjectId, assignmentId, assignmentData);
            console.log("Response from updateAssignment", response.data);
            return response.data;
        } catch (error) {
            console.error(`Error updating assignment ${assignmentId} in subject ${subjectId}:`, error);
            throw error;
        }
    },

    deleteAssignment: async (subjectId, assignmentId) => {
        try {
            await subjectApi.deleteAssignment(subjectId, assignmentId);
            console.log("Response from deleteAssignment", true);
            return true;
        } catch (error) {
            console.error(`Error deleting assignment ${assignmentId} from subject ${subjectId}:`, error);
            throw error;
        }
    }
};

export default subjectService;
// // src/services/subjectService.js
// import { subjectApi } from './api';
// import SubjectModel from '../models/subjectModel';

// /**
//  * Frontend Subject Service
//  * Wraps REST API calls and maps to SubjectModel
//  */
// const subjectService = {
//     // Get all subjects for the current user
//     getAllSubjects: async () => {
//         try {
//             const response = await subjectApi.getAll();
//             console.log(response);
//             // Map each raw subject into a SubjectModel
//             return response.data.map(raw => SubjectModel.fromBackend(raw));
//         } catch (error) {
//             console.error('Error fetching subjects:', error);
//             throw error;
//         }
//     },

//     // Get a single subject by ID
//     getSubjectById: async (id) => {
//         try {
//             const response = await subjectApi.getById(id);
//             return SubjectModel.fromBackend(response.data);
//         } catch (error) {
//             console.error(`Error fetching subject ${id}:`, error);
//             throw error;
//         }
//     },

//     // Create a new subject
//     createSubject: async (subjectModel) => {
//         try {
//             // subjectModel is an instance of SubjectModel
//             const payload = subjectModel.toBackend();
//             const response = await subjectApi.create(payload);
//             return SubjectModel.fromBackend(response.data);
//         } catch (error) {
//             console.error('Error creating subject:', error);
//             throw error;
//         }
//     },

//     // Update an existing subject
//     updateSubject: async (id, updateData) => {
//         try {
//             if (!id) throw new Error('Subject ID is required for update');
//             const response = await subjectApi.update(id, updateData);
//             return SubjectModel.fromBackend(response.data);
//         } catch (error) {
//             console.error(`Error updating subject ${id}:`, error);
//             throw error;
//         }
//     },

//     // Delete a subject
//     deleteSubject: async (id) => {
//         try {
//             if (!id) throw new Error('Subject ID is required for deletion');
//             await subjectApi.delete(id);
//             return true;
//         } catch (error) {
//             console.error(`Error deleting subject ${id}:`, error);
//             throw error;
//         }
//     },

//     // ---- Nested Operations ----
//     // Units
//     getUnits: async (subjectId) => {
//         try {
//             const response = await subjectApi.getUnits(subjectId);
//             return response.data; // raw units array
//         } catch (error) {
//             console.error(`Error fetching units for subject ${subjectId}:`, error);
//             throw error;
//         }
//     },
//     addUnit: async (subjectId, unitData) => {
//         try {
//             const response = await subjectApi.addUnit(subjectId, unitData);
//             return response.data;
//         } catch (error) {
//             console.error(`Error adding unit to subject ${subjectId}:`, error);
//             throw error;
//         }
//     },
//     updateUnit: async (subjectId, unitId, unitData) => {
//         try {
//             const response = await subjectApi.updateUnit(subjectId, unitId, unitData);
//             return response.data;
//         } catch (error) {
//             console.error(`Error updating unit ${unitId} in subject ${subjectId}:`, error);
//             throw error;
//         }
//     },
//     deleteUnit: async (subjectId, unitId) => {
//         try {
//             await subjectApi.deleteUnit(subjectId, unitId);
//             return true;
//         } catch (error) {
//             console.error(`Error deleting unit ${unitId} from subject ${subjectId}:`, error);
//             throw error;
//         }
//     },
//     // Chapters
//     getChapters: async (subjectId, unitId) => {
//         try {
//             const response = await subjectApi.getChapters(subjectId, unitId);
//             return response.data;
//         } catch (error) {
//             console.error(`Error fetching chapters for unit ${unitId}:`, error);
//             throw error;
//         }
//     },
//     addChapter: async (subjectId, unitId, chapData) => {
//         try {
//             const response = await subjectApi.addChapter(subjectId, unitId, chapData);
//             return response.data;
//         } catch (error) {
//             console.error(`Error adding chapter to unit ${unitId}:`, error);
//             throw error;
//         }
//     },
//     updateChapter: async (subjectId, unitId, chapterId, chapData) => {
//         try {
//             const response = await subjectApi.updateChapter(subjectId, unitId, chapterId, chapData);
//             return response.data;
//         } catch (error) {
//             console.error(`Error updating chapter ${chapterId}:`, error);
//             throw error;
//         }
//     },
//     deleteChapter: async (subjectId, unitId, chapterId) => {
//         try {
//             await subjectApi.deleteChapter(subjectId, unitId, chapterId);
//             return true;
//         } catch (error) {
//             console.error(`Error deleting chapter ${chapterId}:`, error);
//             throw error;
//         }
//     },
//     // Lectures
//     getLectures: async (subjectId) => {
//         try {
//             const response = await subjectApi.getLectures(subjectId);
//             return response.data;
//         } catch (error) {
//             console.error(`Error fetching lectures for subject ${subjectId}:`, error);
//             throw error;
//         }
//     },
//     addLecture: async (subjectId, lectureData) => {
//         try {
//             const response = await subjectApi.addLecture(subjectId, lectureData);
//             return response.data;
//         } catch (error) {
//             console.error(`Error adding lecture to subject ${subjectId}:`, error);
//             throw error;
//         }
//     },
//     updateLecture: async (subjectId, lectureId, lectureData) => {
//         try {
//             const response = await subjectApi.updateLecture(subjectId, lectureId, lectureData);
//             return response.data;
//         } catch (error) {
//             console.error(`Error updating lecture ${lectureId}:`, error);
//             throw error;
//         }
//     },
//     deleteLecture: async (subjectId, lectureId) => {
//         try {
//             await subjectApi.deleteLecture(subjectId, lectureId);
//             return true;
//         } catch (error) {
//             console.error(`Error deleting lecture ${lectureId}:`, error);
//             throw error;
//         }
//     },
//     // Readings
//     getReadings: async (subjectId) => {
//         try {
//             const response = await subjectApi.getReadings(subjectId);
//             return response.data;
//         } catch (error) {
//             console.error(`Error fetching readings for subject ${subjectId}:`, error);
//             throw error;
//         }
//     },
//     addReading: async (subjectId, readingData) => {
//         try {
//             const response = await subjectApi.addReading(subjectId, readingData);
//             return response.data;
//         } catch (error) {
//             console.error(`Error adding reading to subject ${subjectId}:`, error);
//             throw error;
//         }
//     },
//     updateReading: async (subjectId, readingId, readingData) => {
//         try {
//             const response = await subjectApi.updateReading(subjectId, readingId, readingData);
//             return response.data;
//         } catch (error) {
//             console.error(`Error updating reading ${readingId}:`, error);
//             throw error;
//         }
//     },
//     deleteReading: async (subjectId, readingId) => {
//         try {
//             await subjectApi.deleteReading(subjectId, readingId);
//             return true;
//         } catch (error) {
//             console.error(`Error deleting reading ${readingId}:`, error);
//             throw error;
//         }
//     },
//     // Assignments
//     getAssignments: async (subjectId) => {
//         try {
//             const response = await subjectApi.getAssignments(subjectId);
//             return response.data;
//         } catch (error) {
//             console.error(`Error fetching assignments for subject ${subjectId}:`, error);
//             throw error;
//         }
//     },
//     addAssignment: async (subjectId, assignmentData) => {
//         try {
//             const response = await subjectApi.addAssignment(subjectId, assignmentData);
//             return response.data;
//         } catch (error) {
//             console.error(`Error adding assignment to subject ${subjectId}:`, error);
//             throw error;
//         }
//     },
//     updateAssignment: async (subjectId, assignmentId, assignmentData) => {
//         try {
//             const response = await subjectApi.updateAssignment(subjectId, assignmentId, assignmentData);
//             return response.data;
//         } catch (error) {
//             console.error(`Error updating assignment ${assignmentId}:`, error);
//             throw error;
//         }
//     },
//     deleteAssignment: async (subjectId, assignmentId) => {
//         try {
//             await subjectApi.deleteAssignment(subjectId, assignmentId);
//             return true;
//         } catch (error) {
//             console.error(`Error deleting assignment ${assignmentId}:`, error);
//             throw error;
//         }
//     }
// };

// export default subjectService;
