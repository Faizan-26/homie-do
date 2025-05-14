import React, { useState, useEffect } from 'react';
import { Button } from '../../../components/ui/button';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../../components/ui/dialog';
import FileUploader from '../../../components/FileUploader';
import { AttachmentModel } from '../../../models/subjectModel';
import useSubjectContentStore from '../../../store/subjectContentStore';

// Lecture Dialogs
export const AddLectureDialog = ({ isOpen, onClose }) => {
  const addLecture = useSubjectContentStore(state => state.addLecture);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [uploadErrors, setUploadErrors] = useState([]);

  const handleFileUploadComplete = (results) => {
    setUploadedFiles(prev => [...prev, ...results]);
    setUploadErrors([]);
    
    console.log('Upload complete:', results);
  };

  const handleFileUploadError = (errors) => {
    setUploadErrors(errors.map(err => err.message || 'Unknown upload error'));
    console.error('Upload errors:', errors);
  };
  
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' bytes';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  const handlePreviewFile = (file) => {
    // Store file data in localStorage for the preview page
    localStorage.setItem('previewFileData', JSON.stringify(file));
    
    // Open preview in a new tab
    window.open('/dashboard/preview-document', '_blank');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (title.trim() && content.trim()) {
      // Process uploaded files
      const files = uploadedFiles.map(fileData => ({
        name: fileData.originalFilename || fileData.original_filename || (fileData.public_id ? fileData.public_id.split('/').pop() : 'file'),
        originalName: fileData.originalFilename || fileData.original_filename || (fileData.public_id ? fileData.public_id.split('/').pop() : 'file'),
        type: fileData.resource_type === 'image' ? `image/${fileData.format}` : fileData.format || 'application/octet-stream',
        size: fileData.bytes || 0,
        url: fileData.secure_url || fileData.url || '',
        publicId: fileData.public_id || '',
        resourceType: fileData.resource_type || 'raw'
      }));
      
      // Create proper attachment objects instead of just strings
      const attachments = files.map(file => new AttachmentModel({
        name: file.name,
        type: file.type,
        size: file.size,
        url: file.url
      }));
      
      // Call store action directly
      addLecture({
        title: title.trim(),
        content: content.trim(),
        attachments,
        files
      });
      
      // Reset form
      setTitle('');
      setContent('');
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
            Add a new lecture with content and attachments
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
                placeholder="e.g., Introduction to React"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="lecture-content" className="text-sm font-medium">
                Lecture Content
              </label>
              <textarea
                id="lecture-content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Enter lecture content or notes here"
                rows={6}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">File Attachments</label>
              <FileUploader 
                onUploadComplete={handleFileUploadComplete}
                onUploadError={handleFileUploadError}
                maxFiles={5}
                autoUpload={true}
              />
              
              {uploadedFiles.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm font-medium mb-2">Uploaded Files:</p>
                  <div className="space-y-2">
                    {uploadedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 border rounded-md bg-gray-50">
                        <div 
                          className="flex items-center space-x-2 cursor-pointer flex-grow overflow-hidden"
                          onClick={() => handlePreviewFile({
                            name: file.originalFilename || file.original_filename || file.public_id,
                            type: file.resource_type === 'image' ? `image/${file.format}` : file.format || 'application/octet-stream',
                            size: file.bytes || 0,
                            url: file.secure_url || file.url || '',
                            publicId: file.public_id || '',
                            resourceType: file.resource_type || 'raw'
                          })}
                        >
                          {file.resource_type === 'image' ? (
                            <img 
                              src={file.secure_url || file.url} 
                              alt="Preview" 
                              className="w-8 h-8 object-cover rounded"
                            />
                          ) : (
                            <div className="w-8 h-8 flex items-center justify-center bg-blue-100 text-blue-600 rounded">
                              📄
                            </div>
                          )}
                          <div className="overflow-hidden">
                            <p className="text-sm font-medium truncate max-w-[200px]">
                              {file.originalFilename || file.original_filename || file.public_id}
                            </p>
                            <p className="text-xs text-gray-500">
                              {formatFileSize(file.bytes || file.size || 0)} • Click to preview
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setUploadedFiles(prev => prev.filter((_, i) => i !== index));
                          }}
                          className="p-1 text-red-500 hover:text-red-700 ml-2"
                          aria-label="Remove file"
                        >
                          🗑️
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {uploadErrors.length > 0 && (
                <div className="mt-2 p-2 border border-red-300 rounded-md bg-red-50">
                  <p className="text-sm text-red-500">Upload errors:</p>
                  <ul className="text-xs text-red-500 list-disc ml-4">
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
              <Button type="submit">Add Lecture</Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export const EditLectureDialog = ({ isOpen, onClose, lecture }) => {
  const updateLecture = useSubjectContentStore(state => state.updateLecture);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [uploadErrors, setUploadErrors] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (lecture) {
      setTitle(lecture.title || '');
      setContent(lecture.content || '');
      
      // Convert files to match the format expected by FileUploader
      if (lecture.files && lecture.files.length > 0) {
        setUploadedFiles(lecture.files.map(file => ({
          originalFilename: file.originalName || file.name || '',
          original_filename: file.originalName || file.name || '',
          format: file.type ? (file.type.split('/')[1] || '') : '',
          bytes: file.size || 0,
          secure_url: file.url || '',
          url: file.url || '',
          public_id: file.publicId || '',
          resource_type: file.resourceType || 'raw'
        })));
      } else {
        setUploadedFiles([]);
      }
    }
  }, [lecture]);

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' bytes';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  const handleFileUploadComplete = (results) => {
    setUploadedFiles(prev => [...prev, ...results]);
    setUploadErrors([]);
  };

  const handleFileUploadError = (errors) => {
    setUploadErrors(errors.map(err => err.message || 'Unknown upload error'));
  };

  const handleRemoveFile = (indexToRemove) => {
    setUploadedFiles(uploadedFiles.filter((_, index) => index !== indexToRemove));
  };
  
  const handlePreviewFile = (file) => {
    // Store file data in localStorage for the preview page
    localStorage.setItem('previewFileData', JSON.stringify(file));
    
    // Open preview in a new tab
    window.open('/dashboard/preview-document', '_blank');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (title.trim() && content.trim()) {
      // Create file objects with consistent naming
      const files = uploadedFiles.length > 0 ? uploadedFiles.map(fileData => {
        const fileName = fileData.originalFilename || fileData.original_filename || 
                        (fileData.public_id ? fileData.public_id.split('/').pop() : 'Unknown file');
        
        return {
          name: fileName,
          originalName: fileName,
          type: fileData.resource_type === 'image' ? `image/${fileData.format}` : 
                fileData.format || 'application/octet-stream',
          size: fileData.bytes || 0,
          url: fileData.secure_url || fileData.url || '',
          publicId: fileData.public_id || '',
          resourceType: fileData.resource_type || 'raw'
        };
      }) : [];
      
      // Create proper attachment objects instead of just strings
      const attachments = files.length > 0 ? files.map(file => new AttachmentModel({
        name: file.name,
        type: file.type,
        size: file.size,
        url: file.url
      })) : [];
      
      // Use zustand to update the lecture - pass ID first, then updated data
      updateLecture(lecture.id, {
        title: title.trim(),
        content: content.trim(),
        attachments,
        files
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
            Update the lecture details
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
                placeholder="e.g., Introduction to React"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="edit-lecture-content" className="text-sm font-medium">
                Lecture Content
              </label>
              <textarea
                id="edit-lecture-content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Enter lecture content or notes here"
                rows={6}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">File Attachments</label>
              <FileUploader 
                onUploadComplete={handleFileUploadComplete}
                onUploadError={handleFileUploadError}
                maxFiles={5}
                autoUpload={true}
              />
              
              {uploadedFiles.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm font-medium mb-2">Uploaded Files:</p>
                  <div className="space-y-2">
                    {uploadedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 border rounded-md bg-gray-50">
                        <div 
                          className="flex items-center space-x-2 cursor-pointer flex-grow overflow-hidden"
                          onClick={() => handlePreviewFile({
                            name: file.originalFilename || file.original_filename || file.public_id,
                            type: file.resource_type === 'image' ? `image/${file.format}` : file.format || 'application/octet-stream',
                            size: file.bytes || 0,
                            url: file.secure_url || file.url || '',
                            publicId: file.public_id || '',
                            resourceType: file.resource_type || 'raw'
                          })}
                        >
                          {file.resource_type === 'image' ? (
                            <img 
                              src={file.secure_url || file.url} 
                              alt="Preview" 
                              className="w-8 h-8 object-cover rounded"
                            />
                          ) : (
                            <div className="w-8 h-8 flex items-center justify-center bg-blue-100 text-blue-600 rounded">
                              📄
                            </div>
                          )}
                          <div className="overflow-hidden">
                            <p className="text-sm font-medium truncate max-w-[200px]">
                              {file.originalFilename || file.original_filename || file.public_id}
                            </p>
                            <p className="text-xs text-gray-500">
                              {formatFileSize(file.bytes || file.size || 0)} • Click to preview
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setUploadedFiles(prev => prev.filter((_, i) => i !== index));
                          }}
                          className="p-1 text-red-500 hover:text-red-700 ml-2"
                          aria-label="Remove file"
                        >
                          🗑️
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {uploadErrors.length > 0 && (
                <div className="mt-2 p-2 border border-red-300 rounded-md bg-red-50">
                  <p className="text-sm text-red-500">Upload errors:</p>
                  <ul className="text-xs text-red-500 list-disc ml-4">
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
export const AddReadingDialog = ({ isOpen, onClose }) => {
  const addReading = useSubjectContentStore(state => state.addReading);
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
        name: fileData.originalFilename || fileData.original_filename || (fileData.public_id ? fileData.public_id.split('/').pop() : 'file'),
        originalName: fileData.originalFilename || fileData.original_filename || (fileData.public_id ? fileData.public_id.split('/').pop() : 'file'),
        type: fileData.resource_type === 'image' ? `image/${fileData.format}` : fileData.format || 'application/octet-stream',
        size: fileData.bytes || 0,
        url: fileData.secure_url || fileData.url || '',
        publicId: fileData.public_id || '',
        resourceType: fileData.resource_type || 'raw'
      }));
      
      // Create proper attachment objects instead of just strings
      const attachments = files.map(file => new AttachmentModel({
        name: file.name,
        type: file.type,
        size: file.size,
        url: file.url
      }));
      
      // Call store action directly
      addReading({
        title: title.trim(),
        author: author.trim(),
        type,
        chapters: type === 'Textbook' ? chapters.trim() : null,
        source: ['Journal Article', 'Web Resource', 'Video'].includes(type) ? source.trim() : null,
        length: type === 'Video' ? length.trim() : null,
        url: ['Web Resource', 'Video'].includes(type) ? url.trim() : null,
        attachments,
        files
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

export const EditReadingDialog = ({ isOpen, onClose, reading }) => {
  const updateReading = useSubjectContentStore(state => state.updateReading);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [type, setType] = useState('Textbook');
  const [chapters, setChapters] = useState('');
  const [source, setSource] = useState('');
  const [length, setLength] = useState('');
  const [url, setUrl] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [uploadErrors, setUploadErrors] = useState([]);
  
  // Initialize form with reading data when opened
  useEffect(() => {
    if (reading) {
      setTitle(reading.title || '');
      setAuthor(reading.author || '');
      setType(reading.type || READING_TYPES.TEXTBOOK);
      setChapters(reading.chapters || '');
      setSource(reading.source || '');
      setLength(reading.length || '');
      setUrl(reading.url || '');
      
      // Convert files to match the format expected by FileUploader
      if (reading.files && reading.files.length > 0) {
        setUploadedFiles(reading.files.map(file => ({
          originalFilename: file.originalName || file.name || '',
          original_filename: file.originalName || file.name || '',
          format: file.type ? (file.type.split('/')[1] || '') : '',
          bytes: file.size || 0,
          secure_url: file.url || '',
          url: file.url || '',
          public_id: file.publicId || '',
          resource_type: file.resourceType || 'raw'
        })));
      } else {
        setUploadedFiles([]);
      }
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
    console.log('Files uploaded successfully:', newFiles);
  };

  const handleFileUploadError = (errors) => {
    console.error('File upload errors:', errors);
    setUploadErrors(errors.map(err => err.message || 'Unknown upload error'));
  };
  
  const handleRemoveFile = (indexToRemove) => {
    setUploadedFiles(uploadedFiles.filter((_, index) => index !== indexToRemove));
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
      const files = uploadedFiles.length > 0 ? uploadedFiles.map(fileData => {
        const fileName = fileData.originalFilename || fileData.original_filename || 
                        (fileData.public_id ? fileData.public_id.split('/').pop() : 'Unknown file');
        
        return {
          name: fileName,
          originalName: fileName,
          type: fileData.resource_type === 'image' ? `image/${fileData.format}` : fileData.format || 'application/octet-stream',
          size: fileData.bytes || 0,
          url: fileData.secure_url || fileData.url || '',
          publicId: fileData.public_id || '',
          resourceType: fileData.resource_type || 'raw'
        };
      }) : [];
      
      // Create proper attachment objects instead of just strings
      const attachments = files.length > 0 ? files.map(file => new AttachmentModel({
        name: file.name,
        type: file.type,
        size: file.size,
        url: file.url
      })) : [];
      
      // Use store action directly - pass ID first, then updated data
      updateReading(reading.id, {
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
              
              <FileUploader 
                onUploadComplete={handleFileUploadComplete}
                onUploadError={handleFileUploadError}
                maxFiles={10}
                autoUpload={true}
              />
              
              {uploadErrors.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm text-red-500 dark:text-red-400">Upload errors:</p>
                  <ul className="list-disc list-inside text-xs text-red-600 dark:text-red-400">
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
export const AddAssignmentDialog = ({ isOpen, onClose }) => {
  const addAssignment = useSubjectContentStore(state => state.addAssignment);
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [points, setPoints] = useState(10);
  const [instructions, setInstructions] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [uploadErrors, setUploadErrors] = useState([]);

  const formatFileSize = (bytes) => {
    if (!bytes || isNaN(bytes)) return '0 B';
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const handleFileUploadComplete = (results) => {
    setUploadedFiles(prev => [...prev, ...results]);
  };

  const handleFileUploadError = (errors) => {
    setUploadErrors(errors.map(err => err.message || 'Unknown upload error'));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (title.trim() && dueDate.trim()) {
      // Process uploaded files
      const files = uploadedFiles.map(fileData => ({
        name: fileData.originalFilename || fileData.original_filename || (fileData.public_id ? fileData.public_id.split('/').pop() : 'file'),
        originalName: fileData.originalFilename || fileData.original_filename || (fileData.public_id ? fileData.public_id.split('/').pop() : 'file'),
        type: fileData.resource_type === 'image' ? `image/${fileData.format}` : fileData.format || 'application/octet-stream',
        size: fileData.bytes || 0,
        url: fileData.secure_url || fileData.url || '',
        publicId: fileData.public_id || '',
        resourceType: fileData.resource_type || 'raw'
      }));
      
      // Create proper attachment objects instead of just strings
      const attachments = files.map(file => new AttachmentModel({
        name: file.name,
        type: file.type,
        size: file.size,
        url: file.url
      }));
      
      // Call store action directly
      addAssignment({
        title: title.trim(),
        dueDate: new Date(dueDate),
        points: Number(points),
        instructions: instructions.trim(),
        isCompleted: false,
        attachments,
        files
      });
      
      // Reset form
      setTitle('');
      setDueDate('');
      setPoints(10);
      setInstructions('');
      setUploadedFiles([]);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Add New Assignment</DialogTitle>
          <DialogDescription>
            Create a new assignment for your students
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
                placeholder="e.g., Research Paper"
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
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
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="assignment-points" className="text-sm font-medium">
                Points
              </label>
              <input
                id="assignment-points"
                type="number"
                min="0"
                value={points}
                onChange={(e) => setPoints(e.target.value)}
                placeholder="e.g., 100"
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
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
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
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
              
              {uploadedFiles.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm font-medium mb-2">Uploaded Files:</p>
                  <div className="space-y-2">
                    {uploadedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 border rounded-md bg-gray-50 dark:bg-gray-800">
                        <div className="flex items-center space-x-2">
                          {file.resource_type === 'image' ? (
                            <img 
                              src={file.secure_url || file.url} 
                              alt="Preview" 
                              className="w-8 h-8 object-cover rounded"
                            />
                          ) : (
                            <div className="w-8 h-8 flex items-center justify-center bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-200 rounded">
                              📄
                            </div>
                          )}
                          <div>
                            <p className="text-sm font-medium truncate max-w-[200px]">
                              {file.originalFilename || file.original_filename || file.public_id}
                            </p>
                            <p className="text-xs text-gray-500">
                              {formatFileSize(file.bytes || file.size || 0)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {uploadErrors.length > 0 && (
                <div className="mt-2 p-2 border border-red-300 rounded-md bg-red-50 dark:bg-red-900/20 dark:border-red-800">
                  <p className="text-sm font-medium text-red-800 dark:text-red-300">Upload Errors:</p>
                  <ul className="list-disc list-inside text-xs text-red-600 dark:text-red-400">
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
              <Button type="submit">Add Assignment</Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export const EditAssignmentDialog = ({ isOpen, onClose, assignment }) => {
  const updateAssignment = useSubjectContentStore(state => state.updateAssignment);
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [points, setPoints] = useState('');
  const [instructions, setInstructions] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [uploadErrors, setUploadErrors] = useState([]);

  useEffect(() => {
    if (assignment) {
      setTitle(assignment.title || '');
      // Convert date object to string format for the date input
      const formattedDate = assignment.dueDate instanceof Date 
        ? assignment.dueDate.toISOString().split('T')[0]
        : typeof assignment.dueDate === 'string' 
          ? assignment.dueDate.split('T')[0]
          : new Date().toISOString().split('T')[0];
      setDueDate(formattedDate);
      setPoints(assignment.points || '');
      setInstructions(assignment.instructions || '');
      
      // Convert files to match the format expected by FileUploader
      if (assignment.files && assignment.files.length > 0) {
        setUploadedFiles(assignment.files.map(file => ({
          originalFilename: file.originalName || file.name || '',
          original_filename: file.originalName || file.name || '',
          format: file.type ? (file.type.split('/')[1] || '') : '',
          bytes: file.size || 0,
          secure_url: file.url || '',
          url: file.url || '',
          public_id: file.publicId || '',
          resource_type: file.resourceType || 'raw'
        })));
      } else {
        setUploadedFiles([]);
      }
    }
  }, [assignment]);

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' bytes';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  const handleFileUploadComplete = (results) => {
    setUploadedFiles(prev => [...prev, ...results]);
    setUploadErrors([]);
  };

  const handleFileUploadError = (errors) => {
    setUploadErrors(errors.map(err => err.message || 'Unknown upload error'));
  };

  const handleRemoveFile = (indexToRemove) => {
    setUploadedFiles(uploadedFiles.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim() && dueDate.trim()) {
      // Process uploaded files
      const files = uploadedFiles.length > 0 ? uploadedFiles.map(fileData => {
        const fileName = fileData.originalFilename || fileData.original_filename || 
                        (fileData.public_id ? fileData.public_id.split('/').pop() : 'Unknown file');
        
        return {
          name: fileName,
          originalName: fileName,
          type: fileData.resource_type === 'image' ? `image/${fileData.format}` : fileData.format || 'application/octet-stream',
          size: fileData.bytes || 0,
          url: fileData.secure_url || fileData.url || '',
          publicId: fileData.public_id || '',
          resourceType: fileData.resource_type || 'raw'
        };
      }) : [];
      
      // Create proper attachment objects instead of just strings
      const attachments = files.length > 0 ? files.map(file => new AttachmentModel({
        name: file.name,
        type: file.type,
        size: file.size,
        url: file.url
      })) : [];
      
      // Use store action directly - pass ID first, then updated data
      updateAssignment(assignment.id, {
        title: title.trim(),
        dueDate: new Date(dueDate),
        points: Number(points),
        instructions: instructions.trim(),
        attachments,
        files
      });
      
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Edit Assignment</DialogTitle>
          <DialogDescription>
            Update the assignment details
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="edit-assignment-points" className="text-sm font-medium">
                Points
              </label>
              <input
                id="edit-assignment-points"
                type="number"
                min="0"
                value={points}
                onChange={(e) => setPoints(e.target.value)}
                placeholder="e.g., 100"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                rows={4}
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
              
              {uploadedFiles.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm font-medium mb-2">Uploaded Files:</p>
                  <div className="space-y-2">
                    {uploadedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 border rounded-md bg-gray-50 dark:bg-gray-800">
                        <div className="flex items-center space-x-2">
                          {file.resource_type === 'image' ? (
                            <img 
                              src={file.secure_url || file.url} 
                              alt="Preview" 
                              className="w-8 h-8 object-cover rounded"
                            />
                          ) : (
                            <div className="w-8 h-8 flex items-center justify-center bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-200 rounded">
                              📄
                            </div>
                          )}
                          <div>
                            <p className="text-sm font-medium truncate max-w-[200px]">
                              {file.originalFilename || file.original_filename || file.public_id}
                            </p>
                            <p className="text-xs text-gray-500">
                              {formatFileSize(file.bytes || file.size || 0)}
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveFile(index)}
                          className="p-1 text-red-500 hover:text-red-700"
                          aria-label="Remove file"
                        >
                          🗑️
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {uploadErrors.length > 0 && (
                <div className="mt-2 p-2 border border-red-300 rounded-md bg-red-50 dark:bg-red-900/20 dark:border-red-800">
                  <p className="text-sm font-medium text-red-800 dark:text-red-300">Upload Errors:</p>
                  <ul className="list-disc list-inside text-xs text-red-600 dark:text-red-400">
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
              <Button type="submit">Update Assignment</Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export const AddNoteDialog = ({ isOpen, onClose }) => {
  const addNote = useSubjectContentStore(state => state.addNote);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [tags, setTags] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim() && content.trim()) {
      // Process tags - split by comma, trim whitespace, and remove empty strings
      const tagsList = tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);
      
      // Call store action directly
      addNote({
        title: title.trim(),
        content: content.trim(),
        date,
        createdAt: new Date().toISOString(),
        lastEdited: new Date().toISOString(),
        tags: tagsList,
        highlights: [],
        hasImages: false,
        imageDescriptions: []
      });
      
      // Reset form
      setTitle('');
      setContent('');
      setDate(new Date().toISOString().split('T')[0]);
      setTags('');
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
          
          <div className="space-y-2">
            <label htmlFor="note-tags" className="text-sm font-medium">
              Tags (comma separated)
            </label>
            <input
              id="note-tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="e.g., important, exam, review"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500">Separate tags with commas (e.g., "important, exam, review")</p>
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

export const EditNoteDialog = ({ isOpen, onClose, note }) => {
  const updateNote = useSubjectContentStore(state => state.updateNote);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [date, setDate] = useState('');
  const [tags, setTags] = useState('');

  useEffect(() => {
    if (note) {
      setTitle(note.title || '');
      setContent(note.content || '');
      
      // Properly format the date for the date input field
      if (note.date) {
        try {
          // Convert to Date object first
          const dateObj = new Date(note.date);
          // Check if valid date
          if (!isNaN(dateObj.getTime())) {
            // Format as YYYY-MM-DD for input[type="date"]
            const formattedDate = dateObj.toISOString().split('T')[0];
            setDate(formattedDate);
          } else {
            setDate(new Date().toISOString().split('T')[0]);
          }
        } catch (error) {
          console.error('Error parsing date:', error);
          setDate(new Date().toISOString().split('T')[0]);
        }
      } else {
        setDate(new Date().toISOString().split('T')[0]);
      }
      
      // Join tags into comma-separated string for editing
      if (note.tags && Array.isArray(note.tags)) {
        setTags(note.tags.join(', '));
      } else {
        setTags('');
      }
    }
  }, [note]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim() && content.trim()) {
      // Process tags - split by comma, trim whitespace, and remove empty strings
      const tagsList = tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);
      
      // Use store action directly - pass ID first, then updated data
      updateNote(note.id, {
        title: title.trim(),
        content: content.trim(),
        date,
        tags: tagsList,
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
          
          <div className="space-y-2">
            <label htmlFor="edit-note-tags" className="text-sm font-medium">
              Tags (comma separated)
            </label>
            <input
              id="edit-note-tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="e.g., important, exam, review"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500">Separate tags with commas (e.g., "important, exam, review")</p>
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