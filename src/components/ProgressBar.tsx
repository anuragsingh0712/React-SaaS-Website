import React from 'react';

interface ProgressBarProps {
  label: string;
  percentage: number;
}

export function ProgressBar({ label, percentage }: ProgressBarProps): React.ReactElement {
  const clamped = Math.min(100, Math.max(0, percentage));

  return (
    <div>
      <div className="flex items-center justify-between text-sm mb-1.5">
        <span className="font-medium">{label}</span>
        <span className="text-muted">{clamped}%</span>
      </div>
      <div className="h-2 w-full rounded-pill bg-canvas dark:bg-night overflow-hidden">
        <div
          className="h-full rounded-pill bg-gradient-primary transition-all duration-500"
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}
