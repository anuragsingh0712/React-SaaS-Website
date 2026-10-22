import React from 'react';

interface FormFieldProps {
  label: string;
  htmlFor: string;
  helperText?: string;
  error?: string;
  children: React.ReactNode;
}

export function FormField({ label, htmlFor, helperText, error, children }: FormFieldProps): React.ReactElement {
  return (
    <div>
      <label htmlFor={htmlFor} className="block text-sm font-medium mb-1.5">
        {label}
      </label>
      {children}
      {error ? (
        <p className="mt-1.5 text-xs font-medium text-danger-dark">{error}</p>
      ) : helperText ? (
        <p className="mt-1.5 text-xs text-muted">{helperText}</p>
      ) : null}
    </div>
  );
}

export const inputClassName =
  'w-full rounded-card border border-border-default dark:border-border-dark bg-surface dark:bg-surface-dark px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary-100';
