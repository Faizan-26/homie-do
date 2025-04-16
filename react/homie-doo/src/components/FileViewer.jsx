import React, { useState, useEffect } from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import cloudinaryService from '../utils/cloudinaryService';
import { useNavigate } from 'react-router-dom';

/**
 * Component for viewing different types of files
 */
const FileViewer = ({ 
  file,
  publicId,
  resourceType = 'auto',
  url,
  fileType,
  name,
  width = '100%',
  height = 'auto',
  showDownloadButton = true,
  customTransformations = {},
  isPreview = false // New prop to determine if this is the full preview page
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const navigate = useNavigate();

  // Determine file type if not provided
  const determineFileType = () => {
    if (fileType) return fileType;
    
    // Check file object
    if (file) {
      if (file.type) {
        if (file.type.startsWith('image/')) return 'image';
        if (file.type.includes('pdf') || file.type === 'application/pdf') return 'document';
        if (file.type.includes('presentation') || file.type.includes('powerpoint')) return 'presentation';
        if (file.type.includes('word') || file.type.includes('document')) return 'document';
        if (file.type.includes('spreadsheet') || file.type.includes('excel')) return 'spreadsheet';
      }
      
      // Check filename
      if (file.name) {
        const name = file.name.toLowerCase();
        if (name.endsWith('.pdf')) return 'document';
        if (name.endsWith('.ppt') || name.endsWith('.pptx')) return 'presentation';
        if (name.endsWith('.doc') || name.endsWith('.docx')) return 'document';
        if (name.endsWith('.xls') || name.endsWith('.xlsx')) return 'spreadsheet';
        if (name.match(/\.(jpe?g|png|gif|bmp|webp|svg)$/)) return 'image';
      }
    }
    
    // Check URL
    if (url) {
      const extension = url.split('.').pop().toLowerCase();
      
      if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(extension)) {
        return 'image';
      } else if (['pdf'].includes(extension)) {
        return 'document';
      } else if (['ppt', 'pptx'].includes(extension)) {
        return 'presentation';
      } else if (['doc', 'docx'].includes(extension)) {
        return 'document';
      } else if (['xls', 'xlsx', 'csv'].includes(extension)) {
        return 'spreadsheet';
      }
    }
    
    // Check name prop
    if (name) {
      const nameLower = name.toLowerCase();
      if (nameLower.endsWith('.pdf')) return 'document';
      if (nameLower.endsWith('.ppt') || nameLower.endsWith('.pptx')) return 'presentation';
      if (nameLower.endsWith('.doc') || nameLower.endsWith('.docx')) return 'document';
      if (nameLower.endsWith('.xls') || nameLower.endsWith('.xlsx')) return 'spreadsheet';
      if (nameLower.match(/\.(jpe?g|png|gif|bmp|webp|svg)$/)) return 'image';
    }
    
    return 'other';
  };
  
  const fileTypeCategory = determineFileType();
  
  // Get the display URL
  useEffect(() => {
    if (url) {
      setImageUrl(url);
      setLoading(false);
      return;
    }
    
    if (publicId) {
      const options = {
        resourceType: resourceType,
        transformations: Object.entries(customTransformations)
          .map(([key, value]) => `${key}_${value}`)
          .join(',')
      };
      
      setImageUrl(cloudinaryService.getFileUrl(publicId, options));
      setLoading(false);
      return;
    }
    
    if (file && file.preview) {
      setImageUrl(file.preview);
      setLoading(false);
      return;
    }
    
    setError('No file source provided');
    setLoading(false);
  }, [url, publicId, file, resourceType, customTransformations]);

  // Handle errors
  const onError = () => {
    setError('Failed to load file');
    setLoading(false);
  };

  // Download file
  const handleDownload = () => {
    if (publicId && resourceType) {
      window.open(cloudinaryService.getDownloadUrl(publicId, resourceType), '_blank');
      return;
    }
    
    if (url) {
      const downloadUrl = url.includes('cloudinary.com') 
        ? `${url.split('/upload/')[0]}/upload/fl_attachment/${url.split('/upload/')[1]}`
        : url;
      window.open(downloadUrl, '_blank');
      return;
    }
    
    if (file && file.preview) {
      const link = document.createElement('a');
      link.href = file.preview;
      link.download = file.name || 'download';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Handle click to view file in preview page
  const handleViewFile = () => {
    // Don't navigate if already in preview mode
    if (isPreview) return;
    
    // Prepare file data for the preview page
    const fileData = {
      url: imageUrl,
      name: name || file?.originalName || file?.name || 'Document',
      type: file?.type,
      size: file?.size,
      publicId,
      resourceType
    };
    
    // Store file data in localStorage for the preview page
    localStorage.setItem('previewFileData', JSON.stringify(fileData));
    
    // Open the preview page in a new tab
    window.open('/dashboard/preview-document', '_blank');
  };

  // Loading skeleton based on file type
  if (loading) {
    return (
      <div style={{ width, height: typeof height === 'number' ? height : 300 }}>
        <Skeleton height="100%" />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center border border-red-200 dark:border-red-800 rounded-md p-4 bg-red-50 dark:bg-red-900/10" style={{ width, height: typeof height === 'number' ? height : 'auto' }}>
        <p className="text-red-600 dark:text-red-400 mb-2">
          {error}
        </p>
        {showDownloadButton && (
          <button
            onClick={handleDownload}
            className="text-sm bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded"
          >
            Download Instead
          </button>
        )}
      </div>
    );
  }

  // Render different file types
  const renderFileContent = () => {
    switch (fileTypeCategory) {
      case 'image':
        return (
          <div className="cursor-pointer" onClick={handleViewFile}>
            <img
              src={imageUrl}
              alt={name || file?.originalName || file?.name || 'Image'}
              className="max-w-full h-auto rounded-md"
              style={{ width, height }}
              onLoad={() => setLoading(false)}
              onError={onError}
            />
          </div>
        );
      
      case 'document':
        if (imageUrl && (imageUrl.toLowerCase().endsWith('.pdf') || (file && file.type === 'application/pdf'))) {
          return (
            <div className="cursor-pointer" onClick={handleViewFile}>
              {!isPreview ? (
                <div 
                  className="flex flex-col items-center justify-center p-4 border border-gray-200 dark:border-gray-700 rounded-md cursor-pointer"
                  style={{ width, height: typeof height === 'number' ? height : 200 }}
                >
                  <div className="text-4xl mb-2">📄</div>
                  <p className="text-sm text-center">{name || file?.originalName || file?.name || 'PDF Document'}</p>
                  <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">Click to view</span>
                </div>
              ) : (
                <object
                  data={imageUrl}
                  type="application/pdf"
                  width={width}
                  height={typeof height === 'number' ? height : 500}
                  className="rounded-md border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex flex-col items-center justify-center p-4">
                    <p className="text-gray-700 dark:text-gray-300 mb-2">
                      Unable to display PDF. 
                    </p>
                    <button
                      onClick={handleDownload}
                      className="text-sm bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded"
                    >
                      Download Instead
                    </button>
                  </div>
                </object>
              )}
            </div>
          );
        } else {
          return (
            <div 
              className="flex flex-col items-center justify-center p-4 border border-gray-200 dark:border-gray-700 rounded-md cursor-pointer"
              onClick={handleViewFile}
              style={{ width, height: typeof height === 'number' ? height : 200 }}
            >
              <div className="text-4xl mb-2">📄</div>
              <p className="text-sm text-center">{name || file?.originalName || file?.name || 'Document'}</p>
              <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">Click to view</span>
            </div>
          );
        }
      
      case 'presentation':
        return (
          <div 
            className="flex flex-col items-center justify-center p-4 border border-gray-200 dark:border-gray-700 rounded-md cursor-pointer"
            onClick={handleViewFile}
            style={{ width, height: typeof height === 'number' ? height : 200 }}
          >
            <div className="text-4xl mb-2">📊</div>
            <p className="text-sm text-center">{name || file?.originalName || file?.name || 'Presentation'}</p>
            <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">Click to view</span>
          </div>
        );
      
      case 'spreadsheet':
        return (
          <div 
            className="flex flex-col items-center justify-center p-4 border border-gray-200 dark:border-gray-700 rounded-md cursor-pointer"
            onClick={handleViewFile}
            style={{ width, height: typeof height === 'number' ? height : 200 }}
          >
            <div className="text-4xl mb-2">📈</div>
            <p className="text-sm text-center">{name || file?.originalName || file?.name || 'Spreadsheet'}</p>
            <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">Click to view</span>
          </div>
        );
      
      default:
        return (
          <div 
            className="flex flex-col items-center justify-center p-4 border border-gray-200 dark:border-gray-700 rounded-md cursor-pointer"
            onClick={handleViewFile}
            style={{ width, height: typeof height === 'number' ? height : 200 }}
          >
            <div className="text-4xl mb-2">📁</div>
            <p className="text-sm text-center">{name || file?.originalName || file?.name || 'File'}</p>
            <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">Click to view</span>
          </div>
        );
    }
  };

  return (
    <div className="file-viewer">
      {renderFileContent()}
      
      {showDownloadButton && !isPreview && (
        <button
          onClick={(e) => {
            e.stopPropagation(); // Prevent triggering the view action
            handleDownload();
          }}
          className="mt-2 text-xs bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded w-full"
        >
          Download
        </button>
      )}
    </div>
  );
};

export default FileViewer; 