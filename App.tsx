import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { VideoUploader } from './components/VideoUploader';
import { ProcessingIndicator } from './components/ProcessingIndicator';
import { ProductPage } from './components/ProductPage';
import { FrameSelector } from './components/FrameSelector';
import { generateProductDetails, extractFramesFromVideo } from './services/geminiService';
import { ProductData } from './types';
import { ErrorIcon, SparklesIcon } from './components/icons';

type AppState = 'idle' | 'processing' | 'selecting' | 'success' | 'error';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('idle');
  const [productData, setProductData] = useState<ProductData | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [extractedFrames, setExtractedFrames] = useState<string[]>([]);

  const handleVideoSelect = (file: File) => {
    setVideoFile(file);
    handleReset();
    setVideoFile(file); // set it again after reset
  };

  const handleStartGeneration = useCallback(async () => {
    if (!videoFile) {
      setErrorMessage('Please select a video file first.');
      setAppState('error');
      return;
    }

    setAppState('processing');
    setErrorMessage('');

    try {
      const frames = await extractFramesFromVideo(videoFile);
      if (frames.length === 0) {
        throw new Error("Could not extract any usable frames from the video. Please try a different video.");
      }
      setExtractedFrames(frames);
      setAppState('selecting');
    } catch (error) {
      console.error('Error extracting frames:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Failed to process video.');
      setAppState('error');
    }
  }, [videoFile]);

  const handleFrameSelect = useCallback(async (selectedFrame: string) => {
    setAppState('processing');
    try {
      const data = await generateProductDetails(selectedFrame);
      setProductData(data);
      setAppState('success');
    } catch (error) {
      console.error('Error generating storefront:', error);
      const specificMessage = "The AI couldn't generate details from the selected image. It might be blurry or the product isn't clear. Please try a different frame or upload a new video.";
      setErrorMessage(specificMessage);
      setAppState('error');
    }
  }, []);
  
  const handleReset = () => {
    setAppState('idle');
    setProductData(null);
    setVideoFile(null);
    setErrorMessage('');
    setExtractedFrames([]);
  };

  const handleBackToSelection = () => {
    setAppState('selecting');
    setErrorMessage('');
  };

  const renderContent = () => {
    switch (appState) {
      case 'processing':
        // If frames haven't been extracted yet, we're in the extraction phase.
        const isExtracting = extractedFrames.length === 0;
        return <ProcessingIndicator isExtracting={isExtracting} />;
      case 'selecting':
        return <FrameSelector frames={extractedFrames} onSelect={handleFrameSelect} onCancel={handleReset} />;
      case 'success':
        return productData ? <ProductPage product={productData} onReset={handleReset} /> : null;
      case 'error':
        const canGoBackToSelection = extractedFrames.length > 0;
        return (
          <div className="text-center p-8 bg-red-50 border border-red-200 rounded-lg max-w-lg mx-auto">
            <div className="w-12 h-12 mx-auto text-red-500 mb-4">
              <ErrorIcon />
            </div>
            <h3 className="text-xl font-semibold text-red-800">Generation Failed</h3>
            <p className="mt-2 text-red-600">{errorMessage}</p>
            {canGoBackToSelection ? (
              <div className="mt-6 flex flex-col sm:flex-row gap-2 justify-center">
                <button
                  onClick={handleBackToSelection}
                  className="bg-indigo-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Try a Different Frame
                </button>
                <button
                  onClick={handleReset}
                  className="bg-slate-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-slate-700 transition-colors"
                >
                  Start Over
                </button>
              </div>
            ) : (
              <button
                onClick={handleReset}
                className="mt-6 bg-red-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-red-700 transition-colors"
              >
                Try Again
              </button>
            )}
          </div>
        );
      case 'idle':
      default:
        return (
          <div className="w-full max-w-2xl mx-auto">
            <VideoUploader onVideoSelect={handleVideoSelect} existingFile={videoFile} />
            {videoFile && (
              <div className="text-center mt-8">
                <button
                  onClick={handleStartGeneration}
                  className="bg-indigo-600 text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-indigo-700 transition-transform hover:scale-105 transform inline-flex items-center gap-2"
                >
                  <div className="w-6 h-6"><SparklesIcon /></div>
                  Generate Storefront
                </button>
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col">
      <Header />
      <main className="flex-grow flex items-center justify-center p-4 md:p-8">
        <div className="w-full">
          {renderContent()}
        </div>
      </main>
      <footer className="text-center p-4 text-slate-500 text-sm">
        <p>AI E-Commerce Solution for Small Shops | Powered by Gemini</p>
      </footer>
    </div>
  );
};

export default App;