import React from 'react';
import { Button } from "@/components/ui/button";

function GetStartedSection({ isDark }) {
  return (
    <div className="relative py-20 text-center text-black dark:text-white transition-colors duration-300">      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/bgbg.webp" 
          alt="Background" 
          className="w-full h-full object-cover opacity-100 dark:opacity-70 transition-opacity duration-300"
        />
        <div className="absolute inset-0  dark:bg-[#1a2035]/80 transition-colors duration-300"></div> {/* Overlay for better text readability */}
      </div>
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4">
        <div className="max-w-xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 dark:text-gray-100 transition-colors duration-300">Get Started with Homie Doo</h2>
          <p className="text-xl mb-8 dark:text-gray-200 transition-colors duration-300">
            Homie Doo is here to help you with your homework, prepare for exams, and achieve academic success.
          </p>
          <Button size="lg" className="bg-primary hover:bg-primary/80 transition-all duration-300 hover:-translate-y-0.5 text-white">
            Get Started
          </Button>
        </div>
      </div>
    </div>
  );
}

export default GetStartedSection;
