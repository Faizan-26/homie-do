import React, { useState } from 'react';
import { Button } from '../../../components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../../components/ui/dialog';

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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Unit</DialogTitle>
          <DialogDescription>
            Create a new unit for your course syllabus
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <label htmlFor="unit-title" className="text-sm font-medium">
              Unit Title
            </label>
            <input
              id="unit-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Unit 1: Introduction"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="unit-weeks" className="text-sm font-medium">
              Weeks
            </label>
            <input
              id="unit-weeks"
              value={weeks}
              onChange={(e) => setWeeks(e.target.value)}
              placeholder="e.g., 1-3"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Add Unit</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export const EditUnitDialog = ({ isOpen, onClose, unit, onUpdateUnit }) => {
  const [title, setTitle] = useState(unit?.title || '');
  const [weeks, setWeeks] = useState(unit?.weeks || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim() && weeks.trim()) {
      onUpdateUnit({
        ...unit,
        title: title.trim(),
        weeks: weeks.trim(),
      });
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Unit</DialogTitle>
          <DialogDescription>
            Update the details of this unit
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <label htmlFor="edit-unit-title" className="text-sm font-medium">
              Unit Title
            </label>
            <input
              id="edit-unit-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="edit-unit-weeks" className="text-sm font-medium">
              Weeks
            </label>
            <input
              id="edit-unit-weeks"
              value={weeks}
              onChange={(e) => setWeeks(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Update Unit</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Chapter</DialogTitle>
          <DialogDescription>
            Create a new chapter within this unit
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <label htmlFor="chapter-title" className="text-sm font-medium">
              Chapter Title
            </label>
            <input
              id="chapter-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Chapter 1: Introduction"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="chapter-subtopics" className="text-sm font-medium">
              Subtopics (one per line)
            </label>
            <textarea
              id="chapter-subtopics"
              value={subtopics}
              onChange={(e) => setSubtopics(e.target.value)}
              placeholder="Subtopic 1&#10;Subtopic 2&#10;Subtopic 3"
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Add Chapter</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export const EditChapterDialog = ({ isOpen, onClose, chapter, onUpdateChapter }) => {
  const [title, setTitle] = useState(chapter?.title || '');
  const [subtopics, setSubtopics] = useState(
    chapter?.subtopics ? chapter.subtopics.join('\n') : ''
  );

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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Chapter</DialogTitle>
          <DialogDescription>
            Update the details of this chapter
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <label htmlFor="edit-chapter-title" className="text-sm font-medium">
              Chapter Title
            </label>
            <input
              id="edit-chapter-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="edit-chapter-subtopics" className="text-sm font-medium">
              Subtopics (one per line)
            </label>
            <textarea
              id="edit-chapter-subtopics"
              value={subtopics}
              onChange={(e) => setSubtopics(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Update Chapter</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Subtopic</DialogTitle>
          <DialogDescription>
            Add a new subtopic to this chapter
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <label htmlFor="subtopic-content" className="text-sm font-medium">
              Subtopic
            </label>
            <input
              id="subtopic-content"
              value={subtopic}
              onChange={(e) => setSubtopic(e.target.value)}
              placeholder="Enter subtopic content"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Add Subtopic</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Subtopic</DialogTitle>
          <DialogDescription>
            Update this subtopic
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <label htmlFor="edit-subtopic-content" className="text-sm font-medium">
              Subtopic
            </label>
            <input
              id="edit-subtopic-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Update Subtopic</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}; 