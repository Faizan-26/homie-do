import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { FileIcon, BookOpen, CheckSquare, FileText, Star, Search, X, ArrowUpDown } from 'lucide-react';

const FavoriteDocuments = ({ subjects, favorites, toggleFavorite }) => {
  const [allDocuments, setAllDocuments] = useState([]);
  const [filteredDocuments, setFilteredDocuments] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('title-asc');

  useEffect(() => {
    if (subjects && favorites) {
      // Extract all documents from all subjects
      const documents = [];
      
      Object.values(subjects).forEach(subject => {
        if (subject.courseMaterials) {
          // Add lectures
          if (subject.courseMaterials.lectures) {
            subject.courseMaterials.lectures.forEach(lecture => {
              const docId = `lecture_${subject.id}_${lecture.id}`;
              if (favorites.includes(docId)) {
                documents.push({
                  ...lecture,
                  docId,
                  type: 'lecture',
                  icon: <FileIcon className="h-4 w-4 mr-2" />,
                  typeBadge: <Badge variant="secondary">Lecture</Badge>,
                  subjectName: subject.name,
                  subjectId: subject.id,
                  subjectColor: subject.color,
                  subjectIcon: subject.icon
                });
              }
            });
          }
          
          // Add readings
          if (subject.courseMaterials.readings) {
            subject.courseMaterials.readings.forEach(reading => {
              const docId = `reading_${subject.id}_${reading.id}`;
              if (favorites.includes(docId)) {
                documents.push({
                  ...reading,
                  docId,
                  type: 'reading',
                  icon: <BookOpen className="h-4 w-4 mr-2" />,
                  typeBadge: <Badge variant="secondary">Reading</Badge>,
                  subjectName: subject.name,
                  subjectId: subject.id,
                  subjectColor: subject.color,
                  subjectIcon: subject.icon
                });
              }
            });
          }
          
          // Add assignments
          if (subject.courseMaterials.assignments) {
            subject.courseMaterials.assignments.forEach(assignment => {
              const docId = `assignment_${subject.id}_${assignment.id}`;
              if (favorites.includes(docId)) {
                documents.push({
                  ...assignment,
                  docId,
                  type: 'assignment',
                  icon: <CheckSquare className="h-4 w-4 mr-2" />,
                  typeBadge: <Badge variant="secondary">Assignment</Badge>,
                  subjectName: subject.name,
                  subjectId: subject.id,
                  subjectColor: subject.color,
                  subjectIcon: subject.icon
                });
              }
            });
          }
          
          // Add notes
          if (subject.notes) {
            subject.notes.forEach(note => {
              const docId = `note_${subject.id}_${note.id}`;
              if (favorites.includes(docId)) {
                documents.push({
                  ...note,
                  docId,
                  type: 'note',
                  icon: <FileText className="h-4 w-4 mr-2" />,
                  typeBadge: <Badge variant="secondary">Note</Badge>,
                  subjectName: subject.name,
                  subjectId: subject.id,
                  subjectColor: subject.color,
                  subjectIcon: subject.icon
                });
              }
            });
          }
        }
      });
      
      setAllDocuments(documents);
    }
  }, [subjects, favorites]);

  // Apply sorting and filtering whenever dependencies change
  useEffect(() => {
    let sorted = [...allDocuments];
    
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
    
    setFilteredDocuments(sorted);
  }, [allDocuments, searchQuery, sortBy]);

  const clearSearch = () => {
    setSearchQuery('');
  };

  const handleRemoveFavorite = (docId) => {
    toggleFavorite(docId.split('_')[0], docId.split('_')[1], docId.split('_')[2]);
  };

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h2 className="text-3xl font-bold">Favorite Documents</h2>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search favorites..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-9 w-full"
            />
            {searchQuery && (
              <button 
                onClick={clearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          
          {/* Sort Dropdown */}
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full sm:w-48">
              <div className="flex items-center">
                <ArrowUpDown className="mr-2 h-4 w-4" />
                <span>Sort by</span>
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="title-asc">Title (A-Z)</SelectItem>
              <SelectItem value="title-desc">Title (Z-A)</SelectItem>
              <SelectItem value="subject-asc">Subject (A-Z)</SelectItem>
              <SelectItem value="subject-desc">Subject (Z-A)</SelectItem>
              <SelectItem value="type-asc">Type (A-Z)</SelectItem>
              <SelectItem value="type-desc">Type (Z-A)</SelectItem>
              <SelectItem value="date-asc">Date (Oldest)</SelectItem>
              <SelectItem value="date-desc">Date (Newest)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4">
        {filteredDocuments.length > 0 ? (
          filteredDocuments.map(document => (
            <Card key={document.docId} className="transition-all duration-200">
              <CardHeader className="flex flex-col md:flex-row md:items-start justify-between pb-2 gap-4">
                <div>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <span className={`w-6 h-6 flex items-center justify-center rounded-md ${document.subjectColor}`}>
                      {document.subjectIcon}
                    </span>
                    {document.title}
                    <button
                      onClick={() => handleRemoveFavorite(document.docId)}
                      className="text-yellow-400 hover:text-yellow-600 transition-colors"
                      aria-label="Remove from favorites"
                    >
                      <Star className="h-4 w-4 fill-yellow-400" />
                    </button>
                  </CardTitle>
                  <CardDescription className="mt-1 flex items-center gap-2">
                    {document.subjectName} • {document.typeBadge}
                    {document.type === 'assignment' && document.dueDate && (
                      <Badge variant="outline">
                        Due: {new Date(document.dueDate).toLocaleDateString()}
                      </Badge>
                    )}
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                {document.type === 'lecture' && document.content && (
                  <p className="text-sm">{document.content.substring(0, 150)}...</p>
                )}
                {document.type === 'reading' && document.author && (
                  <p className="text-sm">By: {document.author || 'Unknown'}</p>
                )}
                {document.type === 'assignment' && document.instructions && (
                  <p className="text-sm">{document.instructions.substring(0, 150)}...</p>
                )}
                {document.type === 'note' && document.content && (
                  <p className="text-sm">{document.content.substring(0, 150)}...</p>
                )}
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button variant="outline">View Document</Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="text-5xl mb-4">⭐</div>
            <p className="text-xl font-medium text-gray-700 dark:text-gray-300">No favorite documents found</p>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              Mark documents as favorite to see them here
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoriteDocuments; 