'use client';

import React from 'react';

export default function ErrorBanner({ message, tone = 'error', onRetry, retryLabel = 'Retry', onDismiss }) {
  if (!message) return null;

  const isWarning = tone === 'warning';

  return (
    <div
      className={`w-full rounded-xl border px-4 py-3 flex items-start gap-3 ${
        isWarning ? 'bg-amber-50 border-amber-200 text-amber-800' : 'bg-red-50 border-red-200 text-red-700'
      }`}
    >
      <span className="text-base leading-none mt-0.5">{isWarning ? '⚠️' : '⛔'}</span>
      <div className="flex-1 text-sm">{message}</div>
      <div className="flex items-center gap-2 shrink-0">
        {onRetry && (
          <button
            onClick={onRetry}
            className={`text-xs font-medium px-3 py-1 rounded-full border transition-colors ${
              isWarning ? 'border-amber-300 hover:bg-amber-100' : 'border-red-300 hover:bg-red-100'
            }`}
          >
            {retryLabel}
          </button>
        )}
        {onDismiss && (
          <button
            onClick={onDismiss}
            aria-label="Dismiss"
            className="text-sm leading-none opacity-60 hover:opacity-100 px-1"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
}
