import React, { useEffect, useState } from 'react';
import { ScrollArea } from '../../../components/ui/scroll-area';
import { Button } from '../../../components/ui/button';
import { ChevronDownIcon, MagnifyingGlassIcon, MoonIcon, SunIcon, PlusIcon, Cross2Icon } from '@radix-ui/react-icons';
import AddSubjectDialog from './AddSubjectDialog';
import SidebarToggle from './SidebarToggle';

const Sidebar = ({ 
  subjects, 
  documents, 
  sidebarOpen,
  sidebarCollapsed, 
  setSidebarCollapsed,
  toggleSidebarCollapse,
  classesExpanded,
  setClassesExpanded,
  selectedSubject,
  setSelectedSubject,
  searchQuery,
  setSearchQuery,
  handleAddSubject,
  isDarkMode,
  toggleDarkMode
}) => {
  const [isMobile, setIsMobile] = useState(false);

  // Check if we're on mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Function to handle selecting a subject on mobile
  const handleSelectSubject = (subjectId) => {
    setSelectedSubject(subjectId);
    // Close sidebar on mobile when an option is selected
    if (isMobile) {
      toggleSidebarCollapse();
    }
  };

  // Function to handle clicking on a document on mobile
  const handleSelectDocument = () => {
    // Close sidebar on mobile when an option is selected
    if (isMobile) {
      toggleSidebarCollapse();
    }
  };

  return (
    <>
      <div className={`
        fixed top-1/4 left-0 z-50
        transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-[240px]' : 'translate-x-0'}
        md:hidden
      `}>
        <SidebarToggle 
          onClick={toggleSidebarCollapse} 
          isCollapsed={!sidebarOpen} 
          isMobile={true}
        />
      </div>
    
      <aside 
        className={`
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
          md:translate-x-0 
          fixed md:relative 
          top-0 left-0
          h-full
          z-40 
          transition-all duration-300 ease-in-out 
          ${isMobile ? 'w-60' : sidebarCollapsed ? 'md:w-16' : 'md:w-64 lg:w-72'} 
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
            onClick={toggleSidebarCollapse} 
            isCollapsed={sidebarCollapsed} 
            isMobile={false}
          />
        </div>
        
      
        
        {/* User Profile and Theme Toggle */}
        <div className={`pt-2 p-4 flex items-center ${sidebarCollapsed && !isMobile ? 'justify-center' : 'gap-3'} border-b border-gray-200 dark:border-gray-700`}>
          <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
            <span className="text-sm font-medium dark:text-gray-100">FW</span>
          </div>
          {(!sidebarCollapsed || isMobile) && (
            <>
              <div className="font-medium text-gray-800 dark:text-gray-100 truncate">Faizan Waince</div>
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
        
        <ScrollArea className="flex-1 overflow-x-hidden">
          <div className="p-2">
            <div className="space-y-1 mt-3">
              <button 
                className={`w-full flex ${sidebarCollapsed && !isMobile ? 'justify-center' : 'items-center gap-2'} px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md`}
                onClick={handleSelectDocument}
              >
                <span className={`text-gray-500 dark:text-gray-400 ${sidebarCollapsed && !isMobile ? 'text-xl' : ''}`}>📝</span>
                {(!sidebarCollapsed || isMobile) && "All notes"}
              </button>
            </div>
            
            <div className="mt-4">
              {(!sidebarCollapsed || isMobile) && (
                <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 px-3 py-1">DOCUMENTS</div>
              )}
              <div className="mt-1 space-y-1">
                {documents.map(doc => (
                  <button 
                    key={doc.id} 
                    className={`w-full flex ${sidebarCollapsed && !isMobile ? 'justify-center' : 'items-center gap-2'} px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md`}
                    title={sidebarCollapsed && !isMobile ? doc.name : ""}
                    onClick={handleSelectDocument}
                  >
                    <span className={`${sidebarCollapsed && !isMobile ? 'text-xl' : ''}`}>{doc.icon}</span>
                    {(!sidebarCollapsed || isMobile) && doc.name}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="mt-4">
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
                    </button>
                  ))}
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
                      <span className={`w-6 h-6 flex items-center justify-center rounded-md ${subject.color}`}>
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
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          {sidebarCollapsed && !isMobile ? (
            <Button 
              className="w-full flex justify-center bg-blue-600 hover:bg-blue-700 aspect-square"
              onClick={() => setSidebarCollapsed(false)}
              title="Add New Document"
            >
              <PlusIcon className="h-5 w-5" />
            </Button>
          ) : (
            <AddSubjectDialog onAddSubject={handleAddSubject} />
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar; 