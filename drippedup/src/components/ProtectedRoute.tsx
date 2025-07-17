import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import AuthForm from '../components/AuthForm';
import LoadingSpinner from '../components/loadingSpinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  loadingComponent?: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  fallback,
  loadingComponent 
}) => {
  const { user, loading } = useAuth();

  // Show loading spinner while checking auth status
  if (loading) {
    return (
      loadingComponent || (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          backgroundColor: '#f8fafc'
        }}>
          <LoadingSpinner />
        </div>
      )
    );
  }

  // Show auth form if not authenticated
  if (!user) {
    return fallback || <AuthForm />;
  }

  // User is authenticated, show protected content
  return <>{children}</>;
};

export default ProtectedRoute;