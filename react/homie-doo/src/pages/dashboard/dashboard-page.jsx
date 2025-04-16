import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import DashboardContent from './components/DashboardContent';

// Dummy subjects data with full structure
const initialSubjects = [
  { 
    id: 1, 
    name: 'Anatomy', 
    icon: '❤️', 
    color: 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-200',
    courseMaterials: {
      syllabus: {
        title: 'Human Anatomy Syllabus',
        content: 'This course covers the study of human body structure including cells, tissues, and organs.',
        sections: [
          { 
            title: 'Unit 1: Introduction to Anatomy', 
            weeks: '1-2',
            chapters: [
              {
                title: 'Chapter 1: Anatomical Terminology',
                subtopics: [
                  'Anatomical Position and Directional Terms',
                  'Body Planes and Sections',
                  'Body Regions and Cavities'
                ]
              },
              {
                title: 'Chapter 2: Body Organization',
                subtopics: [
                  'Levels of Organization',
                  'Homeostasis and Feedback Systems',
                  'Anatomical Variations'
                ]
              }
            ]
          },
          { 
            title: 'Unit 2: Musculoskeletal System', 
            weeks: '3-5',
            chapters: [
              {
                title: 'Chapter 3: Skeletal Tissues',
                subtopics: [
                  'Bone Structure and Classification',
                  'Bone Development and Growth',
                  'Joints and Articulations'
                ]
              }
            ]
          }
        ]
      },
      lectures: [
        { 
          id: 'l1', 
          title: 'Introduction to Human Anatomy', 
          date: '2023-09-05',
          content: 'Overview of anatomical terminology and body organization',
          attachments: ['introSlides.pdf']
        },
        { 
          id: 'l2', 
          title: 'Cells and Tissues', 
          date: '2023-09-07',
          content: 'Structure and function of cells, epithelial tissues, connective tissues',
          attachments: ['cellTypes.pdf', 'tissueLabels.pdf']
        }
      ],
      readings: [
        { 
          id: 'r1', 
          title: 'Gray\'s Anatomy for Students', 
          author: 'Drake et al.',
          type: 'Textbook',
          chapters: 'Ch 1-3 (pp. 1-45)'
        }
      ],
      assignments: [
        { 
          id: 'a1', 
          title: 'Body Regions Labeling Quiz', 
          dueDate: '2023-09-10',
          points: 25,
          instructions: 'Complete the online labeling quiz covering anatomical regions and directional terms'
        }
      ]
    },
    notes: [
      {
        id: 'n1',
        title: 'Lecture 1 Notes',
        date: '2023-09-05',
        content: 'Anatomical position: standing upright, facing forward, arms at sides, palms forward',
        tags: ['terminology', 'basics'],
        highlights: [
          { text: 'Anatomical position', color: 'yellow' }
        ],
        hasImages: false,
        imageDescriptions: []
      }
    ]
  },
  { 
    id: 2, 
    name: 'Physiology', 
    icon: '💓', 
    color: 'bg-pink-100 text-pink-600 dark:bg-pink-900 dark:text-pink-200',
    courseMaterials: {
      syllabus: {
        title: 'Human Physiology Syllabus',
        content: 'This course explores the function of human body systems, from cellular processes to integrated system activities.',
        sections: []
      },
      lectures: [],
      readings: [],
      assignments: []
    },
    notes: []
  },
  { 
    id: 3, 
    name: 'Epidemiology', 
    icon: '🌿', 
    color: 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-200',
    courseMaterials: {
      syllabus: {
        title: 'Principles of Epidemiology',
        content: 'This course introduces methods used to study the distribution and determinants of health and disease in populations.',
        sections: []
      },
      lectures: [],
      readings: [],
      assignments: []
    },
    notes: []
  }
];

const DashboardPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [subjects, setSubjects] = useState(initialSubjects);
  const [FavDocuments, setFavDocuments] = useState([
    { id: 1, name: 'To-do List', icon: '✅', type: 'document' },
    { id: 2, name: 'Reading List', icon: '📚', type: 'document' },
  ]);
  const [classesExpanded, setClassesExpanded] = useState(true);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  const handleResize = () => {
    const mobile = window.innerWidth < 768;
    setIsMobile(mobile);
    
    if (mobile) {
      setSidebarOpen(false);
      // Ensure we never have collapsed state on mobile - always use the full drawer
      setSidebarCollapsed(false);
    } else {
      setSidebarOpen(true);
    }
  };

  useEffect(() => {
    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const savedTheme = localStorage.getItem('theme');
    const savedSidebarState = localStorage.getItem('sidebarCollapsed');
    
    const shouldUseDarkMode = savedTheme === 'dark' || (!savedTheme && darkModeQuery.matches);
    setIsDarkMode(shouldUseDarkMode);
    
    // Only apply saved sidebar state on desktop
    if (savedSidebarState !== null && window.innerWidth >= 768) {
      setSidebarCollapsed(savedSidebarState === 'true');
    }
    
    if (shouldUseDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    handleResize();
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    
    // Update the document classes
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };
  
  const toggleSidebarCollapse = () => {
    // For mobile, toggle open/close
    if (isMobile) {
      setSidebarOpen(!sidebarOpen);
    } 
    // For desktop, toggle collapsed/expanded
    else {
      const newState = !sidebarCollapsed;
      setSidebarCollapsed(newState);
      localStorage.setItem('sidebarCollapsed', newState.toString());
    }
  };

  const handleAddSubject = (newSubject) => {
    // No need to add an ID as it's already included in the newSubject object from uuid
    const updatedSubjects = [...subjects, newSubject];
    setSubjects(updatedSubjects);
    
    // Add a small delay to ensure the subjects state is updated before setting selected subject
    setTimeout(() => {
      setSelectedSubject(newSubject.id);
    }, 50);

  };

  // New function to update subject data
  const handleUpdateSubject = (updatedSubject) => {
    const updatedSubjects = subjects.map(subject => 
      subject.id === updatedSubject.id ? updatedSubject : subject
    );
    setSubjects(updatedSubjects);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex overflow-hidden">
      <div className="flex w-full">
        {/* Sidebar Component */}
        <Sidebar 
          subjects={subjects}
          documents={FavDocuments}
          sidebarOpen={sidebarOpen}
          sidebarCollapsed={sidebarCollapsed}
          setSidebarCollapsed={setSidebarCollapsed}
          toggleSidebarCollapse={toggleSidebarCollapse}
          classesExpanded={classesExpanded}
          setClassesExpanded={setClassesExpanded}
          selectedSubject={selectedSubject}
          setSelectedSubject={setSelectedSubject}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleAddSubject={handleAddSubject}
          isDarkMode={isDarkMode}
          toggleDarkMode={toggleDarkMode}
        />
        
        {/* Dashboard Content Component */}
        <DashboardContent 
          subjects={subjects}
          selectedSubject={selectedSubject}
          updateSubject={handleUpdateSubject}
          navigate={navigate}
        />
      </div>
      
      {/* Semi-transparent overlay for mobile when sidebar is open */}
      {sidebarOpen && isMobile && (
        <div className="fixed inset-0 z-30 pointer-events-none">
          <div className="absolute left-0 top-0 bottom-0 w-60"></div>
          
          <div 
            className="absolute right-0 top-0 bottom-0 left-60 bg-black/10 pointer-events-auto"
            onClick={() => setSidebarOpen(false)}
          ></div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
