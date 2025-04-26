import React from 'react';
import { ChevronRightIcon, ChevronLeftIcon } from '@radix-ui/react-icons';

const SidebarToggle = ({ onClick, isCollapsed, className, isMobile }) => (
  <button 
    onClick={onClick}
    className={`
      flex items-center justify-center
      ${isMobile ? 'h-12 w-6 rounded-r-full mt-12' : 'w-8 h-8 rounded-full'}
      bg-[#F4815B] text-white shadow-lg hover:bg-[#FF7B61] transition-colors
      ${className || ''}
    `}
    style={isMobile ? {
      borderRadius: '0 50% 50% 0',
    } : { 
      borderRadius: '50%',
    }}
  >
     {isCollapsed ? 
        <ChevronRightIcon className="h-5 w-5 transform rotate(50deg)" /> : 
        <ChevronLeftIcon className="h-5 w-5 transform rotate(245deg)" />
          }
   
  </button>
);

export default SidebarToggle; 