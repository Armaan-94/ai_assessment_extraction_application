'use client';

import React from 'react';
import Link from 'next/link';

export default function Sidebar() {
  const handleComingSoon = (e) => {
    e.preventDefault();
    alert("This feature is currently under development.");
  };

  return (
    <aside className="hidden lg:flex w-64 shrink-0 bg-white border-r border-gray-200 flex-col justify-between h-full shadow-sm z-10">
      <div>
        <div 
          className="p-6 flex items-center gap-2 cursor-pointer" 
          onClick={handleComingSoon}
        >
          {/* Mock Logo */}
          <div className="w-8 h-8 bg-gray-900 text-white flex items-center justify-center rounded text-xl font-bold">V</div>
          <span className="text-xl font-bold">VedaAI</span>
        </div>
        
        <div className="px-4 mb-6">
          <button 
            onClick={handleComingSoon}
            className="w-full bg-gray-900 text-white rounded-full py-2 px-4 flex items-center justify-center gap-2 text-sm font-medium hover:bg-gray-800 transition-colors"
          >
            <span>✦</span> AI Teacher&apos;s Toolkit
          </button>
        </div>

        <nav className="px-3 space-y-1">
          {['Home', 'My Classroom', 'Assignments'].map((item) => (
            <a 
              key={item} 
              href="#" 
              onClick={handleComingSoon}
              className="flex items-center gap-3 px-3 py-2.5 text-gray-600 rounded-lg hover:bg-gray-50 text-sm"
            >
              <div className="w-4 h-4 bg-gray-300 rounded-sm"></div>
              {item}
            </a>
          ))}
          <Link 
            href="/" 
            className="flex items-center gap-3 px-3 py-2.5 bg-gray-100 text-gray-900 rounded-lg font-medium text-sm"
          >
            <div className="w-4 h-4 bg-gray-400 rounded-sm"></div>
            Exams
          </Link>
          <a 
            href="#" 
            onClick={handleComingSoon}
            className="flex items-center gap-3 px-3 py-2.5 text-gray-600 rounded-lg hover:bg-gray-50 text-sm"
          >
            <div className="w-4 h-4 bg-gray-300 rounded-sm"></div>
            My Library
          </a>
        </nav>
      </div>

      <div className="p-4 border-t border-gray-100">
        <a 
          href="#" 
          onClick={handleComingSoon}
          className="flex items-center gap-3 px-3 py-2.5 text-gray-600 rounded-lg hover:bg-gray-50 text-sm mb-4"
        >
          <div className="w-4 h-4 bg-gray-300 rounded-sm"></div>
          Settings
        </a>
        <div 
          onClick={handleComingSoon}
          className="bg-gray-50 p-3 rounded-lg flex items-center gap-3 border border-gray-100 cursor-pointer hover:bg-gray-100 transition-colors"
        >
          <div className="w-8 h-8 bg-green-100 text-green-700 rounded-full flex items-center justify-center font-bold text-xs">VA</div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-gray-900">VedaAI International</span>
            <span className="text-[10px] text-gray-500">Main Campus</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
