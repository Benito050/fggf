import React, { useState } from 'react';
import { VideoUploader } from './components/VideoUploader';
import { ProcessingIndicator } from './components/ProcessingIndicator';
import { FrameSelector } from './components/FrameSelector';
import { ProductData } from './types';
import { 
  extractFramesFromVideo, 
  generateProductDetails, 
  generateUniqueImagesForProducts 
} from './services/geminiService';

type GeneratorState = 'upload' | 'extracting' | 'selecting' | 'generating_details' | 'generating_images';

interface GeneratorPageProps {
  onStorefrontReady: (products: ProductData[]) => void;
  onGenerationStart: () => void;
}

export const GeneratorPage: React.FC<GeneratorPageProps> = ({ onStorefrontReady, onGenerationStart }) => {
  const [generatorState, setGeneratorState] = useState<GeneratorState>('upload');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [extractedFrames, setExtractedFrames] = useState<string[]>([]);
  const [error, setError] = useState<string>('');

  const handleVideoSelect = async (file: File) => {
    setVideoFile(file);
    setGeneratorState('extracting');
    setError('');
    try {
      const frames = await extractFramesFromVideo(file);
      if (frames.length === 0) {
        throw new Error("Could not extract any frames from the video. Please try a different video.");
      }
      setExtractedFrames(frames);
      setGeneratorState('selecting');
    } catch (e: any) {
      setError(e.message || 'An unknown error occurred during frame extraction.');
      setGeneratorState('upload');
    }
  };

  const handleFrameSelect = async (frame: string) => {
    setGeneratorState('generating_details');
    setError('');
    try {
      onGenerationStart();
      const products = await generateProductDetails(frame);
      if (products.length === 0) {
        throw new Error("The AI could not identify any products in the selected frame. Please try a different frame or video.");
      }
      setGeneratorState('generating_images');
      
      const productsWithNewImages = await generateUniqueImagesForProducts(products);
      onStorefrontReady(productsWithNewImages);
    } catch (e: any) {
      setError(e.message || 'An unknown error occurred while generating product details.');
      setGeneratorState('selecting'); // Go back to frame selection
    }
  };

  const handleReset = () => {
    setGeneratorState('upload');
    setVideoFile(null);
    setExtractedFrames([]);
    setError('');
  };

  switch (generatorState) {
    case 'upload':
      return (
        <div className="max-w-2xl mx-auto p-4 md:p-8">
          <h2 className="text-3xl font-bold text-center text-plasma-text mb-2">Upload Your Product Video</h2>
          <p className="text-center text-plasma-text-subtle mb-8">Let's create an e-commerce storefront from a single video.</p>
          <VideoUploader onVideoSelect={handleVideoSelect} existingFile={videoFile} />
          {error && <p className="text-red-600 text-center mt-4">{error}</p>}
        </div>
      );
    case 'extracting':
      return <ProcessingIndicator isExtracting={true} />;
    case 'selecting':
      return <FrameSelector frames={extractedFrames} onSelect={handleFrameSelect} onCancel={handleReset} />;
    case 'generating_details':
      return <ProcessingIndicator isExtracting={false} />;
    case 'generating_images':
      return <ProcessingIndicator isExtracting={false} isGeneratingImages={true} />;
    default:
      return null;
  }
};
