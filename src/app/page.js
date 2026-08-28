'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import FileUploadZone from '@/components/FileUploadZone';
import ProcessingOverlay from '@/components/ProcessingOverlay';
import ErrorBanner from '@/components/ErrorBanner';
import { useAssessment } from '@/context/AssessmentContext';
import { fileToImages } from '@/lib/pdf-utils';

export default function Home() {
  const router = useRouter();
  const { status, error, progressText, updateState } = useAssessment();
  const [qPaper, setQPaper] = useState(null);
  const [aSheet, setASheet] = useState(null);

  const handleStartMapping = async () => {
    if (!qPaper || !aSheet) return;

    updateState({ status: 'extracting-questions', progressText: 'Extracting Questions...', error: null });

    try {
      // 1. Convert Question Paper to images
      const qImages = await fileToImages(qPaper);
      updateState({ questionPaperImages: qImages });

      // 2. Extract Questions via API
      const qRes = await fetch('/api/extract-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ images: qImages })
      });
      if (!qRes.ok) throw new Error('Failed to extract questions from the question paper. Check the file and try again.');
      const { questions } = await qRes.json();
      updateState({ questions });

      updateState({ status: 'extracting-answers', progressText: 'Extracting Answers...' });

      // 3. Convert Answer Sheet to images
      const aImages = await fileToImages(aSheet);
      updateState({ answerSheetImages: aImages });

      // 4. Map Answers via API
      const aRes = await fetch('/api/extract-answers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ images: aImages, questions })
      });
      if (!aRes.ok) throw new Error('Failed to map answers from the answer sheet. Check the file and try again.');
      const { answers, unmatchedAnswers } = await aRes.json();
      updateState({ answers, unmatchedAnswers });

      try {
        updateState({ status: 'grading', progressText: 'Grading...' });
        const gRes = await fetch('/api/grade', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ questions, answers })
        });
        if (!gRes.ok) throw new Error('Grading failed');
        const { grades } = await gRes.json();
        updateState({ grades, status: 'complete', gradingError: null });
      } catch (gradeError) {
        console.error('Grading failed:', gradeError);
        updateState({
          status: 'complete',
          gradingError: 'Grading failed, possibly due to API rate limits. Mapping succeeded — you can retry grading from the results page.'
        });
      }

      // Navigate to results
      router.push('/results');
    } catch (err) {
      console.error(err);
      updateState({ status: 'error', error: err.message });
    }
  };

  const handleDismissError = () => updateState({ status: 'idle', error: null });

  return (
    <div className="flex h-full w-full">
      <Sidebar />
      <div className="flex-1 flex flex-col relative h-full bg-[#f8f9fa]">
        <Header />
        
        <ProcessingOverlay 
          isVisible={status !== 'idle' && status !== 'error'} 
          status={status} 
          text={progressText} 
        />

        <main className="flex-1 overflow-auto p-8 flex flex-col items-center">
          <div className="w-full max-w-4xl mt-12 flex flex-col items-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
              Upload <span className="text-orange-500 bg-orange-50 px-2 py-1 rounded">Question Paper & Answer Sheets</span>
            </h1>
            <p className="text-gray-500 mb-12">Upload both files to get started</p>

            {status === 'error' && (
              <div className="w-full max-w-lg mb-8">
                <ErrorBanner
                  message={error}
                  onRetry={handleStartMapping}
                  onDismiss={handleDismissError}
                />
              </div>
            )}

            {/* Center illustration placeholder */}
            <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mb-12 shadow-inner border-4 border-white z-10">
              <span className="text-4xl">👩‍🏫</span>
            </div>

            <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-6 relative sm:-mt-24 pt-20">
              {/* Background pill shape connecting the two zones (aesthetic from figma) */}
              <div className="absolute top-1/2 left-0 right-0 h-48 bg-white/50 rounded-[40px] -z-10 blur-xl"></div>
              
              <FileUploadZone 
                title="Question Paper"
                accept="application/pdf,image/*"
                file={qPaper}
                onFileSelect={setQPaper}
                onRemove={() => setQPaper(null)}
              />
              <FileUploadZone 
                title="Answer Sheet"
                accept="application/pdf,image/*"
                file={aSheet}
                onFileSelect={setASheet}
                onRemove={() => setASheet(null)}
              />
            </div>

            <button 
              onClick={handleStartMapping}
              disabled={!qPaper || !aSheet}
              className={`mt-12 px-8 py-3 rounded-full font-medium transition-all shadow-md ${
                qPaper && aSheet 
                  ? 'bg-gray-900 text-white hover:bg-gray-800 hover:shadow-lg' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Start Mapping →
            </button>
            <p className="text-xs text-gray-400 mt-4">Once both files are uploaded, you&apos;ll able to map answers with questions</p>
          </div>
        </main>
      </div>
    </div>
  );
}
