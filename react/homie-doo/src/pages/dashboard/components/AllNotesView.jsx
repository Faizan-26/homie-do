import React, { useState, useEffect, useCallback } from 'react';
import { FileText, Calendar, Star, Edit2, Trash2, Plus } from 'lucide-react';
import useSubjectStore from '../../../store/subjectStore';
import useSubjectContentStore from '../../../store/subjectContentStore';
import { Button } from '../../../components/ui/button';

const NoteCard = ({ note, subject }) => {
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 
                   transition-all duration-200 hover:shadow-md hover:border-[#F4815B]/20 relative">
      <div className="flex items-start">
        <div className="flex-grow">
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
              {subject.name}
            </span>
          </div>
          <h3 className="font-medium text-lg mt-2 text-gray-900 dark:text-gray-100">{note.title}</h3>
          <div className="text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center">
            <Calendar className="w-4 h-4 mr-1" />
            {note.date ? new Date(note.date).toLocaleDateString() : 'No date'}
          </div>
          {note.content && (
            <p className="mt-3 text-gray-600 dark:text-gray-300 whitespace-pre-wrap">{note.content}</p>
          )}
          {note.tags && note.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {note.tags.map((tag, index) => (
                <span 
                  key={index} 
                  className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const AllNotesView = () => {
  const [allNotes, setAllNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Get subjects from store
  const subjects = useSubjectStore(state => state.subjects);
  
  // Get content store functions
  const { 
    setWorkingSubject, 
    setSelectedTab, 
    toggleDialog, 
    setSelected
  } = useSubjectContentStore();

  // Collect all notes from all subjects
  const collectAllNotes = useCallback(() => {
    setLoading(true);
    
    const notes = [];
    
    subjects.forEach(subject => {
      if (subject.notes && subject.notes.length > 0) {
        subject.notes.forEach(note => {
          notes.push({
            note,
            subject
          });
        });
      }
    });
    
    // Sort notes by date (newest first)
    notes.sort((a, b) => {
      const dateA = a.note.date ? new Date(a.note.date) : new Date(0);
      const dateB = b.note.date ? new Date(b.note.date) : new Date(0);
      return dateB - dateA;
    });
    
    setAllNotes(notes);
    setLoading(false);
  }, [subjects]);

  // Load notes when component mounts or subjects change
  useEffect(() => {
    collectAllNotes();
  }, [collectAllNotes]);

  // Handle adding a new note
  const handleAddNote = () => {
    // We need to select a subject first
    if (subjects.length > 0) {
      setWorkingSubject(subjects[0]);
      setSelectedTab('notes');
      toggleDialog('addNote', true);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#F4815B]"></div>
      </div>
    );
  }
  
  if (allNotes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <FileText className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
        <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-2">No Notes Yet</h2>
        <p className="text-gray-500 dark:text-gray-400 max-w-md mb-6">
          Start adding notes to keep track of important information.
        </p>
        <Button
          onClick={handleAddNote}
          className="bg-[#F4815B] hover:bg-[#E67048] text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Your First Note
        </Button>
      </div>
    );
  }
  
  return (
    <div className="p-6 h-[calc(100vh-4rem)] overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
          All Notes
        </h1>
        <Button
          onClick={handleAddNote}
          className="bg-[#F4815B] hover:bg-[#E67048] text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Note
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {allNotes.map(({ note, subject }, index) => (
          <NoteCard
            key={`${subject.id}-${note.id}-${index}`}
            note={note}
            subject={subject}
          />
        ))}
      </div>
    </div>
  );
};

export default AllNotesView; 