import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import cloudinaryService from '../utils/cloudinaryService';
import config from '../config';

/**
 * A reusable file uploader component with drag and drop support
 */
const FileUploader = ({ 
  onUploadComplete,
  onUploadError,
  maxFiles = 5, 
  maxSize = config.maxFileSize,
  acceptedFileTypes = Object.values(config.supportedFileTypes).flat(),
  autoUpload = true
}) => {
  const [files, setFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState({});
  const [isUploading, setIsUploading] = useState(false);
  const [errors, setErrors] = useState([]);

  // Handle file drop
  const onDrop = useCallback(acceptedFiles => {
    // Reset errors
    setErrors([]);
    
    // Create file previews and merge with existing files
    const newFiles = acceptedFiles.map(file => 
      Object.assign(file, {
        preview: URL.createObjectURL(file),
        id: `${Date.now()}-${file.name}`, // Generate a unique ID
        status: 'pending', // Status: 'pending', 'uploading', 'success', 'error'
        originalName: file.name // Store original filename
      })
    );
    
    setFiles(prev => [...prev, ...newFiles]);
  }, []);
  
  // Auto upload files when they are added
  useEffect(() => {
    if (autoUpload && files.some(file => file.status === 'pending')) {
      uploadAllFiles();
    }
  }, [files, autoUpload]);
  
  // Set up dropzone
  const { 
    getRootProps, 
    getInputProps, 
    isDragActive,
    isDragAccept,
    isDragReject
  } = useDropzone({
    onDrop,
    maxFiles,
    maxSize,
    accept: acceptedFileTypes.reduce((acc, type) => {
      acc[type] = [];
      return acc;
    }, {}),
  });

  // Upload a single file
  const uploadFile = async (file) => {
    try {
      // Update file status
      setFiles(prev => 
        prev.map(f => 
          f.id === file.id ? { ...f, status: 'uploading' } : f
        )
      );
      
      // Determine resource type based on file type
      let resourceType = 'raw';
      if (file.type && file.type.startsWith('image/')) {
        resourceType = 'image';
      } else if (file.type && file.type.startsWith('video/')) {
        resourceType = 'video';
      }
      
      // Use the original filename
      const fileName = file.originalName || file.name || 'file';
      
      // Upload to Cloudinary with progress tracking
      const response = await cloudinaryService.uploadFile(
        file,
        resourceType,
        (progress) => {
          setUploadProgress(prev => ({
            ...prev,
            [file.id]: progress
          }));
        }
      );
      
      // Make sure the original filename is preserved in the response
      response.original_filename = fileName;
      
      // Update file with successful status and response data
      setFiles(prev => 
        prev.map(f => 
          f.id === file.id 
            ? { 
                ...f, 
                status: 'success', 
                cloudinaryData: response,
                url: response.url || response.secure_url,
                publicId: response.publicId || response.public_id,
                size: response.bytes || file.size || 0,
                type: determineFileType(file, response),
                name: fileName, // Use the original filename for consistency
                original_filename: fileName // Include this for compatibility
              } 
            : f
        )
      );
      
      console.log('File uploaded successfully:', response);
      return response;
    } catch (error) {
      console.error(`Error uploading file ${file.name}:`, error);
      
      // Update file with error status
      setFiles(prev => 
        prev.map(f => 
          f.id === file.id ? { ...f, status: 'error' } : f
        )
      );
      
      setErrors(prev => [...prev, `Failed to upload ${file.name}: ${error.message}`]);
      
      throw error;
    }
  };

  // Determine file type based on file and response
  const determineFileType = (file, response) => {
    // First try to determine from response
    if (response) {
      if (response.resource_type === 'image') return `image/${response.format || 'jpeg'}`;
      if (response.format) {
        // Map common formats to MIME types
        const formatMimeMap = {
          'pdf': 'application/pdf',
          'doc': 'application/msword',
          'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'ppt': 'application/vnd.ms-powerpoint',
          'pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
          'xls': 'application/vnd.ms-excel',
          'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        };
        
        return formatMimeMap[response.format] || `application/${response.format}`;
      }
    }
    
    // Fallback to file.type if available
    if (file.type) return file.type;
    
    // Last resort: guess from filename
    if (file.name) {
      const extension = file.name.split('.').pop()?.toLowerCase();
      const extensionMimeMap = {
        'pdf': 'application/pdf',
        'doc': 'application/msword',
        'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'ppt': 'application/vnd.ms-powerpoint',
        'pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'xls': 'application/vnd.ms-excel',
        'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'jpg': 'image/jpeg',
        'jpeg': 'image/jpeg',
        'png': 'image/png',
        'gif': 'image/gif'
      };
      
      return extensionMimeMap[extension] || 'application/octet-stream';
    }
    
    return 'application/octet-stream';
  };

  // Upload all pending files
  const uploadAllFiles = async () => {
    const pendingFiles = files.filter(file => file.status === 'pending');
    
    if (pendingFiles.length === 0) {
      return;
    }
    
    setIsUploading(true);
    
    try {
      const uploadPromises = pendingFiles.map(file => uploadFile(file));
      const results = await Promise.allSettled(uploadPromises);
      
      // Filter successful uploads
      const successfulUploads = results
        .filter(result => result.status === 'fulfilled')
        .map(result => result.value);
      
      // Notify parent component
      if (successfulUploads.length > 0 && onUploadComplete) {
        onUploadComplete(successfulUploads);
      }
      
      // Check for errors
      const failedUploads = results.filter(result => result.status === 'rejected');
      if (failedUploads.length > 0 && onUploadError) {
        onUploadError(failedUploads.map(result => result.reason));
      }
    } catch (error) {
      console.error('Error in bulk upload:', error);
      if (onUploadError) {
        onUploadError([error]);
      }
    } finally {
      setIsUploading(false);
    }
  };

  // Remove a file from the list
  const removeFile = (fileId) => {
    setFiles(prev => prev.filter(file => file.id !== fileId));
    setUploadProgress(prev => {
      const newProgress = { ...prev };
      delete newProgress[fileId];
      return newProgress;
    });
  };

  // Clear all files from the list
  const clearFiles = () => {
    setFiles([]);
    setUploadProgress({});
    setErrors([]);
  };

  // Get appropriate icon for file type
  const getFileIcon = (file) => {
    if (!file) {
      return '📁'; // Default icon for missing file object
    }
    
    // Check file.type first if it exists
    if (file.type) {
      if (file.type.startsWith('image/')) {
        return '🖼️';
      } else if (file.type.includes('pdf')) {
        return '📄';
      } else if (file.type.includes('word') || file.type.includes('document')) {
        return '📝';
      } else if (file.type.includes('presentation') || file.type.includes('powerpoint') || 
                file.type.includes('ppt')) {
        return '📊';
      } else if (file.type.includes('spreadsheet') || file.type.includes('excel') || 
                file.type.includes('xls')) {
        return '📈';
      }
    }
    
    // Check filename extension as fallback
    if (file.name) {
      const extension = file.name.split('.').pop()?.toLowerCase();
      if (extension === 'pdf') return '📄';
      if (['doc', 'docx'].includes(extension)) return '📝';
      if (['ppt', 'pptx'].includes(extension)) return '📊';
      if (['xls', 'xlsx', 'csv'].includes(extension)) return '📈';
      if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(extension)) return '🖼️';
    }
    
    return '📁';
  };

  // Format file size for display
  const formatFileSize = (bytes) => {
    if (bytes === undefined || bytes === null || isNaN(bytes)) return '0 B';
    if (bytes === 0) return '0 B';
    
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(i === 0 ? 0 : 1)} ${sizes[i]}`;
  };

  return (
    <div className="file-uploader">
      <div
        {...getRootProps()}
        className={`p-4 border-2 border-dashed rounded-md transition-all ${
          isDragActive
            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
            : "border-gray-300 dark:border-gray-700"
        } ${
          isDragAccept
            ? "border-green-500 bg-green-50 dark:bg-green-900/20"
            : ""
        } ${
          isDragReject
            ? "border-red-500 bg-red-50 dark:bg-red-900/20"
            : ""
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center text-center">
          <div className="text-4xl mb-3">
            {isDragActive ? "📂" : "📁"}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
            {isDragActive
              ? "Drop files here..."
              : "Drag and drop files here, or click to select files"}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Supported file types: {acceptedFileTypes.join(", ")}
          </p>
        </div>
      </div>

      {/* File list showing only names during upload */}
      {files.length > 0 && (
        <div className="mt-4">
          <h3 className="text-sm font-medium mb-2">
            {files.some(f => f.status === 'uploading') ? 'Uploading...' : 'Files:'}
          </h3>
          <ul className="space-y-2">
            {files.map((file) => (
              <li key={file.id} className="px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <span>{getFileIcon(file)}</span>
                    <span className="truncate text-sm">
                      {file.originalName || file.name || (file.cloudinaryData?.original_filename || 'File')}
                    </span>
                    <span className="text-xs text-gray-500">
                      {formatFileSize(file.size || file.bytes || (file.cloudinaryData?.bytes || 0))}
                    </span>
                  </div>
                  
                  {file.status === 'error' && (
                    <span className="text-red-500 text-xs">Failed</span>
                  )}
                  
                  <button 
                    onClick={() => removeFile(file.id)}
                    className="ml-2 text-gray-400 hover:text-red-500"
                    type="button"
                  >
                    ×
                  </button>
                </div>
                
                {/* Preview for image files */}
                {file.preview && file.type && file.type.startsWith('image/') && (
                  <div className="mt-2">
                    <img 
                      src={file.preview} 
                      alt={file.name || 'Preview'} 
                      className="max-h-20 rounded-md object-contain mx-auto"
                      onLoad={() => { URL.revokeObjectURL(file.preview) }}
                    />
                  </div>
                )}
                
                {file.status === 'uploading' && (
                  <div className="mt-1">
                    <div className="h-1 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-500 rounded-full transition-all" 
                        style={{ width: `${uploadProgress[file.id] || 0}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Uploading: {uploadProgress[file.id] || 0}%
                    </span>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {errors.length > 0 && (
        <div className="mt-3 text-sm text-red-500">
          <h3 className="font-medium">Errors:</h3>
          <ul className="list-disc pl-5 mt-1">
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FileUploader; 