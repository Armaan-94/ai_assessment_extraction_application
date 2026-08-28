'use client';

import React from 'react';
import { useAssessment } from '@/context/AssessmentContext';

export default function UnmatchedAnswers() {
  const { unmatchedAnswers } = useAssessment();

  if (!unmatchedAnswers || unmatchedAnswers.length === 0) return null;

  return (
    <div className="p-4 bg-white rounded-2xl shadow-sm border border-gray-200 shrink-0">
      <h3 className="text-sm font-semibold text-gray-700 mb-2">
        Unmatched Answers ({unmatchedAnswers.length})
        <span className="text-gray-400 font-normal ml-1">— handwriting found on the answer sheet that didn&apos;t match any extracted question</span>
      </h3>
      <div className="flex gap-2 overflow-x-auto pb-2">
        {unmatchedAnswers.map((ua, idx) => (
          <div key={idx} className="bg-gray-50 border border-gray-200 p-2 rounded shadow-sm min-w-[150px] max-w-[200px] shrink-0">
            <p className="text-xs text-gray-600 line-clamp-3">{ua.extractedText}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
