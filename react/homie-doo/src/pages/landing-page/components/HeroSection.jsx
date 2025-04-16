import React from 'react';

function HeroSection({ isDark }) {
  return (
    <div className="relative overflow-hidden pt-10 bg-[#f9f0e5]/80 dark:bg-[#1a2035] transition-colors duration-300">
      {/* Mobile view - Full background image with overlay */}
      <div className="md:hidden flex flex-col min-h-[60vh] relative">
        <div className="absolute inset-0 bg-[#f9f0e5]/80 dark:bg-[#1a2035]/90 z-10 transition-colors duration-300"></div>
        <img 
          src="/landing-bg.jpg" 
          alt="Background" 
          className="absolute inset-0 w-full h-full object-cover opacity-100 dark:opacity-60 transition-opacity duration-300"
        />
        <div className="container mx-auto px-6 py-8 relative z-40 flex flex-col items-center justify-center flex-grow">
          <h2 className="text-3xl sm:text-4xl text-left font-bold text-[#FF5757] dark:text-[#FF7B61] mb-6 transition-colors duration-300">
            Learn with Homie Doo
          </h2>
          <p className="text-base sm:text-lg text-gray-800 z-40 dark:text-gray-200 max-w-lg mx-auto transition-colors duration-300">
            "From the first day of class to the final exam, Homie Doo is here to help you with your homework,
            prepare for exams, and achieve academic success. Let's learn and grow together!"
          </p>
        </div>
      </div>        {/* Desktop view with fixed layout */}
      <div className="hidden md:block relative min-h-[70vh] overflow-hidden">
        {/* Additional dark mode overlay for better transition between sections */}
        <div className="hidden dark:block absolute inset-0 bg-gradient-to-r from-[#1a2035] via-[#1a2035]/90 to-transparent z-[2] pointer-events-none transition-colors duration-300"></div>
        
        {/* Container for content */}
        <div className="container mx-auto px-4 relative z-50 h-full text-left pl-16">
          {/* LEFT SECTION - Content */}
          <div className="max-w-xl mt-30">
           <div style={{ fontFamily: "Segoe UI" }} >
           <h2 className="text-5xl lg:text-6xl font-extrabold text-[#FF6347] dark:text-[#FF7B61] mb-8 transition-colors duration-300">
              Learn with Homie Doo
            </h2>
           </div>
            <p className="text-lg lg:text-xl text-gray-700 dark:text-gray-200 leading-relaxed transition-colors duration-300">
              "From the first day of class to the final exam, Homie Doo is here to help you with your homework,
              prepare for exams, and achieve academic success. Let's learn and grow together!"
            </p>
          </div>
        </div>
        
        {/* RIGHT SECTION */}
        <div className="absolute top-0 bottom-0 right-0 w-1/2 md:w-[55%] lg:w-[50%] z-[1]">
          <div className="absolute inset-[0] bg-gradient-to-r from-[#f9f0e5] via-[#f9f0e5]/70 to-transparent dark:from-[#1a2035] dark:via-[#1a2035]/80 dark:to-[#1a2035]/50 z-10 transition-colors duration-300"></div>
          <div className="absolute inset-0 bg-transparent dark:bg-black/50 z-[5] transition-opacity duration-300"></div>
          <img 
            src="/landing-bg.jpg" 
            alt="Hero Image" 
            className="h-full w-full object-cover opacity-100 dark:opacity-50 transition-opacity duration-300"
            style={{ objectPosition: "center right" }}
            />
        </div>
      </div>
    </div>
  );
}

export default HeroSection;
