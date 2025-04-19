
import { useState, useRef } from "react";
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
import { Progress } from "@/components/ui/progress";
import { Download, Upload, Database, RefreshCw, Save, HardDrive } from "lucide-react";
import { toast } from "sonner";

// Mock departments data - in a real application, this would come from the database
// This array is empty as per the requirement to remove all departments
const mockDepartments = [];

// Semesters data for selection input
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
  // State variables for department and semester selection
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("all");
  
  // State variables for tracking export/import progress
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [importProgress, setImportProgress] = useState(0);
  
  // State variables for backup/restore functionality
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  
  // Reference to the file input element for importing files
  const fileInputRef = useRef<HTMLInputElement>(null);

  /**
   * Handles the export database operation
   * In a real application, this would connect to a backend to generate and download the database
   */
  const handleExport = () => {
    if (!selectedDepartment) {
      toast.error("Please select a department");
      return;
    }
    
    // Simulating export process with progress
    setIsExporting(true);
    setExportProgress(0);
    
    const interval = setInterval(() => {
      setExportProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsExporting(false);
          
          const deptName = mockDepartments.find(d => d.id === selectedDepartment)?.name || "Unknown";
          const semName = semesters.find(s => s.id === selectedSemester)?.name || "All Semesters";
          toast.success(`Database for ${deptName} - ${semName} exported successfully`);
          
          // In a real application, this would trigger a file download
          console.log("Exporting database:", { department: selectedDepartment, semester: selectedSemester });
          
          simulateFileDownload(`${deptName}_${semName}_database.csv`);
          
          return 0;
        }
        return prev + 10;
      });
    }, 150);
  };

  /**
   * Simulates a file download by creating a temporary CSV file and triggering a download
   * In a real application, the backend would generate this file
   * @param filename The name of the file to download
   */
  const simulateFileDownload = (filename: string) => {
    // Create a dummy CSV content
    const csvContent = "id,name,marks\n1,Student 1,85\n2,Student 2,92\n3,Student 3,78";
    
    // Create a blob from the CSV string
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    
    // Create a download link
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    
    // Add to DOM, trigger click, and remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  /**
   * Handles the import database operation
   * In a real application, this would upload the file to a backend that would process it
   * @param e The file input change event
   */
  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!selectedDepartment) {
      toast.error("Please select a department");
      e.target.value = '';
      return;
    }
    
    // Checking file extension
    if (!file.name.endsWith('.csv')) {
      toast.error("Only CSV files are supported");
      e.target.value = '';
      return;
    }
    
    // Simulating import process with progress
    setIsImporting(true);
    setImportProgress(0);
    
    const interval = setInterval(() => {
      setImportProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsImporting(false);
          
          const deptName = mockDepartments.find(d => d.id === selectedDepartment)?.name || "Unknown";
          const semName = semesters.find(s => s.id === selectedSemester)?.name || "All Semesters";
          toast.success(`Database for ${deptName} - ${semName} imported successfully`);
          
          // In a real application, this would process the uploaded file
          console.log("Importing database:", { department: selectedDepartment, semester: selectedSemester, file });
          
          // Reset file input
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
          
          return 0;
        }
        return prev + 10;
      });
    }, 150);
  };

  /**
   * Handles the create backup operation
   * In a real application, this would create a full database backup
   */
  const handleCreateBackup = () => {
    setIsBackingUp(true);
    
    // Simulate backup progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      if (progress > 100) {
        clearInterval(interval);
        setIsBackingUp(false);
        toast.success("Full database backup created successfully");
        simulateFileDownload("database_backup_" + new Date().toISOString().split('T')[0] + ".bak");
      }
    }, 200);
  };

  /**
   * Handles the restore backup operation
   * In a real application, this would restore from a selected backup file
   */
  const handleRestoreBackup = () => {
    // Create a temporary file input for selecting backup file
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.bak';
    fileInput.onchange = (e) => {
      const target = e.target as HTMLInputElement;
      const file = target.files?.[0];
      
      if (file) {
        setIsRestoring(true);
        
        // Simulate restore progress
        let progress = 0;
        const interval = setInterval(() => {
          progress += 10;
          if (progress > 100) {
            clearInterval(interval);
            setIsRestoring(false);
            toast.success("Database restored successfully from backup");
          }
        }, 200);
      }
    };
    
    fileInput.click();
  };

  return (
    <div className="space-y-8">
      {/* Database Export & Import Panel */}
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
              <div className="space-y-2">
                <Button 
                  onClick={handleExport} 
                  disabled={!selectedDepartment || isExporting}
                  className="w-full"
                >
                  {isExporting ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> Exporting...
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4 mr-2" /> Export Database (CSV)
                    </>
                  )}
                </Button>
                {isExporting && <Progress value={exportProgress} className="w-full h-2" />}
              </div>
              
              <div className="space-y-2 relative">
                <Button 
                  variant="outline" 
                  className="w-full"
                  disabled={!selectedDepartment || isImporting}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {isImporting ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> Importing...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" /> Import Database (CSV)
                    </>
                  )}
                </Button>
                {isImporting && <Progress value={importProgress} className="w-full h-2" />}
                <input
                  ref={fileInputRef}
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

      {/* Database Backup Panel */}
      <Card>
        <CardHeader>
          <CardTitle>Database Backup</CardTitle>
          <CardDescription>
            Backup and restore your entire database system
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Button 
                variant="outline" 
                className="w-full"
                disabled={isBackingUp}
                onClick={handleCreateBackup}
              >
                {isBackingUp ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> Creating Backup...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" /> Create Full Backup
                  </>
                )}
              </Button>
              {isBackingUp && <Progress className="w-full h-2" />}
            </div>
            
            <div className="space-y-2">
              <Button 
                variant="outline" 
                className="w-full"
                disabled={isRestoring}
                onClick={handleRestoreBackup}
              >
                {isRestoring ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> Restoring...
                  </>
                ) : (
                  <>
                    <HardDrive className="h-4 w-4 mr-2" /> Restore From Backup
                  </>
                )}
              </Button>
              {isRestoring && <Progress className="w-full h-2" />}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
