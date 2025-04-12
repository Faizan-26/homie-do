import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-white shadow-nav z-50 py-2">
      <div className="container mx-auto px-6 md:px-10">
        <div className="flex justify-between items-center">
          <Link className="text-primary font-semibold text-2xl" to="/">Homie Doo</Link>
          
          {/* Mobile menu button */}
          <button 
            className="md:hidden focus:outline-none"
            onClick={toggleMenu}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link className="text-secondary hover:text-primary transition-colors font-medium" to="/">Home</Link>
            <Link className="text-secondary hover:text-primary transition-colors font-medium" to="/about">About</Link>
            <Link className="bg-primary text-white px-4 py-2 rounded-md hover:bg-opacity-90 transition-colors font-medium" to="/login">Get Started</Link>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'} mt-4`}>
          <div className="flex flex-col space-y-4 pb-4">
            <Link className="text-secondary hover:text-primary transition-colors font-medium" to="/">Home</Link>
            <Link className="text-secondary hover:text-primary transition-colors font-medium" to="/about">About</Link>
            <Link className="bg-primary text-white px-4 py-2 rounded-md hover:bg-opacity-90 transition-colors font-medium w-fit" to="/login">Get Started</Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
