import React, { useState, useEffect } from 'react';
import { ScrollArea } from '../../../components/ui/scroll-area';
import { Button } from '../../../components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../../components/ui/dialog';
import { 
  AddUnitDialog,
  EditUnitDialog,
  AddChapterDialog,
  EditChapterDialog,
  AddSubtopicDialog,
  EditSubtopicDialog 
} from './SyllabusDialogs';

import { 
  AddLectureDialog, 
  EditLectureDialog,
  AddReadingDialog,
  EditReadingDialog,
  AddAssignmentDialog,
  EditAssignmentDialog,
  AddNoteDialog,
  EditNoteDialog
} from './ContentDialogs';
import FileViewer from '../../../components/FileViewer';
import cloudinaryService from '../../../utils/cloudinaryService';

// Dummy data for course materials
const dummySubjectsData = {
  1: {
    id: 1,
    name: 'Anatomy',
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
              },
              {
                title: 'Chapter 4: Muscle Tissues',
                subtopics: [
                  'Muscle Cell Structure',
                  'Types of Muscle Tissue',
                  'Muscle Attachments and Actions'
                ]
              }
            ]
          },
          { 
            title: 'Unit 3: Nervous System', 
            weeks: '6-8',
            chapters: [
              {
                title: 'Chapter 5: Neuroanatomy',
                subtopics: [
                  'Neurons and Neuroglial Cells',
                  'Central Nervous System',
                  'Peripheral Nervous System'
                ]
              }
            ]
          },
          { 
            title: 'Unit 4: Cardiovascular System', 
            weeks: '9-11',
            chapters: [
              {
                title: 'Chapter 6: Heart Anatomy',
                subtopics: [
                  'Cardiac Chambers and Valves',
                  'Cardiac Muscle Tissue',
                  'Cardiac Conduction System'
                ]
              },
              {
                title: 'Chapter 7: Blood Vessels',
                subtopics: [
                  'Arteries, Veins, and Capillaries',
                  'Major Vascular Pathways',
                  'Portal Systems'
                ]
              }
            ]
          },
          { 
            title: 'Unit 5: Respiratory & Digestive Systems', 
            weeks: '12-14',
            chapters: [
              {
                title: 'Chapter 8: Respiratory Structures',
                subtopics: [
                  'Upper and Lower Respiratory Tract',
                  'Lungs and Pleural Cavities',
                  'Respiratory Membrane'
                ]
              },
              {
                title: 'Chapter 9: Digestive Organs',
                subtopics: [
                  'GI Tract Anatomy',
                  'Accessory Digestive Organs',
                  'Peritoneal Relationships'
                ]
              }
            ]
          },
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
        },
        { 
          id: 'l3', 
          title: 'Integumentary System', 
          date: '2023-09-12',
          content: 'Skin structure, appendages, and functions',
          attachments: ['skinDiagram.pdf']
        },
        { 
          id: 'l4', 
          title: 'Skeletal System I', 
          date: '2023-09-14',
          content: 'Bone tissue, classification, and axial skeleton',
          attachments: ['boneStructure.pdf', 'axialSkeleton.pdf']
        },
      ],
      readings: [
        { 
          id: 'r1', 
          title: 'Gray\'s Anatomy for Students', 
          author: 'Drake et al.',
          type: 'Textbook',
          chapters: 'Ch 1-3 (pp. 1-45)'
        },
        { 
          id: 'r2', 
          title: 'Clinical Applications of Anatomical Variations', 
          author: 'Johnson, M',
          type: 'Journal Article',
          source: 'Journal of Anatomy, 45(2)'
        },
        { 
          id: 'r3', 
          title: 'The Skeleton System: Crash Course A&P #19', 
          type: 'Video',
          source: 'YouTube',
          length: '10:42'
        },
      ],
      assignments: [
        { 
          id: 'a1', 
          title: 'Body Regions Labeling Quiz', 
          dueDate: '2023-09-10',
          points: 25,
          instructions: 'Complete the online labeling quiz covering anatomical regions and directional terms'
        },
        { 
          id: 'a2', 
          title: 'Cell Structure Drawing', 
          dueDate: '2023-09-17',
          points: 50,
          instructions: 'Draw and label a eukaryotic cell with all major organelles. Submit as PDF.'
        },
        { 
          id: 'a3', 
          title: 'Tissue Identification Lab', 
          dueDate: '2023-09-24',
          points: 75,
          instructions: 'Attend lab session to identify different tissue types under microscope and complete worksheet'
        },
      ]
    },
    notes: [
      {
        id: 'n1',
        title: 'Lecture 1 Notes',
        date: '2023-09-05',
        content: 'Anatomical position: standing upright, facing forward, arms at sides, palms forward\n\nDirectional terms:\n- Superior/Inferior (above/below)\n- Anterior/Posterior (front/back)\n- Medial/Lateral (toward/away from midline)\n- Proximal/Distal (closer to/farther from attachment)',
        tags: ['terminology', 'basics', 'important'],
        highlights: [
          { text: 'Anatomical position', color: 'yellow' },
          { text: 'Directional terms', color: 'green' }
        ],
        hasImages: true,
        imageDescriptions: ['Anatomical planes diagram', 'Body regions chart']
      },
      {
        id: 'n2',
        title: 'Tissue Types Summary',
        date: '2023-09-08',
        content: '4 Primary Tissue Types:\n1. Epithelial - covers surfaces\n2. Connective - supports and connects\n3. Muscle - movement\n4. Nervous - communication\n\nEpithelial subtypes based on cell shape:\n- Squamous (flat)\n- Cuboidal (cube-like)\n- Columnar (tall rectangle)',
        tags: ['tissues', 'classification', 'exam'],
        highlights: [
          { text: '4 Primary Tissue Types', color: 'pink' },
          { text: 'Epithelial subtypes', color: 'blue' }
        ],
        hasImages: true,
        imageDescriptions: ['Tissue comparison microscope images']
      },
    ]
  },
  2: {
    id: 2,
    name: 'Physiology',
    courseMaterials: {
      syllabus: {
        title: 'Human Physiology Syllabus',
        content: 'This course explores the function of human body systems, from cellular processes to integrated system activities.',
        sections: [
          { 
            title: 'Unit 1: Cellular Physiology', 
            weeks: '1-3',
            chapters: [
              {
                title: 'Chapter 1: Cell Membrane Dynamics',
                subtopics: [
                  'Membrane Structure and Function',
                  'Transport Mechanisms',
                  'Membrane Potentials'
                ]
              },
              {
                title: 'Chapter 2: Cellular Communication',
                subtopics: [
                  'Signal Transduction Pathways',
                  'Second Messengers',
                  'Cellular Receptors'
                ]
              }
            ]
          },
          { 
            title: 'Unit 2: Neurophysiology', 
            weeks: '4-6',
            chapters: [
              {
                title: 'Chapter 3: Neural Signaling',
                subtopics: [
                  'Action Potentials',
                  'Synaptic Transmission',
                  'Neurotransmitters'
                ]
              },
              {
                title: 'Chapter 4: Sensory Physiology',
                subtopics: [
                  'Somatosensation',
                  'Special Senses',
                  'Sensory Adaptation'
                ]
              }
            ]
          },
          { title: 'Unit 3: Cardiovascular Physiology', weeks: '7-9' },
          { title: 'Unit 4: Respiratory Physiology', weeks: '10-12' },
          { title: 'Unit 5: Renal & Digestive Physiology', weeks: '13-15' },
        ]
      },
      lectures: [
        { 
          id: 'l1', 
          title: 'Homeostasis and Cell Membrane Transport', 
          date: '2023-09-06',
          content: 'Principles of homeostasis, membrane structure, and transport mechanisms',
          attachments: ['homeostasisConcepts.pdf', 'transportDiagrams.pdf']
        },
        { 
          id: 'l2', 
          title: 'Membrane Potentials', 
          date: '2023-09-08',
          content: 'Resting membrane potential, action potentials, local potentials',
          attachments: ['actionPotential.pdf', 'ionChannels.pdf']
        },
      ],
      readings: [
        { 
          id: 'r1', 
          title: 'Human Physiology: An Integrated Approach', 
          author: 'Silverthorn, D.U.',
          type: 'Textbook',
          chapters: 'Ch 1-2 (pp. 1-56)'
        },
        { 
          id: 'r2', 
          title: 'Recent Advances in Understanding Ion Channel Function', 
          author: 'Chen, X. et al.',
          type: 'Journal Article',
          source: 'Physiological Reviews, 94(3)'
        },
      ],
      assignments: [
        { 
          id: 'a1', 
          title: 'Homeostasis Concept Map', 
          dueDate: '2023-09-13',
          points: 50,
          instructions: 'Create a concept map showing feedback mechanisms for temperature regulation'
        },
        { 
          id: 'a2', 
          title: 'Membrane Transport Lab', 
          dueDate: '2023-09-20',
          points: 75,
          instructions: 'Complete virtual lab on diffusion and osmosis, analyzing transport rates under different conditions'
        },
      ]
    },
    notes: [
      {
        id: 'n1',
        title: 'Cell Membrane Functions',
        date: '2023-09-06',
        content: 'Cell membrane functions:\n- Barrier between internal/external environments\n- Controls what enters/exits the cell\n- Communication with other cells\n- Cell recognition\n\nPhospholipid bilayer with embedded proteins',
        tags: ['membranes', 'important', 'quiz'],
        highlights: [
          { text: 'Cell membrane functions', color: 'yellow' },
          { text: 'Phospholipid bilayer', color: 'blue' }
        ],
        hasImages: true,
        imageDescriptions: ['Fluid mosaic model diagram', 'Transport protein types']
      }
    ]
  },
  3: {
    id: 3,
    name: 'Epidemiology',
    courseMaterials: {
      syllabus: {
        title: 'Principles of Epidemiology',
        content: 'This course introduces methods used to study the distribution and determinants of health and disease in populations.',
        sections: [
          { 
            title: 'Unit 1: Introduction to Epidemiology', 
            weeks: '1-2',
            chapters: [
              {
                title: 'Chapter 1: History and Scope',
                subtopics: [
                  'Development of Epidemiology',
                  'Modern Applications',
                  'Key Epidemiological Achievements'
                ]
              },
              {
                title: 'Chapter 2: Epidemiological Approach',
                subtopics: [
                  'Population Perspective',
                  'Determinants of Disease',
                  'Surveillance and Investigation'
                ]
              }
            ]
          },
          { 
            title: 'Unit 2: Measuring Disease Frequency', 
            weeks: '3-4',
            chapters: [
              {
                title: 'Chapter 3: Counts and Rates',
                subtopics: [
                  'Prevalence and Incidence',
                  'Mortality Rates',
                  'Years of Potential Life Lost'
                ]
              },
              {
                title: 'Chapter 4: Standardization',
                subtopics: [
                  'Direct Standardization',
                  'Indirect Standardization',
                  'Comparing Populations'
                ]
              }
            ]
          },
          { title: 'Unit 3: Study Designs', weeks: '5-9' },
          { title: 'Unit 4: Causation in Epidemiology', weeks: '10-12' },
          { title: 'Unit 5: Screening & Surveillance', weeks: '13-15' },
        ]
      },
      lectures: [
        { 
          id: 'l1', 
          title: 'History and Scope of Epidemiology', 
          date: '2023-09-05',
          content: 'The evolution of epidemiology, major achievements, and contemporary applications',
          attachments: ['epidHistory.pdf']
        },
        { 
          id: 'l2', 
          title: 'Measures of Disease Frequency', 
          date: '2023-09-12',
          content: 'Prevalence, incidence, mortality rates, and standardization methods',
          attachments: ['frequencyMeasures.pdf', 'rateCalculations.pdf']
        },
      ],
      readings: [
        { 
          id: 'r1', 
          title: 'Epidemiology: Beyond the Basics', 
          author: 'Szklo & Nieto',
          type: 'Textbook',
          chapters: 'Ch 1-2 (pp. 1-40)'
        },
        { 
          id: 'r2', 
          title: 'Epidemiologic Methods in COVID-19 Research', 
          author: 'Thompson, R. et al.',
          type: 'Journal Article',
          source: 'American Journal of Epidemiology, 190(1)'
        },
      ],
      assignments: [
        { 
          id: 'a1', 
          title: 'Disease Outbreak Investigation', 
          dueDate: '2023-09-19',
          points: 100,
          instructions: 'Complete the CDC Outbreak Detective online module and submit a 2-page summary of methods used'
        },
        { 
          id: 'a2', 
          title: 'Rate Calculation Problem Set', 
          dueDate: '2023-09-26',
          points: 50,
          instructions: 'Complete all problems in the worksheet calculating prevalence, incidence, and mortality rates'
        },
      ]
    },
    notes: [
      {
        id: 'n1',
        title: 'Epidemiology Core Concepts',
        date: '2023-09-05',
        content: 'Definition: Study of distribution and determinants of health-related states in specified populations\n\nCore functions:\n- Public health surveillance\n- Field investigation\n- Analytic studies\n- Evaluation\n- Linkages\n- Policy development',
        tags: ['basics', 'definition', 'important'],
        highlights: [
          { text: 'Definition', color: 'yellow' },
          { text: 'Core functions', color: 'green' }
        ],
        hasImages: false,
        imageDescriptions: []
      }
    ]
  }
};

const SubjectContent = ({ subjectId, subjects, updateSubject }) => {
  // Local copy of subject data for temporary edits before saving to parent
  const [localSubjectData, setLocalSubjectData] = useState({});
  
  // Find subject by ID
  const findSubjectById = (id) => {
    return subjects.find(subject => String(subject.id) === String(id)) || null;
  };
  
  // Get subject data from either local or props
  const subject = localSubjectData[subjectId] || findSubjectById(subjectId);
  
  // Set up states for UI and data
  const [activeTab, setActiveTab] = useState('materials');
  const [activeSection, setActiveSection] = useState('syllabus');
  const [noteDialogOpen, setNoteDialogOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  
  // State for syllabus dialogs
  const [addUnitOpen, setAddUnitOpen] = useState(false);
  const [editUnitOpen, setEditUnitOpen] = useState(false);
  const [selectedUnitIndex, setSelectedUnitIndex] = useState(null);
  
  const [addChapterOpen, setAddChapterOpen] = useState(false);
  const [editChapterOpen, setEditChapterOpen] = useState(false);
  const [selectedChapterIndex, setSelectedChapterIndex] = useState(null);
  
  const [addSubtopicOpen, setAddSubtopicOpen] = useState(false);
  const [editSubtopicOpen, setEditSubtopicOpen] = useState(false);
  const [selectedSubtopicIndex, setSelectedSubtopicIndex] = useState(null);
  
  // State for lecture dialogs
  const [addLectureOpen, setAddLectureOpen] = useState(false);
  const [editLectureOpen, setEditLectureOpen] = useState(false);
  const [selectedLectureIndex, setSelectedLectureIndex] = useState(null);
  
  // State for reading dialogs
  const [addReadingOpen, setAddReadingOpen] = useState(false);
  const [editReadingOpen, setEditReadingOpen] = useState(false);
  const [selectedReadingIndex, setSelectedReadingIndex] = useState(null);
  
  // State for assignment dialogs
  const [addAssignmentOpen, setAddAssignmentOpen] = useState(false);
  const [editAssignmentOpen, setEditAssignmentOpen] = useState(false);
  const [selectedAssignmentIndex, setSelectedAssignmentIndex] = useState(null);
  
  // State for note dialogs
  const [addNoteOpen, setAddNoteOpen] = useState(false);
  const [editNoteOpen, setEditNoteOpen] = useState(false);

  // Initialize local subject data from props on subject ID change
  useEffect(() => {
    const subject = findSubjectById(subjectId);
    if (subject) {
      setLocalSubjectData(subject);
    }
  }, [subjectId, subjects]);

  // If subject can't be found, show error message
  if (!subject) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <div className="text-center">
          <h2 className="text-xl font-medium text-gray-900 dark:text-white mb-2">Subject not found</h2>
          <p className="text-gray-500 dark:text-gray-300">The selected subject could not be found.</p>
        </div>
      </div>
    );
  }

  const handleNoteClick = (note) => {
    setSelectedNote(note);
    setNoteDialogOpen(true);
  };

  // Update the handleSyncWithParent function to sync with parent component
  const handleSyncWithParent = (updatedSubject) => {
    // Call the parent component's update function
    updateSubject(updatedSubject);
    
    // Also update local state
    const updatedData = { ...localSubjectData };
    updatedData[subjectId] = updatedSubject;
    setLocalSubjectData(updatedData);
  };

  // Syllabus management functions
  const handleAddUnit = (newUnit) => {
    const updatedSubject = { ...subject };
    if (!updatedSubject.courseMaterials.syllabus.sections) {
      updatedSubject.courseMaterials.syllabus.sections = [];
    }
    
    updatedSubject.courseMaterials.syllabus.sections.push(newUnit);
    
    // Update local state and sync with parent
    handleSyncWithParent(updatedSubject);
  };

  const handleUpdateUnit = (updatedUnit) => {
    if (selectedUnitIndex === null) return;
    
    const updatedSubject = { ...subject };
    updatedSubject.courseMaterials.syllabus.sections[selectedUnitIndex] = {
      ...updatedSubject.courseMaterials.syllabus.sections[selectedUnitIndex],
      ...updatedUnit
    };
    
    // Update local state and sync with parent
    handleSyncWithParent(updatedSubject);
  };

  const handleAddChapter = (newChapter) => {
    if (selectedUnitIndex === null) return;
    
    const updatedSubject = { ...subject };
    const currentUnit = updatedSubject.courseMaterials.syllabus.sections[selectedUnitIndex];
    
    if (!currentUnit.chapters) {
      currentUnit.chapters = [];
    }
    
    currentUnit.chapters.push(newChapter);
    
    // Update local state and sync with parent
    handleSyncWithParent(updatedSubject);
  };

  const handleUpdateChapter = (updatedChapter) => {
    if (selectedUnitIndex === null || selectedChapterIndex === null) return;
    
    const updatedSubject = { ...subject };
    const currentUnit = updatedSubject.courseMaterials.syllabus.sections[selectedUnitIndex];
    
    if (currentUnit.chapters && currentUnit.chapters[selectedChapterIndex]) {
      currentUnit.chapters[selectedChapterIndex] = {
        ...currentUnit.chapters[selectedChapterIndex],
        ...updatedChapter
      };
      
      // Update local state and sync with parent
      handleSyncWithParent(updatedSubject);
    }
  };

  const handleAddSubtopic = (newSubtopic) => {
    if (selectedUnitIndex === null || selectedChapterIndex === null) return;
    
    const updatedSubject = { ...subject };
    const currentUnit = updatedSubject.courseMaterials.syllabus.sections[selectedUnitIndex];
    
    if (currentUnit.chapters && currentUnit.chapters[selectedChapterIndex]) {
      const currentChapter = currentUnit.chapters[selectedChapterIndex];
      
      if (!currentChapter.subtopics) {
        currentChapter.subtopics = [];
      }
      
      currentChapter.subtopics.push(newSubtopic);
      
      // Update local state and sync with parent
      handleSyncWithParent(updatedSubject);
    }
  };

  const handleUpdateSubtopic = (updatedContent) => {
    if (selectedUnitIndex === null || selectedChapterIndex === null || selectedSubtopicIndex === null) return;
    
    const updatedSubject = { ...subject };
    const currentUnit = updatedSubject.courseMaterials.syllabus.sections[selectedUnitIndex];
    
    if (currentUnit.chapters && currentUnit.chapters[selectedChapterIndex]) {
      const currentChapter = currentUnit.chapters[selectedChapterIndex];
      
      if (currentChapter.subtopics && currentChapter.subtopics[selectedSubtopicIndex]) {
        currentChapter.subtopics[selectedSubtopicIndex] = updatedContent;
        
        // Update local state and sync with parent
        handleSyncWithParent(updatedSubject);
      }
    }
  };

  // For lectures
  const handleAddLecture = (lectureData) => {
    // Generate a unique ID for the new lecture
    const newLecture = {
      ...lectureData,
      id: `l${Date.now()}`,
    };
    
    // If there are uploaded files, log their URLs and ensure originalName is preserved
    if (lectureData.files && lectureData.files.length > 0) {
      newLecture.files = lectureData.files.map(file => ({
        ...file,
        originalName: file.originalName || file.original_filename || file.name,
        name: file.originalName || file.original_filename || file.name,
      }));
      
      console.log('Uploaded lecture files:', newLecture.files.map(file => ({
        name: file.name,
        originalName: file.originalName,
        url: file.url,
        publicId: file.publicId
      })));
    }
    
    // Update the subject's lectures
    const updatedSubject = {
      ...localSubjectData,
      courseMaterials: {
        ...localSubjectData.courseMaterials,
        lectures: [...localSubjectData.courseMaterials.lectures, newLecture]
      }
    };
    
    // Update local state and sync with parent
    setLocalSubjectData(updatedSubject);
    updateSubject(updatedSubject);
    
    // Close the dialog
    setAddLectureOpen(false);
  };

  const handleUpdateLecture = (updatedLecture) => {
    const updatedSubject = { ...subject };
    
    // If there are new files uploaded via Cloudinary, console log their URLs
    if (updatedLecture.files && updatedLecture.files.length > 0) {
      // Ensure all files have originalName property
      updatedLecture.files = updatedLecture.files.map(file => ({
        ...file,
        originalName: file.originalName || file.original_filename || file.name,
        name: file.originalName || file.original_filename || file.name,
        alreadyLogged: true
      }));
      
      console.log("Lecture Files Uploaded to Cloudinary:", 
        updatedLecture.files.map(file => `${file.name}: ${file.url}`)
      );
    }
    
    updatedSubject.courseMaterials.lectures = updatedSubject.courseMaterials.lectures.map(lecture => 
      lecture.id === updatedLecture.id ? updatedLecture : lecture
    );
    
    // Update local state and sync with parent
    handleSyncWithParent(updatedSubject);
  };

  // For readings
  const handleAddReading = (readingData) => {
    // Generate a unique ID for the new reading
    const newReading = {
      ...readingData,
      id: `r${Date.now()}`,
    };
    
    // If there are uploaded files, log their URLs and ensure originalName is preserved
    if (readingData.files && readingData.files.length > 0) {
      newReading.files = readingData.files.map(file => ({
        ...file,
        originalName: file.originalName || file.original_filename || file.name,
        name: file.originalName || file.original_filename || file.name,
      }));
      
      console.log('Uploaded reading files:', newReading.files.map(file => ({
        name: file.name,
        originalName: file.originalName,
        url: file.url,
        publicId: file.publicId
      })));
    }

    // Update the subject's readings
    const updatedSubject = {
      ...localSubjectData,
      courseMaterials: {
        ...localSubjectData.courseMaterials,
        readings: [...localSubjectData.courseMaterials.readings, newReading]
      }
    };
    
    setLocalSubjectData(updatedSubject);
    updateSubject(updatedSubject);
  };

  const handleUpdateReading = (updatedReading) => {
    const updatedSubject = { ...subject };
    
    // If there are files in the reading, ensure original filenames are preserved
    if (updatedReading.files && updatedReading.files.length > 0) {
      // Ensure all files have originalName property
      updatedReading.files = updatedReading.files.map(file => ({
        ...file,
        originalName: file.originalName || file.original_filename || file.name,
        name: file.originalName || file.original_filename || file.name,
        alreadyLogged: true
      }));
      
      console.log("Reading Files Uploaded to Cloudinary:", 
        updatedReading.files.map(file => `${file.name}: ${file.url}`)
      );
    }
    
    updatedSubject.courseMaterials.readings = updatedSubject.courseMaterials.readings.map(reading => 
      reading.id === updatedReading.id ? updatedReading : reading
    );
    
    // Update local state and sync with parent
    handleSyncWithParent(updatedSubject);
  };

  // For assignments
  const handleAddAssignment = (assignmentData) => {
    // Generate a unique ID for the new assignment
    const newAssignment = {
      ...assignmentData,
      id: `a${Date.now()}`,
    };
    
    // If there are uploaded files, log their URLs and ensure originalName is preserved
    if (assignmentData.files && assignmentData.files.length > 0) {
      newAssignment.files = assignmentData.files.map(file => ({
        ...file,
        originalName: file.originalName || file.original_filename || file.name,
        name: file.originalName || file.original_filename || file.name,
      }));
      
      console.log('Uploaded assignment files:', newAssignment.files.map(file => ({
        name: file.name,
        originalName: file.originalName,
        url: file.url,
        publicId: file.publicId
      })));
    }

    // Update the subject's assignments
    const updatedSubject = {
      ...localSubjectData,
      courseMaterials: {
        ...localSubjectData.courseMaterials,
        assignments: [...localSubjectData.courseMaterials.assignments, newAssignment]
      }
    };
    
    setLocalSubjectData(updatedSubject);
    updateSubject(updatedSubject);
  };

  const handleUpdateAssignment = (updatedAssignment) => {
    const updatedSubject = { ...subject };
    
    // If there are files in the assignment, ensure original filenames are preserved
    if (updatedAssignment.files && updatedAssignment.files.length > 0) {
      // Ensure all files have originalName property
      updatedAssignment.files = updatedAssignment.files.map(file => ({
        ...file,
        originalName: file.originalName || file.original_filename || file.name,
        name: file.originalName || file.original_filename || file.name,
        alreadyLogged: true
      }));
      
      console.log("Assignment Files Uploaded to Cloudinary:", 
        updatedAssignment.files.map(file => `${file.name}: ${file.url}`)
      );
    }
    
    updatedSubject.courseMaterials.assignments = updatedSubject.courseMaterials.assignments.map(assignment => 
      assignment.id === updatedAssignment.id ? updatedAssignment : assignment
    );
    
    // Update local state and sync with parent
    handleSyncWithParent(updatedSubject);
  };

  // For notes
  const handleAddNote = (newNote) => {
    const updatedSubject = { ...subject };
    // Ensure the notes array exists
    if (!updatedSubject.notes) {
      updatedSubject.notes = [];
    }
    
    // Add a unique ID to the note
    newNote.id = `n${Date.now()}`;
    updatedSubject.notes.push(newNote);
    
    // Update local state and sync with parent
    handleSyncWithParent(updatedSubject);
  };

  const handleUpdateNote = (updatedNote) => {
    const updatedSubject = { ...subject };
    updatedSubject.notes = updatedSubject.notes.map(note => 
      note.id === updatedNote.id ? updatedNote : note
    );
    
    // Update local state and sync with parent
    handleSyncWithParent(updatedSubject);
  };

  // Add delete handlers

  // For lectures
  const handleDeleteLecture = (index) => {
    const updatedSubject = { ...subject };
    updatedSubject.courseMaterials.lectures = [
      ...updatedSubject.courseMaterials.lectures.slice(0, index),
      ...updatedSubject.courseMaterials.lectures.slice(index + 1)
    ];
    
    // Update local state and sync with parent
    handleSyncWithParent(updatedSubject);
  };

  // For readings
  const handleDeleteReading = (index) => {
    const updatedSubject = { ...subject };
    updatedSubject.courseMaterials.readings = [
      ...updatedSubject.courseMaterials.readings.slice(0, index),
      ...updatedSubject.courseMaterials.readings.slice(index + 1)
    ];
    
    // Update local state and sync with parent
    handleSyncWithParent(updatedSubject);
  };

  // For assignments
  const handleDeleteAssignment = (index) => {
    const updatedSubject = { ...subject };
    updatedSubject.courseMaterials.assignments = [
      ...updatedSubject.courseMaterials.assignments.slice(0, index),
      ...updatedSubject.courseMaterials.assignments.slice(index + 1)
    ];
    
    // Update local state and sync with parent
    handleSyncWithParent(updatedSubject);
  };

  // For notes
  const handleDeleteNote = (noteId) => {
    const updatedSubject = { ...subject };
    updatedSubject.notes = updatedSubject.notes.filter(note => note.id !== noteId);
    
    // Update local state and sync with parent
    handleSyncWithParent(updatedSubject);
  };

  // Handle file view functionality
  const handleViewFile = (file) => {
    // Ensure the file has the originalName property if available
    const enhancedFile = {
      ...file,
      name: file.originalName || file.name || (file.public_id ? file.public_id.split('/').pop() : 'Unknown file'),
    };
    
    // Store file data in localStorage to be accessed by the preview page
    localStorage.setItem('previewFileData', JSON.stringify(enhancedFile));
    
    // Navigate to the document preview page
    window.open(`/dashboard/preview-document`, '_blank');
  };

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-2xl font-bold mb-6">{subject.name}</h1>
      
      {/* Tab Navigation */}
      <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
        <div className="flex space-x-4">
          <button
            className={`py-2 px-4 text-sm font-medium ${activeTab === 'materials' ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'}`}
            onClick={() => setActiveTab('materials')}
          >
            Course Materials
          </button>
          <button
            className={`py-2 px-4 text-sm font-medium ${activeTab === 'notes' ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'}`}
            onClick={() => setActiveTab('notes')}
          >
            Notes
          </button>
        </div>
      </div>

      {/* Course Materials Tab */}
      {activeTab === 'materials' && (
        <div>
          {/* Materials Navigation */}
          <div className="flex flex-wrap gap-2 mb-6">
            <Button
              variant={activeSection === 'syllabus' ? 'default' : 'outline'}
              onClick={() => setActiveSection('syllabus')}
            >
              Syllabus
            </Button>
            <Button
              variant={activeSection === 'lectures' ? 'default' : 'outline'}
              onClick={() => setActiveSection('lectures')}
            >
              Lecture Notes
            </Button>
            <Button
              variant={activeSection === 'readings' ? 'default' : 'outline'}
              onClick={() => setActiveSection('readings')}
            >
              Reading Materials
            </Button>
            <Button
              variant={activeSection === 'assignments' ? 'default' : 'outline'}
              onClick={() => setActiveSection('assignments')}
            >
              Assignments
            </Button>
          </div>

          {/* Syllabus Section */}
          {activeSection === 'syllabus' && (
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold mb-4">{subject.courseMaterials.syllabus.title}</h2>
              <p className="mb-4 text-gray-700 dark:text-gray-300">{subject.courseMaterials.syllabus.content}</p>
              
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium text-lg">Course Schedule</h3>
                <Button 
                  size="sm" 
                  variant="outline"
                  className="flex items-center gap-1"
                  onClick={() => setAddUnitOpen(true)}
                >
                  <span>Add Unit</span>
                  <span className="text-lg">+</span>
                </Button>
              </div>

              <div className="space-y-4">
                {subject.courseMaterials.syllabus.sections.map((section, sectionIndex) => (
                  <div key={sectionIndex} className="border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden">
                    {/* Unit Header */}
                    <div className="p-3 bg-gray-50 dark:bg-gray-700 flex justify-between items-center">
                      <div className="font-medium">{section.title}</div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Weeks {section.weeks}</span>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="h-7 w-7 p-0"
                          onClick={() => {
                            setSelectedUnitIndex(sectionIndex);
                            setEditUnitOpen(true);
                          }}
                        >
                          ✏️
                        </Button>
                      </div>
                    </div>
                    
                    {/* Chapters */}
                    <div className="p-3 space-y-3">
                      {section.chapters && section.chapters.map((chapter, chapterIndex) => (
                        <div key={chapterIndex} className="ml-4">
                          <details className="cursor-pointer group">
                            <summary className="font-medium text-sm flex items-center justify-between py-1">
                              <span>{chapter.title}</span>
                              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button 
                                  className="text-xs text-blue-600 dark:text-blue-400"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    setSelectedUnitIndex(sectionIndex);
                                    setSelectedChapterIndex(chapterIndex);
                                    setEditChapterOpen(true);
                                  }}
                                >
                                  Edit
                                </button>
                              </div>
                            </summary>
                            <ul className="mt-2 space-y-1 ml-6 text-sm text-gray-600 dark:text-gray-300">
                              {chapter.subtopics && chapter.subtopics.map((subtopic, subtopicIndex) => (
                                <li key={subtopicIndex} className="flex items-center justify-between group/item">
                                  <span>• {subtopic}</span>
                                  <button 
                                    className="text-xs text-blue-600 dark:text-blue-400 opacity-0 group-hover/item:opacity-100 transition-opacity"
                                    onClick={() => {
                                      setSelectedUnitIndex(sectionIndex);
                                      setSelectedChapterIndex(chapterIndex);
                                      setSelectedSubtopicIndex(subtopicIndex);
                                      setEditSubtopicOpen(true);
                                    }}
                                  >
                                    Edit
                                  </button>
                                </li>
                              ))}
                              <li className="mt-2">
                                <button 
                                  className="text-xs text-blue-600 dark:text-blue-400 flex items-center gap-1"
                                  onClick={() => {
                                    setSelectedUnitIndex(sectionIndex);
                                    setAddChapterOpen(true);
                                  }}
                                >
                                  <span>+ Add Subtopic</span>
                                </button>
                              </li>
                            </ul>
                          </details>
                        </div>
                      ))}
                      <div className="ml-4 mt-2">
                        <button 
                          className="text-sm text-blue-600 dark:text-blue-400 flex items-center gap-1"
                          onClick={() => {
                            setSelectedUnitIndex(sectionIndex);
                            setAddChapterOpen(true);
                          }}
                        >
                          <span>+ Add Chapter</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Lectures Section */}
          {activeSection === 'lectures' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Lecture Notes</h2>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="flex items-center gap-1"
                  onClick={() => setAddLectureOpen(true)}
                >
                  <span>Add Lecture</span>
                  <span className="text-lg">+</span>
                </Button>
              </div>
              
              {subject.courseMaterials.lectures.length > 0 ? (
                <div className="space-y-4">
                  {subject.courseMaterials.lectures.map((lecture, index) => (
                    <div key={lecture.id} className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-lg font-medium">{lecture.title}</h3>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-500 dark:text-gray-400">{lecture.date}</span>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="h-7 w-7 p-0"
                            onClick={() => {
                              setSelectedLectureIndex(index);
                              setEditLectureOpen(true);
                            }}
                          >
                            ✏️
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="h-7 w-7 p-0 text-red-500"
                            onClick={() => handleDeleteLecture(index)}
                          >
                            🗑️
                          </Button>
                        </div>
                      </div>
                      <p className="mb-4 text-gray-700 dark:text-gray-300">{lecture.content}</p>
                      
                      {/* Display uploaded files using FileViewer */}
                      {lecture.files && lecture.files.length > 0 && (
                        <div className="mt-4">
                          <h4 className="text-sm font-medium mb-3">Lecture Files</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {lecture.files.map((file, fileIndex) => (
                              <div 
                                key={fileIndex} 
                                className="border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden cursor-pointer"
                                onClick={() => handleViewFile(file)}
                              >
                                <FileViewer 
                                  file={file}
                                  name={file.originalName || file.name}
                                  url={file.url}
                                  publicId={file.publicId}
                                  resourceType={file.resourceType || 'auto'}
                                  width="100%"
                                  height={200}
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {lecture.attachments?.length > 0 && !lecture.files && (
                        <div className="mt-4">
                          <h4 className="text-sm font-medium mb-2">Attachments</h4>
                          <div className="flex flex-wrap gap-2">
                            {lecture.attachments.map((attachment, idx) => {
                              // Determine if this is a file attachment
                              const fileAttachment = lecture.files?.find(f => f.name === attachment);
                              if (fileAttachment) {
                                // This is a file that was uploaded
                                return (
                                  <div key={idx} className="bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded-md flex items-center gap-2 text-sm">
                                    <span>
                                      {fileAttachment.type?.includes('image') ? '🖼️' : 
                                       fileAttachment.type?.includes('pdf') ? '📄' :
                                       fileAttachment.type?.includes('presentation') ? '📊' : '📁'}
                                    </span>
                                    <span>{attachment}</span>
                                  </div>
                                );
                              } else {
                                // This is a text reference to a file
                                const extension = attachment.split('.').pop()?.toLowerCase();
                                return (
                                  <div key={idx} className="bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded-md flex items-center gap-2 text-sm">
                                    <span>
                                      {extension === 'pdf' ? '📄' :
                                       extension === 'ppt' || extension === 'pptx' ? '📊' :
                                       extension === 'doc' || extension === 'docx' ? '📝' :
                                       extension === 'jpg' || extension === 'png' || extension === 'gif' ? '🖼️' : '📁'}
                                    </span>
                                    <span>{attachment}</span>
                                  </div>
                                );
                              }
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white dark:bg-gray-800 p-8 rounded-lg border border-gray-200 dark:border-gray-700 text-center">
                  <p className="text-gray-500 dark:text-gray-400">No lectures added yet.</p>
                  <Button 
                    className="mt-4"
                    onClick={() => setAddLectureOpen(true)}
                  >
                    Add Your First Lecture
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Readings Section */}
          {activeSection === 'readings' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Reading Materials</h2>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="flex items-center gap-1"
                  onClick={() => setAddReadingOpen(true)}
                >
                  <span>Add Reading</span>
                  <span className="text-lg">+</span>
                </Button>
              </div>
              
              {subject.courseMaterials.readings.length > 0 ? (
                <div className="space-y-4">
                  {subject.courseMaterials.readings.map((reading, index) => (
                    <div key={reading.id} className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                      <div className="flex justify-between items-start">
                        <div className="flex flex-col">
                          <h3 className="text-lg font-medium">{reading.title}</h3>
                          {reading.author && <span className="text-gray-600 dark:text-gray-400">{reading.author}</span>}
                        </div>
                        <div className="flex items-center gap-2">
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="h-7 w-7 p-0"
                            onClick={() => {
                              setSelectedReadingIndex(index);
                              setEditReadingOpen(true);
                            }}
                          >
                            ✏️
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="h-7 w-7 p-0 text-red-500"
                            onClick={() => handleDeleteReading(index)}
                          >
                            🗑️
                          </Button>
                        </div>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-3">
                        <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full">
                          {reading.type}
                        </span>
                        {reading.source && (
                          <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs rounded-full">
                            {reading.source}
                          </span>
                        )}
                        {reading.chapters && (
                          <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs rounded-full">
                            {reading.chapters}
                          </span>
                        )}
                        {reading.length && (
                          <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 text-xs rounded-full">
                            {reading.length}
                          </span>
                        )}
                      </div>
                      
                      {/* Display uploaded files using FileViewer */}
                      {reading.files && reading.files.length > 0 && (
                        <div className="mt-4">
                          <h4 className="text-sm font-medium mb-3">Reading Files</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {reading.files.map((file, fileIndex) => (
                              <div 
                                key={fileIndex} 
                                className="border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden cursor-pointer"
                                onClick={() => handleViewFile(file)}
                              >
                                <FileViewer 
                                  file={file}
                                  name={file.originalName || file.name}
                                  url={file.url}
                                  publicId={file.publicId}
                                  resourceType={file.resourceType || 'auto'}
                                  width="100%"
                                  height={200}
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white dark:bg-gray-800 p-8 rounded-lg border border-gray-200 dark:border-gray-700 text-center">
                  <p className="text-gray-500 dark:text-gray-400">No reading materials added yet.</p>
                  <Button 
                    className="mt-4"
                    onClick={() => setAddReadingOpen(true)}
                  >
                    Add Your First Reading Material
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Assignments Section */}
          {activeSection === 'assignments' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Assignments</h2>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="flex items-center gap-1"
                  onClick={() => setAddAssignmentOpen(true)}
                >
                  <span>Add Assignment</span>
                  <span className="text-lg">+</span>
                </Button>
              </div>
              
              {subject.courseMaterials.assignments.length > 0 ? (
                <div className="space-y-4">
                  {subject.courseMaterials.assignments.map((assignment, index) => (
                    <div key={assignment.id} className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-lg font-medium">{assignment.title}</h3>
                        <div>
                          <div className="flex items-center gap-2">
                            <div className="text-right">
                              <div className="text-sm font-medium text-red-600 dark:text-red-400">Due: {assignment.dueDate}</div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">{assignment.points} points</div>
                            </div>
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="h-7 w-7 p-0"
                              onClick={() => {
                                setSelectedAssignmentIndex(index);
                                setEditAssignmentOpen(true);
                              }}
                            >
                              ✏️
                            </Button>
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="h-7 w-7 p-0 text-red-500"
                              onClick={() => handleDeleteAssignment(index)}
                            >
                              🗑️
                            </Button>
                          </div>
                        </div>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
                        <h4 className="text-sm font-medium mb-2">Instructions</h4>
                        <p className="text-gray-700 dark:text-gray-300">{assignment.instructions}</p>
                      </div>
                      
                      {/* Add file viewing section */}
                      {assignment.files && assignment.files.length > 0 && (
                        <div className="mt-4">
                          <h4 className="text-sm font-medium mb-3">Assignment Files</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {assignment.files.map((file, fileIndex) => (
                              <div 
                                key={fileIndex} 
                                className="border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden cursor-pointer"
                                onClick={() => handleViewFile(file)}
                              >
                                <FileViewer 
                                  file={file}
                                  name={file.originalName || file.name}
                                  url={file.url}
                                  publicId={file.publicId}
                                  resourceType={file.resourceType || 'auto'}
                                  width="100%"
                                  height={200}
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {assignment.completed && (
                        <div className="mt-4 bg-green-50 dark:bg-green-900/20 p-2 rounded-md text-sm text-green-800 dark:text-green-300 flex items-center">
                          <span className="mr-2">✓</span> Completed
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white dark:bg-gray-800 p-8 rounded-lg border border-gray-200 dark:border-gray-700 text-center">
                  <p className="text-gray-500 dark:text-gray-400">No assignments added yet.</p>
                  <Button 
                    className="mt-4"
                    onClick={() => setAddAssignmentOpen(true)}
                  >
                    Add Your First Assignment
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Notes Tab */}
      {activeTab === 'notes' && (
        <div>
          <div className="flex justify-between mb-4">
            <h2 className="text-xl font-semibold">Notes</h2>
            <Button 
              size="sm" 
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => setAddNoteOpen(true)}
            >
              + Add New Note
            </Button>
          </div>

          {/* Notes List */}
          <div className="grid gap-4 md:grid-cols-2">
            {subject.notes.length > 0 ? (
              subject.notes.map(note => (
                <div 
                  key={note.id}
                  className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handleNoteClick(note)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium">{note.title}</h3>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{note.date}</span>
                  </div>
                  
                  <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3 whitespace-pre-line">
                    {note.content}
                  </p>
                  
                  <div className="mt-3 flex items-center gap-3">
                    {note.hasImages && (
                      <span className="text-xs flex items-center text-gray-500 dark:text-gray-400">
                        📷 {note.imageDescriptions.length}
                      </span>
                    )}
                    
                    <div className="flex flex-wrap gap-1">
                      {note.tags && note.tags.map((tag, idx) => (
                        <span key={idx} className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-2 p-8 text-center text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <p>No notes yet.</p>
                <Button 
                  className="mt-4"
                  onClick={() => setAddNoteOpen(true)}
                >
                  Add Your First Note
                </Button>
              </div>
            )}
          </div>

          {/* Note Detail Dialog */}
          <Dialog open={noteDialogOpen} onOpenChange={setNoteDialogOpen}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-auto">
              {selectedNote && (
                <>
                  <DialogHeader>
                    <DialogTitle className="text-xl">{selectedNote.title}</DialogTitle>
                    <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">{selectedNote.date}</div>
                  </DialogHeader>
                  
                  <div className="my-4">
                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {selectedNote.tags && selectedNote.tags.map((tag, idx) => (
                        <span key={idx} className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full">
                          #{tag}
                        </span>
                      ))}
                    </div>
                    
                    {/* Note Content */}
                    <div className="whitespace-pre-line text-gray-800 dark:text-gray-200">
                      {selectedNote.content.split('\n').map((line, idx) => {
                        // Check if this line contains highlighted text
                        let lineContent = line;
                        
                        if (selectedNote.highlights) {
                          selectedNote.highlights.forEach(highlight => {
                            if (line.includes(highlight.text)) {
                              const parts = line.split(highlight.text);
                              lineContent = (
                                <>
                                  {parts[0]}
                                  <span className={`bg-${highlight.color}-200 dark:bg-${highlight.color}-900 px-1 rounded`}>
                                    {highlight.text}
                                  </span>
                                  {parts[1]}
                                </>
                              );
                            }
                          });
                        }
                        
                        return <div key={idx} className="mb-2">{lineContent}</div>;
                      })}
                    </div>
                    
                    {/* Images */}
                    {selectedNote.hasImages && selectedNote.imageDescriptions && selectedNote.imageDescriptions.length > 0 && (
                      <div className="mt-6">
                        <h4 className="font-medium mb-2">Images</h4>
                        <div className="grid grid-cols-2 gap-3">
                          {selectedNote.imageDescriptions.map((desc, idx) => (
                            <div key={idx} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-md flex items-center justify-center">
                              <span className="text-sm text-gray-600 dark:text-gray-300 text-center px-4">
                                {desc} (placeholder)
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex justify-between gap-2 mt-6">
                    <Button 
                      variant="outline" 
                      className="text-red-600"
                      onClick={() => {
                        handleDeleteNote(selectedNote.id);
                        setNoteDialogOpen(false);
                      }}
                    >
                      Delete Note
                    </Button>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline"
                        onClick={() => {
                          setEditNoteOpen(true);
                          setNoteDialogOpen(false);
                        }}
                      >
                        Edit Note
                      </Button>
                      <Button variant="default">Add Tag</Button>
                    </div>
                  </div>
                </>
              )}
            </DialogContent>
          </Dialog>
        </div>
      )}

      {/* Syllabus Dialogs */}
      <AddUnitDialog 
        isOpen={addUnitOpen} 
        onClose={() => setAddUnitOpen(false)} 
        onAddUnit={handleAddUnit} 
      />
      
      <EditUnitDialog 
        isOpen={editUnitOpen} 
        onClose={() => setEditUnitOpen(false)} 
        unit={selectedUnitIndex !== null ? subject.courseMaterials.syllabus.sections[selectedUnitIndex] : null}
        onUpdateUnit={handleUpdateUnit} 
      />
      
      <AddChapterDialog 
        isOpen={addChapterOpen} 
        onClose={() => setAddChapterOpen(false)} 
        onAddChapter={handleAddChapter} 
      />
      
      <EditChapterDialog 
        isOpen={editChapterOpen} 
        onClose={() => setEditChapterOpen(false)} 
        chapter={selectedUnitIndex !== null && selectedChapterIndex !== null && subject.courseMaterials.syllabus.sections[selectedUnitIndex].chapters ? 
          subject.courseMaterials.syllabus.sections[selectedUnitIndex].chapters[selectedChapterIndex] : null}
        onUpdateChapter={handleUpdateChapter} 
      />
      
      <AddSubtopicDialog 
        isOpen={addSubtopicOpen} 
        onClose={() => setAddSubtopicOpen(false)} 
        onAddSubtopic={handleAddSubtopic} 
      />
      
      <EditSubtopicDialog 
        isOpen={editSubtopicOpen} 
        onClose={() => setEditSubtopicOpen(false)} 
        subtopic={
          selectedUnitIndex !== null && 
          selectedChapterIndex !== null && 
          selectedSubtopicIndex !== null && 
          subject.courseMaterials.syllabus.sections[selectedUnitIndex].chapters && 
          subject.courseMaterials.syllabus.sections[selectedUnitIndex].chapters[selectedChapterIndex].subtopics ? 
            subject.courseMaterials.syllabus.sections[selectedUnitIndex].chapters[selectedChapterIndex].subtopics[selectedSubtopicIndex] : null
        }
        onUpdateSubtopic={handleUpdateSubtopic} 
      />
      
      {/* Lecture Dialogs */}
      <AddLectureDialog
        isOpen={addLectureOpen}
        onClose={() => setAddLectureOpen(false)}
        onAddLecture={handleAddLecture}
      />
      
      <EditLectureDialog
        isOpen={editLectureOpen}
        onClose={() => setEditLectureOpen(false)}
        lecture={selectedLectureIndex !== null && subject.courseMaterials.lectures ? 
          subject.courseMaterials.lectures[selectedLectureIndex] : null}
        onUpdateLecture={handleUpdateLecture}
      />
      
      {/* Reading Dialogs */}
      <AddReadingDialog
        isOpen={addReadingOpen}
        onClose={() => setAddReadingOpen(false)}
        onAddReading={handleAddReading}
      />
      
      <EditReadingDialog
        isOpen={editReadingOpen}
        onClose={() => setEditReadingOpen(false)}
        reading={selectedReadingIndex !== null && subject.courseMaterials.readings ? 
          subject.courseMaterials.readings[selectedReadingIndex] : null}
        onUpdateReading={handleUpdateReading}
      />
      
      {/* Assignment Dialogs */}
      <AddAssignmentDialog
        isOpen={addAssignmentOpen}
        onClose={() => setAddAssignmentOpen(false)}
        onAddAssignment={handleAddAssignment}
      />
      
      <EditAssignmentDialog
        isOpen={editAssignmentOpen}
        onClose={() => setEditAssignmentOpen(false)}
        assignment={selectedAssignmentIndex !== null && subject.courseMaterials.assignments ? 
          subject.courseMaterials.assignments[selectedAssignmentIndex] : null}
        onUpdateAssignment={handleUpdateAssignment}
      />
      
      {/* Note Dialogs */}
      <AddNoteDialog
        isOpen={addNoteOpen}
        onClose={() => setAddNoteOpen(false)}
        onAddNote={handleAddNote}
      />
      
      <EditNoteDialog
        isOpen={editNoteOpen}
        onClose={() => setEditNoteOpen(false)}
        note={selectedNote}
        onUpdateNote={handleUpdateNote}
      />
    </div>
  );
};

export default SubjectContent; 