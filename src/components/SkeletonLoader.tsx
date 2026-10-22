import React from 'react';

interface SkeletonLoaderProps {
  className?: string;
  count?: number;
}

export function SkeletonLoader({ className = 'h-24 w-full', count = 1 }: SkeletonLoaderProps): React.ReactElement {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className={`animate-pulse rounded-card bg-slate-200 dark:bg-slate-700/50 ${className}`}
        />
      ))}
    </>
  );
}
