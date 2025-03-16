
import { Header } from "@/components/Header";
import { DashboardCard } from "@/components/DashboardCard";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 flex items-center justify-center h-[calc(100vh-64px)]">
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <DashboardCard
            title="Question Pattern Creation"
            description="Create and manage question patterns with Course Outcomes mapping"
            route="/create-pattern"
          />
          <DashboardCard
            title="Mark Entry System"
            description="Enter marks using anonymous student identifiers"
            route="/mark-entry"
          />
        </div>
      </main>
    </div>
  );
};

export default Index;
