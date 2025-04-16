import React from 'react';

function ServiceCards({ isDark }) {
    const services = [
        {
            id: 1,
            title: "AI Tutor",
            description: "Homie Doo is here to help you with your homework, prepare for exams, and achieve academic success.",
            image: "/ai.svg"
        },
        {
            id: 2,
            title: "Study Tips",
            description: "Get the best study tips and tricks to enhance your learning experience and excel in your academics.",
            image: "/study-tips.svg"
        },
        {
            id: 3,
            title: "Exam Preparation",
            description: "Prepare for your exams with our comprehensive guides and resources to ensure you achieve the best results.",
            image: "/exams.svg"
        }
    ];

    return (
        <div className="py-24 bg-white dark:bg-[#1a2035] transition-colors duration-300">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {services.map((service) => (
                        <div key={service.id} className="w-full">
                            <div className="bg-white dark:bg-[#1e2538] rounded-xl overflow-hidden shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-2 transform h-96 flex flex-col dark:shadow-gray-900/30">
                                <div className="h-1/2 overflow-hidden bg-gray-50 dark:bg-[#252b3b] transition-colors duration-300">
                                    <img 
                                        src={service.image} 
                                        alt={service.title} 
                                        className="w-full h-full object-fit dark:filter dark:brightness-90 transition-all duration-300"
                                    />
                                </div>
                                <div className="p-6 flex flex-col justify-center flex-grow transition-colors duration-300">
                                    <h3 className="text-xl font-bold text-center mb-3 text-gray-800 dark:text-gray-100 transition-colors duration-300">{service.title}</h3>
                                    <p className="text-gray-700 dark:text-gray-300 text-center text-base transition-colors duration-300">{service.description}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default ServiceCards;
