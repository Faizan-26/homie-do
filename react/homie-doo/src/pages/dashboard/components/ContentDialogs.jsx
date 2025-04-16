import React, { useState, useEffect } from 'react';
import { Button } from '../../../components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../../components/ui/dialog';
import FileUploader from '../../../components/FileUploader';
import cloudinaryService from '../../../utils/cloudinaryService';
import FileViewer from '../../../components/FileViewer';

// Lecture Dialogs
export const AddLectureDialog = ({ isOpen, onClose, onAddLecture }) => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [content, setContent] = useState('');
  const [attachments, setAttachments] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [uploadErrors, setUploadErrors] = useState([]);

  const handleFileUploadComplete = (results) => {
    // Add uploaded files to the state
    const newFiles = results.map(fileData => {
      // Always prioritize the original filename from the uploaded file
      const fileName = fileData.originalFilename || fileData.original_filename || 
                      (fileData.public_id ? fileData.public_id.split('/').pop() : 'Unknown file');
      
      return {
        name: fileName,
        originalName: fileName, // Store the original name for consistency
        type: fileData.resource_type === 'image' && fileData.format ? 
              `image/${fileData.format}` : 
              fileData.format || 'application/octet-stream',
        size: fileData.bytes || 0,
        url: fileData.secure_url || fileData.url || '',
        publicId: fileData.public_id || '',
        resourceType: fileData.resource_type || 'raw'
      };
    });
    
    setUploadedFiles(prev => [...prev, ...results]);
    setSelectedFiles(prev => [...prev, ...newFiles]);
    
    // Log successful uploads
    console.log('Files uploaded successfully:', newFiles);
  };

  const handleFileUploadError = (errors) => {
    console.error('File upload errors:', errors);
    setUploadErrors(errors.map(err => err.message || 'Unknown upload error'));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim() && content.trim()) {
      // Process attachments list
      const attachmentsList = attachments
        .split('\n')
        .filter(a => a.trim())
        .map(a => a.trim());
      
      // Add the files to attachments - use original filename when available
      const fileAttachments = selectedFiles.map(file => file.originalName || file.name);
      
      onAddLecture({
        title: title.trim(),
        date,
        content: content.trim(),
        attachments: [...attachmentsList, ...fileAttachments],
        files: selectedFiles
      });
      
      // Reset form
      setTitle('');
      setDate(new Date().toISOString().split('T')[0]);
      setContent('');
      setAttachments('');
      setSelectedFiles([]);
      setUploadedFiles([]);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Add New Lecture</DialogTitle>
          <DialogDescription>
            Add a new lecture to your course materials
          </DialogDescription>
        </DialogHeader>
        
        <div className="overflow-y-auto pr-2">
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="lecture-title" className="text-sm font-medium">
                Lecture Title
              </label>
              <input
                id="lecture-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Introduction to the Course"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="lecture-date" className="text-sm font-medium">
                Date
              </label>
              <input
                id="lecture-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="lecture-content" className="text-sm font-medium">
                Content
              </label>
              <textarea
                id="lecture-content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Lecture content or summary"
                rows={4}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="lecture-attachments" className="text-sm font-medium">
                Text Attachments (one per line)
              </label>
              <textarea
                id="lecture-attachments"
                value={attachments}
                onChange={(e) => setAttachments(e.target.value)}
                placeholder="lecture.pdf&#10;slides.pptx"
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">File Attachments</label>
              <FileUploader 
                onUploadComplete={handleFileUploadComplete}
                onUploadError={handleFileUploadError}
                maxFiles={10}
                autoUpload={true}
              />
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">Add Lecture</Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export const EditLectureDialog = ({ isOpen, onClose, lecture, onUpdateLecture }) => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [content, setContent] = useState('');
  const [attachments, setAttachments] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [uploadErrors, setUploadErrors] = useState([]);

  useEffect(() => {
    if (lecture) {
      setTitle(lecture.title || '');
      setDate(lecture.date || new Date().toISOString().split('T')[0]);
      setContent(lecture.content || '');
      
      // Filter out file attachments which would be in the files array
      const fileNames = lecture.files ? lecture.files.map(file => file.name) : [];
      const textAttachments = lecture.attachments 
        ? lecture.attachments.filter(att => !fileNames.includes(att))
        : [];
      
      setAttachments(textAttachments.join('\n'));
      setSelectedFiles(lecture.files || []);
      
      // Set uploaded files to match the lecture files
      if (lecture.files && lecture.files.length > 0) {
        // Convert files to match the format expected by FileUploader
        setUploadedFiles(lecture.files.map(file => ({
          original_filename: file.name || '',
          format: file.type ? (file.type.split('/')[1] || '') : '',
          bytes: file.size || 0,
          secure_url: file.url || '',
          public_id: file.publicId || '',
          resource_type: file.resourceType || 'raw'
        })));
      } else {
        setUploadedFiles([]);
      }
    }
  }, [lecture]);

  const handleFileUploadComplete = (results) => {
    // Add uploaded files to the state
    const newFiles = results.map(fileData => {
      // Always prioritize the original filename from the uploaded file
      const fileName = fileData.originalFilename || fileData.original_filename || 
                      (fileData.public_id ? fileData.public_id.split('/').pop() : 'Unknown file');
      
      return {
        name: fileName,
        originalName: fileName, // Store the original name for consistency
        type: fileData.resource_type === 'image' && fileData.format ? 
              `image/${fileData.format}` : 
              fileData.format || 'application/octet-stream',
        size: fileData.bytes || 0,
        url: fileData.secure_url || fileData.url || '',
        publicId: fileData.public_id || '',
        resourceType: fileData.resource_type || 'raw'
      };
    });
    
    setUploadedFiles(prev => [...prev, ...results]);
    setSelectedFiles(prev => [...prev, ...newFiles]);
    
    // Log successful uploads
    console.log('Files uploaded successfully:', newFiles);
  };

  const handleFileUploadError = (errors) => {
    console.error('File upload errors:', errors);
    setUploadErrors(errors.map(err => err.message || 'Unknown upload error'));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim() && content.trim()) {
      const attachmentsList = attachments
        .split('\n')
        .filter(a => a.trim())
        .map(a => a.trim());
      
      // Add the files to attachments
      const fileAttachments = selectedFiles.map(file => file.name);
      
      onUpdateLecture({
        ...lecture,
        title: title.trim(),
        date,
        content: content.trim(),
        attachments: [...attachmentsList, ...fileAttachments],
        files: selectedFiles
      });
      
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Edit Lecture</DialogTitle>
          <DialogDescription>
            Update lecture details
          </DialogDescription>
        </DialogHeader>
        
        <div className="overflow-y-auto pr-2">
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="edit-lecture-title" className="text-sm font-medium">
                Lecture Title
              </label>
              <input
                id="edit-lecture-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="edit-lecture-date" className="text-sm font-medium">
                Date
              </label>
              <input
                id="edit-lecture-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="edit-lecture-content" className="text-sm font-medium">
                Content
              </label>
              <textarea
                id="edit-lecture-content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={4}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="edit-lecture-attachments" className="text-sm font-medium">
                Text Attachments (one per line)
              </label>
              <textarea
                id="edit-lecture-attachments"
                value={attachments}
                onChange={(e) => setAttachments(e.target.value)}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">File Attachments</label>
              <FileUploader 
                onUploadComplete={handleFileUploadComplete}
                onUploadError={handleFileUploadError}
                maxFiles={10}
                autoUpload={true}
              />
              
              {selectedFiles.length > 0 && (
                <div className="mt-3">
                  <h3 className="text-sm font-medium mb-2">Current Files:</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                    {selectedFiles.map((file, index) => (
                      <div 
                        key={index} 
                        className="flex items-center gap-2 bg-gray-50 dark:bg-gray-700 p-2 rounded-md cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                        onClick={() => file.url ? window.open(file.url, '_blank') : null}
                      >
                        <span className="flex-shrink-0">
                          {!file.type ? '📁' :
                           file.type.includes('image') ? '🖼️' : 
                           file.type.includes('pdf') ? '📄' :
                           file.type.includes('presentation') ? '📊' : '📁'}
                        </span>
                        <span className="text-sm truncate flex-1">{file.name || 'Unnamed file'}</span>
                        <button 
                          type="button" 
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedFiles(prev => prev.filter((_, i) => i !== index));
                          }}
                          className="text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 text-xs"
                        >
                          ✖️
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">Update Lecture</Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Define a reading types enum
const READING_TYPES = {
  TEXTBOOK: 'Textbook',
  JOURNAL: 'Journal Article',
  VIDEO: 'Video',
  WEBSITE: 'Website',
  BOOK: 'Book',
  OTHER: 'Other'
};

// Reading Materials Dialogs
export const AddReadingDialog = ({ isOpen, onClose, onAddReading }) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [type, setType] = useState('Textbook');
  const [chapters, setChapters] = useState('');
  const [source, setSource] = useState('');
  const [length, setLength] = useState('');
  const [url, setUrl] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [uploadErrors, setUploadErrors] = useState([]);

  const handleFileUploadComplete = (results) => {
    setUploadedFiles(prev => [...prev, ...results]);
    console.log('Reading files uploaded:', results);
  };

  const handleFileUploadError = (errors) => {
    console.error('File upload errors:', errors);
    setUploadErrors(errors.map(err => err.message || 'Unknown upload error'));
  };

  const formatFileSize = (bytes) => {
    if (!bytes || isNaN(bytes)) return '0 B';
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (title.trim()) {
      // Process uploaded files
      const files = uploadedFiles.map(fileData => ({
        name: fileData.original_filename || (fileData.public_id ? fileData.public_id.split('/').pop() : 'file'),
        type: fileData.resource_type === 'image' ? `image/${fileData.format}` : fileData.format || 'application/octet-stream',
        size: fileData.bytes || 0,
        url: fileData.secure_url || fileData.url || '',
        publicId: fileData.public_id || '',
        resourceType: fileData.resource_type || 'raw'
      }));
      
      // Create file attachments list
      const attachments = files.map(file => file.name);
      
      onAddReading({
        title: title.trim(),
        author: author.trim(),
        type,
        chapters: type === 'Textbook' ? chapters.trim() : null,
        source: ['Journal Article', 'Web Resource', 'Video'].includes(type) ? source.trim() : null,
        length: type === 'Video' ? length.trim() : null,
        url: ['Web Resource', 'Video'].includes(type) ? url.trim() : null,
        files,
        attachments
      });
      
      // Reset form
      setTitle('');
      setAuthor('');
      setType('Textbook');
      setChapters('');
      setSource('');
      setLength('');
      setUrl('');
      setUploadedFiles([]);
      setUploadErrors([]);
      onClose();
    }
  };

  const renderTypeSpecificFields = () => {
    switch (type) {
      case READING_TYPES.TEXTBOOK:
      case READING_TYPES.BOOK:
        return (
          <>
            <div className="space-y-2">
              <label htmlFor="reading-author" className="text-sm font-medium">
                Author
              </label>
              <input
                id="reading-author"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="e.g., John Smith"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="reading-chapters" className="text-sm font-medium">
                Chapters/Pages
              </label>
              <input
                id="reading-chapters"
                value={chapters}
                onChange={(e) => setChapters(e.target.value)}
                placeholder="e.g., Ch 1-3, pp. 10-45"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </>
        );
      
      case READING_TYPES.JOURNAL:
        return (
          <>
            <div className="space-y-2">
              <label htmlFor="reading-author" className="text-sm font-medium">
                Author
              </label>
              <input
                id="reading-author"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="e.g., Smith, J. et al."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="reading-source" className="text-sm font-medium">
                Journal Details
              </label>
              <input
                id="reading-source"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                placeholder="e.g., Journal of Biology, Vol 5(2), pp. 123-145"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </>
        );
      
      case READING_TYPES.VIDEO:
        return (
          <>
            <div className="space-y-2">
              <label htmlFor="reading-url" className="text-sm font-medium">
                Video URL
              </label>
              <input
                id="reading-url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="e.g., https://youtube.com/watch?v=..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="reading-length" className="text-sm font-medium">
                Duration
              </label>
              <input
                id="reading-length"
                value={length}
                onChange={(e) => setLength(e.target.value)}
                placeholder="e.g., 10:30"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </>
        );
      
      case READING_TYPES.WEBSITE:
        return (
          <div className="space-y-2">
            <label htmlFor="reading-url" className="text-sm font-medium">
              Website URL
            </label>
            <input
              id="reading-url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="e.g., https://example.com/article"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        );
      
      case READING_TYPES.OTHER:
      default:
        return (
          <>
            <div className="space-y-2">
              <label htmlFor="reading-author" className="text-sm font-medium">
                Author (Optional)
              </label>
              <input
                id="reading-author"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Author name(s)"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="reading-source" className="text-sm font-medium">
                Source (Optional)
              </label>
              <input
                id="reading-source"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                placeholder="Source information"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </>
        );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Add Reading Material</DialogTitle>
          <DialogDescription>
            Add a new reading resource to your course
          </DialogDescription>
        </DialogHeader>
        
        <div className="overflow-y-auto pr-2">
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="reading-title" className="text-sm font-medium">
                Title
              </label>
              <input
                id="reading-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Introduction to Biology"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="reading-type" className="text-sm font-medium">
                Type
              </label>
              <select
                id="reading-type"
                value={type}
                onChange={(e) => setType(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {Object.values(READING_TYPES).map((readingType) => (
                  <option key={readingType} value={readingType}>
                    {readingType}
                  </option>
                ))}
              </select>
            </div>
            
            {renderTypeSpecificFields()}
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Reading Files</label>
              <FileUploader 
                onUploadComplete={handleFileUploadComplete}
                onUploadError={handleFileUploadError}
                maxFiles={10}
                autoUpload={true}
              />
              
              {uploadedFiles.length > 0 && (
                <div className="mt-3">
                  <h3 className="text-sm font-medium mb-2">Uploaded Files:</h3>
                  <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto p-2">
                    {uploadedFiles.map((file, index) => {
                      const fileObj = {
                        name: file.originalName || file.original_filename || file.name || (file.public_id ? file.public_id.split('/').pop() : 'Unknown file'),
                        type: file.resource_type === 'image' ? `image/${file.format}` : file.format || 'application/octet-stream',
                        size: file.bytes || 0,
                        url: file.secure_url || file.url || '',
                        publicId: file.public_id || '',
                        resourceType: file.resource_type || 'raw'
                      };
                      
                      return (
                        <div 
                          key={index} 
                          className="flex items-center gap-2 bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-full cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                        >
                          <span className="flex-shrink-0">
                            {getFileIcon(fileObj)}
                          </span>
                          <span className="text-sm truncate max-w-[150px]">{fileObj.name}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              
              {uploadErrors.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm text-red-500 dark:text-red-400">Upload errors:</p>
                  <ul className="text-xs text-red-500 dark:text-red-400 list-disc ml-4">
                    {uploadErrors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">Add Reading</Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export const EditReadingDialog = ({ isOpen, onClose, reading, onUpdateReading }) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [type, setType] = useState('Textbook');
  const [chapters, setChapters] = useState('');
  const [source, setSource] = useState('');
  const [length, setLength] = useState('');
  const [url, setUrl] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadErrors, setUploadErrors] = useState([]);
  
  // Initialize form with reading data when opened
  useEffect(() => {
    if (reading) {
      setTitle(reading.title || '');
      setAuthor(reading.author || '');
      setType(reading.type || 'Textbook');
      setChapters(reading.chapters || '');
      setSource(reading.source || '');
      setLength(reading.length || '');
      setUrl(reading.url || '');
      setSelectedFiles(reading.files || []);
    }
  }, [reading]);
  
  const handleFileUploadComplete = (results) => {
    const newFiles = results.map(fileData => {
      // Always prioritize the original filename from the uploaded file
      const fileName = fileData.originalFilename || fileData.original_filename || 
                      (fileData.public_id ? fileData.public_id.split('/').pop() : 'Unknown file');
      
      return {
        name: fileName,
        originalName: fileName, // Store the original name for consistency
        type: fileData.resource_type === 'image' && fileData.format ? 
              `image/${fileData.format}` : 
              fileData.format || 'application/octet-stream',
        size: fileData.bytes || 0,
        url: fileData.secure_url || fileData.url || '',
        publicId: fileData.public_id || '',
        resourceType: fileData.resource_type || 'raw'
      };
    });
    
    setUploadedFiles(prev => [...prev, ...results]);
    setSelectedFiles(prev => [...prev, ...newFiles]);
    console.log('Files uploaded successfully:', newFiles);
  };

  const handleFileUploadError = (errors) => {
    console.error('File upload errors:', errors);
    setUploadErrors(errors.map(err => err.message || 'Unknown upload error'));
  };
  
  const handleRemoveFile = (indexToRemove) => {
    setSelectedFiles(prevFiles => prevFiles.filter((_, index) => index !== indexToRemove));
  };

  const formatFileSize = (bytes) => {
    if (!bytes || isNaN(bytes)) return '0 B';
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (title.trim()) {
      // Create file attachments list
      const attachments = selectedFiles.map(file => file.name);
      
      onUpdateReading({
        ...reading,
        title: title.trim(),
        author: author.trim(),
        type,
        chapters: type === 'Textbook' ? chapters.trim() : null,
        source: ['Journal Article', 'Web Resource', 'Video'].includes(type) ? source.trim() : null,
        length: type === 'Video' ? length.trim() : null,
        url: ['Web Resource', 'Video'].includes(type) ? url.trim() : null,
        files: selectedFiles,
        attachments
      });
      
      onClose();
    }
  };

  const renderTypeSpecificFields = () => {
    switch (type) {
      case READING_TYPES.TEXTBOOK:
      case READING_TYPES.BOOK:
        return (
          <>
            <div className="space-y-2">
              <label htmlFor="edit-reading-author" className="text-sm font-medium">
                Author
              </label>
              <input
                id="edit-reading-author"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="edit-reading-chapters" className="text-sm font-medium">
                Chapters/Pages
              </label>
              <input
                id="edit-reading-chapters"
                value={chapters}
                onChange={(e) => setChapters(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </>
        );
      
      case READING_TYPES.JOURNAL:
        return (
          <>
            <div className="space-y-2">
              <label htmlFor="edit-reading-author" className="text-sm font-medium">
                Author
              </label>
              <input
                id="edit-reading-author"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="edit-reading-source" className="text-sm font-medium">
                Journal Details
              </label>
              <input
                id="edit-reading-source"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </>
        );
      
      case READING_TYPES.VIDEO:
        return (
          <>
            <div className="space-y-2">
              <label htmlFor="edit-reading-url" className="text-sm font-medium">
                Video URL
              </label>
              <input
                id="edit-reading-url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="edit-reading-length" className="text-sm font-medium">
                Duration
              </label>
              <input
                id="edit-reading-length"
                value={length}
                onChange={(e) => setLength(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </>
        );
      
      case READING_TYPES.WEBSITE:
        return (
          <div className="space-y-2">
            <label htmlFor="edit-reading-url" className="text-sm font-medium">
              Website URL
            </label>
            <input
              id="edit-reading-url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        );
      
      case READING_TYPES.OTHER:
      default:
        return (
          <>
            <div className="space-y-2">
              <label htmlFor="edit-reading-author" className="text-sm font-medium">
                Author (Optional)
              </label>
              <input
                id="edit-reading-author"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="edit-reading-source" className="text-sm font-medium">
                Source (Optional)
              </label>
              <input
                id="edit-reading-source"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </>
        );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Edit Reading Material</DialogTitle>
          <DialogDescription>
            Update reading material details
          </DialogDescription>
        </DialogHeader>
        
        <div className="overflow-y-auto pr-2">
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="edit-reading-title" className="text-sm font-medium">
                Title
              </label>
              <input
                id="edit-reading-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="edit-reading-type" className="text-sm font-medium">
                Type
              </label>
              <select
                id="edit-reading-type"
                value={type}
                onChange={(e) => setType(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {Object.values(READING_TYPES).map((readingType) => (
                  <option key={readingType} value={readingType}>
                    {readingType}
                  </option>
                ))}
              </select>
            </div>
            
            {renderTypeSpecificFields()}
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Reading Files</label>
              
              {selectedFiles.length > 0 && (
                <div className="mt-2 mb-4">
                  <h3 className="text-sm font-medium mb-2">Current Files:</h3>
                  <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto p-2 border border-gray-200 dark:border-gray-700 rounded-md">
                    {selectedFiles.map((file, index) => (
                      <div 
                        key={index} 
                        className="flex items-center gap-2 bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-full group"
                      >
                        <span className="flex-shrink-0">
                          {getFileIcon(file)}
                        </span>
                        <span className="text-sm truncate max-w-[120px]">{file.name}</span>
                        <button
                          type="button"
                          className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => handleRemoveFile(index)}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <FileUploader 
                onUploadComplete={handleFileUploadComplete}
                onUploadError={handleFileUploadError}
                maxFiles={10}
                autoUpload={true}
              />
              
              {uploadErrors.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm text-red-500 dark:text-red-400">Upload errors:</p>
                  <ul className="text-xs text-red-500 dark:text-red-400 list-disc ml-4">
                    {uploadErrors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">Update Reading</Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Get file icon based on file data
const getFileIcon = (file) => {
  if (!file) return '📁';

  if (file.type) {
    if (file.type.startsWith('image/')) return '🖼️';
    if (file.type.includes('pdf')) return '📄';
    if (file.type.includes('powerpoint') || file.type.includes('presentation') || file.type.includes('ppt')) return '📊';
    if (file.type.includes('word') || file.type.includes('document') || file.type.includes('doc')) return '📝';
    if (file.type.includes('excel') || file.type.includes('spreadsheet') || file.type.includes('xls')) return '📈';
  }
  
  if (file.resourceType === 'image' || file.resource_type === 'image') return '🖼️';
  
  // Check format if available
  if (file.format) {
    if (file.format === 'pdf') return '📄';
    if (file.format.includes('ppt')) return '📊';
    if (file.format.includes('doc')) return '📝';
    if (file.format.includes('xls')) return '📈';
  }
  
  // If no type is available, try to determine from the filename
  const filename = file.originalName || file.name || file.original_filename || '';
  const extension = filename.split('.').pop()?.toLowerCase();
  
  if (extension === 'pdf') return '📄';
  if (['doc', 'docx'].includes(extension)) return '📝';
  if (['ppt', 'pptx'].includes(extension)) return '📊';
  if (['xls', 'xlsx', 'csv'].includes(extension)) return '📈';
  if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(extension)) return '🖼️';
  
  return '📁';
};

// Assignment Dialogs
export const AddAssignmentDialog = ({ isOpen, onClose, onAddAssignment }) => {
  const [title, setTitle] = useState('');
  const [instructions, setInstructions] = useState('');
  const [dueDate, setDueDate] = useState(new Date().toISOString().split('T')[0]);
  const [points, setPoints] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [uploadErrors, setUploadErrors] = useState([]);
  const [viewFile, setViewFile] = useState(null);

  // Add format file size function
  const formatFileSize = (bytes) => {
    if (!bytes || isNaN(bytes)) return '0 B';
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const handleFileUploadComplete = (results) => {
    setUploadedFiles(prev => [...prev, ...results]);
    console.log('Assignment files uploaded:', results);
  };

  const handleFileUploadError = (errors) => {
    console.error('File upload errors:', errors);
    setUploadErrors(errors.map(err => err.message || 'Unknown upload error'));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim() && instructions.trim()) {
      // Process uploaded files
      const files = uploadedFiles.map(fileData => ({
        name: fileData.original_filename || (fileData.public_id ? fileData.public_id.split('/').pop() : 'file'),
        type: fileData.resource_type === 'image' ? `image/${fileData.format}` : fileData.format || 'application/octet-stream',
        size: fileData.bytes || 0,
        url: fileData.secure_url || fileData.url || '',
        publicId: fileData.public_id || '',
        resourceType: fileData.resource_type || 'raw'
      }));
      
      // Create file attachments list
      const attachments = files.map(file => file.name);
      
      onAddAssignment({
        title: title.trim(),
        instructions: instructions.trim(),
        dueDate,
        points: points ? parseInt(points, 10) : null,
        completed: false,
        files,
        attachments
      });
      
      // Reset form
      setTitle('');
      setInstructions('');
      setDueDate(new Date().toISOString().split('T')[0]);
      setPoints('');
      setUploadedFiles([]);
      setUploadErrors([]);
      onClose();
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[500px] max-h-[85vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Add Assignment</DialogTitle>
            <DialogDescription>
              Add a new assignment to your course
            </DialogDescription>
          </DialogHeader>
          
          <div className="overflow-y-auto pr-2">
            <form onSubmit={handleSubmit} className="space-y-4 py-4">
              <div className="space-y-2">
                <label htmlFor="assignment-title" className="text-sm font-medium">
                  Assignment Title
                </label>
                <input
                  id="assignment-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Weekly Problem Set 1"
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="assignment-instructions" className="text-sm font-medium">
                  Instructions
                </label>
                <textarea
                  id="assignment-instructions"
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  placeholder="Assignment instructions and requirements"
                  rows={3}
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="assignment-due-date" className="text-sm font-medium">
                  Due Date
                </label>
                <input
                  id="assignment-due-date"
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="assignment-points" className="text-sm font-medium">
                  Points
                </label>
                <input
                  id="assignment-points"
                  type="number"
                  value={points}
                  onChange={(e) => setPoints(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Assignment Files</label>
                <FileUploader 
                  onUploadComplete={handleFileUploadComplete}
                  onUploadError={handleFileUploadError}
                  maxFiles={10}
                  autoUpload={true}
                />
                
                {uploadedFiles.length > 0 && (
                  <div className="mt-3">
                    <h3 className="text-sm font-medium mb-2">Uploaded Files:</h3>
                    <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto p-2">
                      {uploadedFiles.map((file, index) => {
                        const fileObj = {
                          name: file.originalName || file.original_filename || file.name || (file.public_id ? file.public_id.split('/').pop() : 'Unknown file'),
                          type: file.resource_type === 'image' ? `image/${file.format}` : file.format || 'application/octet-stream',
                          size: file.bytes || 0,
                          url: file.secure_url || file.url || '',
                          publicId: file.public_id || '',
                          resourceType: file.resource_type || 'raw'
                        };
                        
                        return (
                          <div 
                            key={index} 
                            className="flex items-center gap-2 bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-full cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                          >
                            <span className="flex-shrink-0">
                              {getFileIcon(fileObj)}
                            </span>
                            <span className="text-sm truncate max-w-[150px]">{fileObj.name}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit">Add Assignment</Button>
              </DialogFooter>
            </form>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* File preview dialog */}
      {viewFile && (
        <Dialog open={Boolean(viewFile)} onOpenChange={() => setViewFile(null)}>
          <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-hidden flex flex-col">
            <DialogHeader>
              <DialogTitle>{viewFile.name}</DialogTitle>
            </DialogHeader>
            <div className="overflow-y-auto p-2 flex-1">
              <FileViewer 
                file={viewFile}
                name={viewFile.name}
                url={viewFile.url}
                publicId={viewFile.publicId}
                resourceType={viewFile.resourceType || 'auto'}
                width="100%"
                height={400}
                showDownloadButton={true}
              />
            </div>
            <DialogFooter>
              <Button onClick={() => setViewFile(null)}>Close</Button>
              <Button 
                variant="outline" 
                onClick={() => window.open(cloudinaryService.getDownloadUrl(
                  viewFile.publicId,
                  viewFile.resourceType
                ), '_blank')}
              >
                Download
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export const EditAssignmentDialog = ({ isOpen, onClose, assignment, onUpdateAssignment }) => {
  const [title, setTitle] = useState('');
  const [instructions, setInstructions] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [points, setPoints] = useState('');
  const [completed, setCompleted] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [uploadErrors, setUploadErrors] = useState([]);
  const [viewFile, setViewFile] = useState(null);

  // Add format file size function
  const formatFileSize = (bytes) => {
    if (!bytes || isNaN(bytes)) return '0 B';
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  // Get file icon based on file data
  const getFileIcon = (file) => {
    if (!file) return '📁';

    if (file.type) {
      if (file.type.startsWith('image/')) return '🖼️';
      if (file.type.includes('pdf')) return '📄';
      if (file.type.includes('powerpoint') || file.type.includes('presentation') || file.type.includes('ppt')) return '📊';
      if (file.type.includes('word') || file.type.includes('document') || file.type.includes('doc')) return '📝';
      if (file.type.includes('excel') || file.type.includes('spreadsheet') || file.type.includes('xls')) return '📈';
    }
    
    if (file.resourceType === 'image' || file.resource_type === 'image') return '🖼️';
    
    // Check format if available
    if (file.format) {
      if (file.format === 'pdf') return '📄';
      if (file.format.includes('ppt')) return '📊';
      if (file.format.includes('doc')) return '📝';
      if (file.format.includes('xls')) return '📈';
    }
    
    // If no type is available, try to determine from the filename
    const filename = file.originalName || file.name || file.original_filename || '';
    const extension = filename.split('.').pop()?.toLowerCase();
    
    if (extension === 'pdf') return '📄';
    if (['doc', 'docx'].includes(extension)) return '📝';
    if (['ppt', 'pptx'].includes(extension)) return '📊';
    if (['xls', 'xlsx', 'csv'].includes(extension)) return '📈';
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(extension)) return '🖼️';
    
    return '📁';
  };

  useEffect(() => {
    if (assignment) {
      setTitle(assignment.title || '');
      setInstructions(assignment.instructions || '');
      setDueDate(assignment.dueDate || new Date().toISOString().split('T')[0]);
      setPoints(assignment.points !== undefined && assignment.points !== null ? assignment.points.toString() : '');
      setCompleted(assignment.completed || false);
      
      // Convert existing files to the format expected by our component
      if (assignment.files && assignment.files.length > 0) {
        const existingFiles = assignment.files.map(file => {
          // Check if the file already has Cloudinary data
          if (file.publicId) {
            return {
              original_filename: file.name,
              format: file.type?.split('/')[1] || '',
              bytes: file.size || 0,
              secure_url: file.url,
              public_id: file.publicId,
              resource_type: file.resourceType || 'raw'
            };
          }
          // Otherwise it's a local file only
          return file;
        });
        
        setUploadedFiles(existingFiles);
      } else {
        setUploadedFiles([]);
      }
    }
  }, [assignment]);

  const handleFileUploadComplete = (results) => {
    setUploadedFiles(prev => [...prev, ...results]);
  };

  const handleFileUploadError = (errors) => {
    console.error('File upload errors:', errors);
    setUploadErrors(errors.map(err => err.message || 'Unknown upload error'));
  };

  const handleRemoveFile = (indexToRemove) => {
    setUploadedFiles(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim() && instructions.trim()) {
      // Process all files
      const files = uploadedFiles.map(fileData => {
        // Check if this is a Cloudinary response or our existing file format
        if (fileData.public_id || fileData.secure_url) {
          return {
            name: fileData.original_filename || fileData.public_id?.split('/').pop() || fileData.name,
            type: fileData.resource_type === 'image' ? `image/${fileData.format}` : fileData.format || fileData.type,
            size: fileData.bytes || fileData.size,
            url: fileData.secure_url || fileData.url,
            publicId: fileData.public_id || fileData.publicId,
            resourceType: fileData.resource_type || fileData.resourceType || 'raw'
          };
        }
        // If it's already in our format, return as is
        return fileData;
      });
      
      // Create file attachments list
      const attachments = files.map(file => file.name);
      
      onUpdateAssignment({
        ...assignment,
        title: title.trim(),
        instructions: instructions.trim(),
        dueDate,
        points: points ? parseInt(points, 10) : null,
        completed,
        files,
        attachments
      });
      
      onClose();
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[500px] max-h-[85vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Edit Assignment</DialogTitle>
            <DialogDescription>
              Update assignment details
            </DialogDescription>
          </DialogHeader>
          
          <div className="overflow-y-auto pr-2">
            <form onSubmit={handleSubmit} className="space-y-4 py-4">
              <div className="space-y-2">
                <label htmlFor="edit-assignment-title" className="text-sm font-medium">
                  Assignment Title
                </label>
                <input
                  id="edit-assignment-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="edit-assignment-instructions" className="text-sm font-medium">
                  Instructions
                </label>
                <textarea
                  id="edit-assignment-instructions"
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  rows={3}
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="edit-assignment-due-date" className="text-sm font-medium">
                  Due Date
                </label>
                <input
                  id="edit-assignment-due-date"
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="edit-assignment-points" className="text-sm font-medium">
                  Points
                </label>
                <input
                  id="edit-assignment-points"
                  type="number"
                  value={points}
                  onChange={(e) => setPoints(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Assignment Files</label>
                <FileUploader 
                  onUploadComplete={handleFileUploadComplete}
                  onUploadError={handleFileUploadError}
                  maxFiles={10}
                  autoUpload={true}
                />
                
                {uploadedFiles.length > 0 && (
                  <div className="mt-3">
                    <h3 className="text-sm font-medium mb-2">Uploaded Files:</h3>
                    <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto p-2">
                      {uploadedFiles.map((file, index) => {
                        const fileObj = {
                          name: file.originalName || file.original_filename || file.name || (file.public_id ? file.public_id.split('/').pop() : 'Unknown file'),
                          type: file.resource_type === 'image' ? `image/${file.format}` : file.format || 'application/octet-stream',
                          size: file.bytes || 0,
                          url: file.secure_url || file.url || '',
                          publicId: file.public_id || '',
                          resourceType: file.resource_type || 'raw'
                        };
                        
                        return (
                          <div 
                            key={index} 
                            className="flex items-center gap-2 bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-full group"
                          >
                            <span className="flex-shrink-0">
                              {getFileIcon(fileObj)}
                            </span>
                            <span className="text-sm truncate max-w-[120px]">{fileObj.name}</span>
                            <button
                              type="button"
                              className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => handleRemoveFile(index)}
                            >
                              ✕
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/30 p-3 rounded-md">
                <input
                  id="edit-assignment-completed"
                  type="checkbox"
                  checked={completed}
                  onChange={(e) => setCompleted(e.target.checked)}
                  className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="edit-assignment-completed" className="text-sm font-medium">
                  Mark as completed
                </label>
              </div>
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit">Update Assignment</Button>
              </DialogFooter>
            </form>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* File preview dialog */}
      {viewFile && (
        <Dialog open={Boolean(viewFile)} onOpenChange={() => setViewFile(null)}>
          <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-hidden flex flex-col">
            <DialogHeader>
              <DialogTitle>{viewFile.name}</DialogTitle>
            </DialogHeader>
            <div className="overflow-y-auto p-2 flex-1">
              <FileViewer 
                file={viewFile}
                name={viewFile.name}
                url={viewFile.url}
                publicId={viewFile.publicId}
                resourceType={viewFile.resourceType || 'auto'}
                width="100%"
                height={400}
                showDownloadButton={true}
              />
            </div>
            <DialogFooter>
              <Button onClick={() => setViewFile(null)}>Close</Button>
              <Button 
                variant="outline" 
                onClick={() => window.open(cloudinaryService.getDownloadUrl(
                  viewFile.publicId,
                  viewFile.resourceType
                ), '_blank')}
              >
                Download
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export const AddNoteDialog = ({ isOpen, onClose, onAddNote }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim() && content.trim()) {
      onAddNote({
        title: title.trim(),
        content: content.trim(),
        date,
        createdAt: new Date().toISOString(),
        lastEdited: new Date().toISOString(),
        tags: [],
        highlights: [],
        hasImages: false,
        imageDescriptions: []
      });
      
      // Reset form
      setTitle('');
      setContent('');
      setDate(new Date().toISOString().split('T')[0]);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Course Note</DialogTitle>
          <DialogDescription>
            Create a new course note
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <label htmlFor="note-title" className="text-sm font-medium">
              Note Title
            </label>
            <input
              id="note-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Important Concepts from Chapter 1"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="note-content" className="text-sm font-medium">
              Content
            </label>
            <textarea
              id="note-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Your note content..."
              rows={5}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="note-date" className="text-sm font-medium">
              Date
            </label>
            <input
              id="note-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Add Note</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export const EditNoteDialog = ({ isOpen, onClose, note, onUpdateNote }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
    if (note) {
      setTitle(note.title || '');
      setContent(note.content || '');
      setDate(note.date || new Date().toISOString().split('T')[0]);
    }
  }, [note]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim() && content.trim()) {
      onUpdateNote({
        ...note,
        title: title.trim(),
        content: content.trim(),
        date,
        lastEdited: new Date().toISOString()
      });
      
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Course Note</DialogTitle>
          <DialogDescription>
            Update your course note
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <label htmlFor="edit-note-title" className="text-sm font-medium">
              Note Title
            </label>
            <input
              id="edit-note-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="edit-note-content" className="text-sm font-medium">
              Content
            </label>
            <textarea
              id="edit-note-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={5}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="edit-note-date" className="text-sm font-medium">
              Date
            </label>
            <input
              id="edit-note-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Update Note</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}; 