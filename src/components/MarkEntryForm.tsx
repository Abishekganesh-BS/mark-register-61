
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface MarkEntryFormProps {
  departmentId: string;
  subjectCode: string;
  subjectName: string;
  questionPaperCode: string;
  onBack: () => void;
}

// Mock question pattern data (would normally come from the database)
const getQuestionPattern = () => {
  return [
    { id: 1, courseOutcome: "1", totalMarks: 10 },
    { id: 2, courseOutcome: "2", totalMarks: 15 },
    { id: 3, courseOutcome: "3", totalMarks: 10 },
    { id: 4, courseOutcome: "4", totalMarks: 15 },
  ];
};

// Mock student data with random IDs (would normally come from the database)
const getStudents = () => {
  return [
    { id: 1, randomId: "S001" },
    { id: 2, randomId: "S002" },
    { id: 3, randomId: "S003" },
    { id: 4, randomId: "S004" },
    { id: 5, randomId: "S005" },
  ];
};

interface StudentMarks {
  studentId: number;
  marks: Record<number, number>;
  totalMarks: number;
}

export const MarkEntryForm = ({
  departmentId,
  subjectCode,
  subjectName,
  questionPaperCode,
  onBack,
}: MarkEntryFormProps) => {
  const questionPattern = getQuestionPattern();
  const students = getStudents();
  
  const [currentStudentIndex, setCurrentStudentIndex] = useState(0);
  const [studentsMarks, setStudentsMarks] = useState<StudentMarks[]>(
    students.map(student => ({
      studentId: student.id,
      marks: questionPattern.reduce((acc, q) => ({ ...acc, [q.id]: 0 }), {}),
      totalMarks: 0
    }))
  );
  
  const currentStudent = students[currentStudentIndex];
  const currentStudentMarks = studentsMarks.find(sm => sm.studentId === currentStudent.id) || {
    studentId: currentStudent.id,
    marks: {},
    totalMarks: 0
  };
  
  const updateMark = (questionId: number, marks: number) => {
    // Ensure marks are not greater than total marks for the question
    const questionTotalMarks = questionPattern.find(q => q.id === questionId)?.totalMarks || 0;
    const validMarks = Math.min(Math.max(0, marks), questionTotalMarks);
    
    setStudentsMarks(prev => {
      const updatedMarks = [...prev];
      const studentMarkIndex = updatedMarks.findIndex(sm => sm.studentId === currentStudent.id);
      
      if (studentMarkIndex >= 0) {
        const updatedStudentMarks = { ...updatedMarks[studentMarkIndex] };
        updatedStudentMarks.marks = { ...updatedStudentMarks.marks, [questionId]: validMarks };
        
        // Recalculate total marks
        updatedStudentMarks.totalMarks = Object.values(updatedStudentMarks.marks).reduce((sum, mark) => sum + (mark || 0), 0);
        
        updatedMarks[studentMarkIndex] = updatedStudentMarks;
      }
      
      return updatedMarks;
    });
  };
  
  const navigateStudent = (direction: 'prev' | 'next') => {
    if (direction === 'prev' && currentStudentIndex > 0) {
      setCurrentStudentIndex(currentStudentIndex - 1);
    } else if (direction === 'next' && currentStudentIndex < students.length - 1) {
      setCurrentStudentIndex(currentStudentIndex + 1);
    }
  };
  
  const handleSubmit = () => {
    // In a real application, this would save the marks to the database
    console.log("Submitting marks:", studentsMarks);
    
    // Generate CSV content
    const csvRows = [];
    const headers = ['Random ID', ...questionPattern.map(q => `CO ${q.courseOutcome}`), 'Total'];
    csvRows.push(headers.join(','));
    
    studentsMarks.forEach((studentMark) => {
      const student = students.find(s => s.id === studentMark.studentId);
      const values = [
        student?.randomId,
        ...questionPattern.map(q => studentMark.marks[q.id] || 0),
        studentMark.totalMarks
      ];
      csvRows.push(values.join(','));
    });
    
    const csvContent = csvRows.join('\n');
    
    // Create a virtual link to download the CSV
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `marks_${subjectCode}_${questionPaperCode}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success("Marks submitted successfully and CSV exported!");
  };
  
  const getTotalMaxMarks = () => {
    return questionPattern.reduce((sum, q) => sum + q.totalMarks, 0);
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Mark Entry</CardTitle>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="space-y-1">
            <p className="text-sm font-medium">Subject Code: <span className="font-normal">{subjectCode}</span></p>
            <p className="text-sm font-medium">Subject Name: <span className="font-normal">{subjectName}</span></p>
            <p className="text-sm font-medium">Question Paper Code: <span className="font-normal">{questionPaperCode}</span></p>
          </div>
          <div className="flex flex-col md:items-end space-y-1">
            <p className="text-sm font-medium">Student ID: <span className="font-normal">{currentStudent.randomId}</span></p>
            <p className="text-sm font-medium">Student: <span className="font-normal">{currentStudentIndex + 1} of {students.length}</span></p>
            <div className="flex gap-2">
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => navigateStudent('prev')}
                disabled={currentStudentIndex === 0}
              >
                Previous
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => navigateStudent('next')}
                disabled={currentStudentIndex === students.length - 1}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="border p-2 text-left">S.No</th>
                <th className="border p-2 text-left">Course Outcome (CO)</th>
                <th className="border p-2 text-left">Max Marks</th>
                <th className="border p-2 text-left">Obtained Marks</th>
              </tr>
            </thead>
            <tbody>
              {questionPattern.map((question) => (
                <tr key={question.id}>
                  <td className="border p-2">{question.id}</td>
                  <td className="border p-2">CO {question.courseOutcome}</td>
                  <td className="border p-2">{question.totalMarks}</td>
                  <td className="border p-2">
                    <Input
                      type="number"
                      min="0"
                      max={question.totalMarks}
                      value={(currentStudentMarks.marks[question.id] || 0).toString()}
                      onChange={(e) => updateMark(question.id, Number(e.target.value))}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={2} className="border p-2 font-bold text-right">
                  Total:
                </td>
                <td className="border p-2 font-bold">{getTotalMaxMarks()}</td>
                <td className="border p-2 font-bold">{currentStudentMarks.totalMarks}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row gap-2 justify-between">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={handleSubmit}>
          Submit All Marks & Export CSV
        </Button>
      </CardFooter>
    </Card>
  );
};
