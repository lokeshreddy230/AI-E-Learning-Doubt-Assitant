import React from 'react';

export const SkeletonCard = () => (
  <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm animate-pulse">
    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-md w-3/4 mb-4"></div>
    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-md w-1/4 mb-6"></div>
    <div className="space-y-3">
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-md w-full"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-md w-full"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-md w-5/6"></div>
    </div>
  </div>
);

export const SkeletonChart = () => (
  <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm animate-pulse flex flex-col items-center justify-center h-64">
    <div className="w-48 h-48 rounded-full border-8 border-gray-200 dark:border-gray-700"></div>
  </div>
);

export const SkeletonMessage = ({ isAI = false }) => (
  <div className={`flex gap-4 ${isAI ? '' : 'flex-row-reverse'} animate-pulse`}>
    <div className={`w-10 h-10 rounded-full flex-shrink-0 ${isAI ? 'bg-primary-100 dark:bg-primary-900/30' : 'bg-gray-200 dark:bg-gray-700'}`}></div>
    <div className={`p-4 rounded-2xl max-w-[80%] ${isAI ? 'bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700' : 'bg-primary-600'}`}>
      <div className={`h-4 rounded-md mb-2 w-48 ${isAI ? 'bg-gray-200 dark:bg-gray-700' : 'bg-primary-500'}`}></div>
      <div className={`h-4 rounded-md w-64 ${isAI ? 'bg-gray-200 dark:bg-gray-700' : 'bg-primary-500'}`}></div>
    </div>
  </div>
);
