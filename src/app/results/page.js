'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import QuestionPanel from '@/components/QuestionPanel';
import AnswerViewer from '@/components/AnswerViewer';
import { useAssessment } from '@/context/AssessmentContext';

export default function Results() {
  const router = useRouter();
  const { status } = useAssessment();

  // Redirect to home if no data (e.g., page refresh)
  React.useEffect(() => {
    if (status === 'idle') {
      router.push('/');
    }
  }, [status, router]);

  if (status === 'idle') return null;

  return (
    <div className="flex h-full w-full">
      <Sidebar />
      <div className="flex-1 flex flex-col relative h-full bg-[#f8f9fa] overflow-hidden">
        <Header />
        
        <main className="flex-1 flex overflow-hidden p-6 gap-6 h-[calc(100vh-4rem)]">
          <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex h-full">
            <QuestionPanel />
            <AnswerViewer />
          </div>
        </main>
      </div>
    </div>
  );
}
