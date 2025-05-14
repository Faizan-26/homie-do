import React, { useEffect, useState } from 'react';
import { ScrollArea } from '../../../components/ui/scroll-area';
import { Button } from '../../../components/ui/button';
import { ChevronDownIcon, MagnifyingGlassIcon, MoonIcon, SunIcon, PlusIcon, StarIcon } from '@radix-ui/react-icons';
import { Avatar, AvatarFallback, AvatarImage } from '../../../components/ui/avatar';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import SidebarToggle from './SidebarToggle';
import AddSubjectDialog from './AddSubjectDialog';

const Sidebar = ({ 
  subjects, 
  sidebarOpen,
  sidebarCollapsed, 
  toggleSidebar,
  classesExpanded,
  setClassesExpanded,
  selectedSubject,
  setSelectedSubject,
  searchQuery,
  setSearchQuery,
  onAddSubject,
  onSelectTodo,
  onSelectFavorites,
  onSelectAllNotes,
  isDarkMode,
  toggleDarkMode,
  onDeleteSubject,
}) => {
  
  const [isMobile, setIsMobile] = useState(false);
  const [addSubjectOpen, setAddSubjectOpen] = useState(false);
  const [userName, setUserName] = useState("User");
  const [profilePicture, setProfilePicture] = useState(null);

  function getUserDetails() {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user) {
        setUserName(user.name);
        setProfilePicture(user.profilePicture);
      }
    } catch (error) {
      console.error("Error getting user details:", error);
    }
  }

  // Check if we're on mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    getUserDetails();
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Function to handle selecting a subject on mobile
  const handleSelectSubject = (subjectId) => {
    setSelectedSubject(subjectId);
    // Close sidebar on mobile when an option is selected
    if (isMobile) {
      toggleSidebar();
    }
  };

  const handleSelectAllNotes = () => {
    onSelectAllNotes(); // Use the provided handler
    // Close sidebar on mobile when an option is selected
    if (isMobile) {
      toggleSidebar();
    }
  };

  const handleSelectTodo = () => {
    onSelectTodo();
    if (isMobile) {
      toggleSidebar();
    }
  };

  const handleSelectFavorites = () => {
    onSelectFavorites();
    if (isMobile) {
      toggleSidebar();
    }
  };

  // Handle adding a new subject
  const handleAddSubject = (newSubject) => {
    onAddSubject(newSubject).then(result => {
      if (result && result.id) {
        setSelectedSubject(result.id);
      }
    });
  };

  return (
    <>
      {/* Mobile toggle button */}
      <div className={`
        fixed top-4 left-0 z-50
        transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-64' : 'translate-x-0'}
        md:hidden
      `}>
        <SidebarToggle 
          onClick={toggleSidebar} 
          isCollapsed={!sidebarOpen} 
          isMobile={true}
        />
      </div>
    
      <aside 
        className={`
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
          md:translate-x-0 
          fixed md:sticky 
          top-0 left-0
          h-screen
          z-40 
          transition-all duration-300 ease-in-out 
          ${isMobile ? 'w-64' : sidebarCollapsed ? 'md:w-16' : 'md:w-64 lg:w-72'} 
          bg-white dark:bg-gray-800 
          border-r border-gray-200 dark:border-gray-700 
          flex flex-col
          flex-shrink-0
          ${isMobile ? 'shadow-xl' : ''}
        `}
      >
        {/* Desktop Sidebar Toggle - Water Drop Style */}
        <div className="hidden md:block absolute -right-4 top-20 z-50">
          <SidebarToggle 
            onClick={toggleSidebar} 
            isCollapsed={sidebarCollapsed} 
            isMobile={false}
          />
        </div>
        
        {/* User Profile and Theme Toggle */}
        <div className={`pt-2 mt-2 p-4 flex items-center ${sidebarCollapsed && !isMobile ? 'justify-center' : 'gap-3'} border-b border-gray-200 dark:border-gray-700`}>
          <div className="flex-shrink-0">
            
              <Avatar className="h-8 w-8">
                <AvatarImage src={profilePicture} alt={userName} />
                <AvatarFallback className="bg-gray-200 dark:bg-gray-700 text-sm font-medium dark:text-gray-100">
                  {userName?.split(' ').map(n => n[0]).join('').substring(0, 2) || "FW"}
                </AvatarFallback>
              </Avatar>
           
          </div>
          {(!sidebarCollapsed || isMobile) && (
            <>
              <div className="font-medium text-gray-800 dark:text-gray-100 truncate">{userName}</div>
              <button 
                className="ml-auto text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                onClick={toggleDarkMode}
              >
                {isDarkMode ? <SunIcon className="h-4 w-4" /> : <MoonIcon className="h-4 w-4" />}
              </button>
            </>
          )}
        </div>
        
        {/* Search - only show when sidebar is expanded or on mobile */}
        {(!sidebarCollapsed || isMobile) && (
          <div className="px-4 py-2">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
              <input 
                placeholder="Search" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-4 py-2 bg-gray-100 dark:bg-gray-700 border-0 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        )}
        
        <ScrollArea className="flex-1 overflow-y-auto overflow-x-hidden">
          <div className="p-2">
            <div className="space-y-1 mt-3">
              <button 
                className={`w-full flex ${sidebarCollapsed && !isMobile ? 'justify-center' : 'items-center gap-2'} px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md`}
                onClick={handleSelectAllNotes}
              >
                <span className={`text-gray-500 dark:text-gray-400 ${sidebarCollapsed && !isMobile ? 'text-xl' : ''}`}>📝</span>
                {(!sidebarCollapsed || isMobile) && "All notes"}
              </button>
            </div>
            
            {/* Todo and Favorites Section */}
            <div className="mt-4">
              {(!sidebarCollapsed || isMobile) && (
                <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 px-3 py-1">QUICK ACCESS</div>
              )}
              <div className="mt-1 space-y-1">
                {/* Todo Button */}
                <button 
                  className={`w-full flex ${sidebarCollapsed && !isMobile ? 'justify-center' : 'items-center gap-2'} px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md`}
                  title={sidebarCollapsed && !isMobile ? "Todo" : ""}
                  onClick={handleSelectTodo}
                >
                  <span className={`${sidebarCollapsed && !isMobile ? 'text-xl' : ''}`}>✅</span>
                  {(!sidebarCollapsed || isMobile) && "Todo"}
                </button>
                
                {/* Favorite Documents Button */}
                <button 
                  className={`w-full flex ${sidebarCollapsed && !isMobile ? 'justify-center' : 'items-center gap-2'} px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md`}
                  title={sidebarCollapsed && !isMobile ? "Favorite Documents" : ""}
                  onClick={handleSelectFavorites}
                >
                  <span className={`${sidebarCollapsed && !isMobile ? 'text-xl' : ''} text-yellow-500`}>
                    <StarIcon className="h-4 w-4" />
                  </span>
                  {(!sidebarCollapsed || isMobile) && "Favorite Documents"}
                </button>
              </div>
            </div>
            
            <div className="mt-4">
              <div className="flex justify-between items-center">
                <button 
                  className={`w-full flex ${sidebarCollapsed && !isMobile ? 'justify-center' : 'items-center gap-2'} px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md`}
                  onClick={() => (!sidebarCollapsed || isMobile) && setClassesExpanded(!classesExpanded)}
                  title={sidebarCollapsed && !isMobile ? "Classes" : ""}
                >
                  {(!sidebarCollapsed || isMobile) && (
                    <ChevronDownIcon className={`${classesExpanded ? 'transform rotate-0' : 'transform -rotate-90'} transition-transform text-gray-500 dark:text-gray-400`} />
                  )}
                  <span className={`${sidebarCollapsed && !isMobile ? 'text-xl' : ''}`}>🎓</span>
                  {(!sidebarCollapsed || isMobile) && "Classes"}
                </button>
                
              
              </div>
              
              {classesExpanded && (!sidebarCollapsed || isMobile) && (
                <div className="mt-1 ml-4 space-y-1">
                  {subjects.filter(subject => 
                    subject.name.toLowerCase().includes(searchQuery.toLowerCase())
                  ).map(subject => (
                    <button 
                      key={subject.id} 
                      className={`w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md ${selectedSubject === subject.id ? 'bg-blue-50 dark:bg-blue-900' : ''}`}
                      onClick={() => handleSelectSubject(subject.id)}
                    >
                      <span className={`w-5 h-5 flex items-center justify-center rounded-md ${subject.color}`}>
                        {subject.icon}
                      </span>
                      {subject.name}
                      <span
                        className="ml-auto text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent triggering the subject selection
                          onDeleteSubject(subject.id);
                        }}
                        key={subject.id}
                        title="Delete Subject"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="14" height="14" viewBox="0 0 24 24"> <path d="M 10 2 L 9 3 L 4 3 L 4 5 L 5 5 L 5 20 C 5 20.522222 5.1913289 21.05461 5.5683594 21.431641 C 5.9453899 21.808671 6.4777778 22 7 22 L 17 22 C 17.522222 22 18.05461 21.808671 18.431641 21.431641 C 18.808671 21.05461 19 20.522222 19 20 L 19 5 L 20 5 L 20 3 L 15 3 L 14 2 L 10 2 z M 7 5 L 17 5 L 17 20 L 7 20 L 7 5 z M 9 7 L 9 18 L 11 18 L 11 7 L 9 7 z M 13 7 L 13 18 L 15 18 L 15 7 L 13 7 z"></path> </svg>
                      </span>
                    </button>
                  ))}
                </div>
              )}
              
              {sidebarCollapsed && !isMobile && (
                <div className="mt-4 flex flex-col items-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-8 h-8 rounded-full flex items-center justify-center text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-800/50"
                    title="Add Subject"
                    onClick={() => setAddSubjectOpen(true)}
                  >
                    <PlusIcon className="h-4 w-4" />
                  </Button>
                </div>
              )}
              
              {sidebarCollapsed && !isMobile && (
                <div className="mt-1 space-y-1">
                  {subjects.map(subject => (
                    <button 
                      key={subject.id} 
                      className={`w-full flex justify-center px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md ${selectedSubject === subject.id ? 'bg-blue-50 dark:bg-blue-900' : ''}`}
                      onClick={() => handleSelectSubject(subject.id)}
                      title={subject.name}
                    >
                      <span className={`w-5 h-5 flex items-center justify-center rounded-md ${subject.color}`}>
                        {subject.icon}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </ScrollArea>
    {/* New Document Button */}
    <Button 
              className="w-[90%] flex justify-center m-auto mb-2 aspect-square"
              onClick={() => {
                console.log("clicked");
                setAddSubjectOpen(true);
              }}
              title="Add New Document"
            >
              <PlusIcon className="h-5 w-5" />
          {  !sidebarCollapsed && <p>Add Subject</p>}
            </Button>

      </aside> 

      {/* Add Subject Dialog */}
      <DialogPrimitive.Root open={addSubjectOpen} onOpenChange={setAddSubjectOpen}>
        <DialogPrimitive.Portal>
          <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/50" />
          <DialogPrimitive.Content className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-white dark:bg-gray-800 p-6 shadow-lg rounded-lg">
            <DialogPrimitive.Title className="sr-only">Add Subject</DialogPrimitive.Title>
            <AddSubjectDialog
              onAddSubject={handleAddSubject} onClose={() => setAddSubjectOpen(false)}
            />
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>
    </>
  );
};

export default Sidebar; 