
import { Header } from "@/components/Header";
import { DashboardCard } from "@/components/DashboardCard";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  // Get current authenticated user
  const { user, profile } = useAuth();
  const isAdminOrHOD = profile?.role === "admin" || profile?.role === "hod";
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <div className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-4 py-2 rounded-md">
            Logged in as: <span className="font-bold">{profile?.username || user?.email}</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          <DashboardCard
            title="Mark Entry"
            description="Enter marks for students per subject and generate reports"
            route="/mark-entry"
          />
          
          {isAdminOrHOD && (
            <DashboardCard
              title="Create Question Pattern"
              description="Create and manage question patterns for departments"
              route="/create-pattern"
            />
          )}
          
          {profile?.role === "admin" && (
            <DashboardCard
              title="Admin Panel"
              description="Manage departments, users, and database operations"
              route="/admin"
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default Index;
