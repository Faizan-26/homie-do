import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { FileIcon, BookOpen, CheckSquare, FileText, Star, Search, X, ArrowUpDown, Calendar, Clock, Bookmark } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';

const FavoriteDocuments = ({ subjects, favorites, toggleFavorite }) => {
  const [favoriteItems, setFavoriteItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all', 'assignments', 'lectures', 'readings'
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('title-asc');

  useEffect(() => {
    const collectFavorites = () => {
      setLoading(true);
      const items = [];

      subjects.forEach(subject => {
        if (subject.courseMaterials?.assignments) {
          const assignments = subject.courseMaterials.assignments
            .filter(assignment => favorites.includes(`assignment_${subject.id}_${assignment.id}`))
            .map(assignment => ({
              id: assignment.id,
              type: 'assignment',
              title: assignment.title,
              date: assignment.dueDate,
              dateLabel: 'Due',
              subjectId: subject.id,
              subjectName: subject.name,
              content: assignment.instructions,
              data: assignment
            }));
          items.push(...assignments);
        }

        // Get favorited lectures
        if (subject.courseMaterials?.lectures) {
          const lectures = subject.courseMaterials.lectures
            .filter(lecture => favorites.includes(`lecture_${subject.id}_${lecture.id}`))
            .map(lecture => ({
              id: lecture.id,
              type: 'lecture',
              title: lecture.title,
              date: lecture.date,
              dateLabel: 'Date',
              subjectId: subject.id,
              subjectName: subject.name,
              content: lecture.content,
              data: lecture
            }));
          items.push(...lectures);
        }

        // Get favorited readings
        if (subject.courseMaterials?.readings) {
          const readings = subject.courseMaterials.readings
            .filter(reading => favorites.includes(`reading_${subject.id}_${reading.id}`))
            .map(reading => ({
              id: reading.id,
              type: 'reading',
              title: reading.title,
              subjectId: subject.id,
              subjectName: subject.name,
              data: reading
            }));
          items.push(...readings);
        }

        // Get favorited notes
        if (subject.notes) {
          const notes = subject.notes
            .filter(note => favorites.includes(`note_${subject.id}_${note.id}`))
            .map(note => ({
              id: note.id,
              type: 'note',
              title: note.title,
              date: note.date,
              dateLabel: 'Created',
              subjectId: subject.id,
              subjectName: subject.name,
              content: note.content,
              data: note
            }));
          items.push(...notes);
        }
      });

      setFavoriteItems(items);
      setLoading(false);
    };

    collectFavorites();
  }, [subjects, favorites]);

  // Apply sorting and filtering whenever dependencies change
  useEffect(() => {
    let sorted = [...favoriteItems];
    
    // Apply sorting
    switch (sortBy) {
      case 'title-asc':
        sorted.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'title-desc':
        sorted.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case 'subject-asc':
        sorted.sort((a, b) => a.subjectName.localeCompare(b.subjectName));
        break;
      case 'subject-desc':
        sorted.sort((a, b) => b.subjectName.localeCompare(a.subjectName));
        break;
      case 'type-asc':
        sorted.sort((a, b) => a.type.localeCompare(b.type));
        break;
      case 'type-desc':
        sorted.sort((a, b) => b.type.localeCompare(a.type));
        break;
      case 'date-asc':
        sorted.sort((a, b) => {
          const dateA = a.date || a.dueDate || '';
          const dateB = b.date || b.dueDate || '';
          return new Date(dateA) - new Date(dateB);
        });
        break;
      case 'date-desc':
        sorted.sort((a, b) => {
          const dateA = a.date || a.dueDate || '';
          const dateB = b.date || b.dueDate || '';
          return new Date(dateB) - new Date(dateA);
        });
        break;
      default:
        break;
    }
    
    // Apply search filter
    if (searchQuery.trim() !== '') {
      sorted = sorted.filter(doc => 
        doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.subjectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (doc.content && doc.content.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (doc.instructions && doc.instructions.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    setFavoriteItems(sorted);
  }, [favoriteItems, searchQuery, sortBy]);

  const clearSearch = () => {
    setSearchQuery('');
  };

  const handleRemoveFavorite = (item) => {
    toggleFavorite(item.type, item.subjectId, item.id);
    toast.success(`Removed from favorites`);
  };

  const filteredItems = favoriteItems.filter(item => {
    if (filter === 'all') return true;
    return item.type === filter;
  });

  const getItemBadge = (item) => {
    switch (item.type) {
      case 'assignment':
        return (
          <div className="inline-flex items-center px-2 py-1 bg-purple-100 dark:bg-purple-900/30 rounded-full text-xs text-purple-800 dark:text-purple-400">
            <Calendar className="mr-1 h-3 w-3" />
            Assignment
          </div>
        );
      case 'lecture':
        return (
          <div className="inline-flex items-center px-2 py-1 bg-blue-100 dark:bg-blue-900/30 rounded-full text-xs text-blue-800 dark:text-blue-400">
            <FileText className="mr-1 h-3 w-3" />
            Lecture
          </div>
        );
      case 'reading':
        return (
          <div className="inline-flex items-center px-2 py-1 bg-green-100 dark:bg-green-900/30 rounded-full text-xs text-green-800 dark:text-green-400">
            <BookOpen className="mr-1 h-3 w-3" />
            Reading
          </div>
        );
      case 'note':
        return (
          <div className="inline-flex items-center px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 rounded-full text-xs text-yellow-800 dark:text-yellow-400">
            <Bookmark className="mr-1 h-3 w-3" />
            Note
          </div>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col space-y-4">
        <h1 className="text-2xl font-bold">Favorites</h1>
        
        <div className="flex flex-wrap gap-2 mb-4">
          <Button 
            variant={filter === 'all' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setFilter('all')}
          >
            All
          </Button>
          <Button 
            variant={filter === 'assignment' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setFilter('assignment')}
          >
            Assignments
          </Button>
          <Button 
            variant={filter === 'lecture' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setFilter('lecture')}
          >
            Lectures
          </Button>
          <Button 
            variant={filter === 'reading' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setFilter('reading')}
          >
            Readings
          </Button>
          <Button 
            variant={filter === 'note' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setFilter('note')}
          >
            Notes
          </Button>
        </div>
        
        {filteredItems.length === 0 ? (
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 text-center">
            <p className="text-gray-500 dark:text-gray-400">No favorites found</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredItems.map(item => (
              <div 
                key={`${item.type}_${item.id}`}
                className="p-4 rounded-lg border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-start gap-3">
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{item.title}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {item.subjectName}
                        </p>
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveFavorite(item)}
                        className="h-8 w-8 text-yellow-500"
                      >
                        <Star className="h-5 w-5 fill-yellow-500" />
                      </Button>
                    </div>
                    
                    <div className="mt-2 flex flex-wrap gap-2">
                      {getItemBadge(item)}
                      
                      {item.date && (
                        <div className="inline-flex items-center px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs text-gray-800 dark:text-gray-300">
                          <Clock className="mr-1 h-3 w-3" />
                          {item.dateLabel} {formatDistanceToNow(new Date(item.date), { addSuffix: true })}
                        </div>
                      )}
                    </div>
                    
                    {item.content && (
                      <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                        {item.content}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoriteDocuments; 