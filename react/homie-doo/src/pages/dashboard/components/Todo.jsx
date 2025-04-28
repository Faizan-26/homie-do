import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { CheckCircle2, Clock, Calendar, ArrowUpDown, Search, X, FileText, ExternalLink, AlertCircle, Star } from 'lucide-react';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import { Checkbox } from '../../../components/ui/checkbox';

// Import services
import documentService from '../../../services/documentService';
import todoService from '../../../services/todoService';
import subjectService from '../../../services/subjectService';

const Todo = ({ subjects }) => {
  const [allAssignments, setAllAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all', 'incomplete', 'completed'

  useEffect(() => {
    // Extract assignments from subjects and flatten into a single array
    const extractAssignments = () => {
      setLoading(true);
      const allAssignments = [];
      
      subjects.forEach(subject => {
        if (subject.courseMaterials && subject.courseMaterials.assignments) {
          const subjectAssignments = subject.courseMaterials.assignments.map(assignment => ({
            ...assignment,
            subjectId: subject.id,
            subjectName: subject.name
          }));
          allAssignments.push(...subjectAssignments);
        }
      });

      // Sort by due date (closest first)
      allAssignments.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
      
      setAllAssignments(allAssignments);
      setLoading(false);
    };
    
    extractAssignments();
  }, [subjects]);

  const handleToggleCompleted = async (assignment) => {
    try {
      // Update in local state first for immediate feedback
      const updatedAssignments = allAssignments.map(a => 
        a.id === assignment.id ? { ...a, isCompleted: !a.isCompleted } : a
      );
      setAllAssignments(updatedAssignments);
      
      // Update in backend
      await subjectService.updateAssignment(
        assignment.subjectId,
        assignment.id,
        { ...assignment, isCompleted: !assignment.isCompleted }
      );
      
    } catch (error) {
      console.error('Error updating assignment completion status:', error);
      toast.error('Failed to update assignment status');
      // Revert local state change on error
      setAllAssignments(allAssignments);
    }
  };

  const handleToggleFavorite = async (assignment) => {
    try {
      // Update in local state first for immediate feedback
      const updatedAssignments = allAssignments.map(a => 
        a.id === assignment.id ? { ...a, isFavorite: !a.isFavorite } : a
      );
      setAllAssignments(updatedAssignments);
      
      // Update in backend
      await subjectService.updateAssignment(
        assignment.subjectId,
        assignment.id,
        { ...assignment, isFavorite: !assignment.isFavorite }
      );
      
    } catch (error) {
      console.error('Error updating assignment favorite status:', error);
      toast.error('Failed to update favorite status');
      // Revert local state change on error
      setAllAssignments(allAssignments);
    }
  };

  const filteredAssignments = allAssignments.filter(assignment => {
    if (filter === 'incomplete') return !assignment.isCompleted;
    if (filter === 'completed') return assignment.isCompleted;
    return true; // 'all'
  });

  const getDueStatus = (dueDate) => {
    const now = new Date();
    const due = new Date(dueDate);
    
    if (due < now) {
      return { status: 'overdue', label: 'Overdue' };
    }
    
    const diffDays = Math.ceil((due - now) / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 1) {
      return { status: 'due-soon', label: 'Due Today' };
    } else if (diffDays <= 3) {
      return { status: 'upcoming', label: 'Due Soon' };
    } else {
      return { status: 'future', label: 'Upcoming' };
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
        <h1 className="text-2xl font-bold">Assignments</h1>
        
        <div className="flex flex-wrap gap-2 mb-4">
          <Button 
            variant={filter === 'all' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setFilter('all')}
          >
            All
          </Button>
          <Button 
            variant={filter === 'incomplete' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setFilter('incomplete')}
          >
            Incomplete
          </Button>
          <Button 
            variant={filter === 'completed' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setFilter('completed')}
          >
            Completed
          </Button>
      </div>

        {filteredAssignments.length === 0 ? (
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 text-center">
            <p className="text-gray-500 dark:text-gray-400">No assignments found</p>
        </div>
        ) : (
      <div className="grid gap-4">
            {filteredAssignments.map(assignment => {
              const dueStatus = getDueStatus(assignment.dueDate);
              
              return (
                <div 
              key={assignment.id}
                  className={`p-4 rounded-lg border ${
                    assignment.isCompleted 
                      ? 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700' 
                      : dueStatus.status === 'overdue'
                        ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800/30'
                        : dueStatus.status === 'due-soon'
                          ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800/30'
                          : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <Checkbox 
                      id={`assignment-${assignment.id}`}
                      checked={assignment.isCompleted}
                      onCheckedChange={() => handleToggleCompleted(assignment)}
                      className="mt-1"
                    />
                    
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                <div>
                          <h3 className={`font-medium ${assignment.isCompleted ? 'line-through text-gray-500 dark:text-gray-400' : ''}`}>
                    {assignment.title}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {assignment.subjectName}
                          </p>
                </div>
                        
                <Button 
                          variant="ghost"
                          size="icon"
                          onClick={() => handleToggleFavorite(assignment)}
                          className={`h-8 w-8 ${assignment.isFavorite ? 'text-yellow-500' : 'text-gray-400'}`}
                        >
                          <Star className={`h-5 w-5 ${assignment.isFavorite ? 'fill-yellow-500' : ''}`} />
                        </Button>
                      </div>
                      
                      <div className="mt-2 flex flex-wrap gap-2">
                        <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                          assignment.isCompleted
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                            : dueStatus.status === 'overdue'
                              ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                              : dueStatus.status === 'due-soon'
                                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                                : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                        }`}>
                          {assignment.isCompleted ? (
                    <>
                              <CheckCircle2 className="mr-1 h-3 w-3" />
                      Completed
                    </>
                          ) : dueStatus.status === 'overdue' ? (
                            <>
                              <AlertCircle className="mr-1 h-3 w-3" />
                              {dueStatus.label}
                    </>
                  ) : (
                            <>
                              <Clock className="mr-1 h-3 w-3" />
                              {dueStatus.label}
                            </>
                          )}
                        </div>
                        
                        <div className="inline-flex items-center px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs text-gray-800 dark:text-gray-300">
                          Due {formatDistanceToNow(new Date(assignment.dueDate), { addSuffix: true })}
                        </div>
                        
                        {assignment.points && (
                          <div className="inline-flex items-center px-2 py-1 bg-purple-100 dark:bg-purple-900/30 rounded-full text-xs text-purple-800 dark:text-purple-400">
                            {assignment.points} points
                          </div>
            )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Todo; 