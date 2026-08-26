'use client';

import React, { createContext, useContext, useState } from 'react';

const AssessmentContext = createContext();

export function AssessmentProvider({ children }) {
  const [state, setState] = useState({
    status: 'idle', // 'idle' | 'uploading' | 'extracting-questions' | 'extracting-answers' | 'grading' | 'complete' | 'error'
    error: null,
    progress: 0,
    progressText: '',
    questionPaperImages: [],
    answerSheetImages: [],
    questions: [],
    answers: [],
    unmatchedAnswers: [],
    grades: [],
    selectedQuestionId: null,
  });

  const updateState = (updates) => {
    setState((prev) => ({ ...prev, ...updates }));
  };

  const resetAssessment = () => {
    setState({
      status: 'idle',
      error: null,
      progress: 0,
      progressText: '',
      questionPaperImages: [],
      answerSheetImages: [],
      questions: [],
      answers: [],
      unmatchedAnswers: [],
      grades: [],
      selectedQuestionId: null,
    });
  };

  const value = {
    ...state,
    updateState,
    resetAssessment,
  };

  return (
    <AssessmentContext.Provider value={value}>
      {children}
    </AssessmentContext.Provider>
  );
}

export function useAssessment() {
  const context = useContext(AssessmentContext);
  if (!context) {
    throw new Error('useAssessment must be used within an AssessmentProvider');
  }
  return context;
}
