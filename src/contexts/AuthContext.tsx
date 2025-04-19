import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";

// Define user roles
export type UserRole = "user" | "admin" | "hod";

// User interface for storing authenticated user data
interface User {
  username: string;
  role: UserRole;
}

// Authentication context interface
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

// Create the auth context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  login: () => false,
  logout: () => {},
});

// Auth provider props interface
interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Authentication Provider Component
 * Manages the authentication state for the application
 */
export const AuthProvider = ({ children }: AuthProviderProps) => {
  // State for the current user
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  // Check for existing session in localStorage on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem("markRegisterUser");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        // If there's an error parsing, clear the stored user
        localStorage.removeItem("markRegisterUser");
      }
    }
  }, []);

  /**
   * Login function
   * Authenticates a user with username and password
   * In a real application, this would call an API to validate credentials
   */
  const login = (username: string, password: string): boolean => {
    // Check credentials (hardcoded for demo purposes)
    // In a real app, you would validate against a backend service
    if (username === "admin" && password === "admin") {
      const adminUser: User = { username: "admin", role: "admin" };
      setUser(adminUser);
      localStorage.setItem("markRegisterUser", JSON.stringify(adminUser));
      return true;
    } else if (username === "user" && password === "user") {
      const regularUser: User = { username: "user", role: "user" };
      setUser(regularUser);
      localStorage.setItem("markRegisterUser", JSON.stringify(regularUser));
      return true;
    } else if (username === "hod" && password === "hod") {
      const hodUser: User = { username: "hod", role: "hod" };
      setUser(hodUser);
      localStorage.setItem("markRegisterUser", JSON.stringify(hodUser));
      return true;
    }
    
    return false;
  };

  /**
   * Logout function
   * Clears the authenticated user and redirects to login page
   */
  const logout = () => {
    setUser(null);
    localStorage.removeItem("markRegisterUser");
    navigate("/login");
  };

  // Value provided by the context
  const value = {
    user,
    isAuthenticated: !!user,
    login,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Custom hook for using the auth context
 * Provides access to authentication state and functions
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
