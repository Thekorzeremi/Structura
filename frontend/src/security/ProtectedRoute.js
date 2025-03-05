import { Navigate } from 'react-router-dom';
import { useAuth } from '../security/AuthContext';

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user } = useAuth();

  if (!user || !user.isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const hasRequiredRole = allowedRoles.some((role) => user.roles.includes(role));

  if (!hasRequiredRole) {
    return <Navigate to="/" replace />;
  }

  return children;
}
