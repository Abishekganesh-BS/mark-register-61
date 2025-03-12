
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

interface QuestionPaperCode {
  id: number;
  code: string;
}

interface QuestionPatternFormProps {
  departmentId: string;
  subjectCode: string;
  subjectName: string;
  questionPaperCode: string;
  questionPaperCodes: QuestionPaperCode[];
  onQuestionPaperCodeChange: (code: string) => void;
  onBack: () => void;
}

interface QuestionItem {
  id: number;
  courseOutcome: string;
  marks: number;
}

export const QuestionPatternForm = ({
  departmentId,
  subjectCode,
  subjectName,
  questionPaperCode,
  questionPaperCodes,
  onQuestionPaperCodeChange,
  onBack,
}: QuestionPatternFormProps) => {
  const [questions, setQuestions] = useState<QuestionItem[]>([
    { id: 1, courseOutcome: "1", marks: 0 },
  ]);

  const courseOutcomes = ["1", "2", "3", "4", "5", "6"];

  const addQuestion = () => {
    setQuestions([
      ...questions,
      { id: questions.length + 1, courseOutcome: "1", marks: 0 },
    ]);
  };

  const updateQuestion = (id: number, field: string, value: string | number) => {
    setQuestions(
      questions.map((q) =>
        q.id === id ? { ...q, [field]: value } : q
      )
    );
  };

  const getTotalMarks = () => {
    return questions.reduce((sum, q) => sum + (Number(q.marks) || 0), 0);
  };
  
  const getCourseOutcomesTotal = () => {
    const totals = {} as Record<string, number>;
    
    courseOutcomes.forEach(co => {
      totals[co] = 0;
    });
    
    questions.forEach(q => {
      if (q.courseOutcome) {
        totals[q.courseOutcome] += (Number(q.marks) || 0);
      }
    });
    
    return totals;
  };

  const handleSubmit = () => {
    // In a real application, this would save the pattern to the database
    const pattern = {
      departmentId,
      subjectCode,
      subjectName,
      questionPaperCode,
      questions
    };

    console.log("Saving question pattern:", pattern);
    
    // Simulated success message
    toast.success("Question pattern saved successfully!");
  };

  const coTotals = getCourseOutcomesTotal();
  
  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Create Question Pattern</CardTitle>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-4">
          <div className="space-y-1">
            <p className="text-sm font-medium">Subject Code: <span className="font-normal">{subjectCode}</span></p>
            <p className="text-sm font-medium">Subject Name: <span className="font-normal">{subjectName}</span></p>
          </div>
          <div className="w-full sm:w-64">
            <Label htmlFor="questionPaperCode">Question Paper Code</Label>
            <Select value={questionPaperCode} onValueChange={onQuestionPaperCodeChange}>
              <SelectTrigger id="questionPaperCode">
                <SelectValue placeholder="Select Question Paper Code" />
              </SelectTrigger>
              <SelectContent>
                {questionPaperCodes
                  .filter(qpc => qpc.code)
                  .map((qpc) => (
                    <SelectItem key={qpc.id} value={qpc.code}>
                      {qpc.code}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
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
                <th className="border p-2 text-left">Marks</th>
              </tr>
            </thead>
            <tbody>
              {questions.map((question) => (
                <tr key={question.id}>
                  <td className="border p-2">{question.id}</td>
                  <td className="border p-2">
                    <Select
                      value={question.courseOutcome}
                      onValueChange={(value) => updateQuestion(question.id, "courseOutcome", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select CO" />
                      </SelectTrigger>
                      <SelectContent>
                        {courseOutcomes.map((co) => (
                          <SelectItem key={co} value={co}>
                            CO {co}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="border p-2">
                    <Input
                      type="number"
                      min="0"
                      value={question.marks.toString()}
                      onChange={(e) => updateQuestion(question.id, "marks", Number(e.target.value))}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={2} className="border p-2 font-bold text-right">
                  Total Marks:
                </td>
                <td className="border p-2 font-bold">{getTotalMarks()}</td>
              </tr>
            </tfoot>
          </table>
        </div>

        <Button variant="outline" onClick={addQuestion} className="w-full">
          Add Question
        </Button>

        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Course Outcomes Summary</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {courseOutcomes.map(co => (
              <div key={co} className="border p-3 rounded-md">
                <p className="text-sm font-medium">CO {co}</p>
                <p className="text-lg font-bold">{coTotals[co]}</p>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row gap-2 justify-end">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={handleSubmit}>
          Save Question Pattern
        </Button>
      </CardFooter>
    </Card>
  );
};
