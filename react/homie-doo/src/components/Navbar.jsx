import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import ThemeToggle from './ThemeToggle';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

function Navbar({ scrollToAbout }) {
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(false);
  
  useEffect(() => {
    // Check if user has a theme preference in localStorage
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }
  };
  
  const handleGetStarted = () => {
    navigate('/login');
  };

  return (
    <nav className="bg-white dark:bg-[#1e2538] border-b dark:border-gray-700 py-4 fixed top-0 left-0 right-0 z-100 transition-colors duration-300">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <a href="/" className="text-2xl font-bold text-primary dark:text-[#FF7B61] transition-colors duration-300">Homie Doo</a>
        
        {/* Mobile menu with Sheet component */}
        <div className="lg:hidden flex items-center gap-2">
          <ThemeToggle isDark={isDark} onToggle={toggleTheme} />
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" className="p-2 transition-colors duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-menu">
                  <line x1="4" x2="20" y1="12" y2="12"></line>
                  <line x1="4" x2="20" y1="6" y2="6"></line>
                  <line x1="4" x2="20" y1="18" y2="18"></line>
                </svg>
              </Button>
            </SheetTrigger>
            <SheetContent className="bg-white dark:bg-[#1e2538] transition-colors duration-300">
              <SheetHeader>
                <SheetTitle className="text-primary dark:text-[#FF7B61] transition-colors duration-300">Menu</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col mt-6 space-y-4">
                <a href="/" className="text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-[#FF7B61] transition-colors duration-300">Home</a>
                <button
                  onClick={scrollToAbout}
                  className="text-left text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-[#FF7B61] transition-colors duration-300 bg-transparent border-none cursor-pointer"
                >
                  About
                </button>
                <a href="/todos" className="text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-[#FF7B61] transition-colors duration-300">Todos</a>
                <Button
                  onClick={handleGetStarted}
                  className="bg-primary text-white hover:bg-primary/90 transition-all duration-300"
                >
                  Get Started
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
        
        {/* Desktop menu */}
        <div className="hidden lg:flex items-center space-x-8">
          <a href="/" className="text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-[#FF7B61] transition-colors duration-300">Home</a>
          <button 
            onClick={scrollToAbout}
            className="text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-[#FF7B61] transition-colors duration-300 bg-transparent border-none cursor-pointer"
          >
            About
          </button>
          <a href="/todos" className="text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-[#FF7B61] transition-colors duration-300">Todos</a>
          <ThemeToggle isDark={isDark} onToggle={toggleTheme} />
          <Button 
            onClick={handleGetStarted}
            className="bg-primary text-white hover:bg-primary/90 transition-all duration-300"
          >
            Get Started
          </Button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
