
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle";

export const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="bg-background border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">ExaMatrix Registrar</h1>
          <div className="flex items-center space-x-4">
            <nav className="space-x-3">
              <Button variant="outline" onClick={() => navigate("/")}>
                Dashboard
              </Button>
              <Button variant="outline" onClick={() => navigate("/admin")}>
                Admin Panel
              </Button>
              <Button variant="outline" onClick={() => navigate("/login")}>
                Login
              </Button>
            </nav>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
};
