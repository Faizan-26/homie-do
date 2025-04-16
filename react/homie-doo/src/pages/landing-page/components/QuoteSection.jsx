import React from 'react';

function QuoteSection({ isDark }) {
  return (
    <div className="bg-white dark:bg-[#1a2035] py-16 transition-colors duration-300">
      <div className="container mx-auto px-4 relative">
        <div className="bg-white dark:bg-[#1e2538] rounded-lg shadow-lg py-12 px-8 md:px-16 relative max-w-4xl mx-auto transition-colors duration-300">
          {/* Left quote mark */}
          <div className="absolute -left-2 md:left-6 top-6 text-[#FF5757] dark:text-[#FF7B61] text-6xl md:text-8xl font-serif opacity-80 transition-colors duration-300">
            "
          </div>
          
          <blockquote className="text-xl md:text-2xl lg:text-3xl text-gray-800 dark:text-gray-200 text-center font-medium mx-auto max-w-3xl transition-colors duration-300">
            "The more that you read, the more things you will know. The more that you learn, the more places you'll go."
            <footer className="mt-6 text-base md:text-lg font-semibold text-gray-600 dark:text-gray-400 text-center transition-colors duration-300">
              — Dr. Seuss
            </footer>
          </blockquote>
          
          {/* Right quote mark */}
          <div className="absolute -right-2 md:right-6 bottom-6 text-[#FF5757] dark:text-[#FF7B61] text-6xl md:text-8xl font-serif opacity-80 transition-colors duration-300">
            "
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuoteSection;
