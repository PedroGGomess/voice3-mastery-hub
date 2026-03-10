import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: 'student' | 'company_admin' | 'professor' | 'admin';
}

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading, currentUser } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return null; // Wait for auth to load before deciding
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole && currentUser?.role !== requiredRole) {
    if (currentUser?.role === 'company_admin') {
      return <Navigate to="/empresa/dashboard" replace />;
    }
    if (currentUser?.role === 'professor' || currentUser?.role === 'admin') {
      // Avoid infinite loop: if already targeting professor/dashboard routes, go to /app fallback
      if (location.pathname.startsWith('/professor')) {
        return <Navigate to="/app" replace />;
      }
      return <Navigate to="/professor/dashboard" replace />;
    }
    return <Navigate to="/app" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
