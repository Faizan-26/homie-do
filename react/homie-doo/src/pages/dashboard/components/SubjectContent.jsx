import React, { useEffect } from 'react';
import { Toaster } from 'sonner';
import { Button } from '../../../components/ui/button';
import { FileText, Calendar, Clock, Edit2, Trash2, Loader2 } from 'lucide-react';
import useSubjectContentStore from '../../../store/subjectContentStore';
import useSubjectStore from '../../../store/subjectStore';
import { LecturesTab, ReadingsTab, AssignmentsTab, NotesTab } from './SubjectContentTabs';
import SubjectDialogs from './SubjectDialogs';

const SubjectContent = () => {
  const {
    selectedTab,
    workingSubject,
    dialogs,
    selected,
    setSelectedTab,
    setWorkingSubject,
    toggleDialog,
    setSelected,
    addLecture,
    updateLecture,
    deleteLecture,
    addReading,
    updateReading,
    deleteReading,
    addAssignment,
    updateAssignment,
    deleteAssignment,
    addNote,
    updateNote,
    deleteNote,
    isFavorited,
    handleToggleFavorite,
    loading
  } = useSubjectContentStore();

  const { activeSubject, setActiveSubject } = useSubjectStore();

  // Initialize working subject
  useEffect(() => {
    if (activeSubject) {
      setWorkingSubject(activeSubject);
      setSelectedTab('lectures'); // Reset tab to lectures when subject changes
    }
  }, [activeSubject, setWorkingSubject, setSelectedTab]);

  // Sync with parent component when working subject changes
  useEffect(() => {
    if (workingSubject) {
      setActiveSubject(workingSubject);
    }
  }, [workingSubject, setActiveSubject]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-[#F4815B]" />
          <p className="text-gray-500 dark:text-gray-400">Loading content...</p>
        </div>
      </div>
    );
  }

  if (!workingSubject && !activeSubject) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300">
            No subject selected
          </h2>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            Please select a subject from the sidebar
          </p>
        </div>
      </div>
    );
  }

  const TabButton = ({ tab, icon: Icon, label, loading }) => (
    <button
      onClick={() => setSelectedTab(tab)}
      disabled={loading}
      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
        selectedTab === tab
          ? 'bg-[#F4815B] text-white shadow-sm'
          : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
      } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {loading ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : (
        <Icon className="w-5 h-5" />
      )}
      <span>{label}</span>
    </button>
  );

  const renderContent = () => {
    switch (selectedTab) {
      case 'lectures':
        return (
          <LecturesTab
            lectures={workingSubject?.courseMaterials?.lectures}
            onAdd={() => toggleDialog('addLecture', true)}
            onEdit={(lecture) => {
              setSelected('lecture', lecture);
              toggleDialog('editLecture', true);
            }}
            onDelete={deleteLecture}
            onToggleFavorite={(id) => handleToggleFavorite('lecture', id)}
            isFavorited={(id) => isFavorited('lecture', id)}
          />
        );
      case 'readings':
        return (
          <ReadingsTab
            readings={workingSubject?.courseMaterials?.readings}
            onAdd={() => toggleDialog('addReading', true)}
            onEdit={(reading) => {
              setSelected('reading', reading);
              toggleDialog('editReading', true);
            }}
            onDelete={deleteReading}
            onToggleFavorite={(id) => handleToggleFavorite('reading', id)}
            isFavorited={(id) => isFavorited('reading', id)}
          />
        );
      case 'assignments':
        return (
          <AssignmentsTab
            assignments={workingSubject?.courseMaterials?.assignments}
            onAdd={() => toggleDialog('addAssignment', true)}
            onEdit={(assignment) => {
              setSelected('assignment', assignment);
              toggleDialog('editAssignment', true);
            }}
            onDelete={deleteAssignment}
            onToggleFavorite={(id) => handleToggleFavorite('assignment', id)}
            isFavorited={(id) => isFavorited('assignment', id)}
          />
        );
      case 'notes':
        return (
          <NotesTab
            notes={workingSubject?.notes}
            onAdd={() => toggleDialog('addNote', true)}
            onEdit={(note) => {
              setSelected('note', note);
              toggleDialog('editNote', true);
            }}
            onDelete={deleteNote}
            onToggleFavorite={(id) => handleToggleFavorite('note', id)}
            isFavorited={(id) => isFavorited('note', id)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900">
      {/* Tab Navigation */}
      <div className="flex space-x-2 p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10 shadow-sm">
        <TabButton tab="lectures" icon={Calendar} label="Lectures" loading={loading && selectedTab === 'lectures'} />
        <TabButton tab="readings" icon={FileText} label="Readings" loading={loading && selectedTab === 'readings'} />
        <TabButton tab="assignments" icon={Clock} label="Assignments" loading={loading && selectedTab === 'assignments'} />
        <TabButton tab="notes" icon={FileText} label="Notes" loading={loading && selectedTab === 'notes'} />
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-6">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="w-8 h-8 animate-spin text-[#F4815B]" />
              <p className="text-gray-500 dark:text-gray-400">Loading content...</p>
            </div>
          </div>
        ) : (
          renderContent()
        )}
      </div>

      {/* Dialogs */}
      <SubjectDialogs
        dialogs={dialogs}
        selected={selected}
        toggleDialog={toggleDialog}
        onAddLecture={addLecture}
        onUpdateLecture={updateLecture}
        onAddReading={addReading}
        onUpdateReading={updateReading}
        onAddAssignment={addAssignment}
        onUpdateAssignment={updateAssignment}
        onAddNote={addNote}
        onUpdateNote={updateNote}
      />

      <Toaster position="top-right" />
    </div>
  );
};

export default SubjectContent; 