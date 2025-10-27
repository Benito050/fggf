
import React, { useState, useRef, useEffect } from 'react';
import { UploadIcon } from './icons';

interface VideoUploaderProps {
  onVideoSelect: (file: File) => void;
  existingFile: File | null;
}

export const VideoUploader: React.FC<VideoUploaderProps> = ({ onVideoSelect, existingFile }) => {
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (existingFile) {
      const url = URL.createObjectURL(existingFile);
      setVideoSrc(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setVideoSrc(null);
    }
  }, [existingFile]);

  const handleFileChange = (files: FileList | null) => {
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('video/')) {
        onVideoSelect(file);
      } else {
        alert('Please select a valid video file.');
      }
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFileChange(e.dataTransfer.files);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  if (videoSrc && existingFile) {
    return (
      <div className="bg-plasma-surface p-6 rounded-lg shadow-md border border-plasma-border">
        <h3 className="text-lg font-semibold mb-4 text-center text-plasma-text">Your Product Video</h3>
        <video src={videoSrc} controls className="w-full rounded-lg aspect-video" />
        <div className="text-center mt-4">
          <button
            className="text-plasma-accent hover:text-plasma-accent-hover font-semibold"
            type="button"
            onClickCapture={handleClick}
          >
            Choose a different video
          </button>
          <input
            type="file"
            accept="video/*"
            ref={fileInputRef}
            onChange={(e) => handleFileChange(e.target.files)}
            className="hidden"
          />
        </div>
      </div>
    );
  }

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
      className={`p-8 md:p-12 border-2 border-dashed rounded-xl text-center cursor-pointer transition-colors ${
        isDragging ? 'border-plasma-accent bg-blue-50' : 'border-plasma-border bg-plasma-surface hover:border-plasma-accent'
      }`}
    >
      <input
        type="file"
        accept="video/*"
        ref={fileInputRef}
        onChange={(e) => handleFileChange(e.target.files)}
        className="hidden"
      />
      <div className="w-16 h-16 mx-auto text-plasma-text-subtle mb-4">
        <UploadIcon />
      </div>
      <p className="text-xl font-semibold text-plasma-text">Drag & drop your video here</p>
      <p className="text-plasma-text-subtle mt-1">or click to browse files</p>
      <p className="text-xs text-plasma-text-subtle mt-4">MP4, MOV, WEBM supported</p>
    </div>
  );
};
