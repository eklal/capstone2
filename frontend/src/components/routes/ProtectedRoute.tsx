import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

interface ProtectedRouteProps {
  children: React.ReactElement;
  requiredRole?: "trainer" | "client";
}

/**
 * ProtectedRoute - Redirects to login if user is not authenticated
 * Optionally checks for specific user roles
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole 
}) => {
  const { isLoggedIn, user } = useAuth();
  const location = useLocation();

  // Also check localStorage as fallback
  const storedUserStr = localStorage.getItem("user");
  const storedUser = storedUserStr ? JSON.parse(storedUserStr) : null;
  const currentUser = user || storedUser;

  if (!isLoggedIn) {
    // Redirect to login, but save the attempted location
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role if required
  if (requiredRole && currentUser?.role !== requiredRole) {
    // Redirect to home if user doesn't have the required role
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
