import React from 'react';
import { Button } from './ui/button';
import { Star, FileText, ExternalLink, Calendar, Clock, CheckCircle2, Pencil, Trash2 } from 'lucide-react';

/**
 * 
 * @param {Object} assignment - The assignment data
 * @param {string} assignment.id - Assignment ID
 * @param {string} assignment.title - Assignment title
 * @param {string} assignment.dueDate - Due date (ISO string)
 * @param {number} assignment.points - Points value
 * @param {string} assignment.instructions - Assignment instructions
 * @param {string[]} assignment.attachments - Array of attachment filenames
 * @param {string} assignment.subjectName - Optional subject name
 * @param {string} assignment.subjectIcon - Optional subject icon
 * @param {string} assignment.subjectColor - Optional subject color
 * @param {boolean} assignment.completed - Whether the assignment is completed
 * @param {boolean} assignment.isFavorited - Whether the assignment is favorited
 * @param {function} onToggleFavorite - Function to toggle favorite status
 * @param {function} onToggleComplete - Function to toggle completion status
 * @param {function} onEdit - Function to handle edit action
 * @param {function} onDelete - Function to handle delete action
 * @param {function} onViewDetails - Function to handle view details action
 * @param {boolean} showActions - Whether to show action buttons (edit, delete)
 * @param {boolean} showFavorite - Whether to show favorite button
 * @param {boolean} showComplete - Whether to show complete button
 * @param {boolean} minimal - Whether to show a minimal version of the card
 */
const AssignmentCard = ({
  assignment,
  onToggleFavorite,
  onToggleComplete,
  onEdit,
  onDelete,
  onViewDetails,
  showActions = true,
  showFavorite = true,
  showComplete = true,
  minimal = false
}) => {
  const dueDate = new Date(assignment.dueDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diffTime = dueDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  // Determine status badge based on due date
  const getStatusBadge = () => {
    if (diffDays < 0) {
      return <span className="px-2 py-1 rounded-full bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 text-xs">Overdue</span>;
    } else if (diffDays === 0) {
      return <span className="px-2 py-1 rounded-full bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 text-xs">Due Today</span>;
    } else if (diffDays <= 3) {
      return <span className="px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 text-xs">Due Soon</span>;
    } else {
      return <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700/30 dark:text-gray-300 text-xs">Upcoming</span>;
    }
  };
  
  // Handle viewing file attachments
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
      <div className="flex flex-wrap gap-2 mt-2">
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
  
  // For minimal view (like in the subject view)
  if (minimal) {
    return (
      <div className="border rounded-lg p-4 bg-white dark:bg-gray-800 shadow-sm">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium">{assignment.title}</h3>
            <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2 mt-1">
              <span>Due: {dueDate.toLocaleDateString()}</span>
              <span>•</span>
              <span>{assignment.points} points</span>
            </div>
          </div>
          {getStatusBadge()}
        </div>
        <p className="text-sm mt-2 text-gray-700 dark:text-gray-300">{assignment.instructions}</p>
        {renderFileAttachments(assignment.attachments)}
      </div>
    );
  }
  
  // Full card for Todo and other views
  return (
    <div className={`border rounded-lg bg-white dark:bg-gray-800 shadow-sm overflow-hidden ${assignment.completed ? 'opacity-60' : ''}`}>
      <div className="p-4 border-b dark:border-gray-700">
        <div className="flex flex-col md:flex-row md:items-start justify-between pb-2 gap-4">
          <div>
            <h3 className="text-lg font-semibold flex items-center gap-2">
              {assignment.subjectIcon && assignment.subjectColor && (
                <span className={`w-6 h-6 flex items-center justify-center rounded-md ${assignment.subjectColor}`}>
                  {assignment.subjectIcon}
                </span>
              )}
              {assignment.title}
            </h3>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {assignment.subjectName && (
                <>
                  {assignment.subjectName} • 
                </>
              )}
              {assignment.points} points
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {getStatusBadge()}
            <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700/30 dark:text-gray-300 text-xs flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {dueDate.toLocaleDateString()}
            </span>
            <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700/30 dark:text-gray-300 text-xs flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {diffDays === 0 
                ? "Today" 
                : diffDays < 0 
                  ? `${Math.abs(diffDays)} day${Math.abs(diffDays) > 1 ? 's' : ''} overdue` 
                  : `${diffDays} day${diffDays > 1 ? 's' : ''} left`}
            </span>
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <p className="text-sm mb-4">{assignment.instructions}</p>
        {renderFileAttachments(assignment.attachments)}
      </div>
      
      <div className="p-4 border-t dark:border-gray-700 flex flex-col sm:flex-row justify-between gap-2">
        <div className="flex gap-2">
          {showFavorite && onToggleFavorite && (
            <button 
              onClick={() => onToggleFavorite(assignment.id)}
              className={`p-1 rounded-full ${assignment.isFavorited ? 'text-yellow-500' : 'text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300'}`}
              aria-label={assignment.isFavorited ? "Remove from favorites" : "Add to favorites"}
            >
              <Star className="h-5 w-5" fill={assignment.isFavorited ? "currentColor" : "none"} />
            </button>
          )}
          
          {showActions && onEdit && (
            <button 
              onClick={() => onEdit(assignment)}
              className="text-blue-500 hover:text-blue-700 px-2 py-1 flex items-center gap-1"
            >
              <Pencil className="h-4 w-4" />
              <span className="text-sm">Edit</span>
            </button>
          )}
          
          {showActions && onDelete && (
            <button 
              onClick={() => onDelete(assignment.id)}
              className="text-red-500 hover:text-red-700 px-2 py-1 flex items-center gap-1"
            >
              <Trash2 className="h-4 w-4" />
              <span className="text-sm">Delete</span>
            </button>
          )}
        </div>
        
        <div className="flex gap-2">
          {showComplete && onToggleComplete && (
            <Button 
              variant={assignment.completed ? "success" : "outline"} 
              onClick={() => onToggleComplete(assignment.id)}
              className={assignment.completed ? "bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900 dark:text-green-100 dark:hover:bg-green-800" : ""}
            >
              {assignment.completed ? (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Completed
                </>
              ) : (
                'Mark Complete'
              )}
            </Button>
          )}
          
          {onViewDetails && (
            <Button variant="outline" onClick={() => onViewDetails(assignment)}>
              View Details
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssignmentCard; 