
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
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Pencil, Save, Users } from "lucide-react";

// Mock departments data
const mockDepartments = [
  { id: "CS", name: "Computer Science" },
  { id: "ME", name: "Mechanical Engineering" },
  { id: "EE", name: "Electrical Engineering" },
  { id: "CE", name: "Civil Engineering" },
];

// Mock subjects data by department
const mockSubjects = {
  CS: [
    { id: "CS101", code: "CS101", name: "Introduction to Programming" },
    { id: "CS201", code: "CS201", name: "Data Structures" },
    { id: "CS301", code: "CS301", name: "Algorithms" },
  ],
  ME: [
    { id: "ME101", code: "ME101", name: "Engineering Mechanics" },
    { id: "ME201", code: "ME201", name: "Thermodynamics" },
  ],
  EE: [
    { id: "EE101", code: "EE101", name: "Circuit Theory" },
    { id: "EE201", code: "EE201", name: "Electrical Machines" },
  ],
  CE: [
    { id: "CE101", code: "CE101", name: "Structural Analysis" },
    { id: "CE201", code: "CE201", name: "Environmental Engineering" },
  ],
};

// Mock staff members (this would come from UsersPanel in a real app)
const mockStaffMembers = [
  { id: 1, name: "John Doe", email: "john@example.com", role: "staff" },
  { id: 2, name: "Jane Smith", email: "jane@example.com", role: "staff" },
];

// Staff Assignment interface
interface StaffAssignment {
  id: number;
  staffId: number;
  staffName: string;
  departmentId: string;
  departmentName: string;
  subjectId: string;
  subjectName: string;
  startRoll: string;
  endRoll: string;
}

export const StaffAssignment = () => {
  const [assignments, setAssignments] = useState<StaffAssignment[]>([]);
  const [isAddingAssignment, setIsAddingAssignment] = useState(false);
  const [isEditingAssignment, setIsEditingAssignment] = useState(false);
  const [selectedStaffMember, setSelectedStaffMember] = useState<string | undefined>(undefined);
  const [selectedDepartment, setSelectedDepartment] = useState<string | undefined>(undefined);
  const [selectedSubject, setSelectedSubject] = useState<string | undefined>(undefined);
  const [startRoll, setStartRoll] = useState("");
  const [endRoll, setEndRoll] = useState("");
  const [editingAssignment, setEditingAssignment] = useState<StaffAssignment | null>(null);

  // Handle selection changes
  const handleDepartmentChange = (departmentId: string) => {
    setSelectedDepartment(departmentId);
    setSelectedSubject(undefined); // Reset subject when department changes
  };

  // Get department name by ID
  const getDepartmentName = (deptId: string) => {
    return mockDepartments.find(dept => dept.id === deptId)?.name || deptId;
  };

  // Get subject name by ID and department
  const getSubjectName = (subjectId: string, deptId: string) => {
    const subjects = mockSubjects[deptId as keyof typeof mockSubjects] || [];
    return subjects.find(subj => subj.id === subjectId)?.name || subjectId;
  };

  // Get staff name by ID
  const getStaffName = (staffId: number) => {
    return mockStaffMembers.find(staff => staff.id === staffId)?.name || `Staff ${staffId}`;
  };

  // Handle add assignment
  const handleAddAssignment = () => {
    if (!selectedStaffMember || !selectedDepartment || !selectedSubject || !startRoll) {
      toast.error("Please fill all required fields");
      return;
    }

    // Validate roll numbers
    if (endRoll && endRoll < startRoll) {
      toast.error("End roll number must be greater than or equal to start roll number");
      return;
    }

    const staffId = parseInt(selectedStaffMember);
    const newAssignment: StaffAssignment = {
      id: Date.now(), // Use timestamp as ID for mock data
      staffId,
      staffName: getStaffName(staffId),
      departmentId: selectedDepartment,
      departmentName: getDepartmentName(selectedDepartment),
      subjectId: selectedSubject,
      subjectName: getSubjectName(selectedSubject, selectedDepartment),
      startRoll,
      endRoll: endRoll || startRoll // If end roll is empty, use start roll
    };

    setAssignments([...assignments, newAssignment]);
    toast.success("Staff assignment added successfully");
    resetForm();
    setIsAddingAssignment(false);
  };

  // Handle edit assignment
  const handleEditAssignment = (assignment: StaffAssignment) => {
    setEditingAssignment(assignment);
    setSelectedStaffMember(assignment.staffId.toString());
    setSelectedDepartment(assignment.departmentId);
    setSelectedSubject(assignment.subjectId);
    setStartRoll(assignment.startRoll);
    setEndRoll(assignment.endRoll);
    setIsEditingAssignment(true);
  };

  // Handle save edit
  const handleSaveEdit = () => {
    if (!editingAssignment || !selectedStaffMember || !selectedDepartment || !selectedSubject || !startRoll) {
      toast.error("Please fill all required fields");
      return;
    }

    // Validate roll numbers
    if (endRoll && endRoll < startRoll) {
      toast.error("End roll number must be greater than or equal to start roll number");
      return;
    }

    const staffId = parseInt(selectedStaffMember);
    const updatedAssignment: StaffAssignment = {
      ...editingAssignment,
      staffId,
      staffName: getStaffName(staffId),
      departmentId: selectedDepartment,
      departmentName: getDepartmentName(selectedDepartment),
      subjectId: selectedSubject,
      subjectName: getSubjectName(selectedSubject, selectedDepartment),
      startRoll,
      endRoll: endRoll || startRoll
    };

    setAssignments(assignments.map(a => a.id === editingAssignment.id ? updatedAssignment : a));
    toast.success("Staff assignment updated successfully");
    resetForm();
    setIsEditingAssignment(false);
    setEditingAssignment(null);
  };

  // Handle delete assignment
  const handleDeleteAssignment = (id: number) => {
    if (confirm("Are you sure you want to delete this assignment?")) {
      setAssignments(assignments.filter(a => a.id !== id));
      toast.success("Assignment deleted successfully");
    }
  };

  // Reset form fields
  const resetForm = () => {
    setSelectedStaffMember(undefined);
    setSelectedDepartment(undefined);
    setSelectedSubject(undefined);
    setStartRoll("");
    setEndRoll("");
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Staff Assignments</h2>
        <Button onClick={() => setIsAddingAssignment(true)}>
          <Users className="h-4 w-4 mr-2" /> Add Assignment
        </Button>
      </div>

      {/* List of assignments */}
      {assignments.length > 0 ? (
        <div className="grid gap-4">
          {assignments.map((assignment) => (
            <Card key={assignment.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between">
                  <CardTitle>{assignment.staffName}</CardTitle>
                  <Button variant="outline" size="sm" onClick={() => handleEditAssignment(assignment)}>
                    <Pencil className="h-4 w-4 mr-1" /> Edit
                  </Button>
                </div>
                <CardDescription>Department: {assignment.departmentName}</CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="space-y-1">
                  <p><strong>Subject:</strong> {assignment.subjectName} ({assignment.subjectId})</p>
                  <p><strong>Roll Number Range:</strong> {assignment.startRoll} to {assignment.endRoll}</p>
                </div>
              </CardContent>
              <CardFooter className="pt-2">
                <Button 
                  variant="destructive" 
                  size="sm" 
                  onClick={() => handleDeleteAssignment(assignment.id)}
                >
                  Remove Assignment
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-8 text-center text-gray-500">
            <p>No staff assignments found. Add your first assignment to get started.</p>
          </CardContent>
        </Card>
      )}

      {/* Add Assignment Dialog */}
      <Dialog open={isAddingAssignment} onOpenChange={setIsAddingAssignment}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Staff Assignment</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {/* Staff selection */}
            <div className="space-y-2">
              <Label htmlFor="staff">Staff Member</Label>
              <Select value={selectedStaffMember} onValueChange={setSelectedStaffMember}>
                <SelectTrigger id="staff">
                  <SelectValue placeholder="Select Staff Member" />
                </SelectTrigger>
                <SelectContent>
                  {mockStaffMembers.map((staff) => (
                    <SelectItem key={staff.id} value={staff.id.toString()}>
                      {staff.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Department selection */}
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Select value={selectedDepartment} onValueChange={handleDepartmentChange}>
                <SelectTrigger id="department">
                  <SelectValue placeholder="Select Department" />
                </SelectTrigger>
                <SelectContent>
                  {mockDepartments.map((dept) => (
                    <SelectItem key={dept.id} value={dept.id}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Subject selection */}
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Select 
                value={selectedSubject} 
                onValueChange={setSelectedSubject}
                disabled={!selectedDepartment}
              >
                <SelectTrigger id="subject">
                  <SelectValue placeholder="Select Subject" />
                </SelectTrigger>
                <SelectContent>
                  {selectedDepartment && 
                   (mockSubjects[selectedDepartment as keyof typeof mockSubjects] || [])
                    .map((subject) => (
                      <SelectItem key={subject.id} value={subject.id}>
                        {subject.name} ({subject.code})
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Roll number range */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start-roll">Start Roll Number</Label>
                <Input 
                  id="start-roll"
                  value={startRoll}
                  onChange={(e) => setStartRoll(e.target.value)}
                  placeholder="e.g., CS001"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end-roll">End Roll Number (Optional)</Label>
                <Input 
                  id="end-roll"
                  value={endRoll}
                  onChange={(e) => setEndRoll(e.target.value)}
                  placeholder="e.g., CS050"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddingAssignment(false)}>Cancel</Button>
            <Button onClick={handleAddAssignment}>Add Assignment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Assignment Dialog */}
      <Dialog open={isEditingAssignment} onOpenChange={setIsEditingAssignment}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Staff Assignment</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {/* Staff selection */}
            <div className="space-y-2">
              <Label htmlFor="edit-staff">Staff Member</Label>
              <Select value={selectedStaffMember} onValueChange={setSelectedStaffMember}>
                <SelectTrigger id="edit-staff">
                  <SelectValue placeholder="Select Staff Member" />
                </SelectTrigger>
                <SelectContent>
                  {mockStaffMembers.map((staff) => (
                    <SelectItem key={staff.id} value={staff.id.toString()}>
                      {staff.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Department selection */}
            <div className="space-y-2">
              <Label htmlFor="edit-department">Department</Label>
              <Select value={selectedDepartment} onValueChange={handleDepartmentChange}>
                <SelectTrigger id="edit-department">
                  <SelectValue placeholder="Select Department" />
                </SelectTrigger>
                <SelectContent>
                  {mockDepartments.map((dept) => (
                    <SelectItem key={dept.id} value={dept.id}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Subject selection */}
            <div className="space-y-2">
              <Label htmlFor="edit-subject">Subject</Label>
              <Select 
                value={selectedSubject} 
                onValueChange={setSelectedSubject}
                disabled={!selectedDepartment}
              >
                <SelectTrigger id="edit-subject">
                  <SelectValue placeholder="Select Subject" />
                </SelectTrigger>
                <SelectContent>
                  {selectedDepartment && 
                   (mockSubjects[selectedDepartment as keyof typeof mockSubjects] || [])
                    .map((subject) => (
                      <SelectItem key={subject.id} value={subject.id}>
                        {subject.name} ({subject.code})
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Roll number range */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-start-roll">Start Roll Number</Label>
                <Input 
                  id="edit-start-roll"
                  value={startRoll}
                  onChange={(e) => setStartRoll(e.target.value)}
                  placeholder="e.g., CS001"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-end-roll">End Roll Number (Optional)</Label>
                <Input 
                  id="edit-end-roll"
                  value={endRoll}
                  onChange={(e) => setEndRoll(e.target.value)}
                  placeholder="e.g., CS050"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsEditingAssignment(false);
              setEditingAssignment(null);
              resetForm();
            }}>Cancel</Button>
            <Button onClick={handleSaveEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
