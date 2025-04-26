import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Button } from '../../../components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../../components/ui/dialog';
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

const SubjectContent = ({ subject, updateSubject, favorites, toggleFavorite }) => {
  const [selectedTab, setSelectedTab] = useState('syllabus');
  const [selectedNote, setSelectedNote] = useState(null);
  
  // Dialog states
  const [addUnitDialogOpen, setAddUnitDialogOpen] = useState(false);
  const [editUnitDialogOpen, setEditUnitDialogOpen] = useState(false);
  const [selectedUnitIndex, setSelectedUnitIndex] = useState(null);
  
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

  // Check if an item is favorited
  const isFavorited = (type, id) => {
    const favoriteId = `${type}_${subject.id}_${id}`;
    return favorites.includes(favoriteId);
  };

  // Handle favorite toggle
  const handleToggleFavorite = (type, id) => {
    toggleFavorite(type, subject.id, id);
  };
  
  // Handle sync with parent component
  const handleSyncWithParent = (updatedSubject) => {
    // Send updated subject back to parent component
    updateSubject(updatedSubject);
  };
  
  // ===== SYLLABUS CRUD OPERATIONS =====
  
  const handleAddUnit = (newUnit) => {
    const updatedSyllabus = { ...subject.courseMaterials.syllabus };
    if (!updatedSyllabus.sections) {
      updatedSyllabus.sections = [];
    }
    updatedSyllabus.sections.push({
      ...newUnit,
      chapters: []
    });
    
    const updatedSubject = { ...subject, courseMaterials: { ...subject.courseMaterials, syllabus: updatedSyllabus } };
    handleSyncWithParent(updatedSubject);
    toast.success(`Unit "${newUnit.title}" added successfully!`);
  };
  
  const handleUpdateUnit = (updatedUnit) => {
    const updatedSyllabus = { ...subject.courseMaterials.syllabus };
    updatedSyllabus.sections[selectedUnitIndex] = {
      ...updatedSyllabus.sections[selectedUnitIndex],
      title: updatedUnit.title,
      weeks: updatedUnit.weeks
    };
    
    const updatedSubject = { ...subject, courseMaterials: { ...subject.courseMaterials, syllabus: updatedSyllabus } };
    handleSyncWithParent(updatedSubject);
    // toast.success(`Unit "${updatedUnit.title}" updated successfully!`);
  };
  
  const handleAddChapter = (newChapter) => {
    const updatedSyllabus = { ...subject.courseMaterials.syllabus };
    if (!updatedSyllabus.sections[selectedChapterData.unitIndex].chapters) {
      updatedSyllabus.sections[selectedChapterData.unitIndex].chapters = [];
    }
    updatedSyllabus.sections[selectedChapterData.unitIndex].chapters.push({
      ...newChapter,
      subtopics: []
    });
    
    const updatedSubject = { ...subject, courseMaterials: { ...subject.courseMaterials, syllabus: updatedSyllabus } };
    handleSyncWithParent(updatedSubject);
    toast.success(`Chapter "${newChapter.title}" added successfully!`);
  };
  
  const handleUpdateChapter = (updatedChapter) => {
    if (!selectedUnit) return;
    
    // Create a deep copy of the current subject
    const updatedSubject = JSON.parse(JSON.stringify(subject));
    
    // Find the unit containing the chapter
    const unitIndex = updatedSubject.courseMaterials.syllabus.sections.findIndex(
      unit => unit.title === selectedUnit.title
    );
    
    if (unitIndex === -1) return;
    
    // Find the chapter within the unit
    const chapterIndex = updatedSubject.courseMaterials.syllabus.sections[unitIndex].chapters.findIndex(
      chapter => chapter.title === selectedChapter.title
    );
    
    if (chapterIndex === -1) return;
    
    // Update the chapter
    updatedSubject.courseMaterials.syllabus.sections[unitIndex].chapters[chapterIndex] = updatedChapter;
    
    // Update the state
    handleSyncWithParent(updatedSubject);
    
    // Reset selection and close dialog
    setSelectedChapter(null);
    setEditChapterDialogOpen(false);
    
    // Show success toast
    // toast.success("Chapter updated successfully!");
  };
  
  const handleAddSubtopic = (newSubtopic) => {
    const updatedSyllabus = { ...subject.courseMaterials.syllabus };
    const unitIndex = selectedSubtopicData.unitIndex;
    const chapterIndex = selectedSubtopicData.chapterIndex;
    
    if (!updatedSyllabus.sections[unitIndex].chapters[chapterIndex].subtopics) {
      updatedSyllabus.sections[unitIndex].chapters[chapterIndex].subtopics = [];
    }
    
    updatedSyllabus.sections[unitIndex].chapters[chapterIndex].subtopics.push(newSubtopic.title);
    
    const updatedSubject = { ...subject, courseMaterials: { ...subject.courseMaterials, syllabus: updatedSyllabus } };
    handleSyncWithParent(updatedSubject);
    toast.success(`Subtopic "${newSubtopic.title}" added successfully!`);
  };
  
  const handleUpdateSubtopic = (updatedContent) => {
    const updatedSyllabus = { ...subject.courseMaterials.syllabus };
    const unitIndex = selectedSubtopicData.unitIndex;
    const chapterIndex = selectedSubtopicData.chapterIndex;
    const subtopicIndex = selectedSubtopicData.subtopicIndex;
    
    updatedSyllabus.sections[unitIndex].chapters[chapterIndex].subtopics[subtopicIndex] = updatedContent.title;
    
    const updatedSubject = { ...subject, courseMaterials: { ...subject.courseMaterials, syllabus: updatedSyllabus } };
    handleSyncWithParent(updatedSubject);
    // toast.success(`Subtopic updated successfully!`);
  };
  
  // ===== LECTURE CRUD OPERATIONS =====
  
  const handleAddLecture = (lectureData) => {
    const lectureId = `lecture_${Date.now()}`;
    const newLecture = {
      id: lectureId,
      title: lectureData.title,
      date: lectureData.date,
      content: lectureData.content,
      attachments: lectureData.attachments || []
    };
    
    let updatedCourseMaterials = { ...subject.courseMaterials };
    if (!updatedCourseMaterials.lectures) {
      updatedCourseMaterials.lectures = [];
    }
    
    updatedCourseMaterials.lectures = [...updatedCourseMaterials.lectures, newLecture];
    
    const updatedSubject = { ...subject, courseMaterials: updatedCourseMaterials };
    handleSyncWithParent(updatedSubject);
    toast.success(`Lecture "${lectureData.title}" added successfully!`);
  };
  
  const handleUpdateLecture = (updatedLecture) => {
    if (!selectedLecture) return;
    
    const updatedCourseMaterials = { ...subject.courseMaterials };
    const lectureIndex = updatedCourseMaterials.lectures.findIndex(lecture => lecture.id === selectedLecture.id);
    
    if (lectureIndex !== -1) {
      updatedCourseMaterials.lectures[lectureIndex] = {
        ...updatedCourseMaterials.lectures[lectureIndex],
        title: updatedLecture.title,
        date: updatedLecture.date,
        content: updatedLecture.content,
        attachments: updatedLecture.attachments || []
      };
      
      const updatedSubject = { ...subject, courseMaterials: updatedCourseMaterials };
      handleSyncWithParent(updatedSubject);
      // toast.success(`Lecture "${updatedLecture.title}" updated successfully!`);
    }
  };
  
  // ===== READING CRUD OPERATIONS =====
  
  const handleAddReading = (readingData) => {
    const readingId = `reading_${Date.now()}`;
    const newReading = {
      id: readingId,
      title: readingData.title,
      author: readingData.author,
      type: readingData.type,
      chapters: readingData.chapters,
      source: readingData.source,
      length: readingData.length
    };
    
    let updatedCourseMaterials = { ...subject.courseMaterials };
    if (!updatedCourseMaterials.readings) {
      updatedCourseMaterials.readings = [];
    }
    
    updatedCourseMaterials.readings = [...updatedCourseMaterials.readings, newReading];
    
    const updatedSubject = { ...subject, courseMaterials: updatedCourseMaterials };
    handleSyncWithParent(updatedSubject);
    toast.success(`Reading "${readingData.title}" added successfully!`);
  };
  
  const handleUpdateReading = (updatedReading) => {
    if (!selectedReading) return;
    
    const updatedCourseMaterials = { ...subject.courseMaterials };
    const readingIndex = updatedCourseMaterials.readings.findIndex(reading => reading.id === selectedReading.id);
    
    if (readingIndex !== -1) {
      updatedCourseMaterials.readings[readingIndex] = {
        ...updatedCourseMaterials.readings[readingIndex],
        title: updatedReading.title,
        author: updatedReading.author,
        type: updatedReading.type,
        chapters: updatedReading.chapters,
        source: updatedReading.source,
        length: updatedReading.length
      };
      
      const updatedSubject = { ...subject, courseMaterials: updatedCourseMaterials };
      handleSyncWithParent(updatedSubject);
      // toast.success(`Reading "${updatedReading.title}" updated successfully!`);
    }
  };
  
  // ===== ASSIGNMENT CRUD OPERATIONS =====
  
  const handleAddAssignment = (assignmentData) => {
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
    
    const updatedSubject = { ...subject, courseMaterials: updatedCourseMaterials };
    handleSyncWithParent(updatedSubject);
    toast.success(`Assignment "${assignmentData.title}" added successfully!`);
  };
  
  const handleUpdateAssignment = (updatedAssignment) => {
    if (!selectedAssignment) return;
    
    const updatedCourseMaterials = { ...subject.courseMaterials };
    const assignmentIndex = updatedCourseMaterials.assignments.findIndex(assignment => assignment.id === selectedAssignment.id);
    
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
      
      const updatedSubject = { ...subject, courseMaterials: updatedCourseMaterials };
      handleSyncWithParent(updatedSubject);
      // toast.success(`Assignment "${updatedAssignment.title}" updated successfully!`);
    }
  };
  
  // ===== NOTES CRUD OPERATIONS =====
  
  const handleAddNote = (newNote) => {
    const noteId = `note_${Date.now()}`;
    const note = {
      id: noteId,
      title: newNote.title,
      content: newNote.content,
      date: new Date().toISOString().split('T')[0]
    };
    
    let updatedSubject = { ...subject };
    if (!updatedSubject.notes) {
      updatedSubject.notes = [];
    }
    
    updatedSubject.notes = [...updatedSubject.notes, note];
    handleSyncWithParent(updatedSubject);
    toast.success(`Note "${note.title}" added successfully!`);
  };
  
  const handleUpdateNote = (updatedNote) => {
    if (!selectedNoteForEdit) return;
    
    let updatedSubject = { ...subject };
    const noteIndex = updatedSubject.notes.findIndex(note => note.id === selectedNoteForEdit.id);
    
    if (noteIndex !== -1) {
      updatedSubject.notes[noteIndex] = {
        ...updatedSubject.notes[noteIndex],
        title: updatedNote.title,
        content: updatedNote.content
      };
      
      handleSyncWithParent(updatedSubject);
      // toast.success(`Note "${updatedNote.title}" updated successfully!`);
    }
  };
  
  // ===== DELETE OPERATIONS =====
  
  const handleDeleteLecture = (lectureId) => {
    const lecture = subject.courseMaterials.lectures.find(l => l.id === lectureId);
    const updatedCourseMaterials = { ...subject.courseMaterials };
    updatedCourseMaterials.lectures = updatedCourseMaterials.lectures.filter(lecture => lecture.id !== lectureId);
    
    const updatedSubject = { ...subject, courseMaterials: updatedCourseMaterials };
    handleSyncWithParent(updatedSubject);
    toast.success(`Lecture ${lecture?.title || ''} deleted successfully!`);
  };
  
  const handleDeleteReading = (readingId) => {
    const reading = subject.courseMaterials.readings.find(r => r.id === readingId);
    const updatedCourseMaterials = { ...subject.courseMaterials };
    updatedCourseMaterials.readings = updatedCourseMaterials.readings.filter(reading => reading.id !== readingId);
    
    const updatedSubject = { ...subject, courseMaterials: updatedCourseMaterials };
    handleSyncWithParent(updatedSubject);
    toast.success(`Reading "${reading?.title || ''}" deleted successfully!`);
  };
  
  const handleDeleteAssignment = (assignmentId) => {
    const assignment = subject.courseMaterials.assignments.find(a => a.id === assignmentId);
    const updatedCourseMaterials = { ...subject.courseMaterials };
    updatedCourseMaterials.assignments = updatedCourseMaterials.assignments.filter(assignment => assignment.id !== assignmentId);
    
    const updatedSubject = { ...subject, courseMaterials: updatedCourseMaterials };
    handleSyncWithParent(updatedSubject);
    toast.success(`Assignment "${assignment?.title || ''}" deleted successfully!`);
  };
  
  const handleDeleteNote = (noteId) => {
    const note = subject.notes.find(n => n.id === noteId);
    let updatedSubject = { ...subject };
    updatedSubject.notes = updatedSubject.notes.filter(note => note.id !== noteId);
    
    handleSyncWithParent(updatedSubject);
    toast.success(`Note "${note?.title || ''}" deleted successfully!`);
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
              onClick={() => handleDeleteLecture(lecture.id)}
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
              onClick={() => handleDeleteReading(reading.id)}
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
              onClick={() => handleDeleteAssignment(assignment.id)}
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

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-2xl font-bold mb-6">{subject.name}</h1>
      
      {/* Tab Navigation */}
      <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
        <div className="flex space-x-4">
          <button
            className={`py-2 px-4 text-sm font-medium ${selectedTab === 'syllabus' ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'}`}
            onClick={() => setSelectedTab('syllabus')}
          >
            Syllabus
          </button>
          <button
            className={`py-2 px-4 text-sm font-medium ${selectedTab === 'notes' ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'}`}
            onClick={() => setSelectedTab('notes')}
          >
            Notes
          </button>
        </div>
      </div>

      {/* Course Materials Tab */}
      <div>
        {/* Materials Navigation */}
        <div className="flex flex-wrap gap-2 mb-6">
          <Button
            variant={selectedTab === 'syllabus' ? 'default' : 'outline'}
            onClick={() => setSelectedTab('syllabus')}
          >
            Syllabus
          </Button>
          <Button
            variant={selectedTab === 'lectures' ? 'default' : 'outline'}
            onClick={() => setSelectedTab('lectures')}
          >
            Lecture Notes
          </Button>
          <Button
            variant={selectedTab === 'readings' ? 'default' : 'outline'}
            onClick={() => setSelectedTab('readings')}
          >
            Reading Materials
          </Button>
          <Button
            variant={selectedTab === 'assignments' ? 'default' : 'outline'}
            onClick={() => setSelectedTab('assignments')}
          >
            Assignments
          </Button>
        </div>

        {/* Syllabus Section */}
        {selectedTab === 'syllabus' && (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold mb-4">{subject.courseMaterials.syllabus.title}</h2>
            <p className="mb-4 text-gray-700 dark:text-gray-300">{subject.courseMaterials.syllabus.content}</p>
            
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium text-lg">Course Schedule</h3>
              <Button 
                size="sm" 
                variant="outline"
                className="flex items-center gap-1"
                onClick={() => setAddUnitDialogOpen(true)}
              >
                <span>Add Unit</span>
                <span className="text-lg">+</span>
              </Button>
            </div>

            <div className="space-y-4">
              {subject.courseMaterials.syllabus.sections.map((section, sectionIndex) => (
                <div key={sectionIndex} className="border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden">
                  {/* Unit Header */}
                  <div className="p-3 bg-gray-50 dark:bg-gray-700 flex justify-between items-center">
                    <div className="font-medium">{section.title}</div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Weeks {section.weeks}</span>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="h-7 w-7 p-0"
                        onClick={() => {
                          setSelectedUnitIndex(sectionIndex);
                          setEditUnitDialogOpen(true);
                        }}
                      >
                        ✏️
                      </Button>
                    </div>
                  </div>
                  
                  {/* Chapters */}
                  <div className="p-3 space-y-3">
                    {section.chapters && section.chapters.map((chapter, chapterIndex) => (
                      <div key={chapterIndex} className="ml-4">
                        <details className="cursor-pointer group">
                          <summary className="font-medium text-sm flex items-center justify-between py-1">
                            <span>{chapter.title}</span>
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button 
                                className="text-xs text-blue-600 dark:text-blue-400"
                                onClick={(e) => {
                                  e.preventDefault();
                                  setSelectedUnitIndex(sectionIndex);
                                  setSelectedChapterData({ unitIndex, chapterIndex });
                                  setEditChapterDialogOpen(true);
                                }}
                              >
                                Edit
                              </button>
                            </div>
                          </summary>
                          <ul className="mt-2 space-y-1 ml-6 text-sm text-gray-600 dark:text-gray-300">
                            {chapter.subtopics && chapter.subtopics.map((subtopic, subtopicIndex) => (
                              <li key={subtopicIndex} className="flex items-center justify-between group/item">
                                <span>• {subtopic}</span>
                                <button 
                                  className="text-xs text-blue-600 dark:text-blue-400 opacity-0 group-hover/item:opacity-100 transition-opacity"
                                  onClick={() => {
                                    setSelectedUnitIndex(sectionIndex);
                                    setSelectedSubtopicData({ unitIndex, chapterIndex, subtopicIndex });
                                    setEditSubtopicDialogOpen(true);
                                  }}
                                >
                                  Edit
                                </button>
                              </li>
                            ))}
                            <li className="mt-2">
                              <button 
                                className="text-xs text-blue-600 dark:text-blue-400 flex items-center gap-1"
                                onClick={() => {
                                  setSelectedUnitIndex(sectionIndex);
                                  setAddChapterDialogOpen(true);
                                }}
                              >
                                <span>+ Add Subtopic</span>
                              </button>
                            </li>
                          </ul>
                        </details>
                      </div>
                    ))}
                    <div className="ml-4 mt-2">
                      <button 
                        className="text-sm text-blue-600 dark:text-blue-400 flex items-center gap-1"
                        onClick={() => {
                          setSelectedUnitIndex(sectionIndex);
                          setAddChapterDialogOpen(true);
                        }}
                      >
                        <span>+ Add Chapter</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Lectures Section */}
        {selectedTab === 'lectures' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Lecture Notes</h2>
              <Button 
                size="sm" 
                variant="outline" 
                className="flex items-center gap-1"
                onClick={() => setAddLectureDialogOpen(true)}
              >
                <span>Add Lecture</span>
                <span className="text-lg">+</span>
              </Button>
            </div>
            
            {subject.courseMaterials.lectures && subject.courseMaterials.lectures.length > 0 ? (
              <div className="space-y-4">
                {subject.courseMaterials.lectures.map((lecture) => renderLectureCard(lecture))}
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 p-8 rounded-lg border border-gray-200 dark:border-gray-700 text-center">
                <p className="text-gray-500 dark:text-gray-400">No lectures added yet.</p>
                <Button 
                  className="mt-4"
                  onClick={() => setAddLectureDialogOpen(true)}
                >
                  Add Your First Lecture
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Readings Section */}
        {selectedTab === 'readings' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Reading Materials</h2>
              <Button 
                size="sm" 
                variant="outline" 
                className="flex items-center gap-1"
                onClick={() => setAddReadingDialogOpen(true)}
              >
                <span>Add Reading</span>
                <span className="text-lg">+</span>
              </Button>
            </div>
            
            {subject.courseMaterials.readings && subject.courseMaterials.readings.length > 0 ? (
              <div className="space-y-4">
                {subject.courseMaterials.readings.map((reading) => renderReadingCard(reading))}
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 p-8 rounded-lg border border-gray-200 dark:border-gray-700 text-center">
                <p className="text-gray-500 dark:text-gray-400">No reading materials added yet.</p>
                <Button 
                  className="mt-4"
                  onClick={() => setAddReadingDialogOpen(true)}
                >
                  Add Your First Reading Material
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Assignments Section */}
        {selectedTab === 'assignments' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Assignments</h2>
              <Button 
                variant="outline" 
                className="flex items-center gap-1"
                onClick={() => setAddAssignmentDialogOpen(true)}
              >
                <span>Add Assignment</span>
                <span>+</span>
              </Button>
            </div>
            
            {subject.courseMaterials.assignments && subject.courseMaterials.assignments.length > 0 ? (
              <div className="grid gap-4">
                {subject.courseMaterials.assignments.map((assignment) => renderAssignmentCard(assignment))}
              </div>
            ) : (
              <div className="bg-gray-50 dark:bg-gray-900 p-6 text-center border border-gray-200 dark:border-gray-700 rounded-md">
                <p className="text-gray-500 dark:text-gray-400 mb-4">No assignments added yet</p>
                <Button 
                  className="mt-4"
                  onClick={() => setAddAssignmentDialogOpen(true)}
                >
                  Add Your First Assignment
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Notes Tab */}
      {selectedTab === 'notes' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Notes</h2>
            <Button 
              variant="outline" 
              className="flex items-center gap-1"
              onClick={() => setAddNoteDialogOpen(true)}
            >
              <span>Add Note</span>
              <span>+</span>
            </Button>
          </div>
          
          {subject.notes && subject.notes.length > 0 ? (
            <div className="grid gap-4">
              {subject.notes.map((note) => (
                <div 
                  key={note.id} 
                  className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-medium">{note.title}</h3>
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
                        onClick={() => handleDeleteNote(note.id)}
                      >
                        🗑️
                      </Button>
                      <Button
                        variant="ghost"
                        className={`h-7 w-7 p-0 ${isFavorited('note', note.id) ? 'text-yellow-500' : 'text-gray-400'}`}
                        onClick={() => handleToggleFavorite('note', note.id)}
                      >
                        ⭐
                      </Button>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                    {note.date && new Date(note.date).toLocaleDateString()}
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">{note.content}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 dark:bg-gray-900 p-6 text-center border border-gray-200 dark:border-gray-700 rounded-md">
              <p className="text-gray-500 dark:text-gray-400 mb-4">No notes added yet</p>
              <Button 
                className="mt-4"
                onClick={() => setAddNoteDialogOpen(true)}
              >
                Add Your First Note
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Syllabus Dialogs */}
      <AddUnitDialog 
        isOpen={addUnitDialogOpen} 
        onClose={() => setAddUnitDialogOpen(false)} 
        onAddUnit={handleAddUnit} 
      />
      
      <EditUnitDialog 
        isOpen={editUnitDialogOpen} 
        onClose={() => setEditUnitDialogOpen(false)} 
        unit={selectedUnitIndex !== null ? subject.courseMaterials.syllabus.sections[selectedUnitIndex] : null}
        onUpdateUnit={handleUpdateUnit} 
      />
      
      <AddChapterDialog 
        isOpen={addChapterDialogOpen} 
        onClose={() => setAddChapterDialogOpen(false)} 
        onAddChapter={handleAddChapter} 
      />
      
      <EditChapterDialog 
        isOpen={editChapterDialogOpen} 
        onClose={() => setEditChapterDialogOpen(false)} 
        chapter={selectedUnitIndex !== null && selectedChapterData !== null && subject.courseMaterials.syllabus.sections[selectedUnitIndex].chapters ? 
          subject.courseMaterials.syllabus.sections[selectedUnitIndex].chapters[selectedChapterData.chapterIndex] : null}
        onUpdateChapter={handleUpdateChapter} 
      />
      
      <AddSubtopicDialog 
        isOpen={addSubtopicDialogOpen} 
        onClose={() => setAddSubtopicDialogOpen(false)} 
        onAddSubtopic={handleAddSubtopic} 
      />
      
      <EditSubtopicDialog 
        isOpen={editSubtopicDialogOpen} 
        onClose={() => setEditSubtopicDialogOpen(false)} 
        subtopic={
          selectedUnitIndex !== null && 
          selectedChapterData !== null && 
          selectedSubtopicData !== null && 
          subject.courseMaterials.syllabus.sections[selectedUnitIndex].chapters && 
          subject.courseMaterials.syllabus.sections[selectedUnitIndex].chapters[selectedChapterData.chapterIndex].subtopics ? 
            subject.courseMaterials.syllabus.sections[selectedUnitIndex].chapters[selectedChapterData.chapterIndex].subtopics[selectedSubtopicData.subtopicIndex] : null
        }
        onUpdateSubtopic={handleUpdateSubtopic} 
      />
      
      {/* Lecture Dialogs */}
      <AddLectureDialog
        isOpen={addLectureDialogOpen}
        onClose={() => setAddLectureDialogOpen(false)}
        onAddLecture={handleAddLecture}
      />
      
      <EditLectureDialog
        isOpen={editLectureDialogOpen}
        onClose={() => setEditLectureDialogOpen(false)}
        lecture={selectedLecture !== null && subject.courseMaterials.lectures ? 
          subject.courseMaterials.lectures.find(l => l.id === selectedLecture.id) : null}
        onUpdateLecture={handleUpdateLecture}
      />
      
      {/* Reading Dialogs */}
      <AddReadingDialog
        isOpen={addReadingDialogOpen}
        onClose={() => setAddReadingDialogOpen(false)}
        onAddReading={handleAddReading}
      />
      
      <EditReadingDialog
        isOpen={editReadingDialogOpen}
        onClose={() => setEditReadingDialogOpen(false)}
        reading={selectedReading !== null && subject.courseMaterials.readings ? 
          subject.courseMaterials.readings.find(r => r.id === selectedReading.id) : null}
        onUpdateReading={handleUpdateReading}
      />
      
      {/* Assignment Dialogs */}
      <AddAssignmentDialog
        isOpen={addAssignmentDialogOpen}
        onClose={() => setAddAssignmentDialogOpen(false)}
        onAddAssignment={handleAddAssignment}
      />
      
      <EditAssignmentDialog
        isOpen={editAssignmentDialogOpen}
        onClose={() => setEditAssignmentDialogOpen(false)}
        assignment={selectedAssignment !== null && subject.courseMaterials.assignments ? 
          subject.courseMaterials.assignments.find(a => a.id === selectedAssignment.id) : null}
        onUpdateAssignment={handleUpdateAssignment}
      />
      
      {/* Note Dialogs */}
      <AddNoteDialog
        isOpen={addNoteDialogOpen}
        onClose={() => setAddNoteDialogOpen(false)}
        onAddNote={handleAddNote}
      />
      
      <EditNoteDialog
        isOpen={editNoteDialogOpen}
        onClose={() => setEditNoteDialogOpen(false)}
        note={selectedNoteForEdit !== null && subject.notes ? subject.notes.find(n => n.id === selectedNoteForEdit.id) : null}
        onUpdateNote={handleUpdateNote}
      />
    </div>
  );
};

export default SubjectContent; 