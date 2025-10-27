import React, { useState, useEffect, useMemo } from 'react';
import { SpinnerIcon } from './icons';

const generationStepsDetails = [
  "Initializing AI modules...",
  "Analyzing product visuals...",
  "Identifying all products in the frame...",
  "Generating compelling product descriptions...",
  "Analyzing competitive market pricing...",
];

const generationStepsImages = [
  "Preparing image generation models...",
  "Creating unique image for Product 1...",
  "Creating unique image for Product 2...",
  "Finalizing product images...",
  "Building your storefront page...",
];

const extractionSteps = [
  "Preparing video for analysis...",
  "Seeking to key moments in the video...",
  "Extracting high-quality frames...",
  "Finalizing image selection...",
];

interface ProcessingIndicatorProps {
  isExtracting: boolean;
  isGeneratingImages?: boolean;
}

export const ProcessingIndicator: React.FC<ProcessingIndicatorProps> = ({ isExtracting, isGeneratingImages = false }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  
  const steps = useMemo(() => {
    if (isExtracting) return extractionSteps;
    if (isGeneratingImages) return generationStepsImages;
    return generationStepsDetails;
  }, [isExtracting, isGeneratingImages]);

  const title = isExtracting ? "Extracting Key Frames..." : "Generating Your Storefront";

  useEffect(() => {
    // Reset step count when the mode changes
    setCurrentStepIndex(0);
    const interval = setInterval(() => {
      setCurrentStepIndex((prevStep) => (prevStep + 1) % steps.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [steps]);

  return (
    <div className="text-center p-8">
      <div className="w-16 h-16 mx-auto text-plasma-accent">
        <SpinnerIcon />
      </div>
      <h2 className="text-2xl font-bold mt-6 text-plasma-text">{title}</h2>
      <p className="text-plasma-text-subtle mt-2 h-6 transition-opacity duration-500">
        {steps[currentStepIndex]}
      </p>
    </div>
  );
};