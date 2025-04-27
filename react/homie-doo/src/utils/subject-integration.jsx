import { toast } from 'sonner';
import subjectService from '../services/subjectService';
import SubjectModel, { UnitModel, ChapterModel } from '../models/subjectModel';

/**
 * Higher-order component that wraps SubjectContent and provides integration with UserSubject class
 * This allows for a gradual migration to the class-based approach
 */
export const withUserSubjectIntegration = (Component) => {
    return (props) => {
        // Extract relevant props
        const { subject: rawSubject, updateSubject: rawUpdateSubject, ...restProps } = props;

        // Check if the subject has valid ID fields
        if (rawSubject && !rawSubject._id && rawSubject.id) {
            console.log("Subject received without _id, but with id:", rawSubject.id);
            rawSubject._id = rawSubject.id;
        } else if (rawSubject && !rawSubject.id && rawSubject._id) {
            console.log("Subject received without id, but with _id:", rawSubject._id);
            rawSubject.id = rawSubject._id;
        }

        // Convert subject to SubjectModel instance if needed
        const subjectInstance = rawSubject instanceof SubjectModel
            ? rawSubject
            : SubjectModel.fromBackend(rawSubject);
            
        // Ensure both id and _id are set
        if (subjectInstance && subjectInstance._id && !subjectInstance.id) {
            subjectInstance.id = subjectInstance._id;
        } else if (subjectInstance && !subjectInstance._id && subjectInstance.id) {
            subjectInstance._id = subjectInstance.id;
        }

        // Convert back to JSON for rendering 
        const subjectJson = subjectInstance.toBackend();
        
        // Ensure the JSON also has both id and _id
        if (subjectJson && !subjectJson._id && subjectJson.id) {
            subjectJson._id = subjectJson.id;
        } else if (subjectJson && !subjectJson.id && subjectJson._id) {
            subjectJson.id = subjectJson._id;
        }

        // Wrap the update function to handle SubjectModel instances
        const handleUpdateSubject = (updatedSubject) => {
            // If we got a plain object, convert to SubjectModel
            if (!(updatedSubject instanceof SubjectModel)) {
                updatedSubject = SubjectModel.fromBackend(updatedSubject);
            }

            // Call the original update function
            if (rawUpdateSubject) {
                if (props.useInstancesForUpdates) {
                    rawUpdateSubject(updatedSubject);
                } else {
                    rawUpdateSubject(updatedSubject.toBackend());
                }
            }
        };

        // Pass modified props to the component
        return (
            <Component {...restProps} subject={subjectJson} updateSubject={handleUpdateSubject} />
        );
    };
};

// Create an empty subject template
export const createEmptySubject = (name = 'New Subject', userId) => {
    return SubjectModel.createEmpty(userId);
};

// Transform a UI subject to a backend-ready subject
export const transformSubjectForBackend = (subject) => {
    if (subject instanceof SubjectModel) {
        return subject.toBackend();
    }

    return {
        name: subject.name,
        courseMaterials: {
            syllabus: {
                title: subject.courseMaterials.syllabus.title,
                content: subject.courseMaterials.syllabus.content,
                units: subject.courseMaterials.syllabus.sections.map(section => ({
                    title: section.title,
                    weeks: section.weeks,
                    chapters: section.chapters.map(chapter => ({
                        title: chapter.title,
                        subtopics: chapter.subtopics.map(subtopic =>
                            typeof subtopic === 'string' ? subtopic : subtopic.title)
                    }))
                }))
            },
            lectures: subject.courseMaterials.lectures.map(lecture => ({
                id: lecture.id,
                title: lecture.title,
                date: lecture.date,
                content: lecture.content,
                attachments: lecture.files || []
            })),
            readings: subject.courseMaterials.readings.map(reading => ({
                title: reading.title,
                type: reading.type,
                typeFieldOne: reading.typeFieldOne,
                typeFieldTwo: reading.typeFieldTwo,
                attachments: reading.files || []
            })),
            assignments: subject.courseMaterials.assignments.map(assignment => ({
                title: assignment.title,
                dueDate: assignment.dueDate,
                points: assignment.points,
                instructions: assignment.instructions,
                isCompleted: assignment.isCompleted,
                isFavorite: assignment.isFavorite,
                attachments: assignment.files || []
            }))
        },
        notes: subject.notes.map(note => ({
            id: note.id,
            title: note.title,
            date: note.date,
            content: note.content,
            tags: note.tags
        }))
    };
};

// Unit operations with backend integration
export const handleAddUnit = async (subject, unitData) => {
    try {
        console.log("Subject received in handleAddUnit:", subject);
        console.log("Subject ID types:", {
            id: subject.id,
            _id: subject._id,
            hasId: !!subject.id,
            has_id: !!subject._id,
            idType: typeof subject.id,
            _idType: typeof subject._id
        });

        // Prepare the temporary unit object without an ID
        // Backend will assign the proper ID
        const tempUnit = {
            title: unitData.title,
            weeks: unitData.weeks || '',
            chapters: []
        };

        // Transform for backend
        const backendData = {
            title: unitData.title,
            weeks: unitData.weeks || ''
        };

        // Fallback to id if _id is undefined
        const subjectId = subject._id || subject.id;
        
        console.log("Using subject ID for API call:", subjectId);
        
        if (!subjectId) {
            console.error("Subject ID is undefined or null!");
            toast.error("Cannot add unit - subject ID is missing");
            return subject;
        }

        // Add unit to backend - use _id instead of id for MongoDB
        const response = await subjectService.addUnit(subjectId, backendData);
        
        // Get the backend-generated ID from the response
        const newUnitWithId = response;
        console.log("Response from backend after unit creation:", response);
        
        // Create the unit with the backend-generated ID
        const newUnit = {
            id: newUnitWithId.id,  // Use the ID from backend
            title: unitData.title,
            weeks: unitData.weeks || '',
            chapters: []
        };

        // First update the UI subject with the backend-generated ID
        const updatedSubject = {
            ...subject,
            courseMaterials: {
                ...subject.courseMaterials,
                syllabus: {
                    ...subject.courseMaterials.syllabus,
                    sections: [
                        ...subject.courseMaterials.syllabus.sections,
                        newUnit
                    ]
                }
            }
        };

        return updatedSubject;
    } catch (error) {
        console.error('Error adding unit:', error);
        toast.error('Failed to add unit to subject');
        return subject; // Return original subject on failure
    }
};

export const handleUpdateUnit = async (subject, unitData) => {
    try {
        console.log("Subject received in handleUpdateUnit:", subject);
        console.log("Unit data:", unitData);
        console.log("Subject ID types:", {
            id: subject.id,
            _id: subject._id,
            hasId: !!subject.id,
            has_id: !!subject._id
        });

        const unitIndex = subject.courseMaterials.syllabus.sections.findIndex(
            unit => unit.id === unitData.id
        );

        if (unitIndex === -1) return subject;

        // Update UI
        const updatedSections = [...subject.courseMaterials.syllabus.sections];
        updatedSections[unitIndex] = {
            ...updatedSections[unitIndex],
            title: unitData.title,
            weeks: unitData.weeks || ''
        };

        const updatedSubject = {
            ...subject,
            courseMaterials: {
                ...subject.courseMaterials,
                syllabus: {
                    ...subject.courseMaterials.syllabus,
                    sections: updatedSections
                }
            }
        };

        // Format for backend
        const backendData = {
            title: unitData.title,
            weeks: unitData.weeks || ''
        };

        // Fallback to id if _id is undefined
        const subjectId = subject._id || subject.id;
        
        console.log("Using subject ID for API call:", subjectId);
        
        if (!subjectId) {
            console.error("Subject ID is undefined or null!");
            toast.error("Cannot update unit - subject ID is missing");
            return subject;
        }

        // Update unit in backend
        await subjectService.updateUnit(subjectId, unitData.id, backendData);

        return updatedSubject;
    } catch (error) {
        console.error('Error updating unit:', error);
        toast.error('Failed to update unit');
        return subject;
    }
};

export const handleDeleteUnit = async (subject, unitId) => {
    try {
        console.log("Subject received in handleDeleteUnit:", subject);
        console.log("Unit ID to delete:", unitId);

        // Update UI
        const updatedSubject = {
            ...subject,
            courseMaterials: {
                ...subject.courseMaterials,
                syllabus: {
                    ...subject.courseMaterials.syllabus,
                    sections: subject.courseMaterials.syllabus.sections.filter(unit => unit.id !== unitId)
                }
            }
        };

        // Fallback to id if _id is undefined
        const subjectId = subject._id || subject.id;
        
        console.log("Using subject ID for API call:", subjectId);
        
        if (!subjectId) {
            console.error("Subject ID is undefined or null!");
            toast.error("Cannot delete unit - subject ID is missing");
            return subject;
        }

        // Delete unit in backend
        await subjectService.deleteUnit(subjectId, unitId);

        return updatedSubject;
    } catch (error) {
        console.error('Error deleting unit:', error);
        toast.error('Failed to delete unit');
        return subject;
    }
};

// Chapter operations with backend integration
export const handleAddChapter = async (subject, unitId, chapterData) => {
    try {
        console.log("Subject received in handleAddChapter:", subject);
        console.log("Unit ID:", unitId);
        console.log("Chapter data:", chapterData);

        const unitIndex = subject.courseMaterials.syllabus.sections.findIndex(
            unit => unit.id === unitId
        );

        if (unitIndex === -1) return subject;
        
        // Format for backend
        const backendData = {
            title: chapterData.title,
            subtopics: []
        };

        // Fallback to id if _id is undefined
        const subjectId = subject._id || subject.id;
        
        console.log("Using subject ID for API call:", subjectId);
        
        if (!subjectId) {
            console.error("Subject ID is undefined or null!");
            toast.error("Cannot add chapter - subject ID is missing");
            return subject;
        }

        // Add chapter to backend
        const response = await subjectService.addChapter(subjectId, unitId, backendData);
        console.log("Response from backend after chapter creation:", response);
        
        // Create the chapter with the backend-generated ID
        const newChapter = {
            id: response.id,  // Use the ID from backend
            title: chapterData.title,
            subtopics: []
        };

        // Update UI with backend-generated ID
        const updatedSections = [...subject.courseMaterials.syllabus.sections];
        updatedSections[unitIndex] = {
            ...updatedSections[unitIndex],
            chapters: [...updatedSections[unitIndex].chapters, newChapter]
        };

        const updatedSubject = {
            ...subject,
            courseMaterials: {
                ...subject.courseMaterials,
                syllabus: {
                    ...subject.courseMaterials.syllabus,
                    sections: updatedSections
                }
            }
        };

        return updatedSubject;
    } catch (error) {
        console.error('Error adding chapter:', error);
        toast.error('Failed to add chapter');
        return subject;
    }
};

export const handleUpdateChapter = async (subject, unitId, chapterData) => {
    try {
        const unitIndex = subject.courseMaterials.syllabus.sections.findIndex(
            unit => unit.id === unitId
        );

        if (unitIndex === -1) return subject;

        const chapterIndex = subject.courseMaterials.syllabus.sections[unitIndex].chapters.findIndex(
            chapter => chapter.id === chapterData.id
        );

        if (chapterIndex === -1) return subject;

        // Update UI
        const updatedSections = [...subject.courseMaterials.syllabus.sections];
        const updatedChapters = [...updatedSections[unitIndex].chapters];
        updatedChapters[chapterIndex] = {
            ...updatedChapters[chapterIndex],
            title: chapterData.title
        };

        updatedSections[unitIndex] = {
            ...updatedSections[unitIndex],
            chapters: updatedChapters
        };

        const updatedSubject = {
            ...subject,
            courseMaterials: {
                ...subject.courseMaterials,
                syllabus: {
                    ...subject.courseMaterials.syllabus,
                    sections: updatedSections
                }
            }
        };

        // Format for backend
        const backendData = {
            title: chapterData.title,
            subtopics: updatedChapters[chapterIndex].subtopics.map(
                subtopic => typeof subtopic === 'string' ? subtopic : subtopic.title
            )
        };

        // Fallback to id if _id is undefined
        const subjectId = subject._id || subject.id;
        
        if (!subjectId) {
            console.error("Subject ID is undefined or null!");
            toast.error("Cannot update chapter - subject ID is missing");
            return subject;
        }

        // Update chapter in backend
        await subjectService.updateChapter(subjectId, unitId, chapterData.id, backendData);

        return updatedSubject;
    } catch (error) {
        console.error('Error updating chapter:', error);
        toast.error('Failed to update chapter');
        return subject;
    }
};

export const handleDeleteChapter = async (subject, unitId, chapterId) => {
    try {
        const unitIndex = subject.courseMaterials.syllabus.sections.findIndex(
            unit => unit.id === unitId
        );

        if (unitIndex === -1) return subject;

        // Update UI
        const updatedSections = [...subject.courseMaterials.syllabus.sections];
        updatedSections[unitIndex] = {
            ...updatedSections[unitIndex],
            chapters: updatedSections[unitIndex].chapters.filter(chapter => chapter.id !== chapterId)
        };

        const updatedSubject = {
            ...subject,
            courseMaterials: {
                ...subject.courseMaterials,
                syllabus: {
                    ...subject.courseMaterials.syllabus,
                    sections: updatedSections
                }
            }
        };

        // Fallback to id if _id is undefined
        const subjectId = subject._id || subject.id;
        
        if (!subjectId) {
            console.error("Subject ID is undefined or null!");
            toast.error("Cannot delete chapter - subject ID is missing");
            return subject;
        }

        // Delete chapter in backend
        await subjectService.deleteChapter(subjectId, unitId, chapterId);

        return updatedSubject;
    } catch (error) {
        console.error('Error deleting chapter:', error);
        toast.error('Failed to delete chapter');
        return subject;
    }
};

// Subtopic operations
export const handleAddSubtopic = async (subject, unitId, chapterId, subtopicTitle) => {
    try {
        const unitIndex = subject.courseMaterials.syllabus.sections.findIndex(
            unit => unit.id === unitId
        );

        if (unitIndex === -1) return subject;

        const chapterIndex = subject.courseMaterials.syllabus.sections[unitIndex].chapters.findIndex(
            chapter => chapter.id === chapterId
        );

        if (chapterIndex === -1) return subject;

        // Create new subtopic for the backend payload
        const newSubtopic = {
            title: subtopicTitle
        };

        // Prepare existing subtopics plus the new one
        const currentSubtopics = subject.courseMaterials.syllabus.sections[unitIndex].chapters[chapterIndex].subtopics || [];
        const allSubtopicTitles = [...currentSubtopics.map(s => typeof s === 'string' ? s : s.title), subtopicTitle];

        // Update chapter in backend with new subtopic
        const backendData = {
            title: subject.courseMaterials.syllabus.sections[unitIndex].chapters[chapterIndex].title,
            subtopics: allSubtopicTitles
        };

        // Fallback to id if _id is undefined
        const subjectId = subject._id || subject.id;
        
        if (!subjectId) {
            console.error("Subject ID is undefined or null!");
            toast.error("Cannot add subtopic - subject ID is missing");
            return subject;
        }

        // Send update to backend and get the updated chapter
        const response = await subjectService.updateChapter(subjectId, unitId, chapterId, backendData);
        console.log("Response from backend after subtopic addition:", response);
        
        // The backend should return the full updated chapter with all subtopics
        // Extract the newly added subtopic from the response
        let addedSubtopic;
        if (response && response.subtopics && response.subtopics.length > currentSubtopics.length) {
            const newSubtopics = response.subtopics;
            // The last subtopic should be the newly added one
            addedSubtopic = newSubtopics[newSubtopics.length - 1];
        } else {
            // Fallback in case we can't identify the new subtopic
            addedSubtopic = {
                id: `subtopic_${Date.now()}`,  // Temporary ID
                title: subtopicTitle
            };
        }

        // Update UI with backend data
        const updatedSections = [...subject.courseMaterials.syllabus.sections];
        updatedSections[unitIndex] = {
            ...updatedSections[unitIndex],
            chapters: [...updatedSections[unitIndex].chapters]
        };

        updatedSections[unitIndex].chapters[chapterIndex] = {
            ...updatedSections[unitIndex].chapters[chapterIndex],
            subtopics: [...updatedSections[unitIndex].chapters[chapterIndex].subtopics, addedSubtopic]
        };

        const updatedSubject = {
            ...subject,
            courseMaterials: {
                ...subject.courseMaterials,
                syllabus: {
                    ...subject.courseMaterials.syllabus,
                    sections: updatedSections
                }
            }
        };

        return updatedSubject;
    } catch (error) {
        console.error('Error adding subtopic:', error);
        toast.error('Failed to add subtopic');
        return subject;
    }
};

export const handleUpdateSubtopic = async (subject, unitId, chapterId, subtopicData) => {
    try {
        const unitIndex = subject.courseMaterials.syllabus.sections.findIndex(
            unit => unit.id === unitId
        );

        if (unitIndex === -1) return subject;

        const chapterIndex = subject.courseMaterials.syllabus.sections[unitIndex].chapters.findIndex(
            chapter => chapter.id === chapterId
        );

        if (chapterIndex === -1) return subject;

        const subtopicIndex = subject.courseMaterials.syllabus.sections[unitIndex].chapters[chapterIndex].subtopics.findIndex(
            subtopic => subtopic.id === subtopicData.id
        );

        if (subtopicIndex === -1) return subject;

        // Update UI
        const updatedSections = [...subject.courseMaterials.syllabus.sections];
        updatedSections[unitIndex] = {
            ...updatedSections[unitIndex],
            chapters: [...updatedSections[unitIndex].chapters]
        };

        updatedSections[unitIndex].chapters[chapterIndex] = {
            ...updatedSections[unitIndex].chapters[chapterIndex],
            subtopics: [...updatedSections[unitIndex].chapters[chapterIndex].subtopics]
        };

        updatedSections[unitIndex].chapters[chapterIndex].subtopics[subtopicIndex] = {
            ...updatedSections[unitIndex].chapters[chapterIndex].subtopics[subtopicIndex],
            title: subtopicData.title
        };

        const updatedSubject = {
            ...subject,
            courseMaterials: {
                ...subject.courseMaterials,
                syllabus: {
                    ...subject.courseMaterials.syllabus,
                    sections: updatedSections
                }
            }
        };

        // Update chapter in backend
        const backendData = {
            title: updatedSections[unitIndex].chapters[chapterIndex].title,
            subtopics: updatedSections[unitIndex].chapters[chapterIndex].subtopics.map(
                subtopic => typeof subtopic === 'string' ? subtopic : subtopic.title
            )
        };

        // Fallback to id if _id is undefined
        const subjectId = subject._id || subject.id;
        
        if (!subjectId) {
            console.error("Subject ID is undefined or null!");
            toast.error("Cannot update subtopic - subject ID is missing");
            return subject;
        }

        await subjectService.updateChapter(subjectId, unitId, chapterId, backendData);

        return updatedSubject;
    } catch (error) {
        console.error('Error updating subtopic:', error);
        toast.error('Failed to update subtopic');
        return subject;
    }
};

export const handleDeleteSubtopic = async (subject, unitId, chapterId, subtopicId) => {
    try {
        const unitIndex = subject.courseMaterials.syllabus.sections.findIndex(
            unit => unit.id === unitId
        );

        if (unitIndex === -1) return subject;

        const chapterIndex = subject.courseMaterials.syllabus.sections[unitIndex].chapters.findIndex(
            chapter => chapter.id === chapterId
        );

        if (chapterIndex === -1) return subject;

        // Update UI
        const updatedSections = [...subject.courseMaterials.syllabus.sections];
        updatedSections[unitIndex] = {
            ...updatedSections[unitIndex],
            chapters: [...updatedSections[unitIndex].chapters]
        };

        updatedSections[unitIndex].chapters[chapterIndex] = {
            ...updatedSections[unitIndex].chapters[chapterIndex],
            subtopics: updatedSections[unitIndex].chapters[chapterIndex].subtopics.filter(
                subtopic => subtopic.id !== subtopicId
            )
        };

        const updatedSubject = {
            ...subject,
            courseMaterials: {
                ...subject.courseMaterials,
                syllabus: {
                    ...subject.courseMaterials.syllabus,
                    sections: updatedSections
                }
            }
        };

        // Update chapter in backend
        const backendData = {
            title: updatedSections[unitIndex].chapters[chapterIndex].title,
            subtopics: updatedSections[unitIndex].chapters[chapterIndex].subtopics.map(
                subtopic => typeof subtopic === 'string' ? subtopic : subtopic.title
            )
        };

        // Fallback to id if _id is undefined
        const subjectId = subject._id || subject.id;
        
        if (!subjectId) {
            console.error("Subject ID is undefined or null!");
            toast.error("Cannot delete subtopic - subject ID is missing");
            return subject;
        }

        await subjectService.updateChapter(subjectId, unitId, chapterId, backendData);

        return updatedSubject;
    } catch (error) {
        console.error('Error deleting subtopic:', error);
        toast.error('Failed to delete subtopic');
        return subject;
    }
};

// Lecture operations with backend integration
export const handleAddLecture = async (subject, lectureData) => {
    try {
        // Format for backend
        const backendData = {
            title: lectureData.title,
            date: lectureData.date || new Date().toISOString().split('T')[0],
            content: lectureData.content || '',
            attachments: lectureData.files || []
        };

        // Fallback to id if _id is undefined
        const subjectId = subject._id || subject.id;
        
        if (!subjectId) {
            console.error("Subject ID is undefined or null!");
            toast.error("Cannot add lecture - subject ID is missing");
            return subject;
        }

        // Add to backend
        const response = await subjectService.addLecture(subjectId, backendData);
        console.log("Response from backend after lecture creation:", response);

        // Create the lecture with the backend-generated ID
        const newLecture = {
            id: response.id,  // Use the ID from backend
            title: lectureData.title,
            date: lectureData.date || new Date().toISOString().split('T')[0],
            content: lectureData.content || '',
            files: lectureData.files || []
        };

        // Update UI with backend-generated ID
        const updatedSubject = {
            ...subject,
            courseMaterials: {
                ...subject.courseMaterials,
                lectures: [...subject.courseMaterials.lectures, newLecture]
            }
        };

        return updatedSubject;
    } catch (error) {
        console.error('Error adding lecture:', error);
        toast.error('Failed to add lecture');
        return subject;
    }
};

export const handleUpdateLecture = async (subject, lectureData) => {
    try {
        const lectureIndex = subject.courseMaterials.lectures.findIndex(
            lecture => lecture.id === lectureData.id
        );

        if (lectureIndex === -1) return subject;

        // Update UI
        const updatedLectures = [...subject.courseMaterials.lectures];
        updatedLectures[lectureIndex] = {
            ...updatedLectures[lectureIndex],
            title: lectureData.title,
            date: lectureData.date,
            content: lectureData.content,
            files: lectureData.files || updatedLectures[lectureIndex].files
        };

        const updatedSubject = {
            ...subject,
            courseMaterials: {
                ...subject.courseMaterials,
                lectures: updatedLectures
            }
        };

        // Format for backend
        const backendData = {
            title: lectureData.title,
            date: lectureData.date,
            content: lectureData.content,
            attachments: lectureData.files || []
        };

        // Fallback to id if _id is undefined
        const subjectId = subject._id || subject.id;
        
        if (!subjectId) {
            console.error("Subject ID is undefined or null!");
            toast.error("Cannot update lecture - subject ID is missing");
            return subject;
        }

        // Update in backend
        await subjectService.updateLecture(subjectId, lectureData.id, backendData);

        return updatedSubject;
    } catch (error) {
        console.error('Error updating lecture:', error);
        toast.error('Failed to update lecture');
        return subject;
    }
};

export const handleDeleteLecture = async (subject, lectureId) => {
    try {
        // Update UI
        const updatedSubject = {
            ...subject,
            courseMaterials: {
                ...subject.courseMaterials,
                lectures: subject.courseMaterials.lectures.filter(lecture => lecture.id !== lectureId)
            }
        };

        // Fallback to id if _id is undefined
        const subjectId = subject._id || subject.id;
        
        if (!subjectId) {
            console.error("Subject ID is undefined or null!");
            toast.error("Cannot delete lecture - subject ID is missing");
            return subject;
        }

        // Delete from backend
        await subjectService.deleteLecture(subjectId, lectureId);

        return updatedSubject;
    } catch (error) {
        console.error('Error deleting lecture:', error);
        toast.error('Failed to delete lecture');
        return subject;
    }
};

// Reading operations with backend integration
export const handleAddReading = async (subject, readingData) => {
    try {
        // Format for backend
        const backendData = {
            title: readingData.title,
            type: readingData.type || 'ARTICLE',
            typeFieldOne: readingData.typeFieldOne || '',
            typeFieldTwo: readingData.typeFieldTwo || '',
            attachments: readingData.files || []
        };

        // Fallback to id if _id is undefined
        const subjectId = subject._id || subject.id;
        
        if (!subjectId) {
            console.error("Subject ID is undefined or null!");
            toast.error("Cannot add reading - subject ID is missing");
            return subject;
        }

        // Add to backend
        const response = await subjectService.addReading(subjectId, backendData);
        console.log("Response from backend after reading creation:", response);

        // Create the reading with the backend-generated ID
        const newReading = {
            id: response.id,  // Use the ID from backend
            title: readingData.title,
            type: readingData.type || 'ARTICLE',
            typeFieldOne: readingData.typeFieldOne || '',
            typeFieldTwo: readingData.typeFieldTwo || '',
            files: readingData.files || []
        };

        // Update UI with backend-generated ID
        const updatedSubject = {
            ...subject,
            courseMaterials: {
                ...subject.courseMaterials,
                readings: [...subject.courseMaterials.readings, newReading]
            }
        };

        return updatedSubject;
    } catch (error) {
        console.error('Error adding reading:', error);
        toast.error('Failed to add reading');
        return subject;
    }
};

export const handleUpdateReading = async (subject, readingData) => {
    try {
        const readingIndex = subject.courseMaterials.readings.findIndex(
            reading => reading.id === readingData.id
        );

        if (readingIndex === -1) return subject;

        // Update UI
        const updatedReadings = [...subject.courseMaterials.readings];
        updatedReadings[readingIndex] = {
            ...updatedReadings[readingIndex],
            title: readingData.title,
            type: readingData.type,
            typeFieldOne: readingData.typeFieldOne,
            typeFieldTwo: readingData.typeFieldTwo,
            files: readingData.files || updatedReadings[readingIndex].files
        };

        const updatedSubject = {
            ...subject,
            courseMaterials: {
                ...subject.courseMaterials,
                readings: updatedReadings
            }
        };

        // Format for backend
        const backendData = {
            title: readingData.title,
            type: readingData.type,
            typeFieldOne: readingData.typeFieldOne,
            typeFieldTwo: readingData.typeFieldTwo,
            attachments: readingData.files || []
        };

        // Fallback to id if _id is undefined
        const subjectId = subject._id || subject.id;
        
        if (!subjectId) {
            console.error("Subject ID is undefined or null!");
            toast.error("Cannot update reading - subject ID is missing");
            return subject;
        }

        // Update in backend
        await subjectService.updateReading(subjectId, readingData.id, backendData);

        return updatedSubject;
    } catch (error) {
        console.error('Error updating reading:', error);
        toast.error('Failed to update reading');
        return subject;
    }
};

export const handleDeleteReading = async (subject, readingId) => {
    try {
        // Update UI
        const updatedSubject = {
            ...subject,
            courseMaterials: {
                ...subject.courseMaterials,
                readings: subject.courseMaterials.readings.filter(reading => reading.id !== readingId)
            }
        };

        // Fallback to id if _id is undefined
        const subjectId = subject._id || subject.id;
        
        if (!subjectId) {
            console.error("Subject ID is undefined or null!");
            toast.error("Cannot delete reading - subject ID is missing");
            return subject;
        }

        // Delete from backend
        await subjectService.deleteReading(subjectId, readingId);

        return updatedSubject;
    } catch (error) {
        console.error('Error deleting reading:', error);
        toast.error('Failed to delete reading');
        return subject;
    }
};

// Assignment operations with backend integration
export const handleAddAssignment = async (subject, assignmentData) => {
    try {
        // Format for backend
        const backendData = {
            title: assignmentData.title,
            dueDate: assignmentData.dueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            points: assignmentData.points || 100,
            instructions: assignmentData.instructions || '',
            isCompleted: false,
            isFavorite: false,
            attachments: assignmentData.files || []
        };

        // Fallback to id if _id is undefined
        const subjectId = subject._id || subject.id;
        
        if (!subjectId) {
            console.error("Subject ID is undefined or null!");
            toast.error("Cannot add assignment - subject ID is missing");
            return subject;
        }

        // Add to backend
        const response = await subjectService.addAssignment(subjectId, backendData);
        console.log("Response from backend after assignment creation:", response);

        // Create the assignment with the backend-generated ID
        const newAssignment = {
            id: response.id,  // Use the ID from backend
            title: assignmentData.title,
            dueDate: assignmentData.dueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            points: assignmentData.points || 100,
            instructions: assignmentData.instructions || '',
            isCompleted: false,
            isFavorite: false,
            attachments: assignmentData.attachments || [],
            files: assignmentData.files || []
        };

        // Update UI with backend-generated ID
        const updatedSubject = {
            ...subject,
            courseMaterials: {
                ...subject.courseMaterials,
                assignments: [...subject.courseMaterials.assignments, newAssignment]
            }
        };

        return updatedSubject;
    } catch (error) {
        console.error('Error adding assignment:', error);
        toast.error('Failed to add assignment');
        return subject;
    }
};

export const handleUpdateAssignment = async (subject, assignmentData) => {
    try {
        const assignmentIndex = subject.courseMaterials.assignments.findIndex(
            assignment => assignment.id === assignmentData.id
        );

        if (assignmentIndex === -1) return subject;

        // Update UI
        const updatedAssignments = [...subject.courseMaterials.assignments];
        updatedAssignments[assignmentIndex] = {
            ...updatedAssignments[assignmentIndex],
            title: assignmentData.title,
            dueDate: assignmentData.dueDate,
            points: assignmentData.points,
            instructions: assignmentData.instructions,
            isCompleted: assignmentData.isCompleted,
            isFavorite: assignmentData.isFavorite,
            files: assignmentData.files || updatedAssignments[assignmentIndex].files
        };

        const updatedSubject = {
            ...subject,
            courseMaterials: {
                ...subject.courseMaterials,
                assignments: updatedAssignments
            }
        };

        // Format for backend
        const backendData = {
            title: assignmentData.title,
            dueDate: assignmentData.dueDate,
            points: assignmentData.points,
            instructions: assignmentData.instructions,
            isCompleted: assignmentData.isCompleted,
            isFavorite: assignmentData.isFavorite,
            attachments: assignmentData.files || []
        };

        // Fallback to id if _id is undefined
        const subjectId = subject._id || subject.id;
        
        if (!subjectId) {
            console.error("Subject ID is undefined or null!");
            toast.error("Cannot update assignment - subject ID is missing");
            return subject;
        }

        // Update in backend
        await subjectService.updateAssignment(subjectId, assignmentData.id, backendData);

        return updatedSubject;
    } catch (error) {
        console.error('Error updating assignment:', error);
        toast.error('Failed to update assignment');
        return subject;
    }
};

export const handleDeleteAssignment = async (subject, assignmentId) => {
    try {
        // Update UI
        const updatedSubject = {
            ...subject,
            courseMaterials: {
                ...subject.courseMaterials,
                assignments: subject.courseMaterials.assignments.filter(assignment => assignment.id !== assignmentId)
            }
        };

        // Fallback to id if _id is undefined
        const subjectId = subject._id || subject.id;
        
        if (!subjectId) {
            console.error("Subject ID is undefined or null!");
            toast.error("Cannot delete assignment - subject ID is missing");
            return subject;
        }

        // Delete from backend
        await subjectService.deleteAssignment(subjectId, assignmentId);

        return updatedSubject;
    } catch (error) {
        console.error('Error deleting assignment:', error);
        toast.error('Failed to delete assignment');
        return subject;
    }
};

// Note operations with backend integration
export const handleAddNote = async (subject, noteData) => {
    try {
        // Format for backend (notes are updated via the subject)
        const newNoteData = {
            title: noteData.title,
            date: noteData.date || new Date().toISOString().split('T')[0],
            content: noteData.content || '',
            tags: noteData.tags || []
        };

        // Fallback to id if _id is undefined
        const subjectId = subject._id || subject.id;
        
        if (!subjectId) {
            console.error("Subject ID is undefined or null!");
            toast.error("Cannot add note - subject ID is missing");
            return subject;
        }

        // Prepare data for backend
        const updatedNotes = [
            ...subject.notes, 
            newNoteData
        ];
        
        // Update subject with new notes array
        const response = await subjectService.updateSubject(subjectId, {
            notes: updatedNotes
        });
        console.log("Response from backend after note creation:", response);

        // Extract the newly added note with backend-generated ID
        let newNote;
        if (response && response.notes && response.notes.length > subject.notes.length) {
            // The last note in the response should be the newly added one
            newNote = response.notes[response.notes.length - 1];
        } else {
            // Fallback in case we can't identify the new note
            newNote = {
                id: `note_${Date.now()}`,  // Temporary ID
                ...newNoteData
            };
        }

        // Update UI with backend-generated ID
        const updatedSubject = {
            ...subject,
            notes: [...subject.notes, newNote]
        };

        return updatedSubject;
    } catch (error) {
        console.error('Error adding note:', error);
        toast.error('Failed to add note');
        return subject;
    }
};

export const handleUpdateNote = async (subject, noteData) => {
    try {
        const noteIndex = subject.notes.findIndex(
            note => note.id === noteData.id
        );

        if (noteIndex === -1) return subject;

        // Update UI
        const updatedNotes = [...subject.notes];
        updatedNotes[noteIndex] = {
            ...updatedNotes[noteIndex],
            title: noteData.title,
            date: noteData.date,
            content: noteData.content,
            tags: noteData.tags
        };

        const updatedSubject = {
            ...subject,
            notes: updatedNotes
        };

        // Fallback to id if _id is undefined
        const subjectId = subject._id || subject.id;
        
        if (!subjectId) {
            console.error("Subject ID is undefined or null!");
            toast.error("Cannot update note - subject ID is missing");
            return subject;
        }

        // Update subject with modified notes array
        await subjectService.updateSubject(subjectId, {
            notes: updatedNotes
        });

        return updatedSubject;
    } catch (error) {
        console.error('Error updating note:', error);
        toast.error('Failed to update note');
        return subject;
    }
};

export const handleDeleteNote = async (subject, noteId) => {
    try {
        // Update UI
        const updatedNotes = subject.notes.filter(note => note.id !== noteId);
        
        const updatedSubject = {
            ...subject,
            notes: updatedNotes
        };

        // Fallback to id if _id is undefined
        const subjectId = subject._id || subject.id;
        
        if (!subjectId) {
            console.error("Subject ID is undefined or null!");
            toast.error("Cannot delete note - subject ID is missing");
            return subject;
        }

        // Update subject with notes array that has the note removed
        await subjectService.updateSubject(subjectId, {
            notes: updatedNotes
        });

        return updatedSubject;
    } catch (error) {
        console.error('Error deleting note:', error);
        toast.error('Failed to delete note');
        return subject;
    }
}; 