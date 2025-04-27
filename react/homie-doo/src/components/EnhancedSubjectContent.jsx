import React from 'react';
import { withUserSubjectIntegration } from '../utils/subject-integration';
import SubjectContent from '../pages/dashboard/components/SubjectContent';

/**
 * Enhanced version of SubjectContent that uses the UserSubject class structure.
 * This component wraps the existing SubjectContent component and handles the conversion
 * between class instances and plain objects automatically.
 * 
 * This allows for a gradual migration to the new class-based approach without
 * having to rewrite the entire UI component at once.
 * 
 * Usage:
 * 
 * ```jsx
 * // Using with a UserSubject instance
 * const subject = new UserSubject(...); // UserSubject instance
 * 
 * return (
 *   <EnhancedSubjectContent
 *     subject={subject}
 *     updateSubject={setSubject}
 *     useInstancesForUpdates={true} // Tell the component to pass UserSubject instances to updateSubject
 *     favorites={favorites}
 *     toggleFavorite={toggleFavorite}
 *   />
 * );
 * 
 * // Or with plain JSON object (automatically converted to UserSubject)
 * const [subjectData, setSubjectData] = useState({...}); // Plain object
 * 
 * return (
 *   <EnhancedSubjectContent
 *     subject={subjectData}
 *     updateSubject={setSubjectData}
 *     favorites={favorites}
 *     toggleFavorite={toggleFavorite}
 *   />
 * );
 * ```
 */
const EnhancedSubjectContent = withUserSubjectIntegration(SubjectContent);

export default EnhancedSubjectContent; 