import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { ScrollArea } from './ui/scroll-area';
import { PlusIcon } from '@radix-ui/react-icons';
import * as DialogPrimitive from '@radix-ui/react-dialog';

function DirectDialogSidebar({ isCollapsed, onCollapse }) {
  const { user } = useAuth();
  const [isAddSubjectOpen, setIsAddSubjectOpen] = useState(false);
  const [newSubject, setNewSubject] = useState({
    name: '',
    description: '',
  });

  const handleAddSubject = (e) => {
    e.preventDefault();
    // TODO: Implement subject creation logic
    console.log('Adding subject:', newSubject);
    setIsAddSubjectOpen(false);
    setNewSubject({ name: '', description: '' });
  };

  return (
    <div className="flex flex-col h-screen bg-white dark:bg-gray-800 border-r dark:border-gray-700 transition-all duration-300">
      {/* User Profile Section */}
      <div className="p-4 border-b dark:border-gray-700 flex-shrink-0">
        {!isCollapsed ? (
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-800 dark:text-white flex-shrink-0">
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="overflow-hidden">
              <p className="font-medium text-gray-800 dark:text-gray-100 truncate">{user?.name || 'User'}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{user?.email || 'email@example.com'}</p>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-800 dark:text-white">
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
          </div>
        )}
      </div>

      {/* Scrollable Navigation Area */}
      <ScrollArea className="flex-grow overflow-auto">
        <div className="p-2 space-y-1">
          <Button variant="ghost" className="w-full justify-start">
            <span className="text-gray-500 dark:text-gray-400">📝</span>
            {!isCollapsed && <span className="ml-2 truncate">All notes</span>}
          </Button>
          
          {!isCollapsed && (
            <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 px-3 py-2 mt-3">
              QUICK ACCESS
            </div>
          )}
          
          <Button variant="ghost" className="w-full justify-start">
            <span className="flex-shrink-0 text-green-500">✅</span>
            {!isCollapsed && <span className="ml-2 truncate">Todo</span>}
          </Button>
          
          <Button variant="ghost" className="w-full justify-start">
            <span className="flex-shrink-0 text-yellow-500">⭐</span>
            {!isCollapsed && <span className="ml-2 truncate">Favorite Documents</span>}
          </Button>
          
          <div className="flex items-center px-3 py-2 mt-2">
            <button className="flex items-center text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white">
              {!isCollapsed && (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-down">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              )}
              <span className={`${isCollapsed ? '' : 'ml-1'} flex-shrink-0`}>🎓</span>
              {!isCollapsed && <span className="ml-2 font-medium">Classes</span>}
            </button>
          </div>

          {/* Example subject items */}
          <div className="ml-3 space-y-1">
            <Button variant="ghost" className="w-full justify-start">
              <span className="flex-shrink-0 text-red-500">❤️</span>
              {!isCollapsed && <span className="ml-2 truncate">Anatomy</span>}
            </Button>
            <Button variant="ghost" className="w-full justify-start bg-blue-800/50">
              <span className="flex-shrink-0 text-red-500">❤️</span>
              {!isCollapsed && <span className="ml-2 truncate">Physiology</span>}
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <span className="flex-shrink-0 text-green-500">🌿</span>
              {!isCollapsed && <span className="ml-2 truncate">Epidemiology</span>}
            </Button>
          </div>
          
          {/* Add padding to ensure content doesn't hide behind fixed button */}
          <div className="h-16"></div>
        </div>
      </ScrollArea>

      {/* Add Subject Button - fixed at bottom like in the example */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
        {isCollapsed ? (
          <Button 
            onClick={() => setIsAddSubjectOpen(true)}
            className="w-full flex justify-center bg-blue-600 hover:bg-blue-700 text-white aspect-square"
            title="Add Subject"
          >
            <PlusIcon className="h-5 w-5" />
          </Button>
        ) : (
          <Button 
            onClick={() => setIsAddSubjectOpen(true)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Subject
          </Button>
        )}
      </div>
      
      {/* Direct Radix UI Dialog Implementation */}
      <DialogPrimitive.Root open={isAddSubjectOpen} onOpenChange={setIsAddSubjectOpen}>
        <DialogPrimitive.Portal>
          <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
          <DialogPrimitive.Content className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-white dark:bg-gray-800 p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 rounded-lg">
            <DialogPrimitive.Title className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Add New Subject
            </DialogPrimitive.Title>
            <DialogPrimitive.Description className="text-sm text-gray-500 dark:text-gray-400">
              Create a new subject for organizing your notes and assignments
            </DialogPrimitive.Description>
            
            <form id="add-subject-form" onSubmit={handleAddSubject} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-700 dark:text-gray-300">Subject Name</Label>
                <Input
                  id="name"
                  value={newSubject.name}
                  onChange={(e) => setNewSubject({ ...newSubject, name: e.target.value })}
                  placeholder="Enter subject name"
                  className="bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border dark:border-gray-600"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description" className="text-gray-700 dark:text-gray-300">Description</Label>
                <Textarea
                  id="description"
                  value={newSubject.description}
                  onChange={(e) => setNewSubject({ ...newSubject, description: e.target.value })}
                  placeholder="Enter subject description (optional)"
                  className="bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border dark:border-gray-600"
                />
              </div>
              
              <div className="flex justify-end gap-2 mt-6">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsAddSubjectOpen(false)}
                  className="bg-transparent border-gray-300 text-gray-700 dark:text-gray-300 dark:border-gray-600"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Add Subject
                </Button>
              </div>
            </form>
            
            <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none disabled:pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
              <span className="sr-only">Close</span>
            </DialogPrimitive.Close>
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>
    </div>
  );
}

export default DirectDialogSidebar; 