import React from 'react';
import { Player } from '@lottiefiles/react-lottie-player';

export default function Stats() {
  return (
    <div className="py-16 px-6 bg-gray-50 text-center">
      <div className="container mx-auto max-w-3xl">
        <Player
          src="https://lottie.host/6d69bbf1-8330-4a3c-b691-3d130300e31c/4fLlwwQaDJ.json"
          background="transparent"
          speed={1}
          className="h-[300px] mx-auto"
          loop
          autoplay
        />
        <h3 className="text-2xl md:text-3xl font-bold text-primary mt-4">
          90% of students who use Homie Doo have improved their grades.
        </h3>
      </div>
    </div>
  );
}
