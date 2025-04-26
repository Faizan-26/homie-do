import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { CheckCircle2, Clock, Calendar, ArrowUpDown, Search, X, FileText, ExternalLink } from 'lucide-react';

const Todo = ({ subjects }) => {
  const [allAssignments, setAllAssignments] = useState([]);
  const [filteredAssignments, setFilteredAssignments] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [completedAssignments, setCompletedAssignments] = useState(() => {
    // Load completed assignments from localStorage
    const saved = localStorage.getItem('completedAssignments');
    return saved ? JSON.parse(saved) : [];
  });
  const [sortBy, setSortBy] = useState('dueDate-asc');

  useEffect(() => {
    if (subjects) {
      // Extract all assignments from all subjects
      const assignments = Object.values(subjects).flatMap(subject => {
        if (subject.courseMaterials && subject.courseMaterials.assignments) {
          return subject.courseMaterials.assignments.map(assignment => ({
            ...assignment,
            subjectName: subject.name,
            subjectId: subject.id,
            subjectColor: subject.color,
            subjectIcon: subject.icon
          }));
        }
        return [];
      });
      
      setAllAssignments(assignments);
    }
  }, [subjects]);

  // Apply sorting and filtering whenever dependencies change
  useEffect(() => {
    let sorted = [...allAssignments];
    
    // Apply sorting
    switch (sortBy) {
      case 'dueDate-asc':
        sorted.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
        break;
      case 'dueDate-desc':
        sorted.sort((a, b) => new Date(b.dueDate) - new Date(a.dueDate));
        break;
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
      case 'points-asc':
        sorted.sort((a, b) => a.points - b.points);
        break;
      case 'points-desc':
        sorted.sort((a, b) => b.points - a.points);
        break;
      default:
        break;
    }
    
    // Apply search filter
    if (searchQuery.trim() !== '') {
      sorted = sorted.filter(assignment => 
        assignment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        assignment.subjectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (assignment.instructions && assignment.instructions.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    setFilteredAssignments(sorted);
  }, [allAssignments, searchQuery, sortBy]);

  // Save completed assignments to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('completedAssignments', JSON.stringify(completedAssignments));
  }, [completedAssignments]);

  const toggleAssignmentComplete = (assignmentId) => {
    if (completedAssignments.includes(assignmentId)) {
      setCompletedAssignments(completedAssignments.filter(id => id !== assignmentId));
    } else {
      setCompletedAssignments([...completedAssignments, assignmentId]);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  const getDaysRemaining = (dueDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset to beginning of day for accurate comparison
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getStatusBadge = (dueDate) => {
    const daysRemaining = getDaysRemaining(dueDate);
    
    if (daysRemaining < 0) {
      return <Badge variant="destructive">Overdue</Badge>;
    } else if (daysRemaining === 0) {
      return <Badge variant="destructive">Due Today</Badge>;
    } else if (daysRemaining <= 3) {
      return <Badge variant="warning">Due Soon</Badge>;
    } else {
      return <Badge variant="outline">Upcoming</Badge>;
    }
  };

  // Handle file view
  const handleViewFile = (file) => {
    // Prepare file data for the preview page
    const fileData = {
      name: file,
      url: `/uploads/${file}`
    };
    
    // Store file data in localStorage for the preview page
    localStorage.setItem('previewFileData', JSON.stringify(fileData));
    
    // Open the preview page in a new tab
    window.open('/dashboard/preview-document', '_blank');
  };

  // Render file attachment chips
  const renderFileAttachments = (attachments) => {
    if (!attachments || attachments.length === 0) return null;
    
    return (
      <div className="flex flex-wrap gap-2 mt-3">
        {attachments.map((file, index) => (
          <button
            key={index}
            onClick={() => handleViewFile(file)}
            className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 rounded-full text-sm hover:bg-blue-200 dark:hover:bg-blue-800/50 transition-colors"
          >
            <FileText className="w-3 h-3 mr-1" />
            {file}
            <ExternalLink className="w-3 h-3 ml-1" />
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h2 className="text-3xl font-bold">Assignments</h2>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search assignments..."
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
              <SelectItem value="dueDate-asc">Due Date (Earliest)</SelectItem>
              <SelectItem value="dueDate-desc">Due Date (Latest)</SelectItem>
              <SelectItem value="title-asc">Title (A-Z)</SelectItem>
              <SelectItem value="title-desc">Title (Z-A)</SelectItem>
              <SelectItem value="subject-asc">Subject (A-Z)</SelectItem>
              <SelectItem value="subject-desc">Subject (Z-A)</SelectItem>
              <SelectItem value="points-asc">Points (Low-High)</SelectItem>
              <SelectItem value="points-desc">Points (High-Low)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4">
        {filteredAssignments.length > 0 ? (
          filteredAssignments.map(assignment => (
            <Card 
              key={assignment.id}
              className={`${completedAssignments.includes(assignment.id) ? 'opacity-60' : ''} transition-all duration-200`}
            >
              <CardHeader className="flex flex-col md:flex-row md:items-start justify-between pb-2 gap-4">
                <div>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <span className={`w-6 h-6 flex items-center justify-center rounded-md ${assignment.subjectColor}`}>
                      {assignment.subjectIcon}
                    </span>
                    {assignment.title}
                  </CardTitle>
                  <CardDescription className="mt-1">
                    {assignment.subjectName} • {assignment.points} points
                  </CardDescription>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {getStatusBadge(assignment.dueDate)}
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(assignment.dueDate).toLocaleDateString()}
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {getDaysRemaining(assignment.dueDate) === 0 
                      ? "Today" 
                      : getDaysRemaining(assignment.dueDate) < 0 
                        ? `${Math.abs(getDaysRemaining(assignment.dueDate))} day${Math.abs(getDaysRemaining(assignment.dueDate)) > 1 ? 's' : ''} overdue` 
                        : `${getDaysRemaining(assignment.dueDate)} day${getDaysRemaining(assignment.dueDate) > 1 ? 's' : ''} left`}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{assignment.instructions}</p>
                {renderFileAttachments(assignment.attachments)}
              </CardContent>
              <CardFooter className="flex flex-col sm:flex-row justify-between gap-2">
                <Button 
                  variant={completedAssignments.includes(assignment.id) ? "success" : "outline"} 
                  onClick={() => toggleAssignmentComplete(assignment.id)}
                  className={completedAssignments.includes(assignment.id) ? "bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900 dark:text-green-100 dark:hover:bg-green-800" : ""}
                >
                  {completedAssignments.includes(assignment.id) ? (
                    <>
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Completed
                    </>
                  ) : (
                    'Mark Complete'
                  )}
                </Button>
                <Button variant="outline">View Details</Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="text-5xl mb-4">📝</div>
            <p className="text-xl font-medium text-gray-700 dark:text-gray-300">No assignments found</p>
            {searchQuery && (
              <p className="text-gray-500 dark:text-gray-400 mt-2">
                Try adjusting your search query
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Todo; 