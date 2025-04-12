import React from 'react';
import { Link } from 'react-router-dom';

function GetStarted() {
  return (
    <div className="relative py-20 my-16">
      {/* Background Image */}
      <img 
        className="absolute inset-0 w-full h-full object-cover opacity-20" 
        alt="Background" 
        src="/bgbg.webp"
      />
      
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-primary opacity-10"></div>
      
      {/* Foreground Content */}
      <div className="relative container mx-auto px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">Get Started with Homie Doo</h2>
          <p className="text-lg text-gray-700 mb-8">
            Homie Doo is here to help you with your homework, prepare for exams, and achieve academic success.
          </p>
          <Link 
            to="/login" 
            className="inline-block bg-primary hover:bg-opacity-90 text-white font-medium rounded-lg px-8 py-3 text-lg transition-colors"
          >
            Get Started
          </Link>
        </div>
      </div>
    </div>
  );
}


export default GetStarted;

