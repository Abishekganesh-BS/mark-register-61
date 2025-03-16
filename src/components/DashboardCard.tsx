
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
    <Card className="hover:shadow-lg transition-shadow h-[280px] flex flex-col justify-between">
      <CardHeader className="pb-2">
        <CardTitle className="text-2xl">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col h-full justify-between">
        <p className="text-gray-600 mb-6 text-lg">{description}</p>
        <Button onClick={() => navigate(route)} className="w-full py-6 text-lg">
          Access
        </Button>
      </CardContent>
    </Card>
  );
};
