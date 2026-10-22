import React from 'react';
import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';

export function NotFound(): React.ReactElement {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-canvas dark:bg-night px-4 text-center">
      <div className="rounded-pill bg-primary-50 p-4 text-primary">
        <Compass className="h-8 w-8" />
      </div>
      <h1 className="text-3xl font-bold">404</h1>
      <p className="text-muted">We couldn't find the page you were looking for.</p>
      <Link to="/" className="rounded-card bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90">
        Go Home
      </Link>
    </div>
  );
}
