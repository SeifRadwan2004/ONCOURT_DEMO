import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AdminLayout } from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Trash2, Edit, Plus } from "lucide-react";

interface Dashboard {
  id: string;
  name: string;
  userId: string;
  userName: string;
  userRole: "athlete" | "coach" | "admin";
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  description: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: "athlete" | "coach" | "admin";
}

const mockUsers: User[] = [
  { id: "a1", name: "Alex Johnson", email: "alex@example.com", role: "athlete" },
  { id: "a2", name: "Jordan Smith", email: "jordan@example.com", role: "athlete" },
  { id: "c1", name: "Coach Mike", email: "mike@example.com", role: "coach" },
  { id: "c2", name: "Coach Sarah", email: "sarah@example.com", role: "coach" },
];

const mockDashboards: Dashboard[] = [
  {
    id: "d1",
    name: "Performance Analytics",
    userId: "a1",
    userName: "Alex Johnson",
    userRole: "athlete",
    createdAt: "2024-01-15",
    updatedAt: "2024-01-20",
    isActive: true,
    description: "Track speed, power, and endurance metrics",
  },
  {
    id: "d2",
    name: "Group Talent Quadrant",
    userId: "c1",
    userName: "Coach Mike",
    userRole: "coach",
    createdAt: "2024-01-10",
    updatedAt: "2024-01-18",
    isActive: true,
    description: "Visualize athlete talent distribution across maturity stages",
  },
  {
    id: "d3",
    name: "Athlete Development",
    userId: "a2",
    userName: "Jordan Smith",
    userRole: "athlete",
    createdAt: "2024-01-08",
    updatedAt: "2024-01-15",
    isActive: false,
    description: "Long-term performance tracking",
  },
];

export default function DashboardManager() {
  const navigate = useNavigate();
  const [dashboards, setDashboards] = useState<Dashboard[]>(mockDashboards);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string>("");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const handleOpenNewDialog = () => {
    setFormData({ name: "", description: "" });
    setSelectedUser("");
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setFormData({ name: "", description: "" });
    setSelectedUser("");
  };

  const handleSave = () => {
    if (!formData.name || !selectedUser) {
      alert("Please fill in all fields");
      return;
    }

    const user = mockUsers.find((u) => u.id === selectedUser);
    if (!user) return;

    const newDashboard: Dashboard = {
      id: `d${dashboards.length + 1}`,
      name: formData.name,
      description: formData.description,
      userId: selectedUser,
      userName: user.name,
      userRole: user.role,
      createdAt: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
      isActive: true,
    };
    setDashboards([...dashboards, newDashboard]);
    handleCloseDialog();
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this dashboard?")) {
      setDashboards(dashboards.filter((d) => d.id !== id));
    }
  };

  const handleEdit = (dashboard: Dashboard) => {
    navigate(`/admin/dashboard-builder/${dashboard.id}`, { state: { dashboard } });
  };

  const toggleActive = (id: string) => {
    setDashboards(
      dashboards.map((d) => (d.id === id ? { ...d, isActive: !d.isActive } : d))
    );
  };

  return (
    <AdminLayout>
      <div className="space-y-8 p-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">Dashboard Manager</h1>
            <p className="text-muted-foreground mt-2">
              Create and manage custom dashboards for users
            </p>
          </div>
          <Button onClick={handleOpenNewDialog} className="gap-2">
            <Plus className="w-4 h-4" />
            New Dashboard
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-card rounded-lg p-4 border border-border">
            <p className="text-sm text-muted-foreground">Total Dashboards</p>
            <p className="text-3xl font-bold mt-2">{dashboards.length}</p>
          </div>
          <div className="bg-card rounded-lg p-4 border border-border">
            <p className="text-sm text-muted-foreground">Active</p>
            <p className="text-3xl font-bold text-accent mt-2">
              {dashboards.filter((d) => d.isActive).length}
            </p>
          </div>
          <div className="bg-card rounded-lg p-4 border border-border">
            <p className="text-sm text-muted-foreground">Athlete Dashboards</p>
            <p className="text-3xl font-bold mt-2">
              {dashboards.filter((d) => d.userRole === "athlete").length}
            </p>
          </div>
          <div className="bg-card rounded-lg p-4 border border-border">
            <p className="text-sm text-muted-foreground">Coach Dashboards</p>
            <p className="text-3xl font-bold mt-2">
              {dashboards.filter((d) => d.userRole === "coach").length}
            </p>
          </div>
        </div>

        {/* Dashboards Table */}
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Dashboard Name</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Updated</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dashboards.map((dashboard) => (
                  <TableRow key={dashboard.id}>
                    <TableCell className="font-medium">{dashboard.name}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-sm">{dashboard.userName}</p>
                        <p className="text-xs text-muted-foreground">
                          {mockUsers.find((u) => u.id === dashboard.userId)?.email}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs px-2 py-1 rounded-full bg-secondary text-secondary-foreground capitalize">
                        {dashboard.userRole}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground max-w-xs truncate">
                      {dashboard.description}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {dashboard.createdAt}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {dashboard.updatedAt}
                    </TableCell>
                    <TableCell>
                      <button
                        onClick={() => toggleActive(dashboard.id)}
                        className={`text-xs px-2 py-1 rounded-full font-medium transition-colors ${
                          dashboard.isActive
                            ? "bg-green-500/20 text-green-700"
                            : "bg-red-500/20 text-red-700"
                        }`}
                      >
                        {dashboard.isActive ? "Active" : "Inactive"}
                      </button>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(dashboard)}
                          className="gap-1"
                        >
                          <Edit className="w-4 h-4" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(dashboard.id)}
                          className="gap-1 text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* Create New Dashboard Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Dashboard</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* User Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Select User</label>
              <Select value={selectedUser} onValueChange={setSelectedUser}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a user" />
                </SelectTrigger>
                <SelectContent>
                  {mockUsers.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.role}</p>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Dashboard Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Dashboard Name</label>
              <Input
                placeholder="e.g., Performance Analytics"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Input
                placeholder="Brief description of this dashboard"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
