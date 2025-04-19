
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // If already authenticated, redirect to the appropriate page
  if (isAuthenticated) {
    const { user } = useAuth();
    if (user?.role === "admin") {
      navigate("/admin");
    } else {
      navigate("/dashboard");
    }
  }

  /**
   * Handle the login form submission
   * @param e Form submit event
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Validate inputs
    if (!username || !password) {
      toast.error("Please enter both username and password");
      setIsLoading(false);
      return;
    }

    // Attempt login
    setTimeout(() => {
      const success = login(username, password);
      if (success) {
        // Show success message
        toast.success("Login successful");
        
        // Redirect based on user role
        if (username === "admin") {
          navigate("/admin");
        } else {
          navigate("/dashboard");
        }
      } else {
        toast.error("Invalid username or password");
      }
      setIsLoading(false);
    }, 1000); // Simulate a network request
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Mark Register</CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to login
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input 
                id="username"
                placeholder="Enter username" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password"
                type="password" 
                placeholder="Enter password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </div>
            <div className="text-sm text-blue-600 hover:underline cursor-pointer">
              Forgot password?
            </div>

            {/* Helpful login information */}
            <div className="bg-gray-100 p-3 rounded-md border border-gray-200">
              <p className="text-sm font-semibold mb-1">Test Credentials:</p>
              <p className="text-xs">Admin: username = "admin", password = "admin"</p>
              <p className="text-xs">User: username = "user", password = "user"</p>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading || !username || !password}
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Login;
