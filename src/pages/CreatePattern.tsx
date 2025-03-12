
import { useState } from "react";
import { Header } from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { QuestionPatternForm } from "@/components/QuestionPatternForm";

const departments = [
  { id: "1", name: "Computer Science" },
  { id: "2", name: "Mechanical" },
  { id: "3", name: "Electrical" },
  { id: "4", name: "Civil" },
];

const CreatePattern = () => {
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [subjectCode, setSubjectCode] = useState("");
  const [subjectName, setSubjectName] = useState("");
  const [questionPaperCodes, setQuestionPaperCodes] = useState([{ id: 1, code: "" }]);
  const [selectedQuestionPaperCode, setSelectedQuestionPaperCode] = useState("");
  const [step, setStep] = useState(1);

  const addQuestionPaperCode = () => {
    setQuestionPaperCodes([
      ...questionPaperCodes,
      { id: questionPaperCodes.length + 1, code: "" }
    ]);
  };

  const updateQuestionPaperCode = (id: number, code: string) => {
    setQuestionPaperCodes(
      questionPaperCodes.map(qpc => 
        qpc.id === id ? { ...qpc, code } : qpc
      )
    );
  };

  const handleDepartmentSelect = (value: string) => {
    setSelectedDepartment(value);
  };

  const proceedToQuestionPattern = () => {
    if (selectedDepartment && subjectCode && subjectName && questionPaperCodes.some(qpc => qpc.code)) {
      setSelectedQuestionPaperCode(questionPaperCodes[0].code);
      setStep(2);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6 text-center">Question Pattern Creation</h2>
        
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
                <Label htmlFor="subjectCode">Subject Code</Label>
                <Input
                  id="subjectCode"
                  value={subjectCode}
                  onChange={(e) => setSubjectCode(e.target.value)}
                  placeholder="e.g., CS101"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subjectName">Subject Name</Label>
                <Input
                  id="subjectName"
                  value={subjectName}
                  onChange={(e) => setSubjectName(e.target.value)}
                  placeholder="e.g., Introduction to Programming"
                />
              </div>

              <div className="space-y-2">
                <Label>Question Paper Codes</Label>
                {questionPaperCodes.map((qpc) => (
                  <div key={qpc.id} className="flex gap-2">
                    <Input
                      value={qpc.code}
                      onChange={(e) => updateQuestionPaperCode(qpc.id, e.target.value)}
                      placeholder="e.g., QPC001"
                    />
                  </div>
                ))}
                <Button variant="outline" onClick={addQuestionPaperCode} className="w-full">
                  Add Another Question Paper Code
                </Button>
              </div>

              <Button 
                onClick={proceedToQuestionPattern} 
                disabled={!selectedDepartment || !subjectCode || !subjectName || !questionPaperCodes.some(qpc => qpc.code)}
                className="w-full mt-4"
              >
                Continue
              </Button>
            </CardContent>
          </Card>
        )}

        {step === 2 && (
          <QuestionPatternForm
            departmentId={selectedDepartment}
            subjectCode={subjectCode}
            subjectName={subjectName}
            questionPaperCode={selectedQuestionPaperCode}
            questionPaperCodes={questionPaperCodes}
            onQuestionPaperCodeChange={setSelectedQuestionPaperCode}
            onBack={() => setStep(1)}
          />
        )}
      </main>
    </div>
  );
};

export default CreatePattern;
