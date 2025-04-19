
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DepartmentList } from "@/components/DepartmentList";
import { DatabasePanel } from "@/components/DatabasePanel";
import { UsersPanel } from "@/components/UsersPanel";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

// Mock dept types for type selection
const departmentTypes = [
  { id: "ug", name: "Undergraduate (8 Semesters)" },
  { id: "pg", name: "Postgraduate (4 Semesters)" },
  { id: "mtech", name: "M.Tech (10 Semesters)" },
];

const Admin = () => {
  // Get current authenticated user
  const { user } = useAuth();
  
  const [newDepartmentName, setNewDepartmentName] = useState("");
  const [newDepartmentCode, setNewDepartmentCode] = useState("");
  const [newDepartmentType, setNewDepartmentType] = useState("ug");
  const [isAddingDepartment, setIsAddingDepartment] = useState(false);
  
  /**
   * Handles adding a new department
   * In a real app, this would save to a database
   */
  const handleAddDepartment = () => {
    if (!newDepartmentName || !newDepartmentCode) {
      toast.error("Department name and code are required");
      return;
    }
    
    // In a real application, this would save to a database
    console.log("Adding department:", { 
      name: newDepartmentName, 
      code: newDepartmentCode,
      type: newDepartmentType
    });
    
    // Dispatch an event to update the DepartmentList component
    const event = new CustomEvent("departmentAdded", {
      detail: {
        id: Date.now(),
        name: newDepartmentName,
        code: newDepartmentCode,
        type: newDepartmentType,
        students: 0,
        subjects: 0
      }
    });
    document.dispatchEvent(event);
    
    toast.success(`Department "${newDepartmentName}" added successfully`);
    
    // Reset form
    setNewDepartmentName("");
    setNewDepartmentCode("");
    setNewDepartmentType("ug");
    setIsAddingDepartment(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <div className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-4 py-2 rounded-md">
            Logged in as: <span className="font-bold">{user?.username}</span>
          </div>
        </div>
        
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
                      <Select 
                        value={newDepartmentType}
                        onValueChange={setNewDepartmentType}
                      >
                        <SelectTrigger id="dept-type">
                          <SelectValue placeholder="Select Department Type" />
                        </SelectTrigger>
                        <SelectContent>
                          {departmentTypes.map((type) => (
                            <SelectItem key={type.id} value={type.id}>
                              {type.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsAddingDepartment(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddDepartment}>
                      Add Department
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            
            <DepartmentList />
          </TabsContent>
          
          <TabsContent value="database">
            <DatabasePanel />
          </TabsContent>
          
          <TabsContent value="users">
            <UsersPanel />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Admin;
