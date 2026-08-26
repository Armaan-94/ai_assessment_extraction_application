'use client';

import React from 'react';

export default function ProcessingOverlay({ isVisible, status, text }) {
  if (!isVisible) return null;

  return (
    <div className="absolute inset-0 bg-white z-50 flex flex-col items-center justify-center">
      {/* Animated Sparkles Logo */}
      <div className="relative w-24 h-24 mb-6">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center gap-1">
          <svg className="w-12 h-12 text-orange-500 animate-pulse" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" />
          </svg>
          <div className="flex flex-col gap-1 translate-y-3">
            <svg className="w-6 h-6 text-orange-400 animate-pulse delay-75" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L13.2 8.8L20 10L13.2 11.2L12 18L10.8 11.2L4 10L10.8 8.8L12 2Z" />
            </svg>
          </div>
        </div>
      </div>
      
      <h2 className="text-2xl font-bold text-gray-900 mb-2">{text || 'Extracting...'}</h2>
      <p className="text-gray-400 text-sm">This may take a while</p>

      {/* Progress visualizer */}
      <div className="mt-8 flex gap-2">
        <div className={`h-1.5 w-12 rounded-full ${status !== 'idle' ? 'bg-orange-500' : 'bg-gray-200'}`}></div>
        <div className={`h-1.5 w-12 rounded-full ${status === 'extracting-answers' || status === 'grading' ? 'bg-orange-500' : 'bg-gray-200'} transition-colors duration-500`}></div>
        <div className={`h-1.5 w-12 rounded-full ${status === 'grading' ? 'bg-orange-500' : 'bg-gray-200'} transition-colors duration-500`}></div>
      </div>
    </div>
  );
}
