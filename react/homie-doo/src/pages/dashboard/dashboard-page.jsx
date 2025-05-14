import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'sonner';
import { useAuth } from '../../context/AuthContext';
import { SubjectModel } from '../../models/subjectModel';
import useSubjectStore from '../../store/subjectStore';
import Sidebar from './components/Sidebar';
import DashboardContent from './components/DashboardContent';

const DashboardPage = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Use Zustand store instead of local state
  const { 
    subjects, 
    favorites, 
    todo, 
    loading, 
    activeSubject,
    fetchSubjects, 
    addSubject, 
    deleteSubject, 
    updateSubject, 
    toggleFavorite,
    setActiveSubject,
    clearActiveSubject
  } = useSubjectStore();
  
  // State to track selected view (subject, todo, or favorites)
  const [selectedView, setSelectedView] = useState({
    type: null, // can be 'subject', 'todo', or 'favorites'
    id: null // subject id if type is 'subject'
  });

  const [classesExpanded, setClassesExpanded] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // Fetch subjects and other data when the component mounts
  useEffect(() => {
    fetchSubjects();
  }, [fetchSubjects]);
  
  // Update active subject when selected view changes
  useEffect(() => {
    if (selectedView.type === 'subject' && selectedView.id) {
      setActiveSubject(selectedView.id);
    } else {
      clearActiveSubject();
    }
  }, [selectedView, setActiveSubject, clearActiveSubject]);
 
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
    const result = await addSubject(newSubject);
    if (result && result.id) {
      // Set the new subject as the selected view
      setSelectedView({
        type: 'subject',
        id: result.id
      });
    }
    return result;
  };

  const handleDeleteSubject = async (subjectId) => {
    await deleteSubject(subjectId);
    
    // If the deleted subject was active, clear it
    if (activeSubject?.id === subjectId) {
      clearActiveSubject();
    }
    
    // If the deleted subject was selected, reset the view
    if (selectedView.type === 'subject' && selectedView.id === subjectId) {
      setSelectedView({ type: null, id: null });
    }
  };

  const handleUpdateSubject = async (updatedSubject) => {
    await updateSubject(updatedSubject);
  };

  const handleToggleFavorite = (docType, subjectId, docId) => {
    toggleFavorite(docType, subjectId, docId);
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

  const handleSelectAllNotes = () => {
    setSelectedView({
      type: 'allnotes',
      id: null
    });
  };

  const handleSelectSubject = (subjectId) => {
    setSelectedView({
      type: 'subject',
      id: subjectId
    });
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
          onSelectAllNotes={handleSelectAllNotes}
          onAddSubject={handleAddSubject}
          isDarkMode={isDarkMode}
          toggleDarkMode={toggleDarkMode}
          onDeleteSubject={handleDeleteSubject}
        />
        
        {/* Dashboard Content Component */}
        <DashboardContent 
          subjects={subjects}
          activeSubject={activeSubject}
          selectedView={selectedView}
          updateSubject={handleUpdateSubject}
          favorites={favorites}
          toggleFavorite={handleToggleFavorite}
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
