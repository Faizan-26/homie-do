import React, { useState, useEffect, useCallback } from 'react';
import { Star, FileText, Calendar, Book, Video, Trash2, Edit2, Download } from 'lucide-react';
import useSubjectStore from '../../../store/subjectStore';
import useSubjectContentStore from '../../../store/subjectContentStore';
import { useNavigate } from 'react-router-dom';

const ContentCard = ({ type, item, subject, onNavigate }) => {
  const typeBadge = {
    lecture: { label: 'Lecture', icon: <Calendar className="w-4 h-4" />, color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' },
    reading: { label: 'Reading', icon: <Book className="w-4 h-4" />, color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' },
    assignment: { label: 'Assignment', icon: <FileText className="w-4 h-4" />, color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300' },
    note: { label: 'Note', icon: <FileText className="w-4 h-4" />, color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300' },
  };

  const badge = typeBadge[type] || typeBadge.note;

  return (
    <div 
      className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 
                transition-all duration-200 hover:shadow-md hover:border-[#F4815B]/20 cursor-pointer"
      onClick={() => onNavigate(subject.id, type)}
    >
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2">
            <span className={`px-2 py-1 text-xs rounded-full flex items-center gap-1 ${badge.color}`}>
              {badge.icon}
              {badge.label}
            </span>
            <Star className="w-4 h-4 text-yellow-500" fill="currentColor" />
          </div>
          <h3 className="font-medium text-lg mt-2 text-gray-900 dark:text-gray-100">{item.title}</h3>
          <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {subject.name}
            {item.date && (
              <>
                <span className="mx-1">•</span>
                {new Date(item.date).toLocaleDateString()}
              </>
            )}
            {type === 'reading' && item.author && (
              <>
                <span className="mx-1">•</span>
                By {item.author}
              </>
            )}
          </div>
        </div>
      </div>
      
      {(type === 'lecture' || type === 'note') && item.content && (
        <p className="mt-3 text-gray-600 dark:text-gray-300 line-clamp-2">{item.content}</p>
      )}
      
      {type === 'assignment' && item.instructions && (
        <p className="mt-3 text-gray-600 dark:text-gray-300 line-clamp-2">{item.instructions}</p>
      )}
      
      {item.tags && item.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {item.tags.map((tag, index) => (
            <span 
              key={index} 
              className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

const FavoritesView = () => {
  const [favoriteItems, setFavoriteItems] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Fix: Use a more stable selector pattern
  const subjects = useSubjectStore(state => state.subjects);
  const favorites = useSubjectStore(state => state.favorites);
  
  const navigate = useNavigate();
  
  // Fix: Use selector functions to prevent unnecessary re-renders
  const setWorkingSubject = useSubjectContentStore(state => state.setWorkingSubject);
  const setSelectedTab = useSubjectContentStore(state => state.setSelectedTab);

  // Use useCallback to memoize the loadFavorites function
  const loadFavorites = useCallback(() => {
    setLoading(true);
    
    // Group all favorites by type
    const items = [];

    favorites.forEach(favoriteId => {
      const [type, subjectId, itemId] = favoriteId.split('_');
      const subject = subjects.find(s => s.id === subjectId);
      
      if (!subject) return;
      
      let item;
      
      // Find the item
      switch (type) {
        case 'lecture':
          item = subject.courseMaterials?.lectures?.find(l => l.id === itemId);
          break;
        case 'reading':
          item = subject.courseMaterials?.readings?.find(r => r.id === itemId);
          break;
        case 'assignment':
          item = subject.courseMaterials?.assignments?.find(a => a.id === itemId);
          break;
        case 'note':
          item = subject.notes?.find(n => n.id === itemId);
          break;
        default:
          return;
      }
      
      if (item) {
        items.push({
          id: favoriteId,
          type,
          subjectId,
          itemId,
          subject,
          item
        });
      }
    });
    
    setFavoriteItems(items);
    setLoading(false);
  }, [subjects, favorites]);

  // Call loadFavorites once when component mounts or when dependencies change
  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  const handleNavigateToItem = useCallback((subjectId, type) => {
    const subject = subjects.find(s => s.id === subjectId);
    if (subject) {
      // Update the working subject in the store
      setWorkingSubject(subject);
      
      // Set the selected tab based on the content type
      setSelectedTab(type === 'note' ? 'notes' : `${type}s`);
      
      // Since we're using the sidebar selection approach rather than direct URL navigation,
      // we should just update the working subject and tab, the main dashboard will render the right view
      // No direct navigation needed - the DashboardContent component handles displaying the subject
    }
  }, [subjects, setWorkingSubject, setSelectedTab]);
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#F4815B]"></div>
      </div>
    );
  }
  
  if (favoriteItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <Star className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
        <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-2">No Favorites Yet</h2>
        <p className="text-gray-500 dark:text-gray-400 max-w-md">
          Mark lectures, readings, assignments, and notes as favorites to access them quickly here.
        </p>
      </div>
    );
  }
  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-200">
        Favorites
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {favoriteItems.map(({ id, type, subject, item }) => (
          <ContentCard
            key={id}
            type={type}
            item={item}
            subject={subject}
            onNavigate={handleNavigateToItem}
          />
        ))}
      </div>
    </div>
  );
};

export default FavoritesView; 