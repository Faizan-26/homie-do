import React from 'react';
import { Link } from 'react-router-dom';

function Hero() {
  return (
    <div className="py-24 md:py-32 px-6 md:px-10 container mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
      {/* LEFT SECTION */}
      <div className="flex flex-col space-y-6">
        <h2 className="text-4xl md:text-5xl font-bold text-primary">
          Learn with Homie Doo
        </h2>

        <p className="text-lg text-gray-700">
          "From the first day of class to the final exam, Homie Doo is here to help you with your homework,
          prepare for exams, and achieve academic success. Let's learn and grow together!"
        </p>
        
        <div className="pt-4">
          <Link to="/login" className="bg-primary text-white px-6 py-3 rounded-md hover:bg-opacity-90 transition-colors font-medium inline-block">
            Get Started
          </Link>
        </div>
      </div>
      
      {/* RIGHT SECTION */}
      <div className="relative">
        <img 
          src="/landing-bg.jpg" 
          alt="Hero Image" 
          className="rounded-lg shadow-lg w-full object-cover"
        />
      </div>
    </div>
  );
}


export default Hero;


