import React from 'react';
import { RefreshCcw } from 'lucide-react';

interface RefreshButtonProps {
  onRefresh: () => void;
  isLoading?: boolean;
}

export function RefreshButton({ onRefresh, isLoading = false }: RefreshButtonProps): React.ReactElement {
  return (
    <button
      type="button"
      onClick={onRefresh}
      disabled={isLoading}
      className="inline-flex items-center gap-2 rounded-card border border-border-default dark:border-border-dark px-4 py-2 text-sm font-medium text-muted hover:bg-canvas dark:hover:bg-night disabled:opacity-60"
    >
      <RefreshCcw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
      Refresh
    </button>
  );
}
