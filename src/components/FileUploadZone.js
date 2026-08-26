'use client';

import React, { useRef } from 'react';

export default function FileUploadZone({ 
  title, 
  subtitle = "Max 10MB", 
  accept, 
  onFileSelect, 
  file, 
  onRemove 
}) {
  const inputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <div 
      className={`border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-8 transition-colors ${
        file ? 'border-gray-300 bg-white' : 'border-gray-200 bg-white hover:border-orange-300 cursor-pointer'
      }`}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={() => !file && inputRef.current?.click()}
    >
      <input 
        type="file" 
        className="hidden" 
        ref={inputRef} 
        onChange={handleChange}
        accept={accept}
      />
      
      {!file ? (
        <>
          <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center mb-4 text-gray-400 border border-gray-100">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
          </div>
          <p className="font-semibold text-gray-900 mb-1">Upload <span className="text-orange-500">{title}</span></p>
          <p className="text-xs text-gray-400">{subtitle}</p>
        </>
      ) : (
        <div className="flex flex-col items-center relative w-full h-full justify-center">
          <button 
            onClick={(e) => { e.stopPropagation(); onRemove(); }}
            className="absolute -top-10 -right-4 w-6 h-6 bg-gray-500 text-white rounded-full flex items-center justify-center hover:bg-gray-700 z-10 text-xs shadow"
          >
            ×
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 text-red-500 rounded flex items-center justify-center font-bold text-xs uppercase">
              {file.type === 'application/pdf' ? 'PDF' : 'IMG'}
            </div>
            <div className="flex flex-col items-start overflow-hidden max-w-[200px]">
              <span className="text-sm font-medium text-gray-900 truncate w-full">{file.name}</span>
              <span className="text-xs text-gray-500">{(file.size / (1024 * 1024)).toFixed(1)}MB</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
