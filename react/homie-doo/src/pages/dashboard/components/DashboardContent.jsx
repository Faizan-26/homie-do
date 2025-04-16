import React from 'react';
import { Button } from '../../../components/ui/button';
import { MoonIcon, SunIcon } from '@radix-ui/react-icons';
import SubjectContent from './SubjectContent';

const DashboardContent = ({ 
  subjects, 
  selectedSubject,
  updateSubject, 
  navigate
}) => {
  return (
    <div className="flex-1 h-screen overflow-y-auto overflow-x-hidden pb-4">
      <header className="w-full bg-white dark:bg-gray-800 shadow-sm">
        <div className="w-full px-2 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center ml-8 md:ml-0">
             
              <h1 className="text-lg md:text-2xl font-bold text-gray-900 dark:text-white truncate">Dashboard</h1>
            </div>
            <div className="flex items-center">
              <Button 
                variant="outline" 
                onClick={() => navigate('/')}
                className="text-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700 text-xs md:text-sm"
                size="sm"
              >
                Log Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="w-full px-2 sm:px-6 lg:px-8 py-4">
        {selectedSubject ? (
          <SubjectContent 
            subjectId={selectedSubject} 
            subjects={subjects} 
            updateSubject={updateSubject} 
          />
        ) : (
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
            <div className="px-3 py-4 sm:p-6 text-center">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Welcome to your Dashboard</h2>
              <p className="text-gray-500 dark:text-gray-300 mb-4">
                Please select a subject from the sidebar to view its content, or add a new subject.
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default DashboardContent; 