
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
import { Textarea } from "@/components/ui/textarea";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Pencil, Trash2, FileText, Users, Database, Plus, Download, X } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow 
} from "@/components/ui/table";

// Department types for edit dialog
const departmentTypes = [
  { id: "ug", name: "Undergraduate (8 Semesters)" },
  { id: "pg", name: "Postgraduate (4 Semesters)" },
  { id: "mtech", name: "M.Tech (10 Semesters)" },
];

// Department interface - defines the structure of a department
interface Department {
  id: number;
  name: string;
  code: string;
  type: string;
  students: number;
  subjects: number;
}

// Student interface - defines the structure of a student record
interface Student {
  id: string;
  name: string;
  semester: number;
  email: string;
  phone?: string;
}

// Subject interface - defines the structure of a subject
interface Subject {
  id: number;
  code: string;
  name: string;
  semester: number;
  credits: number;
  description?: string;
}

// Function to generate mock student data for a department
// In a real application, this would come from a database
const generateStudents = (dept: Department): Student[] => {
  const students: Student[] = [];
  const totalStudents = dept.students || 20;
  
  for (let i = 1; i <= totalStudents; i++) {
    const year = Math.ceil(Math.random() * 4);
    const sem = year * 2 - (Math.random() > 0.5 ? 1 : 0);
    students.push({
      id: `${dept.code}${new Date().getFullYear().toString().slice(-2)}${i.toString().padStart(3, '0')}`,
      name: `Student ${i}`,
      semester: sem,
      email: `student${i}@university.edu`,
      phone: Math.random() > 0.3 ? `+91 ${Math.floor(Math.random() * 10000000000).toString().padStart(10, '0')}` : undefined
    });
  }
  
  return students;
};

// Function to generate mock subject data for a department
// In a real application, this would come from a database
const generateSubjects = (dept: Department): Subject[] => {
  const subjects: Subject[] = [];
  const totalSubjects = dept.subjects || 10;
  
  for (let i = 1; i <= totalSubjects; i++) {
    const semester = Math.ceil(Math.random() * 8);
    subjects.push({
      id: i,
      code: `${dept.code}${semester}${i.toString().padStart(2, '0')}`,
      name: `Subject ${i} for ${dept.name}`,
      semester: semester,
      credits: Math.floor(Math.random() * 3) + 2,
      description: Math.random() > 0.5 ? `Description for subject ${i}` : undefined
    });
  }
  
  return subjects;
};

// Empty departments array (previously had mock data)
// In a real application, you would fetch this from your database
const mockDepartments: Department[] = [];

export const DepartmentList = () => {
  // State for departments - initialized with empty array
  const [departments, setDepartments] = useState(mockDepartments);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  // States for student database view
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [isStudentDatabaseOpen, setIsStudentDatabaseOpen] = useState(false);
  const [studentFilter, setStudentFilter] = useState("");
  
  // States for subject management
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isSubjectsDialogOpen, setIsSubjectsDialogOpen] = useState(false);
  const [newSubject, setNewSubject] = useState<Partial<Subject>>({
    semester: 1,
    credits: 3
  });
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [isAddSubjectDialogOpen, setIsAddSubjectDialogOpen] = useState(false);
  const [isEditSubjectDialogOpen, setIsEditSubjectDialogOpen] = useState(false);
  
  // Listen for department added events
  // This allows other components to add departments without props drilling
  useEffect(() => {
    const handleDepartmentAdded = (event: CustomEvent<Department>) => {
      setDepartments(prev => [...prev, event.detail]);
    };
    
    document.addEventListener("departmentAdded", handleDepartmentAdded as EventListener);
    
    return () => {
      document.removeEventListener("departmentAdded", handleDepartmentAdded as EventListener);
    };
  }, []);

  // Function to handle department edit
  const handleEditDepartment = (dept: Department) => {
    setEditingDepartment(dept);
    setIsEditDialogOpen(true);
  };

  // Function to save department edit
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

  // Function to delete a department
  const handleDeleteDepartment = (id: number, name: string) => {
    if (confirm(`Are you sure you want to delete department "${name}"? This cannot be undone.`)) {
      setDepartments(departments.filter(d => d.id !== id));
      toast.success(`Department "${name}" deleted successfully`);
    }
  };

  // Function to view student database for a department
  const handleViewStudentDatabase = (dept: Department) => {
    setSelectedDepartment(dept);
    const generatedStudents = generateStudents(dept);
    setStudents(generatedStudents);
    setIsStudentDatabaseOpen(true);
  };

  // Function to manage subjects for a department
  const handleManageSubjects = (dept: Department) => {
    setSelectedDepartment(dept);
    const generatedSubjects = generateSubjects(dept);
    setSubjects(generatedSubjects);
    setIsSubjectsDialogOpen(true);
  };

  // Function to add a new subject
  const handleAddSubject = () => {
    if (!newSubject.code || !newSubject.name) {
      toast.error("Subject code and name are required");
      return;
    }

    const newSubjectWithId: Subject = {
      id: Date.now(),
      code: newSubject.code || "",
      name: newSubject.name || "",
      semester: newSubject.semester || 1,
      credits: newSubject.credits || 3,
      description: newSubject.description
    };

    setSubjects([...subjects, newSubjectWithId]);
    
    // Update department subjects count
    if (selectedDepartment) {
      const updatedDept = { ...selectedDepartment, subjects: (selectedDepartment.subjects || 0) + 1 };
      setSelectedDepartment(updatedDept);
      setDepartments(departments.map(d => 
        d.id === updatedDept.id ? updatedDept : d
      ));
    }

    toast.success(`Subject "${newSubject.name}" added successfully`);
    setNewSubject({
      semester: 1,
      credits: 3
    });
    setIsAddSubjectDialogOpen(false);
  };

  // Function to edit a subject
  const handleEditSubject = (subject: Subject) => {
    setEditingSubject(subject);
    setIsEditSubjectDialogOpen(true);
  };

  // Function to save subject edit
  const handleSaveSubjectEdit = () => {
    if (editingSubject) {
      setSubjects(subjects.map(s => 
        s.id === editingSubject.id ? editingSubject : s
      ));
      toast.success(`Subject "${editingSubject.name}" updated successfully`);
      setIsEditSubjectDialogOpen(false);
      setEditingSubject(null);
    }
  };

  // Function to delete a subject
  const handleDeleteSubject = (id: number, name: string) => {
    if (confirm(`Are you sure you want to delete subject "${name}"? This cannot be undone.`)) {
      setSubjects(subjects.filter(s => s.id !== id));
      
      // Update department subjects count
      if (selectedDepartment) {
        const updatedDept = { ...selectedDepartment, subjects: Math.max(0, (selectedDepartment.subjects || 0) - 1) };
        setSelectedDepartment(updatedDept);
        setDepartments(departments.map(d => 
          d.id === updatedDept.id ? updatedDept : d
        ));
      }
      
      toast.success(`Subject "${name}" deleted successfully`);
    }
  };

  // Function to export students to CSV
  const exportStudentsToCSV = () => {
    if (!students.length) return;
    
    const headers = ["ID", "Name", "Semester", "Email", "Phone"];
    const rows = students.map(student => 
      [student.id, student.name, student.semester.toString(), student.email, student.phone || ""]
    );
    
    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.join(","))
    ].join("\n");
    
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${selectedDepartment?.code}_students.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success(`Exported ${students.length} students to CSV`);
  };

  // Function to export subjects to CSV
  const exportSubjectsToCSV = () => {
    if (!subjects.length) return;
    
    const headers = ["Code", "Name", "Semester", "Credits", "Description"];
    const rows = subjects.map(subject => 
      [subject.code, subject.name, subject.semester.toString(), subject.credits.toString(), subject.description || ""]
    );
    
    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.join(","))
    ].join("\n");
    
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${selectedDepartment?.code}_subjects.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success(`Exported ${subjects.length} subjects to CSV`);
  };

  // Filter students based on search input
  const filteredStudents = studentFilter 
    ? students.filter(s => 
        s.id.toLowerCase().includes(studentFilter.toLowerCase()) || 
        s.name.toLowerCase().includes(studentFilter.toLowerCase()) ||
        s.email.toLowerCase().includes(studentFilter.toLowerCase())
      )
    : students;

  // Helper function to get department type label
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

      {/* Edit Department Dialog */}
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

      {/* Student Database Dialog */}
      <Dialog open={isStudentDatabaseOpen} onOpenChange={setIsStudentDatabaseOpen}>
        <DialogContent className="max-w-5xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Student Database - {selectedDepartment?.name} ({selectedDepartment?.code})
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex justify-between items-center gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search by ID, name or email..."
                  value={studentFilter}
                  onChange={(e) => setStudentFilter(e.target.value)}
                />
              </div>
              <Button onClick={exportStudentsToCSV} className="gap-2">
                <Download className="h-4 w-4" /> Export CSV
              </Button>
            </div>
            
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Semester</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.length > 0 ? (
                    filteredStudents.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell className="font-medium">{student.id}</TableCell>
                        <TableCell>{student.name}</TableCell>
                        <TableCell>{student.semester}</TableCell>
                        <TableCell>{student.email}</TableCell>
                        <TableCell>{student.phone || "-"}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center">
                        No students found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Manage Subjects Dialog */}
      <Dialog open={isSubjectsDialogOpen} onOpenChange={setIsSubjectsDialogOpen}>
        <DialogContent className="max-w-5xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Subject Management - {selectedDepartment?.name} ({selectedDepartment?.code})
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex justify-between items-center gap-4">
              <Button onClick={() => setIsAddSubjectDialogOpen(true)} className="gap-2">
                <Plus className="h-4 w-4" /> Add Subject
              </Button>
              <Button onClick={exportSubjectsToCSV} className="gap-2">
                <Download className="h-4 w-4" /> Export CSV
              </Button>
            </div>
            
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Semester</TableHead>
                    <TableHead>Credits</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subjects.length > 0 ? (
                    subjects.map((subject) => (
                      <TableRow key={subject.id}>
                        <TableCell className="font-medium">{subject.code}</TableCell>
                        <TableCell>{subject.name}</TableCell>
                        <TableCell>{subject.semester}</TableCell>
                        <TableCell>{subject.credits}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm" onClick={() => handleEditSubject(subject)}>
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-destructive hover:text-destructive"
                              onClick={() => handleDeleteSubject(subject.id, subject.name)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center">
                        No subjects found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Subject Dialog */}
      <Dialog open={isAddSubjectDialogOpen} onOpenChange={setIsAddSubjectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Subject</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="subject-code">Subject Code</Label>
              <Input 
                id="subject-code" 
                value={newSubject.code || ''} 
                onChange={(e) => setNewSubject({...newSubject, code: e.target.value})}
                placeholder="e.g. CS101"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subject-name">Subject Name</Label>
              <Input 
                id="subject-name" 
                value={newSubject.name || ''} 
                onChange={(e) => setNewSubject({...newSubject, name: e.target.value})}
                placeholder="e.g. Introduction to Computer Science"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subject-semester">Semester</Label>
              <Select 
                value={newSubject.semester?.toString() || '1'}
                onValueChange={(value) => setNewSubject({...newSubject, semester: parseInt(value)})}
              >
                <SelectTrigger id="subject-semester">
                  <SelectValue placeholder="Select Semester" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 8 }, (_, i) => (
                    <SelectItem key={i + 1} value={(i + 1).toString()}>
                      Semester {i + 1}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="subject-credits">Credits</Label>
              <Select 
                value={newSubject.credits?.toString() || '3'}
                onValueChange={(value) => setNewSubject({...newSubject, credits: parseInt(value)})}
              >
                <SelectTrigger id="subject-credits">
                  <SelectValue placeholder="Select Credits" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5].map((credit) => (
                    <SelectItem key={credit} value={credit.toString()}>
                      {credit} {credit === 1 ? 'Credit' : 'Credits'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="subject-description">Description (Optional)</Label>
              <Textarea 
                id="subject-description" 
                value={newSubject.description || ''} 
                onChange={(e) => setNewSubject({...newSubject, description: e.target.value})}
                placeholder="Enter subject description..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddSubjectDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddSubject}>Add Subject</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Subject Dialog */}
      <Dialog open={isEditSubjectDialogOpen} onOpenChange={setIsEditSubjectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Subject</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-subject-code">Subject Code</Label>
              <Input 
                id="edit-subject-code" 
                value={editingSubject?.code || ''} 
                onChange={(e) => editingSubject && setEditingSubject({...editingSubject, code: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-subject-name">Subject Name</Label>
              <Input 
                id="edit-subject-name" 
                value={editingSubject?.name || ''} 
                onChange={(e) => editingSubject && setEditingSubject({...editingSubject, name: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-subject-semester">Semester</Label>
              <Select 
                value={editingSubject?.semester?.toString() || '1'}
                onValueChange={(value) => editingSubject && setEditingSubject({...editingSubject, semester: parseInt(value)})}
              >
                <SelectTrigger id="edit-subject-semester">
                  <SelectValue placeholder="Select Semester" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 8 }, (_, i) => (
                    <SelectItem key={i + 1} value={(i + 1).toString()}>
                      Semester {i + 1}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-subject-credits">Credits</Label>
              <Select 
                value={editingSubject?.credits?.toString() || '3'}
                onValueChange={(value) => editingSubject && setEditingSubject({...editingSubject, credits: parseInt(value)})}
              >
                <SelectTrigger id="edit-subject-credits">
                  <SelectValue placeholder="Select Credits" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5].map((credit) => (
                    <SelectItem key={credit} value={credit.toString()}>
                      {credit} {credit === 1 ? 'Credit' : 'Credits'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-subject-description">Description (Optional)</Label>
              <Textarea 
                id="edit-subject-description" 
                value={editingSubject?.description || ''} 
                onChange={(e) => editingSubject && setEditingSubject({...editingSubject, description: e.target.value})}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditSubjectDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveSubjectEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
