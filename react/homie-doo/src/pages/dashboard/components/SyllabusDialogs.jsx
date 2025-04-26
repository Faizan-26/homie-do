import React, { useEffect, useState } from 'react';
import { Button } from '../../../components/ui/button';
import * as DialogPrimitive from '@radix-ui/react-dialog';


export const AddUnitDialog = ({ isOpen, onClose, onAddUnit }) => {
  const [title, setTitle] = useState('');
  const [weeks, setWeeks] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim() && weeks.trim()) {
      onAddUnit({
        title: title.trim(),
        weeks: weeks.trim(),
        chapters: []
      });
      setTitle('');
      setWeeks('');
      onClose();
    }
  };

  return (
    <DialogPrimitive.Root open={isOpen} onOpenChange={onClose}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-white dark:bg-gray-800 p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 rounded-lg">
          <DialogPrimitive.Title className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Add New Unit
          </DialogPrimitive.Title>
          <DialogPrimitive.Description className="text-sm text-gray-500 dark:text-gray-400">
            Create a new unit for your course syllabus
          </DialogPrimitive.Description>
          
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="unit-title" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Unit Title
              </label>
              <input
                id="unit-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Unit 1: Introduction"
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="unit-weeks" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Weeks
              </label>
              <input
                id="unit-weeks"
                value={weeks}
                onChange={(e) => setWeeks(e.target.value)}
                placeholder="e.g., 1-3"
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
            
            <div className="flex justify-end gap-2 mt-6">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
                className="bg-transparent border-gray-300 text-gray-700 dark:text-gray-300 dark:border-gray-600"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Add Unit
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
  );
};

export const EditUnitDialog = ({ isOpen, onClose, unit, onUpdateUnit }) => {
  const [title, setTitle] = useState(unit?.title || '');
  const [weeks, setWeeks] = useState(unit?.weeks || '');
  useEffect(() => {
    if (unit) {
      console.log('Unit data:', unit);
      setTitle(unit.title || '');
      setWeeks(unit.weeks || '');
    }
  }, [unit]);


  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim() && weeks.trim()) {
      onUpdateUnit({
        ...unit,
        title: title.trim(),
        weeks: weeks.trim(),
      });
      setTitle('');
      setWeeks('');
      onClose();
    }
  };

  return (
    <DialogPrimitive.Root open={isOpen} onOpenChange={onClose}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-white dark:bg-gray-800 p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 rounded-lg">
          <DialogPrimitive.Title className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Edit Unit
          </DialogPrimitive.Title>
          <DialogPrimitive.Description className="text-sm text-gray-500 dark:text-gray-400">
            Update the details of this unit
          </DialogPrimitive.Description>
          
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="edit-unit-title" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Unit Title
              </label>
              <input
                id="edit-unit-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)} // 
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="edit-unit-weeks" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Weeks
              </label>
              <input
                id="edit-unit-weeks"
                value={weeks}
                onChange={(e) => setWeeks(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
            
            <div className="flex justify-end gap-2 mt-6">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
                className="bg-transparent border-gray-300 text-gray-700 dark:text-gray-300 dark:border-gray-600"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Update Unit
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
  );
};

export const AddChapterDialog = ({ isOpen, onClose, onAddChapter }) => {
  const [title, setTitle] = useState('');
  const [subtopics, setSubtopics] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim()) {
      // Split subtopics by new line to create the initial array
      const subtopicsArray = subtopics
        .split('\n')
        .filter(st => st.trim())
        .map(st => st.trim());
      
      onAddChapter({
        title: title.trim(),
        subtopics: subtopicsArray.length > 0 ? subtopicsArray : []
      });
      setTitle('');
      setSubtopics('');
      onClose();
    }
  };

  return (
    <DialogPrimitive.Root open={isOpen} onOpenChange={onClose}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-white dark:bg-gray-800 p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 rounded-lg">
          <DialogPrimitive.Title className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Add New Chapter
          </DialogPrimitive.Title>
          <DialogPrimitive.Description className="text-sm text-gray-500 dark:text-gray-400">
            Create a new chapter within this unit
          </DialogPrimitive.Description>
          
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="chapter-title" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Chapter Title
              </label>
              <input
                id="chapter-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Chapter 1: Introduction"
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="chapter-subtopics" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Subtopics (one per line)
              </label>
              <textarea
                id="chapter-subtopics"
                value={subtopics}
                onChange={(e) => setSubtopics(e.target.value)}
                placeholder="Subtopic 1&#10;Subtopic 2&#10;Subtopic 3"
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
            
            <div className="flex justify-end gap-2 mt-6">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
                className="bg-transparent border-gray-300 text-gray-700 dark:text-gray-300 dark:border-gray-600"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Add Chapter
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
  );
};

export const EditChapterDialog = ({ isOpen, onClose, chapter, onUpdateChapter }) => {
  const [title, setTitle] = useState(chapter?.title || '');
  const [subtopics, setSubtopics] = useState(
    chapter?.subtopics ? chapter.subtopics.join('\n') : ''
  );

  useEffect(()=>{
    if (chapter) {
      setTitle(chapter.title || '');
      setSubtopics(chapter.subtopics ? chapter.subtopics.join('\n') : '');
    }

  }, [chapter]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim()) {
      // Split subtopics by new line to update the array
      const subtopicsArray = subtopics
        .split('\n')
        .filter(st => st.trim())
        .map(st => st.trim());
      
      onUpdateChapter({
        ...chapter,
        title: title.trim(),
        subtopics: subtopicsArray
      });
      onClose();
    }
  };

  return (
    <DialogPrimitive.Root open={isOpen} onOpenChange={onClose}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-white dark:bg-gray-800 p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 rounded-lg">
          <DialogPrimitive.Title className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Edit Chapter
          </DialogPrimitive.Title>
          <DialogPrimitive.Description className="text-sm text-gray-500 dark:text-gray-400">
            Update the details of this chapter
          </DialogPrimitive.Description>
          
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="edit-chapter-title" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Chapter Title
              </label>
              <input
                id="edit-chapter-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="edit-chapter-subtopics" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Subtopics (one per line)
              </label>
              <textarea
                id="edit-chapter-subtopics"
                value={subtopics}
                onChange={(e) => setSubtopics(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
            
            <div className="flex justify-end gap-2 mt-6">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
                className="bg-transparent border-gray-300 text-gray-700 dark:text-gray-300 dark:border-gray-600"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Update Chapter
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
  );
};

export const AddSubtopicDialog = ({ isOpen, onClose, onAddSubtopic }) => {
  const [subtopic, setSubtopic] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (subtopic.trim()) {
      onAddSubtopic(subtopic.trim());
      setSubtopic('');
      onClose();
    }
  };

  return (
    <DialogPrimitive.Root open={isOpen} onOpenChange={onClose}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-white dark:bg-gray-800 p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 rounded-lg">
          <DialogPrimitive.Title className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Add New Subtopic
          </DialogPrimitive.Title>
          <DialogPrimitive.Description className="text-sm text-gray-500 dark:text-gray-400">
            Add a new subtopic to this chapter
          </DialogPrimitive.Description>
          
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="subtopic-content" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Subtopic
              </label>
              <input
                id="subtopic-content"
                value={subtopic}
                onChange={(e) => setSubtopic(e.target.value)}
                placeholder="Enter subtopic content"
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
            
            <div className="flex justify-end gap-2 mt-6">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
                className="bg-transparent border-gray-300 text-gray-700 dark:text-gray-300 dark:border-gray-600"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Add Subtopic
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
  );
};

export const EditSubtopicDialog = ({ isOpen, onClose, subtopic, onUpdateSubtopic }) => {
  const [content, setContent] = useState(subtopic || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (content.trim()) {
      onUpdateSubtopic(content.trim());
      onClose();
    }
  };

  return (
    <DialogPrimitive.Root open={isOpen} onOpenChange={onClose}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-white dark:bg-gray-800 p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 rounded-lg">
          <DialogPrimitive.Title className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Edit Subtopic
          </DialogPrimitive.Title>
          <DialogPrimitive.Description className="text-sm text-gray-500 dark:text-gray-400">
            Update this subtopic
          </DialogPrimitive.Description>
          
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="edit-subtopic-content" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Subtopic
              </label>
              <input
                id="edit-subtopic-content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
            
            <div className="flex justify-end gap-2 mt-6">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
                className="bg-transparent border-gray-300 text-gray-700 dark:text-gray-300 dark:border-gray-600"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Update Subtopic
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
  );
}; 