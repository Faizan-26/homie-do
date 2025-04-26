import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { ScrollArea } from './ui/scroll-area';
import { PlusIcon } from '@radix-ui/react-icons';

function Sidebar({ isCollapsed, onCollapse }) {
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

      {/* Add Subject Button - fixed at bottom */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
        <Dialog open={isAddSubjectOpen} onOpenChange={setIsAddSubjectOpen}>
          <DialogTrigger asChild>
            {isCollapsed ? (
              <Button 
                className="w-full flex justify-center bg-blue-600 hover:bg-blue-700 text-white aspect-square"
                title="Add Subject"
              >
                <PlusIcon className="h-5 w-5" />
              </Button>
            ) : (
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Add Subject
              </Button>
            )}
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] bg-white dark:bg-gray-800">
            <DialogHeader>
              <DialogTitle className="text-gray-900 dark:text-gray-100">Add New Subject</DialogTitle>
              <DialogDescription className="text-gray-500 dark:text-gray-400">
                Create a new subject for organizing your notes and assignments.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddSubject} className="space-y-4">
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
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="outline" className="bg-transparent border-gray-300 text-gray-700 dark:text-gray-300 dark:border-gray-600">
                    Cancel
                  </Button>
                </DialogClose>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                  Add Subject
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

export default Sidebar; 