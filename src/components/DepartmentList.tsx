
import { useState, useEffect } from "react";
import { 
  Card, 
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Pencil, Trash2, FileText, Users, Database } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

// Department types for edit dialog
const departmentTypes = [
  { id: "ug", name: "Undergraduate (8 Semesters)" },
  { id: "pg", name: "Postgraduate (4 Semesters)" },
  { id: "mtech", name: "M.Tech (10 Semesters)" },
];

// Department interface
interface Department {
  id: number;
  name: string;
  code: string;
  type: string;
  students: number;
  subjects: number;
}

// Mocked department data - in a real app this would come from the database
const mockDepartments: Department[] = [
  { id: 1, name: "Computer Science", code: "CS", type: "ug", students: 120, subjects: 42 },
  { id: 2, name: "Mechanical Engineering", code: "ME", type: "ug", students: 150, subjects: 38 },
  { id: 3, name: "Electrical Engineering", code: "EE", type: "ug", students: 135, subjects: 40 },
  { id: 4, name: "Civil Engineering", code: "CE", type: "ug", students: 110, subjects: 36 },
  { id: 5, name: "M.Tech Computer Science", code: "MCS", type: "mtech", students: 45, subjects: 20 },
];

export const DepartmentList = () => {
  const [departments, setDepartments] = useState(mockDepartments);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  // Listen for department added events
  useEffect(() => {
    const handleDepartmentAdded = (event: CustomEvent<Department>) => {
      setDepartments(prev => [...prev, event.detail]);
    };
    
    document.addEventListener("departmentAdded", handleDepartmentAdded as EventListener);
    
    return () => {
      document.removeEventListener("departmentAdded", handleDepartmentAdded as EventListener);
    };
  }, []);

  const handleEditDepartment = (dept: Department) => {
    setEditingDepartment(dept);
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    if (editingDepartment) {
      setDepartments(departments.map(d => 
        d.id === editingDepartment.id ? { ...d, ...editingDepartment } : d
      ));
      toast.success(`Department "${editingDepartment.name}" updated successfully`);
      setIsEditDialogOpen(false);
      setEditingDepartment(null);
    }
  };

  const handleDeleteDepartment = (id: number, name: string) => {
    if (confirm(`Are you sure you want to delete department "${name}"? This cannot be undone.`)) {
      setDepartments(departments.filter(d => d.id !== id));
      toast.success(`Department "${name}" deleted successfully`);
    }
  };

  const handleViewStudentDatabase = (dept: Department) => {
    // This would typically navigate to a student database view or open a modal
    toast.info(`Viewing student database for ${dept.name}`);
    console.log("Viewing student database for department:", dept);
  };

  const handleManageSubjects = (dept: Department) => {
    // This would typically navigate to a subject management view or open a modal
    toast.info(`Managing subjects for ${dept.name}`);
    console.log("Managing subjects for department:", dept);
  };

  const getDepartmentTypeLabel = (type: string) => {
    switch (type) {
      case "ug": return "Undergraduate (8 Semesters)";
      case "pg": return "Postgraduate (4 Semesters)";
      case "mtech": return "M.Tech (10 Semesters)";
      default: return "Unknown";
    }
  };

  return (
    <div className="space-y-4">
      {departments.map((dept) => (
        <Card key={dept.id} className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-xl">{dept.name}</CardTitle>
                <CardDescription>Code: {dept.code} | Type: {getDepartmentTypeLabel(dept.type)}</CardDescription>
              </div>
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleEditDepartment(dept)}
                >
                  <Pencil className="h-4 w-4 mr-1" /> Edit
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => handleDeleteDepartment(dept.id, dept.name)}
                >
                  <Trash2 className="h-4 w-4 mr-1" /> Delete
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center">
                <Users className="h-5 w-5 mr-2 text-gray-500" />
                <span>{dept.students} Students</span>
              </div>
              <div className="flex items-center">
                <FileText className="h-5 w-5 mr-2 text-gray-500" />
                <span>{dept.subjects} Subjects</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="pt-2">
            <div className="flex space-x-2 w-full">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => handleViewStudentDatabase(dept)}
              >
                <Database className="h-4 w-4 mr-2" /> View Student Database
              </Button>
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => handleManageSubjects(dept)}
              >
                <FileText className="h-4 w-4 mr-2" /> Manage Subjects
              </Button>
            </div>
          </CardFooter>
        </Card>
      ))}

      {departments.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>No departments found. Add your first department to get started.</p>
        </div>
      )}

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Department</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-dept-name">Department Name</Label>
              <Input 
                id="edit-dept-name" 
                value={editingDepartment?.name || ""} 
                onChange={(e) => editingDepartment && setEditingDepartment({...editingDepartment, name: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-dept-code">Department Code</Label>
              <Input 
                id="edit-dept-code" 
                value={editingDepartment?.code || ""} 
                onChange={(e) => editingDepartment && setEditingDepartment({...editingDepartment, code: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-dept-type">Department Type</Label>
              <Select 
                value={editingDepartment?.type || ""}
                onValueChange={(value) => editingDepartment && setEditingDepartment({...editingDepartment, type: value})}
              >
                <SelectTrigger id="edit-dept-type">
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
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
