import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import cloudinaryService from '../../utils/cloudinaryService';

const DocumentPreviewPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [fileData, setFileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true); // Open by default
  const [question, setQuestion] = useState('');
  const [viewerType, setViewerType] = useState('google'); // 'google' or 'office'
  const [isMobile, setIsMobile] = useState(false);
  const drawerRef = useRef(null);
  
  // Check if mobile view
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth <= 768) {
        setSidebarOpen(false); // Close sidebar by default on mobile
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);
  
  // Handle click outside of drawer to close it on mobile
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobile && sidebarOpen && drawerRef.current && !drawerRef.current.contains(event.target)) {
        setSidebarOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobile, sidebarOpen]);
  
  // Get file data from localStorage or location state
  useEffect(() => {
    try {
      // First try to get data from localStorage (preferred method)
      const storedFileData = localStorage.getItem('previewFileData');
      if (storedFileData) {
        const parsedData = JSON.parse(storedFileData);
        setFileData(parsedData);
        setLoading(false);
        return;
      }
      
      // Fall back to location state if available
      if (location.state?.fileData) {
        setFileData(location.state.fileData);
        setLoading(false);
        return;
      }
      
      // If neither source has data, set an error
      setError('No file data available for preview');
      setLoading(false);
    } catch (err) {
      console.error('Error loading file data:', err);
      setError('Failed to load file data');
      setLoading(false);
    }
  }, [location]);

  // Handle download
  const handleDownload = () => {
    if (!fileData) return;
    
    if (fileData.publicId && fileData.resourceType) {
      window.open(cloudinaryService.getDownloadUrl(fileData.publicId, fileData.resourceType), '_blank');
      return;
    }
    
    if (fileData.url) {
      const downloadUrl = fileData.url.includes('cloudinary.com') 
        ? `${fileData.url.split('/upload/')[0]}/upload/fl_attachment/${fileData.url.split('/upload/')[1]}`
        : fileData.url;
      window.open(downloadUrl, '_blank');
    }
  };

  // Determine file type based on file data
  const getFileType = () => {
    if (!fileData) return 'unknown';
    
    // Try to determine from MIME type
    if (fileData.type) {
      if (fileData.type.startsWith('image/')) return 'image';
      if (fileData.type.includes('pdf') || fileData.type === 'application/pdf') return 'pdf';
      if (fileData.type.includes('presentation') || fileData.type.includes('powerpoint')) return 'powerpoint';
      if (fileData.type.includes('word') || fileData.type.includes('document')) return 'word';
      if (fileData.type.includes('spreadsheet') || fileData.type.includes('excel')) return 'excel';
      if (fileData.type.includes('text/') || fileData.type.includes('code/')) return 'text';
      if (fileData.type.includes('video/')) return 'video';
      if (fileData.type.includes('audio/')) return 'audio';
    }
    
    // Try to determine from URL if no MIME type available
    if (fileData.url) {
      const url = fileData.url.toLowerCase();
      if (url.endsWith('.pdf')) return 'pdf';
      if (url.endsWith('.ppt') || url.endsWith('.pptx')) return 'powerpoint';
      if (url.endsWith('.doc') || url.endsWith('.docx')) return 'word';
      if (url.endsWith('.xls') || url.endsWith('.xlsx') || url.endsWith('.csv')) return 'excel';
      if (url.match(/\.(jpe?g|png|gif|bmp|webp|svg)$/)) return 'image';
      if (url.match(/\.(txt|md|rtf|json|xml|html|css|js)$/)) return 'text';
      if (url.match(/\.(mp4|webm|ogg|mov|avi)$/)) return 'video';
      if (url.match(/\.(mp3|wav|ogg)$/)) return 'audio';
    }
    
    // Try to determine from filename
    if (fileData.name) {
      const name = fileData.name.toLowerCase();
      if (name.endsWith('.pdf')) return 'pdf';
      if (name.endsWith('.ppt') || name.endsWith('.pptx')) return 'powerpoint';
      if (name.endsWith('.doc') || name.endsWith('.docx')) return 'word';
      if (name.endsWith('.xls') || name.endsWith('.xlsx') || name.endsWith('.csv')) return 'excel';
      if (name.match(/\.(jpe?g|png|gif|bmp|webp|svg)$/)) return 'image';
      if (name.match(/\.(txt|md|rtf|json|xml|html|css|js)$/)) return 'text';
      if (name.match(/\.(mp4|webm|ogg|mov|avi)$/)) return 'video';
      if (name.match(/\.(mp3|wav|ogg)$/)) return 'audio';
    }
    
    return 'unknown';
  };

  // Submit question about the document (placeholder for future functionality)
  const handleSubmitQuestion = (e) => {
    e.preventDefault();
    alert(`Question submitted: ${question}`);
    setQuestion('');
  };

  // Get Google Docs Viewer URL
  const getGoogleDocsViewerUrl = () => {
    if (!fileData?.url) return '';
    return `https://docs.google.com/viewer?url=${encodeURIComponent(fileData.url)}&embedded=true`;
  };

  // Get Office Online Viewer URL
  const getOfficeOnlineViewerUrl = () => {
    if (!fileData?.url) return '';
    return `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(fileData.url)}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="w-full max-w-5xl">
          <Skeleton height={80} className="mb-4 rounded-lg" />
          <div className="flex">
            <Skeleton height={600} width="70%" className="rounded-lg mr-4" />
            <Skeleton height={600} width="30%" className="rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !fileData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
        <div className="text-red-500 text-xl mb-4 p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
          <div className="text-6xl mb-4 text-center">😕</div>
          <p className="text-center">{error || 'File data not available'}</p>
          <div className="flex justify-center mt-6">
            <button 
              onClick={() => navigate(-1)} 
              className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors shadow-md"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  const fileType = getFileType();
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-md p-4 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <button 
              onClick={() => navigate(-1)}
              className="mr-4 p-2 text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Go back"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
            </button>
            <h1 className="text-xl font-semibold text-gray-800 dark:text-white truncate max-w-md">
              {fileData.name || 'Document Preview'}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            {(fileType === 'pdf' || fileType === 'word' || fileType === 'excel' || fileType === 'powerpoint' || fileType === 'unknown') && (
              <div className="flex mr-4 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                <button 
                  onClick={() => setViewerType('google')}
                  className={`px-3 py-1 text-sm rounded-md transition-colors ${viewerType === 'google' 
                    ? 'bg-white dark:bg-gray-600 shadow-sm text-blue-600 dark:text-blue-400' 
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
                >
                  Google
                </button>
                {(fileType === 'word' || fileType === 'excel' || fileType === 'powerpoint') && (
                  <button 
                    onClick={() => setViewerType('office')}
                    className={`px-3 py-1 text-sm rounded-md transition-colors ${viewerType === 'office' 
                      ? 'bg-white dark:bg-gray-600 shadow-sm text-blue-600 dark:text-blue-400' 
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
                  >
                    Office
                  </button>
                )}
              </div>
            )}
            
            <button 
              onClick={handleDownload} 
              className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors shadow-sm flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              <span className="hidden sm:inline">Download</span>
            </button>
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)} 
              className="p-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors shadow-sm"
              aria-label={sidebarOpen ? 'Hide chat' : 'Show chat'}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Document view */}
        <main className={`flex-1 overflow-auto transition-all duration-300 h-[calc(100vh-73px)] ${!isMobile && sidebarOpen ? 'mr-96' : 'mr-0'}`}>
          <div className="h-full bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
            {/* PDF Viewer */}
            {fileType === 'pdf' && (
              <>
                {viewerType === 'google' && (
                  <iframe 
                    src={getGoogleDocsViewerUrl()}
                    width="100%" 
                    height="100%" 
                    className="w-full h-full border-0"
                    title="Google Docs Viewer"
                    allowFullScreen
                  >
                    <p>Your browser does not support iframes.</p>
                  </iframe>
                )}
              </>
            )}

            {/* Image Viewer */}
            {fileType === 'image' && (
              <div className="flex justify-center items-center h-full p-4">
                <img 
                  src={fileData.url} 
                  alt={fileData.name || 'Image'} 
                  className="max-w-full max-h-full h-auto w-auto object-contain rounded-md shadow-md"
                />
              </div>
            )}

            {/* Video Viewer */}
            {fileType === 'video' && (
              <div className="flex justify-center items-center h-full p-4">
                <video 
                  src={fileData.url} 
                  controls
                  className="max-w-full max-h-full w-auto h-auto rounded-md shadow-md"
                >
                  Your browser does not support the video tag.
                </video>
              </div>
            )}

            {/* Audio Viewer */}
            {fileType === 'audio' && (
              <div className="flex flex-col justify-center items-center h-full p-4">
                <div className="text-6xl mb-8">🎵</div>
                <h2 className="text-xl font-semibold mb-4">{fileData.name}</h2>
                <audio 
                  src={fileData.url} 
                  controls
                  className="w-full max-w-md rounded-md shadow-md mb-4"
                >
                  Your browser does not support the audio tag.
                </audio>
                <button 
                  onClick={handleDownload}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors mt-4"
                >
                  Download Audio
                </button>
              </div>
            )}

            {/* Office Files Viewer */}
            {(fileType === 'word' || fileType === 'excel' || fileType === 'powerpoint') && (
              <>
                {viewerType === 'google' && (
                  <iframe 
                    src={getGoogleDocsViewerUrl()}
                    width="100%" 
                    height="100%" 
                    className="w-full h-full border-0"
                    title="Google Docs Viewer"
                    allowFullScreen
                  >
                    <p>Your browser does not support iframes.</p>
                  </iframe>
                )}
                
                {viewerType === 'office' && (
                  <iframe 
                    src={getOfficeOnlineViewerUrl()}
                    width="100%" 
                    height="100%" 
                    className="w-full h-full border-0"
                    title="Office Online Viewer"
                    allowFullScreen
                  >
                    <p>Your browser does not support iframes.</p>
                  </iframe>
                )}
              </>
            )}
            
            {/* Text/Code Viewer */}
            {fileType === 'text' && (
              <div className="h-full">
                <iframe
                  src={fileData.url}
                  width="100%"
                  height="100%"
                  className="w-full h-full border-0 bg-white dark:bg-gray-800 font-mono text-sm"
                  title="Text Viewer"
                >
                  <p>Your browser does not support iframes.</p>
                </iframe>
              </div>
            )}
            
            {/* Unknown File Type */}
            {fileType === 'unknown' && (
              <>
                {viewerType === 'google' && (
                  <iframe 
                    src={getGoogleDocsViewerUrl()}
                    width="100%" 
                    height="100%" 
                    className="w-full h-full border-0"
                    title="Google Docs Viewer"
                    allowFullScreen
                  >
                    <p>Your browser does not support iframes.</p>
                  </iframe>
                )}
              </>
            )}
          </div>
        </main>

        {/* Chat sidebar for desktop */}
        {!isMobile && sidebarOpen && (
          <aside className="w-96 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 fixed right-0 top-[73px] bottom-0 overflow-hidden shadow-lg z-10">
            <div className="p-4 h-full flex flex-col">
              {/* Chat conversations will go here */}
              <div className="flex-1 overflow-auto mb-4 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                <div className="space-y-4">
                  {/* Sample welcome message */}
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 mr-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                        <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
                      </svg>
                    </div>
                    <div className="bg-white dark:bg-gray-700 rounded-lg p-3 shadow-sm max-w-[85%]">
                      <p className="text-sm text-gray-800 dark:text-gray-200">
                        Ask me anything about this document! I can help you understand the content or highlight key information.
                      </p>
                    </div>
                  </div>
                  
                  {/* Sample Q&A, only shown if user has asked questions */}
                  {question && (
                    <>
                      <div className="flex items-start justify-end">
                        <div className="bg-blue-500 rounded-lg p-3 shadow-sm max-w-[85%]">
                          <p className="text-sm text-white">
                            {question}
                          </p>
                        </div>
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white ml-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 mr-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                            <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
                          </svg>
                        </div>
                        <div className="bg-white dark:bg-gray-700 rounded-lg p-3 shadow-sm max-w-[85%]">
                          <p className="text-sm text-gray-800 dark:text-gray-200">
                            Analyzing your question. I'll have an answer for you shortly!
                          </p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
              
              {/* File information */}
              <div className="mb-4 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                  <li><strong>Name:</strong> {fileData.name}</li>
                  <li><strong>Type:</strong> {fileData.type || 'Unknown'}</li>
                  <li><strong>Size:</strong> {fileData.size ? formatFileSize(fileData.size) : 'Unknown'}</li>
                </ul>
              </div>
              
              {/* Question input */}
              <form onSubmit={handleSubmitQuestion} className="mt-auto">
                <div className="relative">
                  <textarea
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="Ask a question about this document..."
                    className="w-full p-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm resize-none"
                    rows={3}
                  />
                  <button
                    type="submit"
                    className="absolute right-2 bottom-2 p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                    disabled={!question.trim()}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </form>
            </div>
          </aside>
        )}

        {/* Mobile drawer */}
        {isMobile && sidebarOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-30">
            <div 
              ref={drawerRef}
              className="absolute right-0 top-0 bottom-0 w-full max-w-[90%] bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 h-full"
            >
              <div className="p-4 h-full flex flex-col">
                {/* Drawer header with back button */}
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => setSidebarOpen(false)}
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  <h2 className="text-lg font-medium text-gray-800 dark:text-white">Document AI Assistant</h2>
                  <div className="w-10"></div> {/* Spacer to center the title */}
                </div>

                {/* Chat content */}
                <div className="flex-1 overflow-auto mb-4 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                  <div className="space-y-4">
                    {/* Sample welcome message */}
                    <div className="flex items-start">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 mr-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                          <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
                        </svg>
                      </div>
                      <div className="bg-white dark:bg-gray-700 rounded-lg p-3 shadow-sm max-w-[85%]">
                        <p className="text-sm text-gray-800 dark:text-gray-200">
                          Ask me anything about this document! I can help you understand the content or highlight key information.
                        </p>
                      </div>
                    </div>
                    
                    {/* Sample Q&A, only shown if user has asked questions */}
                    {question && (
                      <>
                        <div className="flex items-start justify-end">
                          <div className="bg-blue-500 rounded-lg p-3 shadow-sm max-w-[85%]">
                            <p className="text-sm text-white">
                              {question}
                            </p>
                          </div>
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white ml-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                            </svg>
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 mr-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                              <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
                            </svg>
                          </div>
                          <div className="bg-white dark:bg-gray-700 rounded-lg p-3 shadow-sm max-w-[85%]">
                            <p className="text-sm text-gray-800 dark:text-gray-200">
                              Analyzing your question. I'll have an answer for you shortly!
                            </p>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                
                {/* File information */}
                <div className="mb-4 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                  <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                    <li><strong>Name:</strong> {fileData.name}</li>
                    <li><strong>Type:</strong> {fileData.type || 'Unknown'}</li>
                    <li><strong>Size:</strong> {fileData.size ? formatFileSize(fileData.size) : 'Unknown'}</li>
                  </ul>
                </div>
                
                {/* Question input */}
                <form onSubmit={handleSubmitQuestion} className="mt-auto">
                  <div className="relative">
                    <textarea
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      placeholder="Ask a question about this document..."
                      className="w-full p-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm resize-none"
                      rows={3}
                    />
                    <button
                      type="submit"
                      className="absolute right-2 bottom-2 p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                      disabled={!question.trim()}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Helper function to format file size
const formatFileSize = (bytes) => {
  if (!bytes || isNaN(bytes)) return '0 B';
  if (bytes < 1024) return bytes + ' B';
  else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  else return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
};

export default DocumentPreviewPage; 