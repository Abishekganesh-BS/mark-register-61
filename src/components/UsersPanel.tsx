
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
import { Pencil, Trash2, UserPlus, Lock, Shield, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// User interface
interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  department: string;
  lastActive?: string;
}

// Mocked user data - in a real app this would come from a database
const mockUsers: User[] = [
  { 
    id: 1, 
    name: "Admin User", 
    email: "admin@example.com", 
    role: "admin", 
    department: "all",
    lastActive: "2023-09-15T10:30:00"
  },
  {
    id: 2,
    name: "Staff User",
    email: "user@example.com",
    role: "staff",
    department: "CS",
    lastActive: "2023-09-16T09:15:00"
  }
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
  const [isEditingUser, setIsEditingUser] = useState(false);
  const [isResetPassword, setIsResetPassword] = useState(false);
  const [isManagingPermissions, setIsManagingPermissions] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "",
    department: "",
    password: "",
    confirmPassword: ""
  });
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [resetPasswordUser, setResetPasswordUser] = useState<User | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [managingPermissionsUser, setManagingPermissionsUser] = useState<User | null>(null);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<string>("all");

  // Handle add user
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

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newUser.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    // In a real application, this would save to a database
    const newId = Math.max(...users.map(u => u.id), 0) + 1;
    const userWithDate = { 
      ...newUser, 
      id: newId,
      lastActive: new Date().toISOString()
    };
    
    setUsers([...users, userWithDate]);
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

  const handleStartEditUser = (user: User) => {
    setEditingUser(user);
    setIsEditingUser(true);
  };

  const handleSaveEditUser = () => {
    if (!editingUser) return;
    
    // Validation
    if (!editingUser.name || !editingUser.email || !editingUser.role || !editingUser.department) {
      toast.error("Please fill all required fields");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(editingUser.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    // Update user
    setUsers(users.map(u => u.id === editingUser.id ? editingUser : u));
    toast.success(`User "${editingUser.name}" updated successfully`);
    setIsEditingUser(false);
    setEditingUser(null);
  };

  const handleStartResetPassword = (user: User) => {
    setResetPasswordUser(user);
    setNewPassword("");
    setConfirmNewPassword("");
    setIsResetPassword(true);
  };

  const handleResetPassword = () => {
    if (!resetPasswordUser) return;
    
    if (!newPassword) {
      toast.error("Please enter a new password");
      return;
    }
    
    if (newPassword !== confirmNewPassword) {
      toast.error("Passwords do not match");
      return;
    }
    
    // In a real app, this would reset the password in the database
    toast.success(`Password reset successfully for ${resetPasswordUser.name}`);
    setIsResetPassword(false);
    setResetPasswordUser(null);
    setNewPassword("");
    setConfirmNewPassword("");
  };

  const handleStartManagePermissions = (user: User) => {
    setManagingPermissionsUser(user);
    
    // Set initial permissions based on role (in a real app, would fetch from database)
    if (user.role === "admin") {
      setSelectedPermissions(["view_all", "edit_all", "delete_all", "manage_users"]);
    } else if (user.role === "department_admin") {
      setSelectedPermissions(["view_department", "edit_department"]);
    } else {
      setSelectedPermissions(["view_department"]);
    }
    
    setIsManagingPermissions(true);
  };

  const handleSavePermissions = () => {
    if (!managingPermissionsUser) return;
    
    // In a real app, this would update permissions in the database
    toast.success(`Permissions updated for ${managingPermissionsUser.name}`);
    setIsManagingPermissions(false);
    setManagingPermissionsUser(null);
    setSelectedPermissions([]);
  };

  const handleDeleteUser = (id: number, name: string) => {
    if (confirm(`Are you sure you want to delete user "${name}"? This cannot be undone.`)) {
      setUsers(users.filter(u => u.id !== id));
      toast.success(`User "${name}" deleted successfully`);
    }
  };

  const togglePermission = (permission: string) => {
    setSelectedPermissions(prev => 
      prev.includes(permission)
        ? prev.filter(p => p !== permission)
        : [...prev, permission]
    );
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

  const formatLastActive = (dateString?: string) => {
    if (!dateString) return "Never";
    
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  // Filter users based on active tab
  const filteredUsers = activeTab === "all" 
    ? users 
    : users.filter(user => user.role === activeTab);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold">User Management</h2>
          <p className="text-muted-foreground">
            Manage users and their permissions. Staff subject assignments are managed in the Staff Assignments tab.
          </p>
        </div>
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
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-4">
        <TabsList>
          <TabsTrigger value="all">All Users</TabsTrigger>
          <TabsTrigger value="admin">Admins</TabsTrigger>
          <TabsTrigger value="staff">Staff</TabsTrigger>
        </TabsList>
      </Tabs>
      
      {filteredUsers.map((user) => (
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
                  onClick={() => handleStartEditUser(user)}
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
            <div className="flex flex-col space-y-2">
              <div className="flex flex-wrap gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(user.role)}`}>
                  {getRoleLabel(user.role)}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  {getDepartmentLabel(user.department)}
                </span>
              </div>
              <p className="text-sm text-gray-500">
                Last active: {formatLastActive(user.lastActive)}
              </p>
            </div>
          </CardContent>
          <CardFooter className="pt-2">
            <div className="flex space-x-2 w-full">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => handleStartResetPassword(user)}
              >
                <Lock className="h-4 w-4 mr-2" /> Reset Password
              </Button>
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => handleStartManagePermissions(user)}
              >
                <Shield className="h-4 w-4 mr-2" /> Manage Permissions
              </Button>
            </div>
          </CardFooter>
        </Card>
      ))}
      
      {/* Edit User Dialog */}
      <Dialog open={isEditingUser} onOpenChange={setIsEditingUser}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-user-name">Full Name</Label>
                <Input 
                  id="edit-user-name" 
                  value={editingUser?.name || ""} 
                  onChange={(e) => editingUser && setEditingUser({...editingUser, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-user-email">Email</Label>
                <Input 
                  id="edit-user-email" 
                  type="email"
                  value={editingUser?.email || ""} 
                  onChange={(e) => editingUser && setEditingUser({...editingUser, email: e.target.value})}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-user-role">Role</Label>
                <Select 
                  value={editingUser?.role || ""} 
                  onValueChange={(value) => editingUser && setEditingUser({...editingUser, role: value})}
                >
                  <SelectTrigger id="edit-user-role">
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
                <Label htmlFor="edit-user-department">Department</Label>
                <Select 
                  value={editingUser?.department || ""} 
                  onValueChange={(value) => editingUser && setEditingUser({...editingUser, department: value})}
                >
                  <SelectTrigger id="edit-user-department">
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
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditingUser(false)}>Cancel</Button>
            <Button onClick={handleSaveEditUser}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Reset Password Dialog */}
      <Dialog open={isResetPassword} onOpenChange={setIsResetPassword}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset Password for {resetPasswordUser?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input 
                id="new-password" 
                type="password"
                value={newPassword} 
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirm-new-password">Confirm New Password</Label>
              <Input 
                id="confirm-new-password" 
                type="password"
                value={confirmNewPassword} 
                onChange={(e) => setConfirmNewPassword(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsResetPassword(false)}>Cancel</Button>
            <Button onClick={handleResetPassword}>Reset Password</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Manage Permissions Dialog */}
      <Dialog open={isManagingPermissions} onOpenChange={setIsManagingPermissions}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Manage Permissions for {managingPermissionsUser?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-base font-medium">User Permissions</Label>
              <div className="grid grid-cols-1 gap-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="perm-view-all"
                    checked={selectedPermissions.includes("view_all")}
                    onChange={() => togglePermission("view_all")}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <Label htmlFor="perm-view-all">View All Departments</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="perm-edit-all"
                    checked={selectedPermissions.includes("edit_all")}
                    onChange={() => togglePermission("edit_all")}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <Label htmlFor="perm-edit-all">Edit All Departments</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="perm-delete-all"
                    checked={selectedPermissions.includes("delete_all")}
                    onChange={() => togglePermission("delete_all")}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <Label htmlFor="perm-delete-all">Delete Records</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="perm-manage-users"
                    checked={selectedPermissions.includes("manage_users")}
                    onChange={() => togglePermission("manage_users")}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <Label htmlFor="perm-manage-users">Manage Users</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="perm-view-department"
                    checked={selectedPermissions.includes("view_department")}
                    onChange={() => togglePermission("view_department")}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <Label htmlFor="perm-view-department">View Department Data</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="perm-edit-department"
                    checked={selectedPermissions.includes("edit_department")}
                    onChange={() => togglePermission("edit_department")}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <Label htmlFor="perm-edit-department">Edit Department Data</Label>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsManagingPermissions(false)}>Cancel</Button>
            <Button onClick={handleSavePermissions}>Save Permissions</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {filteredUsers.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>No users found. Add your first user to get started.</p>
        </div>
      )}
    </div>
  );
};
