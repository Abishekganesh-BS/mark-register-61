
import { useState } from "react";
import { Header } from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    
    setIsLoading(true);
    
    // TODO: Implement proper user registration with a database
    // Recommended: Set up a Supabase project and use their Auth service
    // 1. Create a users table with username and password fields
    // 2. Add Row Level Security (RLS) policies
    // 3. Use Supabase Auth methods for secure registration
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Registration successful");
      navigate("/login");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 flex items-center justify-center h-[calc(100vh-64px)]">
        <Card className="w-full max-w-md dark:border-border">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Create Account</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input 
                  id="username" 
                  type="text" 
                  placeholder="Choose a username" 
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password" 
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input 
                  id="confirmPassword" 
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              <Button 
                type="submit" 
                className="w-full py-6 text-lg"
                disabled={isLoading}
              >
                {isLoading ? "Creating Account..." : "Register"}
              </Button>
            </form>
            <div className="mt-4 text-center text-sm">
              <p>
                Already have an account?{" "}
                <Button variant="link" className="p-0" onClick={() => navigate("/login")}>
                  Login
                </Button>
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Register;
