
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="bg-white border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">ExaMatrix Registrar</h1>
          <nav className="space-x-4">
            <Button variant="outline" onClick={() => navigate("/")}>
              Dashboard
            </Button>
            <Button variant="outline" onClick={() => navigate("/admin")}>
              Admin Panel
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
};
