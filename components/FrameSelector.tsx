import React, { useState } from 'react';

interface FrameSelectorProps {
  frames: string[];
  onSelect: (frame: string) => void;
  onCancel: () => void;
}

export const FrameSelector: React.FC<FrameSelectorProps> = ({ frames, onSelect, onCancel }) => {
  const [selected, setSelected] = useState<string | null>(null);

  const handleSelect = (frame: string) => {
    setSelected(frame);
  };

  const handleConfirm = () => {
    if (selected) {
      onSelect(selected);
    }
  };

  const handleResetSelection = () => {
    setSelected(null);
  };

  return (
    <div className="max-w-4xl mx-auto text-center p-4 animate-fade-in">
      <h2 className="text-3xl font-bold text-plasma-text mb-2">
        {selected ? "Confirm Your Selection" : "Select the Best Frame"}
      </h2>
      <p className="text-plasma-text-subtle mb-8">
        {selected ? "This image will be used to generate your storefront." : "Choose the clearest image of your product(s) to generate your storefront."}
      </p>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
        {frames.map((frame, index) => {
          const isSelected = selected === frame;
          const isEnabled = !selected || isSelected;
          return (
            <div
              key={index}
              className={`rounded-lg overflow-hidden border-2 bg-plasma-surface transition-all transform ${
                isSelected
                  ? 'border-plasma-accent ring-2 ring-plasma-accent ring-offset-2'
                  : 'border-plasma-border'
              } ${
                isEnabled
                  ? 'cursor-pointer hover:border-plasma-accent hover:scale-105'
                  : 'opacity-50'
              }`}
              onClick={isEnabled ? () => handleSelect(frame) : undefined}
              role="button"
              aria-label={`Select frame ${index + 1}`}
              aria-pressed={isSelected}
            >
              <img src={frame} alt={`Frame ${index + 1}`} className="w-full h-full object-cover aspect-video" />
            </div>
          );
        })}
      </div>

      <div className="mt-8">
        {selected ? (
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleConfirm}
              className="bg-plasma-accent text-white font-bold py-2 px-6 rounded-lg hover:bg-plasma-accent-hover transition-colors"
            >
              Generate with this Image
            </button>
            <button
              onClick={handleResetSelection}
              className="bg-plasma-bg text-plasma-text font-bold py-2 px-6 rounded-lg hover:bg-plasma-border transition-colors border border-plasma-border"
            >
              Change Selection
            </button>
          </div>
        ) : (
          <button
            onClick={onCancel}
            className="bg-gray-700 text-white font-bold py-2 px-6 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Cancel and Start Over
          </button>
        )}
      </div>
    </div>
  );
};

const fadeIn = `
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
  animation: fadeIn 0.5s ease-out forwards;
}
`;

if (!document.querySelector('#frame-selector-animation')) {
    const styleSheet = document.createElement("style");
    styleSheet.id = 'frame-selector-animation';
    styleSheet.innerText = fadeIn;
    document.head.appendChild(styleSheet);
}
