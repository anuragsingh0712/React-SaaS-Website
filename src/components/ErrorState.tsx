import React from 'react';
import { RefreshCcw, TriangleAlert } from 'lucide-react';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({ message = 'Something went wrong.', onRetry }: ErrorStateProps): React.ReactElement {
  return (
    <div className="flex flex-col items-center justify-center rounded-card border border-danger-light bg-danger-light/40 px-6 py-16 text-center">
      <div className="rounded-pill bg-white p-3 text-danger-dark">
        <TriangleAlert className="h-6 w-6" />
      </div>
      <h3 className="mt-4 font-semibold text-danger-dark">{message}</h3>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 inline-flex items-center gap-2 rounded-card bg-danger-dark px-4 py-2 text-sm font-medium text-white hover:opacity-90"
        >
          <RefreshCcw className="h-4 w-4" /> Try again
        </button>
      )}
    </div>
  );
}
