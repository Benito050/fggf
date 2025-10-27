import React from 'react';
import { SparklesIcon } from './icons';

interface FrameSelectorProps {
  frames: string[];
  onSelect: (frameDataUrl: string) => void;
  onCancel: () => void;
}

export const FrameSelector: React.FC<FrameSelectorProps> = ({ frames, onSelect, onCancel }) => {
  return (
    <div className="max-w-4xl mx-auto text-center animate-fade-in">
      <h2 className="text-3xl font-bold text-slate-800">Select the Best Product Image</h2>
      <p className="text-slate-500 mt-2 mb-8">
        We've extracted a few key frames from your video. Choose the one that best showcases your product.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        {frames.map((frame, index) => (
          <button
            key={index}
            onClick={() => onSelect(frame)}
            className="block rounded-lg overflow-hidden border-2 border-transparent hover:border-indigo-500 hover:shadow-2xl focus:border-indigo-600 focus:ring-2 focus:ring-indigo-400 focus:outline-none transition-all duration-300 transform hover:-translate-y-1 group"
          >
            <img 
              src={frame} 
              alt={`Frame ${index + 1}`} 
              className="w-full h-full object-cover aspect-video"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-white font-bold text-lg">Use This Image</span>
            </div>
          </button>
        ))}
      </div>
       <div className="text-center mt-8">
            <button 
                onClick={onCancel}
                className="text-slate-600 font-semibold py-2 px-6 rounded-lg hover:bg-slate-200 transition-colors"
            >
                Cancel & Start Over
            </button>
        </div>
    </div>
  );
};

// Add fade-in animation styles if they are not already global
const fadeIn = `
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
  animation: fadeIn 0.5s ease-out forwards;
}
`;
if (!document.querySelector('#animation-styles')) {
    const styleSheet = document.createElement("style");
    styleSheet.id = 'animation-styles';
    styleSheet.innerText = fadeIn;
    document.head.appendChild(styleSheet);
}
