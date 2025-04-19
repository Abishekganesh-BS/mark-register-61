
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut, User, LayoutDashboard, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="bg-background border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">Mark Register</h1>
          
          <div className="flex items-center space-x-4">
            {user?.role === "admin" && (
              <div className="flex items-center space-x-2 mr-4">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => navigate('/dashboard')}
                >
                  <LayoutDashboard className="h-4 w-4 mr-2" />
                  Dashboard
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => navigate('/admin')}
                >
                  <Shield className="h-4 w-4 mr-2" />
                  Admin Panel
                </Button>
              </div>
            )}
            {user && (
              <div className="flex items-center space-x-2">
                <div className="flex items-center rounded-full bg-gray-100 dark:bg-gray-800 px-3 py-1">
                  <User className="h-4 w-4 mr-2 text-gray-500" />
                  <span className="text-sm font-medium">{user.username}</span>
                  <span className="ml-2 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-0.5 rounded-full">
                    {user.role}
                  </span>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={logout} 
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            )}
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
};
