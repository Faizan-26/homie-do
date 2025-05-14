import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';
import { Button } from '../../../components/ui/button';
import { X } from 'lucide-react';
import SubjectModel from '../../../models/subjectModel';
import { getLoggedInUserId } from '../../../utils/authUtils';

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

const AddSubjectDialog = ({ onAddSubject, onClose }) => {
  if (typeof onClose !== 'function') {
    throw new Error('AddSubjectDialog: onClose function is required');
  }
  
  const [subjectName, setSubjectName] = useState('');
  const [selectedColor, setSelectedColor] = useState(SUBJECT_COLORS[0].value);
  const [selectedIcon, setSelectedIcon] = useState(ICONS[0]);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate inputs
    if (!subjectName.trim()) {
      setError('Subject name is required');
      toast.error('Subject name is required');
      return;
    }
    
    // Clear any previous errors
    setError('');
    // Create a complete subject using the SubjectModel's createEmpty method
    // take userid from local storage
    const userId = getLoggedInUserId();
    const newSubject = SubjectModel.createEmpty(userId);
    
    // Then set the basic properties from the form
    newSubject.name = subjectName.trim();
    newSubject.color = selectedColor;
    newSubject.icon = selectedIcon;
    
    // Set syllabus title based on subject name
    newSubject.courseMaterials.syllabus.title = `${subjectName.trim()} Syllabus`;
    onAddSubject(newSubject);
    
    // Reset the form
    setSubjectName('');
    setSelectedColor(SUBJECT_COLORS[0].value);
    setSelectedIcon(ICONS[0]);
    onClose();
  };

  return (
    <>
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold">Add New Subject</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Create a new subject for your study materials
          </p>
        </div>
        <button 
          className="text-gray-400 hover:text-gray-500"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
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
                className={`w-8 h-8 rounded-md flex items-center justify-center bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 ${selectedIcon === icon ? 'ring-2 ring-blue-500' : ''}`}
                onClick={() => setSelectedIcon(icon)}
                aria-label={`Select ${icon} icon`}
              >
                {icon}
              </button>
            ))}
          </div>
        </div>
        
        <div className="flex justify-end gap-2 mt-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button type="submit">Add Subject</Button>
        </div>
      </form>
    </>
  );
};

export default AddSubjectDialog; 