'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import QuestionPanel from '@/components/QuestionPanel';
import AnswerViewer from '@/components/AnswerViewer';
import UnmatchedAnswers from '@/components/UnmatchedAnswers';
import ErrorBanner from '@/components/ErrorBanner';
import { useAssessment } from '@/context/AssessmentContext';

export default function Results() {
  const router = useRouter();
  const { status, gradingError, questions, answers, updateState } = useAssessment();
  const [isRetryingGrade, setIsRetryingGrade] = React.useState(false);

  // Redirect to home if no data (e.g., page refresh)
  React.useEffect(() => {
    if (status === 'idle') {
      router.push('/');
    }
  }, [status, router]);

  if (status === 'idle') return null;

  const handleRetryGrading = async () => {
    setIsRetryingGrade(true);
    try {
      const gRes = await fetch('/api/grade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questions, answers })
      });
      if (!gRes.ok) throw new Error('Grading failed');
      const { grades } = await gRes.json();
      updateState({ grades, gradingError: null });
    } catch (err) {
      console.error('Retry grading failed:', err);
      updateState({ gradingError: 'Grading failed again, possibly due to API rate limits. You can try once more, or review the mapped answers without scores.' });
    } finally {
      setIsRetryingGrade(false);
    }
  };

  return (
    <div className="flex h-full w-full">
      <Sidebar />
      <div className="flex-1 flex flex-col relative h-full bg-[#f8f9fa] overflow-hidden">
        <Header />

        <main className="flex-1 flex flex-col overflow-hidden p-6 gap-4 h-[calc(100vh-4rem)]">
          {gradingError && (
            <ErrorBanner
              tone="warning"
              message={isRetryingGrade ? 'Retrying grading…' : gradingError}
              onRetry={isRetryingGrade ? undefined : handleRetryGrading}
              retryLabel="Retry Grading"
              onDismiss={() => updateState({ gradingError: null })}
            />
          )}
          <div className="flex-1 min-h-0 bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col lg:flex-row">
            <QuestionPanel />
            <AnswerViewer />
          </div>
          <UnmatchedAnswers />
        </main>
      </div>
    </div>
  );
}
