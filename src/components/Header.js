'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

export default function Header() {
  const router = useRouter();

  const handleComingSoon = () => {
    alert("This feature is currently under development.");
  };

  const handleBackClick = () => {
    // Navigate back to the exams home
    router.push('/');
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0">
      <div 
        className="flex items-center text-gray-500 text-sm gap-2 cursor-pointer hover:text-gray-700 transition-colors"
        onClick={handleBackClick}
      >
        <span>←</span>
        <span>📄 Exams</span>
      </div>
      <div className="flex items-center gap-4">
        <button 
          onClick={handleComingSoon}
          className="text-gray-400 hover:text-gray-600 transition-colors"
          title="Help"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        </button>
        <button 
          onClick={handleComingSoon}
          className="text-gray-400 hover:text-gray-600 relative transition-colors"
          title="Notifications"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        <div 
          onClick={handleComingSoon}
          className="flex items-center gap-2 pl-4 border-l border-gray-200 cursor-pointer hover:bg-gray-50 p-1 rounded transition-colors"
        >
          <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 overflow-hidden">
            {/* Avatar placeholder */}
            <svg className="w-full h-full text-gray-400 mt-2" fill="currentColor" viewBox="0 0 24 24"><path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
          </div>
          <span className="text-sm font-medium text-gray-700">Teacher Admin</span>
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
        </div>
      </div>
    </header>
  );
}
