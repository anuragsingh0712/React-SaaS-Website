import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../auth/auth';

interface RequireAuthProps {
  children: React.ReactNode;
}

export function RequireAuth({ children }: RequireAuthProps): React.ReactElement {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}
