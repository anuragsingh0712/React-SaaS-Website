import React from 'react';
import { Inbox } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ElementType;
  action?: React.ReactNode;
}

export function EmptyState({ title, description, icon: Icon = Inbox, action }: EmptyStateProps): React.ReactElement {
  return (
    <div className="flex flex-col items-center justify-center rounded-card border border-dashed border-border-default dark:border-border-dark bg-surface dark:bg-surface-dark px-6 py-16 text-center">
      <div className="rounded-pill bg-canvas dark:bg-night p-3 text-muted">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="mt-4 font-semibold">{title}</h3>
      {description && <p className="mt-1 max-w-sm text-sm text-muted">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
