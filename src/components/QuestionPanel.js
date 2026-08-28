'use client';

import React from 'react';
import { useAssessment } from '@/context/AssessmentContext';

export default function QuestionPanel() {
  const { questions, grades, selectedQuestionId, updateState } = useAssessment();

  return (
    <div className="w-full lg:w-[35%] h-1/2 lg:h-full shrink-0 bg-[#fafafa] border-b lg:border-b-0 lg:border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-white shrink-0">
        <h2 className="font-semibold text-gray-800 text-sm">Extracted Questions <span className="text-gray-400 font-normal">(from question paper)</span></h2>
        <button className="text-xs font-medium px-3 py-1 bg-white border border-gray-200 rounded-full hover:bg-gray-50">Expand All</button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {questions.map((q) => {
          const isSelected = selectedQuestionId === q.id;
          const grade = grades.find(g => g.questionId === q.id);
          const isUnanswered = grade?.evaluation === 'unanswered';
          const isAnswered = grade && !isUnanswered;
          const scoreColor = isAnswered && grade.score === grade.maxScore ? 'text-green-600 bg-green-50' :
                             isAnswered ? 'text-orange-600 bg-orange-50' :
                             isUnanswered ? 'text-red-500 bg-red-50' : 'text-gray-500 bg-gray-100';

          return (
            <div 
              key={q.id} 
              onClick={() => updateState({ selectedQuestionId: q.id })}
              className={`bg-white rounded-xl border p-4 cursor-pointer transition-all shadow-sm ${
                isSelected ? 'border-orange-500 ring-1 ring-orange-500' : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${
                  isSelected ? 'bg-orange-500 text-white' : 'bg-gray-800 text-white'
                }`}>
                  {q.number}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-800 line-clamp-3">{q.text}</p>
                  
                  {isSelected && grade && (
                    <div className="mt-4 pt-3 border-t border-gray-100">
                      <h4 className="text-xs font-bold text-gray-900 mb-1">AI Feedback</h4>
                      <p className="text-xs text-gray-600">{grade.feedback}</p>
                    </div>
                  )}
                </div>
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <span className={`text-xs font-bold px-2 py-1 rounded ${scoreColor}`}>
                    {isUnanswered ? 'Unanswered' : grade ? `${grade.score}/${grade.maxScore}` : `${q.marks ? `?/${q.marks}` : '-'}`}
                  </span>
                  <svg className={`w-4 h-4 text-gray-400 transition-transform ${isSelected ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
