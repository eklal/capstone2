import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

interface PublicRouteProps {
  children: React.ReactElement;
}

/**
 * PublicRoute - Redirects to dashboard if user is already logged in
 * Used for login/register pages
 */
const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const { isLoggedIn } = useAuth();

  if (isLoggedIn) {
    // Redirect to dashboard if already logged in
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PublicRoute;
