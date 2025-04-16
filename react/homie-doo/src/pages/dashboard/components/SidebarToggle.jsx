import React from 'react';
import { ChevronRightIcon, ChevronLeftIcon } from '@radix-ui/react-icons';

const SidebarToggle = ({ onClick, isCollapsed, className, isMobile }) => (
  <button 
    onClick={onClick}
    className={`
      flex items-center justify-center
      ${isMobile ? 'h-12 w-6 rounded-r-full' : 'w-8 h-8 rounded-full'}
      bg-blue-600 text-white shadow-lg hover:bg-blue-700 transition-colors
      ${className || ''}
    `}
    style={isMobile ? {
      borderRadius: '0 50% 50% 0',
    } : { 
      borderRadius: '50% 50% 50% 0',
      transform: 'rotate(-45deg)'
    }}
  >
    {isMobile ? (
      isCollapsed ? 
        <ChevronRightIcon className="h-5 w-5" /> : 
        <ChevronLeftIcon className="h-5 w-5" />
    ) : (
      isCollapsed ? 
        <ChevronRightIcon className="h-5 w-5 transform rotate(45deg)" /> : 
        <ChevronLeftIcon className="h-5 w-5 transform rotate(45deg)" />
    )}
  </button>
);

export default SidebarToggle; 