import React from 'react';
import { Button } from '../../../components/ui/button';
import SubjectContent from './SubjectContent';
import { useAuth } from '../../../context/AuthContext';
import Todo from './Todo';
import FavoriteDocuments from './FavoriteDocuments';

const DashboardContent = ({ 
  subjects, 
  selectedView, 
  updateSubject, 
  favorites,
  toggleFavorite,
  sidebarCollapsed,
  navigate,
}) => {
  const { logout: authLogout } = useAuth();

  const handleLogout = () => {
    authLogout();
    navigate('/login');
  };

  // Function to render the appropriate content based on the selected view
  const renderContent = () => {
    if (!selectedView.type) {
      // Default view - can display a welcome message or dashboard overview
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-center max-w-md mx-auto p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Welcome to Homie Doo</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Select a subject from the sidebar to get started, or access your assignments and favorite documents.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-center">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="text-3xl mb-2">📚</div>
                <h3 className="font-medium">Your Subjects</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {subjects.length} {subjects.length === 1 ? 'subject' : 'subjects'}
                </p>
              </div>
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="text-3xl mb-2">✅</div>
                <h3 className="font-medium">Assignments</h3>
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
        const selectedSubject = subjects.find(s => s.id === selectedView.id);
        if (!selectedSubject) {
          return <div className="p-6">Subject not found</div>;
        }
        return (
          <SubjectContent 
            subject={selectedSubject} 
            updateSubject={updateSubject}
            favorites={favorites}
            toggleFavorite={toggleFavorite}
          />
        );
      
      case 'todo':
        return <Todo subjects={subjects} />;
      
      case 'favorites':
        return (
          <FavoriteDocuments 
            subjects={subjects} 
            favorites={favorites}
            toggleFavorite={toggleFavorite}
          />
        );
      
      default:
        return <div className="p-6">Select a subject, todo, or favorites</div>;
    }
  };

  return (
    <div className="flex-1 h-screen overflow-y-auto overflow-x-hidden pb-4">
      <header className="w-full bg-white dark:bg-gray-800 shadow-sm">
        <div className="w-full px-2 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center ml-0">
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

      <main className={`w-full px-2 sm:px-6 lg:px-8 py-4 transition-all duration-300 ${sidebarCollapsed ? 'md:pl-4' : 'md:pl-6'}`}>
        {renderContent()}
      </main>
    </div>
  );
};

export default DashboardContent; 