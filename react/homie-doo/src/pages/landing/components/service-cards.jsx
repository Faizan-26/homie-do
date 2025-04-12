import React from 'react';

function ServiceCards() {
  return (
    <div className="py-16 px-6 container mx-auto">
      <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Our Services</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="bg-white rounded-xl shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-2">
          <img src="/ai.svg" className="w-full h-48 object-cover" alt="AI Tutor" />
          <div className="p-6">
            <h5 className="text-xl font-semibold text-center mb-3">AI Tutor</h5>
            <p className="text-gray-600 text-center">
              Homie Doo is here to help you with your homework, prepare for exams, and achieve academic success.
            </p>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-2">
          <img src="/study-tips.svg" className="w-full h-48 object-cover" alt="Study Tips" />
          <div className="p-6">
            <h5 className="text-xl font-semibold text-center mb-3">Study Tips</h5>
            <p className="text-gray-600 text-center">
              Get the best study tips and tricks to enhance your learning experience and excel in your academics.
            </p>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-2">
          <img src="/exams.svg" className="w-full h-48 object-cover" alt="Exam Preparation" />
          <div className="p-6">
            <h5 className="text-xl font-semibold text-center mb-3">Exam Preparation</h5>
            <p className="text-gray-600 text-center">
              Prepare for your exams with our comprehensive guides and resources to ensure you achieve the best results.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ServiceCards;

