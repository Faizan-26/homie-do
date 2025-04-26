import React from 'react';
import { 
  Calendar, 
  Star, 
  CheckCircle, 
  Trash2, 
  Edit, 
  Info, 
  File,
  FileText,
  FileImage,
  FilePdf
} from 'lucide-react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardContent, CardFooter, CardHeader } from './ui/card';
import { cn } from '@/lib/utils';

/**
 * A reusable assignment card component that can be used throughout the application
 * @param {Object} props
 * @param {Object} props.assignment - Assignment data
 * @param {string} props.assignment.id - Assignment ID
 * @param {string} props.assignment.title - Assignment title
 * @param {string} props.assignment.dueDate - Due date string
 * @param {number} props.assignment.points - Points for the assignment
 * @param {string} props.assignment.instructions - Assignment instructions
 * @param {Array} props.assignment.attachments - Array of attachment objects
 * @param {boolean} props.assignment.completed - Whether the assignment is completed
 * @param {boolean} props.assignment.favorite - Whether the assignment is favorited
 * @param {Function} props.onToggleFavorite - Function to toggle favorite status
 * @param {Function} props.onToggleComplete - Function to toggle completion status
 * @param {Function} props.onEdit - Function to edit the assignment
 * @param {Function} props.onDelete - Function to delete the assignment
 * @param {Function} props.onViewDetails - Function to view assignment details
 * @param {boolean} props.minimal - Whether to show a minimal version of the card
 * @param {string} props.className - Additional class names
 */
const AssignmentCardGlobal = ({ 
  assignment, 
  onToggleFavorite, 
  onToggleComplete, 
  onEdit, 
  onDelete, 
  onViewDetails,
  minimal = false,
  className
}) => {
  // Determine status based on due date
  const getStatusBadge = () => {
    if (!assignment.dueDate) return null;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const dueDate = new Date(assignment.dueDate);
    dueDate.setHours(0, 0, 0, 0);
    
    const diffTime = dueDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return <Badge variant="destructive">Overdue</Badge>;
    } else if (diffDays === 0) {
      return <Badge variant="warning">Due Today</Badge>;
    } else if (diffDays <= 3) {
      return <Badge variant="warning">Due Soon</Badge>;
    } else {
      return <Badge variant="outline">Upcoming</Badge>;
    }
  };

  // Handle viewing file attachments
  const handleViewFile = (file) => {
    // Prepare file data for preview page
    const fileData = {
      name: file.name,
      url: file.url,
      type: file.type || 'application/octet-stream',
      size: file.size,
      lastModified: file.lastModified
    };
    
    // Store file data in localStorage so the preview page can access it
    localStorage.setItem('previewFile', JSON.stringify(fileData));
    
    // Open preview in new tab
    window.open('/dashboard/preview_document', '_blank');
  };

  // Render file attachments as chips/buttons
  const renderFileAttachments = () => {
    if (!assignment.attachments || assignment.attachments.length === 0) {
      return null;
    }

    return (
      <div className="flex flex-wrap gap-2 mt-2">
        {assignment.attachments.map((file, index) => {
          // Determine file icon based on file type
          let FileIcon = FileText;
          if (file.type?.includes('image')) {
            FileIcon = FileImage;
          } else if (file.type?.includes('pdf')) {
            FileIcon = FilePdf;
          } else {
            FileIcon = File;
          }

          return (
            <Button
              key={index}
              variant="outline"
              size="sm"
              className="flex items-center gap-1 text-xs hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => handleViewFile(file)}
            >
              <FileIcon className="h-3.5 w-3.5" />
              <span className="max-w-[120px] truncate">{file.name}</span>
            </Button>
          );
        })}
      </div>
    );
  };

  // Render minimal card (for compact views)
  if (minimal) {
    return (
      <Card className={cn("hover:shadow-md transition-shadow", className)}>
        <CardContent className="p-3">
          <div className="flex justify-between items-start">
            <div className="mr-2">
              <h3 className="font-medium text-sm line-clamp-1">{assignment.title}</h3>
              <div className="flex items-center text-gray-500 dark:text-gray-400 text-xs mt-1">
                <Calendar className="h-3 w-3 mr-1" />
                <span>{assignment.dueDate ? new Date(assignment.dueDate).toLocaleDateString() : 'No due date'}</span>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              {getStatusBadge()}
            </div>
          </div>
          {renderFileAttachments()}
        </CardContent>
      </Card>
    );
  }

  // Render full card
  return (
    <Card className={cn("hover:shadow-md transition-shadow", className)}>
      <CardHeader className="p-4 pb-2">
        <div className="flex justify-between items-start">
          <div className="mr-2">
            <h3 className="font-medium text-base">{assignment.title}</h3>
            <div className="flex items-center text-gray-500 dark:text-gray-400 text-xs mt-1">
              <Calendar className="h-3 w-3 mr-1" />
              <span>{assignment.dueDate ? new Date(assignment.dueDate).toLocaleDateString() : 'No due date'}</span>
              {assignment.points !== undefined && (
                <>
                  <span className="mx-1">•</span>
                  <span>{assignment.points} {assignment.points === 1 ? 'point' : 'points'}</span>
                </>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-1">
            {getStatusBadge()}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-2 pb-2">
        {assignment.instructions && (
          <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-2">
            {assignment.instructions}
          </p>
        )}
        {renderFileAttachments()}
      </CardContent>
      <CardFooter className="p-4 pt-2 flex justify-between">
        <div className="flex space-x-1">
          <Button variant="ghost" size="sm" onClick={() => onEdit?.(assignment.id)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onDelete?.(assignment.id)}>
            <Trash2 className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onToggleFavorite?.(assignment.id)}
            className={assignment.favorite ? "text-yellow-500" : ""}
          >
            <Star className="h-4 w-4" fill={assignment.favorite ? "currentColor" : "none"} />
          </Button>
        </div>
        <div className="flex space-x-1">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onToggleComplete?.(assignment.id)}
            className={assignment.completed ? "text-green-500" : ""}
          >
            <CheckCircle className="h-4 w-4" fill={assignment.completed ? "currentColor" : "none"} />
          </Button>
          {onViewDetails && (
            <Button variant="outline" size="sm" onClick={() => onViewDetails(assignment.id)}>
              <Info className="h-4 w-4 mr-1" />
              Details
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default AssignmentCardGlobal; 