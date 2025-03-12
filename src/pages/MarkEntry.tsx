
import { useState } from "react";
import { Header } from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MarkEntryForm } from "@/components/MarkEntryForm";

const departments = [
  { id: "1", name: "Computer Science" },
  { id: "2", name: "Mechanical" },
  { id: "3", name: "Electrical" },
  { id: "4", name: "Civil" },
];

// This would normally come from an API
const mockSubjectsByDepartment = {
  "1": [
    { code: "CS101", name: "Introduction to Programming", questionPaperCodes: ["QPC001", "QPC002"] },
    { code: "CS201", name: "Data Structures", questionPaperCodes: ["QPC003"] },
  ],
  "2": [
    { code: "ME101", name: "Engineering Mechanics", questionPaperCodes: ["QPC004"] },
    { code: "ME201", name: "Thermodynamics", questionPaperCodes: ["QPC005", "QPC006"] },
  ],
};

const MarkEntry = () => {
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedQuestionPaperCode, setSelectedQuestionPaperCode] = useState("");
  const [step, setStep] = useState(1);
  
  const subjects = selectedDepartment 
    ? (mockSubjectsByDepartment[selectedDepartment as keyof typeof mockSubjectsByDepartment] || []) 
    : [];
  
  const questionPaperCodes = selectedSubject
    ? subjects.find(s => s.code === selectedSubject)?.questionPaperCodes || []
    : [];

  const handleDepartmentSelect = (value: string) => {
    setSelectedDepartment(value);
    setSelectedSubject("");
    setSelectedQuestionPaperCode("");
  };

  const handleSubjectSelect = (value: string) => {
    setSelectedSubject(value);
    setSelectedQuestionPaperCode("");
  };

  const proceedToMarkEntry = () => {
    if (selectedDepartment && selectedSubject && selectedQuestionPaperCode) {
      setStep(2);
    }
  };

  const currentSubject = subjects.find(s => s.code === selectedSubject);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6 text-center">Mark Entry System</h2>
        
        {step === 1 && (
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Select Department and Subject</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Select value={selectedDepartment} onValueChange={handleDepartmentSelect}>
                  <SelectTrigger id="department">
                    <SelectValue placeholder="Select Department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept.id} value={dept.id}>
                        {dept.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Select 
                  value={selectedSubject} 
                  onValueChange={handleSubjectSelect}
                  disabled={!selectedDepartment}
                >
                  <SelectTrigger id="subject">
                    <SelectValue placeholder="Select Subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((subject) => (
                      <SelectItem key={subject.code} value={subject.code}>
                        {subject.code} - {subject.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="questionPaperCode">Question Paper Code</Label>
                <Select 
                  value={selectedQuestionPaperCode} 
                  onValueChange={setSelectedQuestionPaperCode}
                  disabled={!selectedSubject}
                >
                  <SelectTrigger id="questionPaperCode">
                    <SelectValue placeholder="Select Question Paper Code" />
                  </SelectTrigger>
                  <SelectContent>
                    {questionPaperCodes.map((code) => (
                      <SelectItem key={code} value={code}>
                        {code}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button 
                onClick={proceedToMarkEntry} 
                disabled={!selectedDepartment || !selectedSubject || !selectedQuestionPaperCode}
                className="w-full mt-4"
              >
                Continue
              </Button>
            </CardContent>
          </Card>
        )}

        {step === 2 && (
          <MarkEntryForm
            departmentId={selectedDepartment}
            subjectCode={selectedSubject}
            subjectName={currentSubject?.name || ""}
            questionPaperCode={selectedQuestionPaperCode}
            onBack={() => setStep(1)}
          />
        )}
      </main>
    </div>
  );
};

export default MarkEntry;
