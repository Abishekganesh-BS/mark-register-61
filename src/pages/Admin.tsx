
import { useState } from "react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DepartmentList } from "@/components/DepartmentList";
import { DatabasePanel } from "@/components/DatabasePanel";
import { UsersPanel } from "@/components/UsersPanel";
import { toast } from "sonner";

const Admin = () => {
  const [newDepartmentName, setNewDepartmentName] = useState("");
  const [newDepartmentCode, setNewDepartmentCode] = useState("");
  const [isAddingDepartment, setIsAddingDepartment] = useState(false);
  
  const handleAddDepartment = () => {
    if (!newDepartmentName || !newDepartmentCode) {
      toast.error("Department name and code are required");
      return;
    }
    
    // In a real application, this would save to a database
    console.log("Adding department:", { name: newDepartmentName, code: newDepartmentCode });
    toast.success(`Department "${newDepartmentName}" added successfully`);
    
    // Reset form
    setNewDepartmentName("");
    setNewDepartmentCode("");
    setIsAddingDepartment(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
        
        <Tabs defaultValue="departments" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="departments">Departments</TabsTrigger>
            <TabsTrigger value="database">Database</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
          </TabsList>
          
          <TabsContent value="departments" className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Department Management</h2>
              <Dialog open={isAddingDepartment} onOpenChange={setIsAddingDepartment}>
                <DialogTrigger asChild>
                  <Button>Add New Department</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Department</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="dept-name">Department Name</Label>
                      <Input 
                        id="dept-name" 
                        value={newDepartmentName} 
                        onChange={(e) => setNewDepartmentName(e.target.value)}
                        placeholder="e.g. Computer Science"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dept-code">Department Code</Label>
                      <Input 
                        id="dept-code" 
                        value={newDepartmentCode} 
                        onChange={(e) => setNewDepartmentCode(e.target.value)}
                        placeholder="e.g. CS"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dept-type">Department Type</Label>
                      <select 
                        id="dept-type"
                        className="w-full px-3 py-2 border rounded-md"
                        defaultValue="ug"
                      >
                        <option value="ug">Undergraduate (8 Semesters)</option>
                        <option value="pg">Postgraduate (4 Semesters)</option>
                        <option value="mtech">M.Tech (10 Semesters)</option>
                      </select>
                    </div>
                    <Button onClick={handleAddDepartment} className="w-full">Create Department</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            
            <DepartmentList />
          </TabsContent>
          
          <TabsContent value="database" className="space-y-4">
            <DatabasePanel />
          </TabsContent>
          
          <TabsContent value="users" className="space-y-4">
            <UsersPanel />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Admin;
