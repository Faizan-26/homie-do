import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'sonner';
import Sidebar from './components/Sidebar';
import DashboardContent from './components/DashboardContent';
import { useAuth } from '../../context/AuthContext';
import subjectService from '../../services/subjectService';
import SubjectModel from '../../models/subjectModel';


const DashboardPage = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State to track selected view (subject, todo, or favorites)
  const [selectedView, setSelectedView] = useState({
    type: null, // can be 'subject', 'todo', or 'favorites'
    id: null // subject id if type is 'subject'
  });
  
  // State to track which documents are favorited
  const [favorites, setFavorites] = useState(() => {
    // Load favorites from localStorage
    const savedFavorites = localStorage.getItem('favorites');
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });
  
  const [classesExpanded, setClassesExpanded] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // Fetch subjects and other data when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch subjects from API using our new service
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
            icon: '📚', // Default icon
            color: getRandomSubjectColor(), // Function to generate a random color
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
        
        setSubjects(processedSubjects);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load data. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Save favorites to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);
  
  const handleResize = () => {
    const mobile = window.innerWidth < 768;
    setIsMobile(mobile);
    
    if (mobile) {
      setSidebarOpen(false);
      setSidebarCollapsed(false);
    } else {
      setSidebarOpen(true);
    }
  };

  useEffect(() => {
    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const savedTheme = localStorage.getItem('theme');
    const savedSidebarState = localStorage.getItem('sidebarCollapsed');
    
    const shouldUseDarkMode = savedTheme === 'dark' || (!savedTheme && darkModeQuery.matches);
    setIsDarkMode(shouldUseDarkMode);
    
    // Only apply saved sidebar state on desktop
    if (savedSidebarState !== null && window.innerWidth >= 768) {
      setSidebarCollapsed(savedSidebarState === 'true');
    }
    
    if (shouldUseDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    handleResize();
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    
    // Update the document classes
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };
  
  const toggleSidebarCollapse = () => {
    // For mobile, toggle open/close
    if (isMobile) {
      setSidebarOpen(!sidebarOpen);
    } 
    // For desktop, toggle collapsed/expanded
    else {
      const newState = !sidebarCollapsed;
      setSidebarCollapsed(newState);
      localStorage.setItem('sidebarCollapsed', newState.toString());
    }
  };

  const handleAddSubject = async (newSubject) => {
    try {
      // Create a new empty subject model
      const subjectModel = SubjectModel.createEmpty(user?.id);
      
      // Update with user input
      subjectModel.name = newSubject.name;
      subjectModel.courseMaterials.syllabus.title = `${newSubject.name} Syllabus`;
      subjectModel.courseMaterials.syllabus.content = newSubject.description || '';
      
      // Create subject using our service
      const createdSubject = await subjectService.createSubject(subjectModel.toBackend());
      
      // Format for UI
      const uiSubject = {
        id: createdSubject._id,
        name: createdSubject.name,
        description: newSubject.description || '',
        instructor: newSubject.instructor || '',
        icon: newSubject.icon || '📚',
        color: newSubject.color || getRandomSubjectColor(),
        courseMaterials: {
          syllabus: {
            id: createdSubject._id,
            title: `${createdSubject.name} Syllabus`,
            content: newSubject.description || '',
            sections: []
          },
          lectures: [],
          readings: [],
          assignments: []
        },
        notes: []
      };
      
      setSubjects([...subjects, uiSubject]);
      toast.success(`Subject "${newSubject.name}" added successfully!`);
      return uiSubject;
    } catch (error) {
      console.error('Error adding subject:', error);
      toast.error('Failed to add subject. Please try again.');
      return null;
    }
  };

  const handleDeleteSubject = async (subjectId) => {
    try {
      // Delete using the service
      await subjectService.deleteSubject(subjectId);
      
      // Update UI
      setSubjects(subjects.filter(subject => subject.id !== subjectId));
      
      // If the deleted subject was selected, reset the view
      if (selectedView.type === 'subject' && selectedView.id === subjectId) {
        setSelectedView({ type: null, id: null });
      }
      
      toast.success('Subject deleted successfully');
    } catch (error) {
      console.error('Error deleting subject:', error);
      toast.error('Failed to delete subject. Please try again.');
    }
  };

  const handleUpdateSubject = async (updatedSubject) => {
    try {
      // Prepare data for the API
      const apiSubject = {
        name: updatedSubject.name,
        courseMaterials: {
          syllabus: {
            title: updatedSubject.courseMaterials.syllabus.title,
            content: updatedSubject.courseMaterials.syllabus.content,
            units: updatedSubject.courseMaterials.syllabus.sections.map(section => ({
              title: section.title,
              weeks: section.weeks,
              chapters: section.chapters.map(chapter => ({
                title: chapter.title,
                subtopics: chapter.subtopics.map(subtopic => subtopic.title)
              }))
            }))
          },
          lectures: updatedSubject.courseMaterials.lectures.map(lecture => ({
            id: lecture.id,
            title: lecture.title,
            date: lecture.date,
            content: lecture.content,
            attachments: lecture.files || []
          })),
          readings: updatedSubject.courseMaterials.readings.map(reading => ({
            title: reading.title,
            type: reading.type,
            typeFieldOne: reading.typeFieldOne,
            typeFieldTwo: reading.typeFieldTwo,
            attachments: reading.files || []
          })),
          assignments: updatedSubject.courseMaterials.assignments.map(assignment => ({
            title: assignment.title,
            dueDate: assignment.dueDate,
            points: assignment.points,
            instructions: assignment.instructions,
            isCompleted: assignment.isCompleted,
            isFavorite: assignment.isFavorite,
            attachments: assignment.files || []
          }))
        },
        notes: updatedSubject.notes.map(note => ({
          id: note.id,
          title: note.title,
          date: note.date,
          content: note.content,
          tags: note.tags
        }))
      };
      
      // Update using the service
      await subjectService.updateSubject(updatedSubject.id, apiSubject);
      
      // Update UI
      setSubjects(subjects.map(subject => 
        subject.id === updatedSubject.id ? updatedSubject : subject
      ));
      
      toast.success('Subject updated successfully');
    } catch (error) {
      console.error('Error updating subject:', error);
      toast.error('Failed to update subject. Please try again.');
    }
  };

  const toggleFavorite = (docType, subjectId, docId) => {
    const favoriteId = `${docType}_${subjectId}_${docId}`;
    const newFavorites = [...favorites];
    
    const index = newFavorites.indexOf(favoriteId);
    if (index !== -1) {
      newFavorites.splice(index, 1);
    } else {
      newFavorites.push(favoriteId);
    }
    
    setFavorites(newFavorites);
  };

  const handleSelectTodo = () => {
    setSelectedView({
      type: 'todo',
      id: null
    });
  };

  const handleSelectFavorites = () => {
    setSelectedView({
      type: 'favorites',
      id: null
    });
  };

  const handleSelectSubject = (subjectId) => {
    setSelectedView({
      type: 'subject',
      id: subjectId
    });
  };

  // Helper function to generate random subject colors
  const getRandomSubjectColor = () => {
    const colors = [
      'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-200',
      'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-200',
      'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-200',
      'bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-200',
      'bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-200',
      'bg-pink-100 text-pink-600 dark:bg-pink-900 dark:text-pink-200',
      'bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-200'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };
  
  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      {loading && (
        <div className="fixed inset-0 bg-black/20 dark:bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl">
            <div className="flex items-center space-x-4">
              <div className="w-6 h-6 border-4 border-t-blue-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
              <span>Loading your subjects...</span>
            </div>
          </div>
        </div>
      )}
      
      <main className="flex-1 flex overflow-hidden">
        {/* Sidebar Component */}
        <Sidebar 
          subjects={subjects}
          sidebarOpen={sidebarOpen}
          sidebarCollapsed={sidebarCollapsed}
          toggleSidebar={toggleSidebarCollapse}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          classesExpanded={classesExpanded}
          setClassesExpanded={setClassesExpanded}
          selectedSubject={selectedView.type === 'subject' ? selectedView.id : null}
          setSelectedSubject={handleSelectSubject}
          onSelectTodo={handleSelectTodo}
          onSelectFavorites={handleSelectFavorites}
          onAddSubject={handleAddSubject}
          isDarkMode={isDarkMode}
          toggleDarkMode={toggleDarkMode}
          onDeleteSubject={handleDeleteSubject}
        />
        
        {/* Dashboard Content Component */}
        <DashboardContent 
          subjects={subjects}
          selectedView={selectedView}
          updateSubject={handleUpdateSubject}
          favorites={favorites}
          toggleFavorite={toggleFavorite}
          sidebarCollapsed={sidebarCollapsed}
          navigate={navigate}
          logout={logout}
        />
        
        {sidebarOpen && isMobile && (
          <div className="fixed inset-0 z-30 pointer-events-none">
            <div className="absolute left-0 top-0 bottom-0 w-60"></div>
            
            <div 
              className="absolute right-0 top-0 bottom-0 left-60 bg-black/10 pointer-events-auto"
              onClick={() => setSidebarOpen(false)}
            ></div>
          </div>
        )}
      </main>
      
      <Toaster position="top-right" />
    </div>
  );
};

export default DashboardPage;
