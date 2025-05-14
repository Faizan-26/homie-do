import React from 'react';
import { Button } from '../../../components/ui/button';
import { Star, FileText, Calendar, Clock, Plus, Edit2, Trash2, Book, Video, Download, ExternalLink, FileIcon, ImageIcon, Film, Music, File } from 'lucide-react';
import { Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ContentCard = ({ children, className = '', onEdit, onDelete, onToggleFavorite, isFavorited, id }) => (
  <div 
    className={`
      bg-white dark:bg-gray-800 
      rounded-lg shadow-sm 
      overflow-hidden 
      border border-gray-200 dark:border-gray-700 
      transition-all duration-200
      hover:shadow-md hover:border-[#F4815B]/20
      dark:hover:border-[#F4815B]/20
      ${className}
    `}
  >
    <div className="absolute top-4 right-4 flex space-x-2">
      {onToggleFavorite && (
        <button
          onClick={() => onToggleFavorite(id)}
          className={`p-1 rounded-full transition-colors ${
            isFavorited
              ? 'text-yellow-500'
              : 'text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300'
          }`}
        >
          <Star className="w-5 h-5" fill={isFavorited ? "currentColor" : "none"} />
        </button>
      )}
      {onEdit && (
        <button
          onClick={() => onEdit(id)}
          className="p-1 rounded-full text-blue-500 hover:text-blue-700 transition-colors"
        >
          <Edit2 className="w-4 h-4" />
        </button>
      )}
      {onDelete && (
        <button
          onClick={() => onDelete(id)}
          className="p-1 rounded-full text-red-500 hover:text-red-700 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      )}
    </div>
    {children}
  </div>
);

const DateDisplay = ({ date }) => (
  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
    <Clock className="w-4 h-4 mr-1" />
    {new Date(date).toLocaleDateString()}
  </div>
);

// File icon component to show appropriate icon based on file type
const FileTypeIcon = ({ fileType }) => {
  switch (fileType.toLowerCase()) {
    case 'image/jpeg':
    case 'image/png':
    case 'image/gif':
    case 'image/webp':
    case 'image/svg+xml':
      return <ImageIcon className="w-4 h-4" />;
    case 'video/mp4':
    case 'video/webm':
    case 'video/ogg':
      return <Film className="w-4 h-4" />;
    case 'audio/mpeg':
    case 'audio/wav':
    case 'audio/ogg':
      return <Music className="w-4 h-4" />;
    case 'application/pdf':
      return <FileText className="w-4 h-4" />;
    case 'application/msword':
    case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
      return <FileIcon className="w-4 h-4" />;
    default:
      return <File className="w-4 h-4" />;
  }
};

// File Chip component for consistent display of attachments
const FileChip = ({ file }) => {
  const navigate = useNavigate();
  
  const handlePreview = () => {
    // Store file data in localStorage before navigating
    localStorage.setItem('previewFileData', JSON.stringify(file));
    navigate('/dashboard/preview-document');
  };
  
  return (
    <div 
      onClick={handlePreview}
      className="flex items-center gap-1 px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors cursor-pointer"
    >
      <FileTypeIcon fileType={file.type || 'application/octet-stream'} />
      <span className="truncate max-w-[150px]">{file.name}</span>
    </div>
  );
};

const LectureItem = ({ lecture, onEdit, onDelete, onToggleFavorite, isFavorited }) => (
  <ContentCard 
    className="p-4 mb-4 relative"
    onEdit={() => onEdit(lecture)}
    onDelete={() => onDelete(lecture.id)}
    onToggleFavorite={() => onToggleFavorite(lecture.id)}
    isFavorited={isFavorited(lecture.id)}
    id={lecture.id}
  >
    <div className="flex items-start space-x-3 pr-24">
      <Video className="w-5 h-5 mt-1 text-[#F4815B]" />
      <div>
        <h3 className="font-medium text-gray-900 dark:text-gray-100">{lecture.title}</h3>
        <DateDisplay date={lecture.date} />
        {lecture.content && (
          <p className="mt-2 text-gray-600 dark:text-gray-400">{lecture.content}</p>
        )}
      </div>
    </div>
    {(lecture.files?.length > 0 || lecture.attachments?.length > 0) && (
      <div className="mt-3 flex flex-wrap gap-2">
        {lecture.files?.map((file, index) => (
          <FileChip key={`file-${index}`} file={file} />
        ))}
        {lecture.attachments?.map((file, index) => (
          <FileChip key={`attachment-${index}`} file={file} />
        ))}
      </div>
    )}
  </ContentCard>
);

const ReadingItem = ({ reading, onEdit, onDelete, onToggleFavorite, isFavorited }) => (
  <ContentCard 
    className="p-4 mb-4 relative"
    onEdit={() => onEdit(reading)}
    onDelete={() => onDelete(reading.id)}
    onToggleFavorite={() => onToggleFavorite(reading.id)}
    isFavorited={isFavorited(reading.id)}
    id={reading.id}
  >
    <div className="flex items-start space-x-3 pr-24">
      <Book className="w-5 h-5 mt-1 text-[#F4815B]" />
      <div>
        <h3 className="font-medium text-gray-900 dark:text-gray-100">{reading.title}</h3>
        {reading.author && <p className="text-sm text-gray-600 dark:text-gray-400">By {reading.author}</p>}
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {reading.type}{reading.source ? ` • ${reading.source}` : ''}
        </p>
      </div>
    </div>
    {(reading.files?.length > 0 || reading.attachments?.length > 0) && (
      <div className="mt-3 flex flex-wrap gap-2">
        {reading.files?.map((file, index) => (
          <FileChip key={`file-${index}`} file={file} />
        ))}
        {reading.attachments?.map((file, index) => (
          <FileChip key={`attachment-${index}`} file={file} />
        ))}
      </div>
    )}
  </ContentCard>
);

const AssignmentItem = ({ assignment, onEdit, onDelete, onToggleFavorite, isFavorited }) => {
  const dueDate = new Date(assignment.dueDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diffTime = dueDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  const getStatusBadge = () => {
    if (assignment.isCompleted) return { text: 'Completed', color: 'green' };
    if (diffDays < 0) return { text: 'Overdue', color: 'red' };
    if (diffDays === 0) return { text: 'Due Today', color: 'red' };
    if (diffDays <= 3) return { text: 'Due Soon', color: 'yellow' };
    return { text: 'Upcoming', color: 'gray' };
  };
  
  const status = getStatusBadge();

  return (
    <ContentCard 
      className="p-4 mb-4 relative"
      onEdit={() => onEdit(assignment)}
      onDelete={() => onDelete(assignment.id)}
      onToggleFavorite={() => onToggleFavorite(assignment.id)}
      isFavorited={isFavorited(assignment.id)}
      id={assignment.id}
    >
      <div className="flex items-start space-x-3 pr-24">
        <FileText className="w-5 h-5 mt-1 text-[#F4815B]" />
        <div>
          <h3 className="font-medium text-gray-900 dark:text-gray-100">{assignment.title}</h3>
          <div className="flex flex-wrap gap-2 mt-2">
            <span className={`px-2 py-1 rounded-full text-xs bg-${status.color}-100 text-${status.color}-800 dark:bg-${status.color}-900/30 dark:text-${status.color}-300`}>
              {status.text}
            </span>
            <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800 dark:bg-gray-700/30 dark:text-gray-300">
              <Calendar className="w-3 h-3 inline mr-1" />
              {dueDate.toLocaleDateString()}
            </span>
            <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800 dark:bg-gray-700/30 dark:text-gray-300">
              {assignment.points} points
            </span>
          </div>
          {assignment.instructions && (
            <p className="mt-2 text-gray-600 dark:text-gray-400">{assignment.instructions}</p>
          )}
        </div>
      </div>
      {(assignment.files?.length > 0 || assignment.attachments?.length > 0) && (
        <div className="mt-3 flex flex-wrap gap-2">
          {assignment.files?.map((file, index) => (
            <FileChip key={`file-${index}`} file={file} />
          ))}
          {assignment.attachments?.map((file, index) => (
            <FileChip key={`attachment-${index}`} file={file} />
          ))}
        </div>
      )}
    </ContentCard>
  );
};

const NoteItem = ({ note, onEdit, onDelete, onToggleFavorite, isFavorited }) => (
  <ContentCard 
    className="p-4 relative"
    onEdit={() => onEdit(note)}
    onDelete={() => onDelete(note.id)}
    onToggleFavorite={() => onToggleFavorite(note.id)}
    isFavorited={isFavorited(note.id)}
    id={note.id}
  >
    <div className="flex items-start space-x-3 pr-24">
      <FileText className="w-5 h-5 mt-1 text-[#F4815B]" />
      <div>
        <h3 className="font-medium text-gray-900 dark:text-gray-100">{note.title}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          <Calendar className="w-4 h-4 inline mr-1" />
          {note.date ? new Date(note.date).toLocaleDateString() : note.createdAt ? new Date(note.createdAt).toLocaleDateString() : 'No date'}
        </p>
        {note.content && (
          <p className="mt-2 text-gray-600 dark:text-gray-400 whitespace-pre-wrap">{note.content}</p>
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
    {(note.files?.length > 0 || note.attachments?.length > 0) && (
      <div className="mt-3 flex flex-wrap gap-2">
        {note.files?.map((file, index) => (
          <FileChip key={`file-${index}`} file={file} />
        ))}
        {note.attachments?.map((file, index) => (
          <FileChip key={`attachment-${index}`} file={file} />
        ))}
      </div>
    )}
  </ContentCard>
);

const TabContent = ({ type, items = [], loading, onEdit, onDelete, onToggleFavorite, isFavorited }) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="animate-spin">
          <Loader2 className="w-8 h-8 text-[#F4815B]" />
        </div>
      </div>
    );
  }

  if (!items?.length) {
    return (
      <div className="text-center py-12 text-gray-500 dark:text-gray-400">
        No {type} available yet.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((item) => {
        switch (type) {
          case 'lectures':
            return (
              <LectureItem
                key={item.id}
                lecture={item}
                onEdit={onEdit}
                onDelete={onDelete}
                onToggleFavorite={onToggleFavorite}
                isFavorited={isFavorited}
              />
            );
          case 'readings':
            return (
              <ReadingItem
                key={item.id}
                reading={item}
                onEdit={onEdit}
                onDelete={onDelete}
                onToggleFavorite={onToggleFavorite}
                isFavorited={isFavorited}
              />
            );
          case 'assignments':
            return (
              <AssignmentItem
                key={item.id}
                assignment={item}
                onEdit={onEdit}
                onDelete={onDelete}
                onToggleFavorite={onToggleFavorite}
                isFavorited={isFavorited}
              />
            );
          case 'notes':
            return (
              <NoteItem
                key={item.id}
                note={item}
                onEdit={onEdit}
                onDelete={onDelete}
                onToggleFavorite={onToggleFavorite}
                isFavorited={isFavorited}
              />
            );
          default:
            return null;
        }
      })}
    </div>
  );
};

export const LecturesTab = ({ lectures, onAdd, onEdit, onDelete, onToggleFavorite, isFavorited }) => (
  <div className="space-y-6">
    <div className="flex justify-between items-center">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Lectures</h2>
      <Button
        onClick={onAdd}
        className="bg-[#F4815B] hover:bg-[#E67048] text-white"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Lecture
      </Button>
    </div>

    {lectures?.length > 0 ? (
      <TabContent type="lectures" items={lectures} onEdit={onEdit} onDelete={onDelete} onToggleFavorite={onToggleFavorite} isFavorited={isFavorited} />
    ) : (
      <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <div className="max-w-sm mx-auto">
          <Calendar className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
            No Lectures Yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Start adding lectures to organize your course materials.
          </p>
          <Button
            onClick={onAdd}
            className="bg-[#F4815B] hover:bg-[#E67048] text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Your First Lecture
          </Button>
        </div>
      </div>
    )}
  </div>
);

export const ReadingsTab = ({ readings, onAdd, onEdit, onDelete, onToggleFavorite, isFavorited }) => (
  <div className="space-y-6">
    <div className="flex justify-between items-center">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Reading Materials</h2>
      <Button
        onClick={onAdd}
        className="bg-[#F4815B] hover:bg-[#E67048] text-white"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Reading
      </Button>
    </div>

    {readings?.length > 0 ? (
      <TabContent type="readings" items={readings} onEdit={onEdit} onDelete={onDelete} onToggleFavorite={onToggleFavorite} isFavorited={isFavorited} />
    ) : (
      <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <div className="max-w-sm mx-auto">
          <Book className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
            No Reading Materials Yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Add reading materials to help students prepare for your course.
          </p>
          <Button
            onClick={onAdd}
            className="bg-[#F4815B] hover:bg-[#E67048] text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Your First Reading
          </Button>
        </div>
      </div>
    )}
  </div>
);

export const AssignmentsTab = ({ assignments, onAdd, onEdit, onDelete, onToggleFavorite, isFavorited }) => (
  <div className="space-y-6">
    <div className="flex justify-between items-center">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Assignments</h2>
      <Button
        onClick={onAdd}
        className="bg-[#F4815B] hover:bg-[#E67048] text-white"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Assignment
      </Button>
    </div>

    {assignments?.length > 0 ? (
      <TabContent type="assignments" items={assignments} onEdit={onEdit} onDelete={onDelete} onToggleFavorite={onToggleFavorite} isFavorited={isFavorited} />
    ) : (
      <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <div className="max-w-sm mx-auto">
          <Clock className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
            No Assignments Yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Create assignments to track student progress and submissions.
          </p>
          <Button
            onClick={onAdd}
            className="bg-[#F4815B] hover:bg-[#E67048] text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Your First Assignment
          </Button>
        </div>
      </div>
    )}
  </div>
);

export const NotesTab = ({ notes, onAdd, onEdit, onDelete, onToggleFavorite, isFavorited }) => (
  <div className="space-y-6">
    <div className="flex justify-between items-center">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Notes</h2>
      <Button
        onClick={onAdd}
        className="bg-[#F4815B] hover:bg-[#E67048] text-white"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Note
      </Button>
    </div>

    {notes?.length > 0 ? (
      <TabContent type="notes" items={notes} onEdit={onEdit} onDelete={onDelete} onToggleFavorite={onToggleFavorite} isFavorited={isFavorited} />
    ) : (
      <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <div className="max-w-sm mx-auto">
          <FileText className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
            No Notes Yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Add notes to keep track of important information about your course.
          </p>
          <Button
            onClick={onAdd}
            className="bg-[#F4815B] hover:bg-[#E67048] text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Your First Note
          </Button>
        </div>
      </div>
    )}
  </div>
); 