import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Button } from '../../../components/ui/button';
import { 
  AddUnitDialog,
  EditUnitDialog,
  AddChapterDialog,
  EditChapterDialog,
  AddSubtopicDialog,
  EditSubtopicDialog 
} from './SyllabusDialogs';

import { 
  AddLectureDialog, 
  EditLectureDialog,
  AddReadingDialog,
  EditReadingDialog,
  AddAssignmentDialog,
  EditAssignmentDialog,
  AddNoteDialog,
  EditNoteDialog
} from './ContentDialogs';
import { Star, FileText, Calendar, Clock } from 'lucide-react';
import subjectService from '../../../services/subjectService';

// Import utility functions from our integration file
import {
  handleAddUnit,
  handleUpdateUnit,
  handleDeleteUnit,
  handleAddChapter,
  handleUpdateChapter,
  handleDeleteChapter,
  handleAddSubtopic,
  handleUpdateSubtopic,
  handleDeleteSubtopic,
  handleAddLecture,
  handleUpdateLecture,
  handleDeleteLecture,
  handleAddReading,
  handleUpdateReading,
  handleDeleteReading,
  handleAddAssignment,
  handleUpdateAssignment,
  handleDeleteAssignment,
  handleAddNote,
  handleUpdateNote,
  handleDeleteNote
} from '../../../utils/subject-integration.jsx';

const SubjectContent = ({ subject, updateSubject, favorites, toggleFavorite }) => {
  const [selectedTab, setSelectedTab] = useState('syllabus');
  const [loading, setLoading] = useState(false);
  const [workingSubject, setWorkingSubject] = useState(subject);
  
  const [addUnitDialogOpen, setAddUnitDialogOpen] = useState(false);
  const [editUnitDialogOpen, setEditUnitDialogOpen] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState(null);
  
  const [addChapterDialogOpen, setAddChapterDialogOpen] = useState(false);
  const [editChapterDialogOpen, setEditChapterDialogOpen] = useState(false);
  const [selectedChapterData, setSelectedChapterData] = useState(null);
  
  const [addSubtopicDialogOpen, setAddSubtopicDialogOpen] = useState(false);
  const [editSubtopicDialogOpen, setEditSubtopicDialogOpen] = useState(false);
  const [selectedSubtopicData, setSelectedSubtopicData] = useState(null);
  
  const [addLectureDialogOpen, setAddLectureDialogOpen] = useState(false);
  const [editLectureDialogOpen, setEditLectureDialogOpen] = useState(false);
  const [selectedLecture, setSelectedLecture] = useState(null);
  
  const [addReadingDialogOpen, setAddReadingDialogOpen] = useState(false);
  const [editReadingDialogOpen, setEditReadingDialogOpen] = useState(false);
  const [selectedReading, setSelectedReading] = useState(null);
  
  const [addAssignmentDialogOpen, setAddAssignmentDialogOpen] = useState(false);
  const [editAssignmentDialogOpen, setEditAssignmentDialogOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  
  const [addNoteDialogOpen, setAddNoteDialogOpen] = useState(false);
  const [editNoteDialogOpen, setEditNoteDialogOpen] = useState(false);
  const [selectedNoteForEdit, setSelectedNoteForEdit] = useState(null);

  // Load syllabus data when component mounts or subject changes
  useEffect(() => {
    const loadSyllabusData = async () => {
      try {
        setLoading(true);
        setWorkingSubject(subject);
        
        // If subject has no syllabus or syllabus data, create one
        if (!subject.courseMaterials.syllabus) {
          console.log('Subject has no syllabus, creating one...');
          const syllabusService = subjectService.createSyllabus(subject.id, syllabusData);
          
          // Create a new syllabus
          const syllabusData = {
            title: `${subject.name} Syllabus`,
            description: `Syllabus for ${subject.name}`,
            subjectId: subject.id,
            topics: []
          };
          
          try {
            const syllabus = await syllabusService.createSyllabus(subject.id, syllabusData);
            
            if (syllabus) {
              // Update the working subject with the new syllabus
              const updatedSubject = {
                ...subject,
                courseMaterials: {
                  ...subject.courseMaterials,
                  syllabus: {
                    id: syllabus.id,
                    title: syllabus.name || `${subject.name} Syllabus`,
                    content: syllabus.description || subject.description || '',
                    sections: syllabus.units || []
                  }
                }
              };
              
              setWorkingSubject(updatedSubject);
              updateSubject(updatedSubject);
            }
          } catch (err) {
            console.error('Error creating syllabus:', err);
            toast.error('Failed to create syllabus');
          }
        } else if (subject.courseMaterials.syllabus && subject.courseMaterials.syllabus.id) {
          // If subject has a syllabus ID, fetch the latest data
          try {
            console.log('Subject has syllabus ID, fetching latest data...');
            const syllabusData = subjectService.getSyllabusById(subject.courseMaterials.syllabus.id);
            
            if (syllabusData) {
              // Update the working subject with the latest syllabus data
              const updatedSubject = {
                ...subject,
                courseMaterials: {
                  ...subject.courseMaterials,
                  syllabus: {
                    id: syllabusData.id,
                    title: syllabusData.name || subject.courseMaterials.syllabus.title,
                    content: syllabusData.description || subject.courseMaterials.syllabus.content,
                    sections: syllabusData.units || subject.courseMaterials.syllabus.sections
                  }
                }
              };
              
              setWorkingSubject(updatedSubject);
            }
          } catch (err) {
            console.error('Error fetching syllabus:', err);
          }
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error loading syllabus data:', error);
        setLoading(false);
      }
    };
    
    loadSyllabusData();
  }, [subject.id]);

  // Check if an item is favorited
  const isFavorited = (type, id) => {
    const favoriteId = `${type}_${workingSubject.id}_${id}`;
    return favorites.includes(favoriteId);
  };

  // Handle favorite toggle
  const handleToggleFavorite = (type, id) => {
    toggleFavorite(type, workingSubject.id, id);
  };
  
  // Handle sync with parent component
  const handleSyncWithParent = (updatedSubject) => {
    // Update local state
    setWorkingSubject(updatedSubject);
    // Send updated subject back to parent component
    updateSubject(updatedSubject);
  };
  
  // ===== SYLLABUS CRUD OPERATIONS =====
  
  const onAddUnit = async (newUnit) => {
    try {
      const updatedSubject = await handleAddUnit(workingSubject, newUnit);
      handleSyncWithParent(updatedSubject);
      toast.success(`Unit "${newUnit.title}" added successfully!`);
    } catch (error) {
      toast.error('Failed to add unit');
    }
  };
  
  const onUpdateUnit = async (updatedUnit) => {
    try {
      const updatedSubject = await handleUpdateUnit(workingSubject, updatedUnit);
      handleSyncWithParent(updatedSubject);
    } catch (error) {
      toast.error('Failed to update unit');
    }
  };
  
  const onDeleteUnit = async (unitId) => {
    try {
      const unit = workingSubject.courseMaterials.syllabus.sections.find(u => u.id === unitId);
      const updatedSubject = await handleDeleteUnit(workingSubject, unitId);
      handleSyncWithParent(updatedSubject);
      toast.success(`Unit "${unit?.title || ''}" deleted successfully!`);
    } catch (error) {
      toast.error('Failed to delete unit');
    }
  };
  
  const onAddChapter = async (newChapter) => {
    try {
      const updatedSubject = await handleAddChapter(workingSubject, selectedChapterData.unitId, newChapter);
      handleSyncWithParent(updatedSubject);
      toast.success(`Chapter "${newChapter.title}" added successfully!`);
    } catch (error) {
      toast.error('Failed to add chapter');
    }
  };
  
  const onUpdateChapter = async (updatedChapter) => {
    if (!updatedChapter) return;
    
    try {
      const updatedSubject = await handleUpdateChapter(workingSubject, selectedChapterData.unitId, updatedChapter);
      handleSyncWithParent(updatedSubject);
      
      // Reset selection and close dialog
      setSelectedChapterData(null);
      setEditChapterDialogOpen(false);
    } catch (error) {
      toast.error('Failed to update chapter');
    }
  };
  
  const onDeleteChapter = async (unitId, chapterId) => {
    try {
      const unit = workingSubject.courseMaterials.syllabus.sections.find(u => u.id === unitId);
      const chapter = unit?.chapters.find(c => c.id === chapterId);
      
      const updatedSubject = await handleDeleteChapter(workingSubject, unitId, chapterId);
      handleSyncWithParent(updatedSubject);
      
      toast.success(`Chapter "${chapter?.title || ''}" deleted successfully!`);
    } catch (error) {
      toast.error('Failed to delete chapter');
    }
  };
  
  const onAddSubtopic = async (newSubtopic) => {
    try {
      const { unitId, chapterId } = selectedSubtopicData;
      
      const updatedSubject = await handleAddSubtopic(
        workingSubject, 
        unitId, 
        chapterId, 
        newSubtopic
      );
      
      handleSyncWithParent(updatedSubject);
      toast.success(`Subtopic "${newSubtopic.title}" added successfully!`);
    } catch (error) {
      toast.error('Failed to add subtopic');
    }
  };
  
  const onUpdateSubtopic = async (updatedContent) => {
    try {
      const { unitId, chapterId, subtopicId } = selectedSubtopicData;
      
      const updatedSubject = await handleUpdateSubtopic(
        workingSubject,
        unitId,
        chapterId,
        subtopicId,
        updatedContent
      );
      
      handleSyncWithParent(updatedSubject);
      toast.success('Subtopic updated successfully!');
    } catch (error) {
      toast.error('Failed to update subtopic');
    }
  };
  
  const onDeleteSubtopic = async (unitId, chapterId, subtopicId) => {
    try {
      const unit = workingSubject.courseMaterials.syllabus.sections.find(u => u.id === unitId);
      const chapter = unit?.chapters.find(c => c.id === chapterId);
      const subtopic = chapter?.subtopics.find(s => s.id === subtopicId);
      
      const updatedSubject = await handleDeleteSubtopic(
        workingSubject,
        unitId,
        chapterId,
        subtopicId
      );
      
      handleSyncWithParent(updatedSubject);
      toast.success(`Subtopic "${subtopic?.title || ''}" deleted successfully!`);
    } catch (error) {
      toast.error('Failed to delete subtopic');
    }
  };
  
  // ===== LECTURE CRUD OPERATIONS =====
  
  const onAddLecture = async (lectureData) => {
    try {
      const updatedSubject = await handleAddLecture(workingSubject, lectureData);
      handleSyncWithParent(updatedSubject);
      toast.success(`Lecture "${lectureData.title}" added successfully!`);
    } catch (error) {
      toast.error('Failed to add lecture');
    }
  };
  
  const onUpdateLecture = async (lectureData) => {
    try {
      const updatedSubject = await handleUpdateLecture(workingSubject, lectureData);
      handleSyncWithParent(updatedSubject);
      toast.success(`Lecture "${lectureData.title}" updated successfully!`);
    } catch (error) {
      toast.error('Failed to update lecture');
    }
  };
  
  const onDeleteLecture = async (lectureId) => {
    try {
      const lecture = workingSubject.courseMaterials.lectures.find(l => l.id === lectureId);
      
      const updatedSubject = await handleDeleteLecture(workingSubject, lectureId);
      handleSyncWithParent(updatedSubject);
      
      toast.success(`Lecture "${lecture?.title || ''}" deleted successfully!`);
    } catch (error) {
      toast.error('Failed to delete lecture');
    }
  };
  
  // ===== READING CRUD OPERATIONS =====
  
  const onAddReading = async (readingData) => {
    try {
      const updatedSubject = await handleAddReading(workingSubject, readingData);
      handleSyncWithParent(updatedSubject);
      toast.success(`Reading "${readingData.title}" added successfully!`);
    } catch (error) {
      toast.error('Failed to add reading');
    }
  };
  
  const onUpdateReading = async (readingData) => {
    try {
      const updatedSubject = await handleUpdateReading(workingSubject, readingData);
      handleSyncWithParent(updatedSubject);
      toast.success(`Reading "${readingData.title}" updated successfully!`);
    } catch (error) {
      toast.error('Failed to update reading');
    }
  };
  
  const onDeleteReading = async (readingId) => {
    try {
      const reading = workingSubject.courseMaterials.readings.find(r => r.id === readingId);
      
      const updatedSubject = await handleDeleteReading(workingSubject, readingId);
      handleSyncWithParent(updatedSubject);
      
      toast.success(`Reading "${reading?.title || ''}" deleted successfully!`);
    } catch (error) {
      toast.error('Failed to delete reading');
    }
  };
  
  // ===== ASSIGNMENT CRUD OPERATIONS =====
  
  const onAddAssignment = async (assignmentData) => {
    try {
      const updatedSubject = await handleAddAssignment(workingSubject, assignmentData);
      handleSyncWithParent(updatedSubject);
      toast.success(`Assignment "${assignmentData.title}" added successfully!`);
    } catch (error) {
      toast.error('Failed to add assignment');
    }
  };
  
  const onUpdateAssignment = async (assignmentData) => {
    try {
      const updatedSubject = await handleUpdateAssignment(workingSubject, assignmentData);
      handleSyncWithParent(updatedSubject);
      toast.success(`Assignment "${assignmentData.title}" updated successfully!`);
    } catch (error) {
      toast.error('Failed to update assignment');
    }
  };
  
  const onDeleteAssignment = async (assignmentId) => {
    try {
      const assignment = workingSubject.courseMaterials.assignments.find(a => a.id === assignmentId);
      
      const updatedSubject = await handleDeleteAssignment(workingSubject, assignmentId);
      handleSyncWithParent(updatedSubject);
      
      toast.success(`Assignment "${assignment?.title || ''}" deleted successfully!`);
    } catch (error) {
      toast.error('Failed to delete assignment');
    }
  };
  
  // ===== NOTES CRUD OPERATIONS =====
  
  const onAddNote = async (noteData) => {
    try {
      const updatedSubject = await handleAddNote(workingSubject, noteData);
      handleSyncWithParent(updatedSubject);
      toast.success(`Note "${noteData.title}" added successfully!`);
    } catch (error) {
      toast.error('Failed to add note');
    }
  };
  
  const onUpdateNote = async (noteData) => {
    try {
      const updatedSubject = await handleUpdateNote(workingSubject, noteData);
      handleSyncWithParent(updatedSubject);
      toast.success(`Note "${noteData.title}" updated successfully!`);
    } catch (error) {
      toast.error('Failed to update note');
    }
  };
  
  const onDeleteNote = async (noteId) => {
    try {
      const note = workingSubject.notes.find(n => n.id === noteId);
      
      const updatedSubject = await handleDeleteNote(workingSubject, noteId);
      handleSyncWithParent(updatedSubject);
      
      toast.success(`Note "${note?.title || ''}" deleted successfully!`);
    } catch (error) {
      toast.error('Failed to delete note');
    }
  };

  // Render file attachment chips
  const renderFileAttachments = (attachments, files) => {
    if (!files || files.length === 0) return null;
    
    return (
      <div className="flex flex-wrap gap-2 mt-2">
        {files.map((file, index) => {
          const fileName = file.name || file.originalName || 'File';
          
          return (
            <button
              key={index}
              onClick={() => handleViewFile(file)}
              className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 rounded-full text-sm hover:bg-blue-200 dark:hover:bg-blue-800/50 transition-colors"
            >
              <FileText className="w-3 h-3 mr-1" />
              {fileName}
            </button>
          );
        })}
      </div>
    );
  };

  // Update the lecture card rendering
  const renderLectureCard = (lecture) => {
    const isLectureFavorited = isFavorited('lecture', lecture.id);
    
    return (
      <div key={lecture.id} className="p-4 border rounded-lg mb-4 bg-white dark:bg-gray-800 shadow-sm">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold">{lecture.title}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{lecture.date}</p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => handleToggleFavorite('lecture', lecture.id)}
              className={`p-1 rounded-full ${isLectureFavorited ? 'text-yellow-500' : 'text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300'}`}
              aria-label={isLectureFavorited ? "Remove from favorites" : "Add to favorites"}
            >
              <Star className="h-5 w-5" fill={isLectureFavorited ? "currentColor" : "none"} />
            </button>
            <button 
              onClick={() => setSelectedLecture(lecture)}
              className="text-blue-500 hover:text-blue-700 px-2 py-1"
            >
              Edit
            </button>
            <button 
              onClick={() => onDeleteLecture(lecture.id)}
              className="text-red-500 hover:text-red-700 px-2 py-1"
            >
              Delete
            </button>
          </div>
        </div>
        <p className="mt-2">{lecture.content}</p>
        {renderFileAttachments(lecture.attachments, lecture.files)}
      </div>
    );
  };

  // Update the reading card rendering to include attachments
  const renderReadingCard = (reading) => {
    const isReadingFavorited = isFavorited('reading', reading.id);
    
    return (
      <div key={reading.id} className="p-4 border rounded-lg mb-4 bg-white dark:bg-gray-800 shadow-sm">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold">{reading.title}</h3>
            {reading.author && <p className="text-sm text-gray-500 dark:text-gray-400">By {reading.author}</p>}
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{reading.type}{reading.source ? ` • ${reading.source}` : ''}</p>
            {reading.chapters && <p className="text-sm text-gray-500 dark:text-gray-400">{reading.chapters}</p>}
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => handleToggleFavorite('reading', reading.id)}
              className={`p-1 rounded-full ${isReadingFavorited ? 'text-yellow-500' : 'text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300'}`}
              aria-label={isReadingFavorited ? "Remove from favorites" : "Add to favorites"}
            >
              <Star className="h-5 w-5" fill={isReadingFavorited ? "currentColor" : "none"} />
            </button>
            <button 
              onClick={() => setSelectedReading(reading)}
              className="text-blue-500 hover:text-blue-700 px-2 py-1"
            >
              Edit
            </button>
            <button 
              onClick={() => onDeleteReading(reading.id)}
              className="text-red-500 hover:text-red-700 px-2 py-1"
            >
              Delete
            </button>
          </div>
        </div>
        {renderFileAttachments(reading.attachments, reading.files)}
      </div>
    );
  };

  // Update the assignment card to include the Todo card UI and file attachments
  const renderAssignmentCard = (assignment) => {
    const isAssignmentFavorited = isFavorited('assignment', assignment.id);
    const dueDate = new Date(assignment.dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diffTime = dueDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    // Determine status badge
    const getStatusBadge = () => {
      if (diffDays < 0) {
        return <span className="px-2 py-1 rounded-full bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 text-xs">Overdue</span>;
      } else if (diffDays === 0) {
        return <span className="px-2 py-1 rounded-full bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 text-xs">Due Today</span>;
      } else if (diffDays <= 3) {
        return <span className="px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 text-xs">Due Soon</span>;
      } else {
        return <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700/30 dark:text-gray-300 text-xs">Upcoming</span>;
      }
    };
    
    return (
      <div key={assignment.id} className="border rounded-lg mb-4 bg-white dark:bg-gray-800 shadow-sm overflow-hidden">
        <div className="p-4 border-b dark:border-gray-700">
          <div className="flex flex-col md:flex-row md:items-start justify-between pb-2 gap-4">
            <div>
              <h3 className="text-lg font-semibold flex items-center gap-2">{assignment.title}</h3>
              <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {assignment.points} points
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {getStatusBadge()}
              <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700/30 dark:text-gray-300 text-xs flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {dueDate.toLocaleDateString()}
              </span>
              <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700/30 dark:text-gray-300 text-xs flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {diffDays === 0 
                  ? "Today" 
                  : diffDays < 0 
                    ? `${Math.abs(diffDays)} day${Math.abs(diffDays) > 1 ? 's' : ''} overdue` 
                    : `${diffDays} day${diffDays > 1 ? 's' : ''} left`}
              </span>
            </div>
          </div>
        </div>
        
        <div className="p-4">
          <p className="text-sm mb-4">{assignment.instructions}</p>
          {renderFileAttachments(assignment.attachments, assignment.files)}
        </div>
        
        <div className="p-4 border-t dark:border-gray-700 flex flex-col sm:flex-row justify-between gap-2">
          <div className="flex gap-2">
            <button 
              onClick={() => handleToggleFavorite('assignment', assignment.id)}
              className={`p-1 rounded-full ${isAssignmentFavorited ? 'text-yellow-500' : 'text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300'}`}
              aria-label={isAssignmentFavorited ? "Remove from favorites" : "Add to favorites"}
            >
              <Star className="h-5 w-5" fill={isAssignmentFavorited ? "currentColor" : "none"} />
            </button>
            <button 
              onClick={() => setSelectedAssignment(assignment)}
              className="text-blue-500 hover:text-blue-700 px-2 py-1"
            >
              Edit
            </button>
            <button 
              onClick={() => onDeleteAssignment(assignment.id)}
              className="text-red-500 hover:text-red-700 px-2 py-1"
            >
              Delete
            </button>
          </div>
          <Button variant="outline">View Details</Button>
        </div>
      </div>
    );
  };

  // Helper function to render note cards
  const renderNoteCard = (note) => (
    <div key={note.id} className="bg-white dark:bg-gray-800 p-4 border border-gray-200 dark:border-gray-700 rounded-md">
      <div className="flex justify-between">
        <h3 className="font-semibold text-lg mb-2">{note.title}</h3>
        <div className="flex space-x-2">
          <Button 
            variant="ghost" 
            className="h-7 w-7 p-0"
            onClick={() => {
              setSelectedNoteForEdit(note);
              setEditNoteDialogOpen(true);
            }}
          >
            ✏️
          </Button>
          <Button 
            variant="ghost" 
            className="h-7 w-7 p-0 text-red-500"
            onClick={() => onDeleteNote(note.id)}
          >
            🗑️
          </Button>
        </div>
      </div>
      <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
        Created: {new Date(note.createdAt || Date.now()).toLocaleDateString()}
      </div>
      <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{note.content}</p>
    </div>
  );

  // Render the appropriate content based on the selected tab
  return (
    <div className="flex flex-col space-y-6">
      {/* Tab navigation */}
      <div className="flex border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
        <button
          onClick={() => setSelectedTab('syllabus')}
          className={`px-4 py-2 border-b-2 font-medium text-sm ${
            selectedTab === 'syllabus'
              ? 'border-indigo-500 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
          }`}
        >
          Syllabus
        </button>
        <button
          onClick={() => setSelectedTab('lectures')}
          className={`px-4 py-2 border-b-2 font-medium text-sm ${
            selectedTab === 'lectures'
              ? 'border-indigo-500 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
          }`}
        >
          Lectures
        </button>
        <button
          onClick={() => setSelectedTab('readings')}
          className={`px-4 py-2 border-b-2 font-medium text-sm ${
            selectedTab === 'readings'
              ? 'border-indigo-500 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
          }`}
        >
          Readings
        </button>
        <button
          onClick={() => setSelectedTab('assignments')}
          className={`px-4 py-2 border-b-2 font-medium text-sm ${
            selectedTab === 'assignments'
              ? 'border-indigo-500 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
          }`}
        >
          Assignments
        </button>
        <button
          onClick={() => setSelectedTab('notes')}
          className={`px-4 py-2 border-b-2 font-medium text-sm ${
            selectedTab === 'notes'
              ? 'border-indigo-500 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
          }`}
        >
          Notes
        </button>
      </div>

      {/* Content area */}
      <div className="flex-1 p-4">
        {/* Syllabus Tab */}
        {selectedTab === 'syllabus' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Course Syllabus</h2>
              <Button
                onClick={() => setAddUnitDialogOpen(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                Add Unit
              </Button>
            </div>
            
            {/* Units, Chapters, and Subtopics */}
            {workingSubject.courseMaterials.syllabus && workingSubject.courseMaterials.syllabus.sections && workingSubject.courseMaterials.syllabus.sections.length > 0 ? (
              <div className="space-y-6">
                {workingSubject.courseMaterials.syllabus.sections.map((unit) => (
                  <div key={unit.id} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                    <div className="bg-gray-50 dark:bg-gray-800 px-4 py-3 flex justify-between items-center">
                      <h3 className="font-medium text-lg">{unit.title}</h3>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          className="h-8 w-8 p-0"
                          onClick={() => {
                            setSelectedUnit(unit);
                            setEditUnitDialogOpen(true);
                          }}
                        >
                          ✏️
                        </Button>
                        <Button
                          variant="ghost"
                          className="h-8 w-8 p-0 text-red-500"
                          onClick={() => onDeleteUnit(unit.id)}
                        >
                          🗑️
                        </Button>
                        <Button
                          variant="ghost"
                          onClick={() => {
                            setAddChapterDialogOpen(true);
                            setSelectedChapterData({ unitId: unit.id });
                          }}
                        >
                          + Chapter
                        </Button>
                      </div>
                    </div>
                    
                    {/* Chapters */}
                    {unit.chapters && unit.chapters.length > 0 ? (
                      <div className="divide-y divide-gray-200 dark:divide-gray-700">
                        {unit.chapters.map((chapter) => (
                          <div key={chapter.id} className="px-4 py-3">
                            <div className="flex justify-between items-center mb-2">
                              <h4 className="font-medium">{chapter.title}</h4>
                              <div className="flex space-x-2">
                                <Button
                                  variant="ghost"
                                  className="h-7 w-7 p-0"
                                  onClick={() => {
                                    setSelectedChapterData({
                                      unitId: unit.id,
                                      chapterId: chapter.id,
                                      chapter
                                    });
                                    setEditChapterDialogOpen(true);
                                  }}
                                >
                                  ✏️
                                </Button>
                                <Button
                                  variant="ghost"
                                  className="h-7 w-7 p-0 text-red-500"
                                  onClick={() => onDeleteChapter(unit.id, chapter.id)}
                                >
                                  🗑️
                                </Button>
                                <Button
                                  variant="ghost"
                                  onClick={() => {
                                    setAddSubtopicDialogOpen(true);
                                    setSelectedSubtopicData({
                                      unitId: unit.id,
                                      chapterId: chapter.id
                                    });
                                  }}
                                >
                                  + Subtopic
                                </Button>
                              </div>
                            </div>
                            
                            {/* Subtopics */}
                            {chapter.subtopics && chapter.subtopics.length > 0 ? (
                              <ul className="pl-6 space-y-2">
                                {chapter.subtopics.map((subtopic) => (
                                  <li key={subtopic.id} className="flex justify-between items-center">
                                    <span>{subtopic.title}</span>
                                    <div className="flex space-x-1">
                                      <Button
                                        variant="ghost"
                                        className="h-6 w-6 p-0"
                                        onClick={() => {
                                          setSelectedSubtopicData({
                                            unitId: unit.id,
                                            chapterId: chapter.id,
                                            subtopicId: subtopic.id,
                                            subtopic
                                          });
                                          setEditSubtopicDialogOpen(true);
                                        }}
                                      >
                                        ✏️
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        className="h-6 w-6 p-0 text-red-500"
                                        onClick={() => onDeleteSubtopic(unit.id, chapter.id, subtopic.id)}
                                      >
                                        🗑️
                                      </Button>
                                    </div>
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <p className="text-sm text-gray-500 dark:text-gray-400 pl-6">
                                No subtopics added yet.
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="px-4 py-3 text-gray-500 dark:text-gray-400">
                        No chapters added to this unit yet.
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 text-gray-500 dark:text-gray-400">
                No syllabus content added yet. Click "Add Unit" to get started.
              </div>
            )}
          </div>
        )}

        {/* Lectures Tab */}
        {selectedTab === 'lectures' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Lectures</h2>
              <Button
                onClick={() => setAddLectureDialogOpen(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                Add Lecture
              </Button>
            </div>
            
            {workingSubject.courseMaterials.lectures && workingSubject.courseMaterials.lectures.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {workingSubject.courseMaterials.lectures.map(lecture => renderLectureCard(lecture))}
              </div>
            ) : (
              <div className="text-center py-10 text-gray-500 dark:text-gray-400">
                No lectures added yet. Click "Add Lecture" to get started.
              </div>
            )}
          </div>
        )}

        {/* Readings Tab */}
        {selectedTab === 'readings' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Reading Materials</h2>
              <Button
                onClick={() => setAddReadingDialogOpen(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                Add Reading
              </Button>
            </div>
            
            {workingSubject.courseMaterials.readings && workingSubject.courseMaterials.readings.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {workingSubject.courseMaterials.readings.map(reading => renderReadingCard(reading))}
              </div>
            ) : (
              <div className="text-center py-10 text-gray-500 dark:text-gray-400">
                No reading materials added yet. Click "Add Reading" to get started.
              </div>
            )}
          </div>
        )}

        {/* Assignments Tab */}
        {selectedTab === 'assignments' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Assignments</h2>
              <Button
                onClick={() => setAddAssignmentDialogOpen(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                Add Assignment
              </Button>
            </div>
            
            {workingSubject.courseMaterials.assignments && workingSubject.courseMaterials.assignments.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {workingSubject.courseMaterials.assignments.map(assignment => renderAssignmentCard(assignment))}
              </div>
            ) : (
              <div className="text-center py-10 text-gray-500 dark:text-gray-400">
                No assignments added yet. Click "Add Assignment" to get started.
              </div>
            )}
          </div>
        )}

        {/* Notes Tab */}
        {selectedTab === 'notes' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Notes</h2>
              <Button
                onClick={() => setAddNoteDialogOpen(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                Add Note
              </Button>
            </div>
            
            {workingSubject.notes && workingSubject.notes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {workingSubject.notes.map(note => renderNoteCard(note))}
              </div>
            ) : (
              <div className="text-center py-10 text-gray-500 dark:text-gray-400">
                No notes added yet. Click "Add Note" to get started.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Dialogs */}
      {/* Unit Dialogs */}
      <AddUnitDialog 
        isOpen={addUnitDialogOpen} 
        onClose={() => setAddUnitDialogOpen(false)}
        onAddUnit={onAddUnit}
      />
      
      <EditUnitDialog 
        isOpen={editUnitDialogOpen} 
        onClose={() => setEditUnitDialogOpen(false)}
        unit={selectedUnit}
        onUpdateUnit={(updatedUnit) => {
          if (selectedUnit) {
            onUpdateUnit({...selectedUnit, ...updatedUnit});
          }
        }}
      />
      
      {/* Chapter Dialogs */}
      <AddChapterDialog 
        isOpen={addChapterDialogOpen} 
        onClose={() => setAddChapterDialogOpen(false)} 
        onAddChapter={onAddChapter}
      />
      
      <EditChapterDialog 
        isOpen={editChapterDialogOpen} 
        onClose={() => setEditChapterDialogOpen(false)}
        chapter={selectedChapterData?.chapter}
        onUpdateChapter={(updatedChapter) => {
          if (selectedChapterData?.chapter) {
            onUpdateChapter({...selectedChapterData.chapter, ...updatedChapter});
          }
        }}
      />
      
      {/* Subtopic Dialogs */}
      <AddSubtopicDialog 
        isOpen={addSubtopicDialogOpen} 
        onClose={() => setAddSubtopicDialogOpen(false)}
        onAddSubtopic={onAddSubtopic}
      />
      
      <EditSubtopicDialog 
        isOpen={editSubtopicDialogOpen} 
        onClose={() => setEditSubtopicDialogOpen(false)}
        subtopic={selectedSubtopicData?.subtopic}
        onUpdateSubtopic={(updatedSubtopic) => {
          if (selectedSubtopicData?.subtopic) {
            onUpdateSubtopic({...selectedSubtopicData.subtopic, ...updatedSubtopic});
          }
        }}
      />
      
      {/* Lecture Dialogs */}
      <AddLectureDialog 
        isOpen={addLectureDialogOpen} 
        onClose={() => setAddLectureDialogOpen(false)}
        onAddLecture={onAddLecture}
      />
      
      <EditLectureDialog 
        isOpen={editLectureDialogOpen} 
        onClose={() => setEditLectureDialogOpen(false)}
        lecture={selectedLecture}
        onUpdateLecture={(updatedLecture) => {
          if (selectedLecture) {
            onUpdateLecture({...selectedLecture, ...updatedLecture});
          }
        }}
      />
      
      {/* Reading Dialogs */}
      <AddReadingDialog 
        isOpen={addReadingDialogOpen} 
        onClose={() => setAddReadingDialogOpen(false)}
        onAddReading={onAddReading}
      />
      
      <EditReadingDialog 
        isOpen={editReadingDialogOpen} 
        onClose={() => setEditReadingDialogOpen(false)}
        reading={selectedReading}
        onUpdateReading={(updatedReading) => {
          if (selectedReading) {
            onUpdateReading({...selectedReading, ...updatedReading});
          }
        }}
      />
      
      {/* Assignment Dialogs */}
      <AddAssignmentDialog 
        isOpen={addAssignmentDialogOpen} 
        onClose={() => setAddAssignmentDialogOpen(false)}
        onAddAssignment={onAddAssignment}
      />
      
      <EditAssignmentDialog 
        isOpen={editAssignmentDialogOpen} 
        onClose={() => setEditAssignmentDialogOpen(false)}
        assignment={selectedAssignment}
        onUpdateAssignment={(updatedAssignment) => {
          if (selectedAssignment) {
            onUpdateAssignment({...selectedAssignment, ...updatedAssignment});
          }
        }}
      />
      
      {/* Note Dialogs */}
      <AddNoteDialog 
        isOpen={addNoteDialogOpen} 
        onClose={() => setAddNoteDialogOpen(false)}
        onAddNote={onAddNote}
      />
      
      <EditNoteDialog 
        isOpen={editNoteDialogOpen} 
        onClose={() => setEditNoteDialogOpen(false)}
        note={selectedNoteForEdit}
        onUpdateNote={(updatedNote) => {
          if (selectedNoteForEdit) {
            onUpdateNote({...selectedNoteForEdit, ...updatedNote});
          }
        }}
      />
    </div>
  );
};

export default SubjectContent; 