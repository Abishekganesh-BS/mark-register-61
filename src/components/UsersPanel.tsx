
import { useState } from "react";
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
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pencil, Trash2, UserPlus, Lock, Shield } from "lucide-react";
import { toast } from "sonner";

// Mocked user data - in a real app this would come from a database
const mockUsers = [
  { id: 1, name: "Admin User", email: "admin@example.com", role: "admin", department: "all" },
  { id: 2, name: "CS Department Head", email: "cshead@example.com", role: "department_admin", department: "CS" },
  { id: 3, name: "ME Department Head", email: "mehead@example.com", role: "department_admin", department: "ME" },
  { id: 4, name: "Faculty User", email: "faculty@example.com", role: "staff", department: "CS" },
];

const mockDepartments = [
  { id: "all", name: "All Departments" },
  { id: "CS", name: "Computer Science" },
  { id: "ME", name: "Mechanical Engineering" },
  { id: "EE", name: "Electrical Engineering" },
  { id: "CE", name: "Civil Engineering" },
];

const userRoles = [
  { id: "admin", name: "System Administrator", description: "Full access to all features" },
  { id: "department_admin", name: "Department Administrator", description: "Manage specific department" },
  { id: "staff", name: "Staff", description: "Limited department access" },
];

export const UsersPanel = () => {
  const [users, setUsers] = useState(mockUsers);
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "",
    department: "",
    password: "",
    confirmPassword: ""
  });

  const handleAddUser = () => {
    // Simple validation
    if (!newUser.name || !newUser.email || !newUser.role || !newUser.department) {
      toast.error("Please fill all required fields");
      return;
    }

    if (newUser.password !== newUser.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    // In a real application, this would save to a database
    const newId = Math.max(...users.map(u => u.id)) + 1;
    setUsers([...users, { ...newUser, id: newId }]);
    toast.success(`User "${newUser.name}" added successfully`);
    
    // Reset form
    setNewUser({
      name: "",
      email: "",
      role: "",
      department: "",
      password: "",
      confirmPassword: ""
    });
    setIsAddingUser(false);
  };

  const handleDeleteUser = (id: number, name: string) => {
    if (confirm(`Are you sure you want to delete user "${name}"? This cannot be undone.`)) {
      setUsers(users.filter(u => u.id !== id));
      toast.success(`User "${name}" deleted successfully`);
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin": return "bg-red-100 text-red-800";
      case "department_admin": return "bg-blue-100 text-blue-800";
      case "staff": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getRoleLabel = (roleId: string) => {
    return userRoles.find(r => r.id === roleId)?.name || roleId;
  };

  const getDepartmentLabel = (deptId: string) => {
    return mockDepartments.find(d => d.id === deptId)?.name || deptId;
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">User Management</h2>
        <Dialog open={isAddingUser} onOpenChange={setIsAddingUser}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="h-4 w-4 mr-2" /> Add New User
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="user-name">Full Name</Label>
                  <Input 
                    id="user-name" 
                    value={newUser.name} 
                    onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="user-email">Email</Label>
                  <Input 
                    id="user-email" 
                    type="email"
                    value={newUser.email} 
                    onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="user-role">Role</Label>
                  <Select value={newUser.role} onValueChange={(value) => setNewUser({...newUser, role: value})}>
                    <SelectTrigger id="user-role">
                      <SelectValue placeholder="Select Role" />
                    </SelectTrigger>
                    <SelectContent>
                      {userRoles.map((role) => (
                        <SelectItem key={role.id} value={role.id}>
                          {role.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="user-department">Department</Label>
                  <Select value={newUser.department} onValueChange={(value) => setNewUser({...newUser, department: value})}>
                    <SelectTrigger id="user-department">
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
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="user-password">Password</Label>
                <Input 
                  id="user-password" 
                  type="password"
                  value={newUser.password} 
                  onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="user-confirm-password">Confirm Password</Label>
                <Input 
                  id="user-confirm-password" 
                  type="password"
                  value={newUser.confirmPassword} 
                  onChange={(e) => setNewUser({...newUser, confirmPassword: e.target.value})}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddingUser(false)}>Cancel</Button>
              <Button onClick={handleAddUser}>Create User</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      {users.map((user) => (
        <Card key={user.id} className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>{user.name}</CardTitle>
                <CardDescription>{user.email}</CardDescription>
              </div>
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                >
                  <Pencil className="h-4 w-4 mr-1" /> Edit
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => handleDeleteUser(user.id, user.name)}
                >
                  <Trash2 className="h-4 w-4 mr-1" /> Delete
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="py-2">
            <div className="flex flex-wrap gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(user.role)}`}>
                {getRoleLabel(user.role)}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                {getDepartmentLabel(user.department)}
              </span>
            </div>
          </CardContent>
          <CardFooter className="pt-2">
            <div className="flex space-x-2 w-full">
              <Button variant="outline" className="flex-1">
                <Lock className="h-4 w-4 mr-2" /> Reset Password
              </Button>
              <Button variant="outline" className="flex-1">
                <Shield className="h-4 w-4 mr-2" /> Manage Permissions
              </Button>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};
