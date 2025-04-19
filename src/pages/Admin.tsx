
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Header } from "@/components/Header";
import { UsersPanel } from "@/components/UsersPanel";
import { DatabasePanel } from "@/components/DatabasePanel";
import { StaffAssignment } from "@/components/StaffAssignment";
import { DepartmentList } from "@/components/DepartmentList";

const Admin = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto py-6 px-4">
        <h1 className="text-3xl font-bold mb-6">Admin Panel</h1>
        
        <Tabs defaultValue="users">
          <TabsList className="w-full justify-start border-b mb-8">
            <TabsTrigger value="users" className="text-lg py-2 px-4">Users</TabsTrigger>
            <TabsTrigger value="departments" className="text-lg py-2 px-4">Departments</TabsTrigger>
            <TabsTrigger value="assignments" className="text-lg py-2 px-4">Staff Assignments</TabsTrigger>
            <TabsTrigger value="database" className="text-lg py-2 px-4">Database</TabsTrigger>
          </TabsList>
          
          <TabsContent value="users" className="mt-4">
            <UsersPanel />
          </TabsContent>
          
          <TabsContent value="departments" className="mt-4">
            <DepartmentList />
          </TabsContent>
          
          <TabsContent value="assignments" className="mt-4">
            <StaffAssignment />
          </TabsContent>
          
          <TabsContent value="database" className="mt-4">
            <DatabasePanel />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Admin;
