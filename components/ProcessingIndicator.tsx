import React, { useState, useEffect } from 'react';
import { SpinnerIcon } from './icons';

const generationSteps = [
  "Initializing AI modules...",
  "Analyzing product visuals...",
  "Transcribing audio narration...",
  "Generating compelling product description...",
  "Analyzing competitive market pricing...",
  "Building your storefront...",
];

const extractionSteps = [
  "Preparing video for analysis...",
  "Seeking to key moments in the video...",
  "Extracting high-quality frames...",
  "Finalizing image selection...",
]

interface ProcessingIndicatorProps {
  isExtracting: boolean;
}

export const ProcessingIndicator: React.FC<ProcessingIndicatorProps> = ({ isExtracting }) => {
  const [currentStep, setCurrentStep] = useState(0);
  
  const steps = isExtracting ? extractionSteps : generationSteps;
  const title = isExtracting ? "Extracting Key Frames..." : "Generating Your Storefront";

  useEffect(() => {
    // Reset step count when the mode changes
    setCurrentStep(0);
    const interval = setInterval(() => {
      setCurrentStep((prevStep) => (prevStep + 1) % steps.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [isExtracting, steps.length]);

  return (
    <div className="text-center p-8">
      <div className="w-16 h-16 mx-auto text-indigo-600">
        <SpinnerIcon />
      </div>
      <h2 className="text-2xl font-bold mt-6 text-slate-800">{title}</h2>
      <p className="text-slate-500 mt-2 h-6 transition-opacity duration-500">
        {steps[currentStep]}
      </p>
    </div>
  );
};