import React from 'react';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ user, requiredRole, children }) {
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return (
      <div style={{ padding: '3rem', textAlign: 'center' }}>
        <h2 style={{ color: 'var(--accent-danger)' }}>Access Denied</h2>
        <p style={{ color: 'var(--text-muted)', marginTop: '1rem' }}>
          Your role ({user.role}) does not have permission to access Admin CRUD pages.
        </p>
      </div>
    );
  }

  return children;
}
