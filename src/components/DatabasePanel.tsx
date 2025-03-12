
import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Download, Upload, Database } from "lucide-react";
import { toast } from "sonner";

const mockDepartments = [
  { id: "1", name: "Computer Science", code: "CS" },
  { id: "2", name: "Mechanical Engineering", code: "ME" },
  { id: "3", name: "Electrical Engineering", code: "EE" },
  { id: "4", name: "Civil Engineering", code: "CE" },
  { id: "5", name: "M.Tech Computer Science", code: "MCS" },
];

const semesters = [
  { id: "all", name: "All Semesters" },
  { id: "1", name: "Semester 1" },
  { id: "2", name: "Semester 2" },
  { id: "3", name: "Semester 3" },
  { id: "4", name: "Semester 4" },
  { id: "5", name: "Semester 5" },
  { id: "6", name: "Semester 6" },
  { id: "7", name: "Semester 7" },
  { id: "8", name: "Semester 8" },
  { id: "9", name: "Semester 9 (M.Tech only)" },
  { id: "10", name: "Semester 10 (M.Tech only)" },
];

export const DatabasePanel = () => {
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("all");
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  const handleExport = () => {
    if (!selectedDepartment) {
      toast.error("Please select a department");
      return;
    }
    
    // Simulating export process
    setIsExporting(true);
    
    setTimeout(() => {
      setIsExporting(false);
      const deptName = mockDepartments.find(d => d.id === selectedDepartment)?.name;
      const semName = semesters.find(s => s.id === selectedSemester)?.name;
      toast.success(`Database for ${deptName} - ${semName} exported successfully`);
      
      // In a real application, this would trigger a file download
      console.log("Exporting database:", { department: selectedDepartment, semester: selectedSemester });
    }, 1500);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!selectedDepartment) {
      toast.error("Please select a department");
      return;
    }
    
    // Checking file extension
    if (!file.name.endsWith('.csv')) {
      toast.error("Only CSV files are supported");
      return;
    }
    
    // Simulating import process
    setIsImporting(true);
    
    setTimeout(() => {
      setIsImporting(false);
      const deptName = mockDepartments.find(d => d.id === selectedDepartment)?.name;
      const semName = semesters.find(s => s.id === selectedSemester)?.name;
      toast.success(`Database for ${deptName} - ${semName} imported successfully`);
      
      // In a real application, this would process the uploaded file
      console.log("Importing database:", { department: selectedDepartment, semester: selectedSemester, file });
    }, 1500);
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Database Export & Import</CardTitle>
          <CardDescription>
            Export student databases as CSV files or import data from CSV files
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="export-department">Select Department</Label>
                <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                  <SelectTrigger id="export-department">
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
                <Label htmlFor="export-semester">Select Semester</Label>
                <Select value={selectedSemester} onValueChange={setSelectedSemester}>
                  <SelectTrigger id="export-semester">
                    <SelectValue placeholder="Select Semester" />
                  </SelectTrigger>
                  <SelectContent>
                    {semesters.map((sem) => (
                      <SelectItem key={sem.id} value={sem.id}>
                        {sem.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4 flex flex-col justify-end">
              <Button 
                onClick={handleExport} 
                disabled={!selectedDepartment || isExporting}
                className="w-full"
              >
                {isExporting ? (
                  "Exporting..."
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" /> Export Database (CSV)
                  </>
                )}
              </Button>
              
              <div className="relative">
                <Button 
                  variant="outline" 
                  className="w-full"
                  disabled={!selectedDepartment || isImporting}
                  onClick={() => document.getElementById('file-upload')?.click()}
                >
                  {isImporting ? (
                    "Importing..."
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" /> Import Database (CSV)
                    </>
                  )}
                </Button>
                <input
                  id="file-upload"
                  type="file"
                  accept=".csv"
                  className="hidden"
                  onChange={handleImport}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Database Backup</CardTitle>
          <CardDescription>
            Backup and restore your entire database system
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button variant="outline" className="w-full">
              <Database className="h-4 w-4 mr-2" /> Create Full Backup
            </Button>
            <Button variant="outline" className="w-full">
              <Database className="h-4 w-4 mr-2" /> Restore From Backup
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
