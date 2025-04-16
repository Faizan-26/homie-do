import React from 'react';
import { FaSun, FaMoon } from 'react-icons/fa';

const ThemeToggle = ({ isDark, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      className="p-2.5 rounded-lg bg-white/90 dark:bg-[#1e2538] text-[#FF6347] dark:text-[#FF7B61] 
        hover:bg-gray-100 dark:hover:bg-[#252b3b] transition-all duration-300 shadow-md"
      aria-label="Toggle theme"
    >
      {isDark ? <FaSun className="w-5 h-5 transition-transform duration-300" /> : <FaMoon className="w-5 h-5 transition-transform duration-300" />}
    </button>
  );
};

export default ThemeToggle; 