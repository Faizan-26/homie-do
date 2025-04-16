import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Button } from '../../../components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../../components/ui/dialog';
import { PlusIcon } from '@radix-ui/react-icons';

const SUBJECT_COLORS = [
  { name: 'Red', value: 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-200' },
  { name: 'Pink', value: 'bg-pink-100 text-pink-600 dark:bg-pink-900 dark:text-pink-200' },
  { name: 'Orange', value: 'bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-200' },
  { name: 'Yellow', value: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-200' },
  { name: 'Green', value: 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-200' },
  { name: 'Blue', value: 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-200' },
  { name: 'Purple', value: 'bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-200' },
];

const ICONS = ['📚', '🧠', '🔬', '🧪', '📊', '📈', '📝', '💻', '🧮', '🔍', '🧬', '⚗️', '🔭', '📡', '📱', '🔋', '💡', ]; 

const AddSubjectDialog = ({ onAddSubject }) => {
  const [open, setOpen] = useState(false);
  const [subjectName, setSubjectName] = useState('');
  const [selectedColor, setSelectedColor] = useState(SUBJECT_COLORS[0].value);
  const [selectedIcon, setSelectedIcon] = useState(ICONS[0]);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate inputs
    if (!subjectName.trim()) {
      setError('Subject name is required');
      return;
    }
    
    // Clear any previous errors
    setError('');
    
    // Create a complete subject structure with empty sections
    const newSubject = {
      id: uuidv4(),
      name: subjectName.trim(),
      color: selectedColor,
      icon: selectedIcon,
      courseMaterials: {
        syllabus: {
          title: `${subjectName.trim()} Syllabus`,
          content: '',
          sections: []
        },
        lectures: [],
        readings: [],
        assignments: []
      },
      notes: []
    };
    
    onAddSubject(newSubject);
    
    // Reset the form
    setSubjectName('');
    setSelectedColor(SUBJECT_COLORS[0].value);
    setSelectedIcon(ICONS[0]);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full bg-blue-600 hover:bg-blue-700">
          <PlusIcon className="mr-2 h-4 w-4" />
          New Subject
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Subject</DialogTitle>
          <DialogDescription>
            Create a new subject for your study materials
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              Subject Name
            </label>
            <input
              id="name"
              value={subjectName}
              onChange={(e) => setSubjectName(e.target.value)}
              placeholder="Enter subject name"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Subject Color
            </label>
            <div className="flex flex-wrap gap-2">
              {SUBJECT_COLORS.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  className={`w-8 h-8 rounded-full ${color.value.split(' ')[0]} hover:ring-2 hover:ring-offset-2 ${selectedColor === color.value ? 'ring-2 ring-offset-2 ring-blue-500' : ''}`}
                  onClick={() => setSelectedColor(color.value)}
                  aria-label={`Select ${color.name} color`}
                />
              ))}
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Subject Icon
            </label>
            <div className="flex flex-wrap gap-2">
              {ICONS.map((icon) => (
                <button
                  key={icon}
                  type="button"
                  className={`w-8 h-8 rounded-md flex items-center justify-center bg-gray-100 hover:bg-gray-200 ${selectedIcon === icon ? 'ring-2 ring-blue-500' : ''}`}
                  onClick={() => setSelectedIcon(icon)}
                  aria-label={`Select ${icon} icon`}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Subject</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddSubjectDialog; 