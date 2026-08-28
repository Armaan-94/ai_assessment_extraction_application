'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAssessment } from '@/context/AssessmentContext';

export default function AnswerViewer() {
  const { answerSheetImages, answers, selectedQuestionId, questions } = useAssessment();
  const [currentPage, setCurrentPage] = useState(0);
  const [zoom, setZoom] = useState(100);
  const containerRef = useRef(null);

  // Find if selected question has an answer and on which page
  useEffect(() => {
    if (selectedQuestionId) {
      const answer = answers.find(a => a.questionId === selectedQuestionId);
      if (answer && answer.regions && answer.regions.length > 0) {
        setCurrentPage(answer.regions[0].pageIndex);
        // Scroll into view logic could go here
      }
    }
  }, [selectedQuestionId, answers]);

  const activeAnswer = answers.find(a => a.questionId === selectedQuestionId);
  const activeRegions = activeAnswer?.regions?.filter(r => r.pageIndex === currentPage) || [];

  // Find next page that has regions for this answer
  let nextPageWithAnswer = null;
  if (activeAnswer && activeAnswer.regions) {
    const nextRegion = activeAnswer.regions.find(r => r.pageIndex > currentPage);
    if (nextRegion) {
      nextPageWithAnswer = nextRegion.pageIndex;
    }
  }

  return (
    <div className="flex-1 bg-gray-900 rounded-tl-xl overflow-hidden flex flex-col relative h-full">
      {/* Toolbar */}
      <div className="h-14 bg-gray-800/80 backdrop-blur border-b border-gray-700 flex items-center justify-between px-6 z-10">
        <div className="text-white font-medium text-sm">Answer Sheet</div>
        <div className="flex items-center gap-4">
          <div className="flex items-center bg-gray-700 rounded-md overflow-hidden">
            <button onClick={() => setZoom(Math.max(50, zoom - 10))} className="px-3 py-1.5 text-gray-300 hover:text-white hover:bg-gray-600 transition">-</button>
            <span className="text-white text-xs px-2 w-12 text-center">{zoom}%</span>
            <button onClick={() => setZoom(Math.min(200, zoom + 10))} className="px-3 py-1.5 text-gray-300 hover:text-white hover:bg-gray-600 transition">+</button>
          </div>
          <div className="flex items-center gap-3 bg-gray-700 rounded-md px-3 py-1.5">
            <button 
              onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
              disabled={currentPage === 0}
              className="text-gray-400 hover:text-white disabled:opacity-50"
            >
              &lt;
            </button>
            <span className="text-white text-xs">Page {currentPage + 1} of {answerSheetImages.length}</span>
            <button 
              onClick={() => setCurrentPage(Math.min(answerSheetImages.length - 1, currentPage + 1))}
              disabled={currentPage === answerSheetImages.length - 1}
              className="text-gray-400 hover:text-white disabled:opacity-50"
            >
              &gt;
            </button>
          </div>
        </div>
      </div>

      {/* Canvas Area */}
      <div 
        ref={containerRef}
        className="flex-1 overflow-auto bg-gray-900 p-8 flex justify-center relative"
      >
        {selectedQuestionId && !activeAnswer && (
          <div className="fixed top-24 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-sm px-4 py-2 rounded-full shadow-lg z-50">
            No answer found for this question
          </div>
        )}
        {nextPageWithAnswer !== null && (
          <button 
            onClick={() => setCurrentPage(nextPageWithAnswer)}
            className="fixed bottom-10 right-10 bg-orange-500 text-white px-5 py-3 rounded-full shadow-lg hover:bg-orange-600 transition-colors z-50 flex items-center gap-2 text-sm font-medium animate-bounce"
          >
            Answer continues on Page {nextPageWithAnswer + 1} <span>→</span>
          </button>
        )}
        {answerSheetImages[currentPage] && (
          <div 
            className="relative bg-white shadow-2xl transition-transform duration-200"
            style={{ 
              transform: `scale(${zoom / 100})`, 
              transformOrigin: 'top center',
              // Base width representing a standard A4 page aspect ratio, will naturally scale with the image
              maxWidth: '1000px',
              width: '100%'
            }}
          >
            <img 
              src={answerSheetImages[currentPage]} 
              alt={`Answer Sheet Page ${currentPage + 1}`} 
              className="w-full h-auto block"
            />
            
            {/* Highlight Overlays */}
            {activeRegions.map((region, idx) => {
              const { yMin, xMin, yMax, xMax } = region.boundingBox;
              // Convert 0-1000 to percentages
              const top = `${(yMin / 1000) * 100}%`;
              const left = `${(xMin / 1000) * 100}%`;
              const height = `${((yMax - yMin) / 1000) * 100}%`;
              const width = `${((xMax - xMin) / 1000) * 100}%`;
              
              const rawNum = (questions.find(q => q.id === selectedQuestionId)?.number || '').trim();
              // The extracted `number` is whatever was printed on the paper (e.g. "Q2", "2", "11(a)") -
              // prefix with "Q" only when it isn't already labeled, to avoid a "QQ2" double-prefix.
              const qLabel = /^q/i.test(rawNum) ? rawNum : `Q${rawNum}`;

              return (
                <div
                  key={idx}
                  className="absolute border-2 border-green-500 bg-green-500/10 transition-all duration-300 pointer-events-none rounded"
                  style={{ top, left, height, width }}
                >
                  {/* Question Number Tag */}
                  <div className="absolute -top-3 -left-3 bg-green-500 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-md z-10">
                    {qLabel}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
