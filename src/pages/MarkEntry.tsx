
import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MarkEntryForm } from "@/components/MarkEntryForm";
import { useAuth } from "@/contexts/AuthContext";

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

// Mock question paper codes
const mockQuestionPaperCodes = [
  { id: 1, code: "Q1" },
  { id: 2, code: "Q2" },
  { id: 3, code: "M1" },
  { id: 4, code: "F1" },
];

// Mock staff assignments
const mockStaffAssignments = [
  {
    staffId: 2, // 'user' account ID
    departmentId: "CS",
    subjectId: "CS101",
    subjectName: "Introduction to Programming",
    startRoll: "CS001",
    endRoll: "CS050"
  }
];

const MarkEntry = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  
  const [selectedDepartment, setSelectedDepartment] = useState<string>("");
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [questionPaperCode, setQuestionPaperCode] = useState<string>("");
  const [step, setStep] = useState<1 | 2>(1);
  
  // For staff users, automatically select their assigned subjects
  const [staffAssignments, setStaffAssignments] = useState<typeof mockStaffAssignments>([]);
  
  useEffect(() => {
    // For staff users, automatically load their assignments
    if (!isAdmin && user) {
      // In a real app, this would fetch from the database based on logged-in user ID
      // For our mock, we'll use the user with ID 2 (the 'user' account)
      const userAssignments = mockStaffAssignments.filter(
        assignment => assignment.staffId === 2 // Hardcoded for demo purposes
      );
      
      setStaffAssignments(userAssignments);
      
      // If staff has only one assignment, select it automatically
      if (userAssignments.length === 1) {
        const assignment = userAssignments[0];
        setSelectedDepartment(assignment.departmentId);
        setSelectedSubject(assignment.subjectId);
      }
      
      // Skip to step 2 for staff users regardless
      setStep(2);
    }
  }, [user, isAdmin]);

  const handleDepartmentChange = (departmentId: string) => {
    setSelectedDepartment(departmentId);
    setSelectedSubject(""); // Reset subject when department changes
  };

  const handleProceed = () => {
    // Validation
    if (!selectedDepartment || !selectedSubject) {
      alert("Please select both department and subject");
      return;
    }
    
    setStep(2);
  };

  // Get subject name by ID
  const getSubjectName = (subjectId: string): string => {
    if (!selectedDepartment) return "";
    
    const subjects = mockSubjects[selectedDepartment as keyof typeof mockSubjects] || [];
    const subject = subjects.find(s => s.id === subjectId);
    return subject ? subject.name : "";
  };

  const handleBack = () => {
    if (isAdmin) {
      setStep(1);
    } else {
      // For staff users, we don't go back to step 1 since it's skipped
      // Could implement other back action here if needed
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto py-6 px-4">
        <h1 className="text-3xl font-bold mb-6">Mark Entry</h1>

        {isAdmin && step === 1 && (
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-center">Select Department and Subject</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
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

              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Select value={selectedSubject} onValueChange={setSelectedSubject} disabled={!selectedDepartment}>
                  <SelectTrigger id="subject">
                    <SelectValue placeholder={selectedDepartment ? "Select Subject" : "Select Department First"} />
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

              <Button onClick={handleProceed} className="w-full mt-4">
                Proceed
              </Button>
            </CardContent>
          </Card>
        )}

        {step === 2 && (
          <>
            {!isAdmin && staffAssignments.length === 0 ? (
              <Card className="max-w-2xl mx-auto">
                <CardContent className="py-8 text-center">
                  <p className="text-lg text-muted-foreground">
                    No subjects have been assigned to you. Please contact the administrator.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <MarkEntryForm 
                departmentId={selectedDepartment}
                subjectCode={selectedSubject}
                subjectName={getSubjectName(selectedSubject)}
                questionPaperCode={questionPaperCode || mockQuestionPaperCodes[0].code}
                onBack={handleBack}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default MarkEntry;
