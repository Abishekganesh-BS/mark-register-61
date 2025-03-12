
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface DashboardCardProps {
  title: string;
  description: string;
  route: string;
}

export const DashboardCard = ({ title, description, route }: DashboardCardProps) => {
  const navigate = useNavigate();

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 mb-4">{description}</p>
        <Button onClick={() => navigate(route)} className="w-full">
          Access
        </Button>
      </CardContent>
    </Card>
  );
};
