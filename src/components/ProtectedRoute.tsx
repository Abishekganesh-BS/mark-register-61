import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

/**
 * ProtectedRoute Component
 * 
 * Protects routes by checking if the user is authenticated
 * If not authenticated, redirects to the login page
 * If authenticated but accessing admin routes without admin role, redirects to dashboard
 * 
 * @returns JSX Element - Either the protected route content or a redirect
 */
const ProtectedRoute = () => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();
  
  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // If trying to access admin page without admin role, redirect to dashboard
  if (location.pathname === "/admin" && user?.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }
  
  // Otherwise, render the protected content
  return <Outlet />;
};

export default ProtectedRoute;
