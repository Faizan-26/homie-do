import React from 'react';
// import { DotLottie } from '@lottiefiles/dotlottie-web';
// import { Player } from '@lottiefiles/react-lottie-player';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

function StatsSection({ isDark }) {

  return (
    <div className="py-16 bg-white dark:bg-[#1a2035] transition-colors duration-300">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-center">
          {/* Lottie Animation */}
          <div className="w-full max-w-md h-[300px] mb-6 md:mb-0 md:mr-8 rounded-xl overflow-hidden transition-all duration-300">
            {isDark ? (
               <DotLottieReact
               src="https://lottie.host/5756ccc5-8579-4e32-bbcc-6fb7dc6113e3/TRVkJq11lx.lottie"
               loop
               autoplay
             />
            ) : (
              <DotLottieReact
              src="https://lottie.host/4f5f8aaa-7fdc-4ef1-b7b8-932caf831721/eRgNKaz2xu.lottie"
              loop
              autoplay
              />
            )}
          </div>
          
          <h3 className="text-2xl md:text-3xl font-bold text-primary dark:text-[#FF7B61] max-w-2xl text-center transition-colors duration-300">
            90% of students who use Homie Doo have improved their grades.
          </h3>
        </div>
      </div>
    </div>
  );
}

export default StatsSection;
