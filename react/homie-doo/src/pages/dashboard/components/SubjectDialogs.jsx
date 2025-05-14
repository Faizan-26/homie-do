import React from 'react';

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

const SubjectDialogs = ({
  dialogs,
  selected,
  toggleDialog,
  onAddLecture,
  onUpdateLecture,
  onAddReading,
  onUpdateReading,
  onAddAssignment,
  onUpdateAssignment,
  onAddNote,
  onUpdateNote,
}) => {
  return (
    <>
      {/* Content Dialogs */}
      <AddLectureDialog 
        isOpen={dialogs.addLecture}
        onClose={() => toggleDialog('addLecture', false)}
        onAddLecture={onAddLecture}
      />
      <EditLectureDialog 
        isOpen={dialogs.editLecture}
        onClose={() => toggleDialog('editLecture', false)}
        lecture={selected.lecture}
        onUpdateLecture={onUpdateLecture}
      />
      <AddReadingDialog 
        isOpen={dialogs.addReading}
        onClose={() => toggleDialog('addReading', false)}
        onAddReading={onAddReading}
      />
      <EditReadingDialog 
        isOpen={dialogs.editReading}
        onClose={() => toggleDialog('editReading', false)}
        reading={selected.reading}
        onUpdateReading={onUpdateReading}
      />
      <AddAssignmentDialog 
        isOpen={dialogs.addAssignment}
        onClose={() => toggleDialog('addAssignment', false)}
        onAddAssignment={onAddAssignment}
      />
      <EditAssignmentDialog 
        isOpen={dialogs.editAssignment}
        onClose={() => toggleDialog('editAssignment', false)}
        assignment={selected.assignment}
        onUpdateAssignment={onUpdateAssignment}
      />
      <AddNoteDialog 
        isOpen={dialogs.addNote}
        onClose={() => toggleDialog('addNote', false)}
        onAddNote={onAddNote}
      />
      <EditNoteDialog 
        isOpen={dialogs.editNote}
        onClose={() => toggleDialog('editNote', false)}
        note={selected.note}
        onUpdateNote={onUpdateNote}
      />
    </>
  );
};

export default SubjectDialogs; 