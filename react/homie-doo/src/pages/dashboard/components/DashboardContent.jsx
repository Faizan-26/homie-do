import React, { useEffect } from 'react';
import { Button } from '../../../components/ui/button';
import { useAuth } from '../../../context/AuthContext';
import useSubjectStore from '../../../store/subjectStore';
import SubjectContent from './SubjectContent';
import FavoritesView from './FavoritesView';
import AllNotesView from './AllNotesView';

const DashboardContent = ({ 
  selectedView, 
  navigate
}) => {
  const { logout: authLogout } = useAuth();
  const { 
    subjects, 
    setActiveSubject, 
    clearActiveSubject 
  } = useSubjectStore();

  const handleLogout = () => {
    authLogout();
    navigate('/login');
  };
  
  // Effect to ensure we have the correct subject data
  useEffect(() => {
    if (selectedView.type === 'subject' && selectedView.id && subjects) {
      // Find the subject from subjects array using the ID from selectedView
      const foundSubject = subjects.find(s => s.id === selectedView.id);
      if (foundSubject) {
        setActiveSubject(foundSubject); // Set the active subject in the store
      }
    } else {
      clearActiveSubject();
    }
  }, [selectedView, subjects, setActiveSubject, clearActiveSubject]);

  // Function to render the appropriate content based on the selected view
  const renderContent = () => {
    if (!selectedView.type) {
      // Default view - can display a welcome message or dashboard overview
      return (
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <div className="text-center max-w-md mx-auto p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">Welcome to Homie Doo</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Select a subject from the sidebar to get started, or access your assignments and favorite documents.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-center">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="text-3xl mb-2">📚</div>
                <h3 className="font-medium text-gray-800 dark:text-gray-200">Your Subjects</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {subjects?.length || 0} {subjects?.length === 1 ? 'subject' : 'subjects'}
                </p>
              </div>
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="text-3xl mb-2">✅</div>
                <h3 className="font-medium text-gray-800 dark:text-gray-200">Assignments</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Manage your tasks
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    switch (selectedView.type) {
      case 'subject':
        const currentSubject = subjects?.find(s => s.id === selectedView.id);
        if (!currentSubject) {
          return (
            <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
              <div className="text-center">
                <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300">
                  Loading subject...
                </h2>
                <p className="mt-2 text-gray-500 dark:text-gray-400">
                  Please wait while we load the subject data
                </p>
              </div>
            </div>
          );
        }
        return <SubjectContent />;
      
      case 'todo':
        return (
          <div className="h-[calc(100vh-4rem)] overflow-y-auto bg-gray-50 dark:bg-gray-900">
            <div className="max-w-4xl mx-auto p-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-6">
                  Todo List
                </h1>
                <div className="space-y-6">
                  {subjects?.map(subject => (
                    <div key={subject.id} className="mb-6 last:mb-0">
                      <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
                        {subject.name}
                      </h2>
                      <div className="grid gap-4">
                        {subject.courseMaterials.assignments.map(assignment => (
                          <div 
                            key={assignment.id}
                            className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4"
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">
                                  {assignment.title}
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  Due: {new Date(assignment.dueDate).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'favorites':
        return <FavoritesView />;
      
      case 'allnotes':
        return <AllNotesView />;
      
      default:
        return (
          <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300">
                Welcome to your Dashboard
              </h2>
              <p className="mt-2 text-gray-500 dark:text-gray-400">
                Select a view from the sidebar to get started
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className={`flex-1 flex flex-col h-screen bg-gray-50 dark:bg-gray-900`}>
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-lg md:text-2xl font-bold truncate">
                <span className="text-[#F4815B] dark:text-[#FF7B61]">Homie </span>
                <span className="text-gray-900 dark:text-white">Doo</span>
              </h1>
            </div>
            <div className="flex items-center">
              <Button 
                variant="outline"
                onClick={handleLogout}
                className="text-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700 text-xs md:text-sm"
                size="sm"
              >
                Log Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-hidden">
        {renderContent()}
      </main>
    </div>
  );
};

export default DashboardContent; 