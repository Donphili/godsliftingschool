import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import AdminSidebar from "../../components/layout/AdminSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { toast } from "sonner";
import axios from "axios";
import { Plus, Users, Search, Trash2 } from "lucide-react";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const AdminStudents = () => {
  const { token } = useAuth();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [classFilter, setClassFilter] = useState("");
  
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    date_of_birth: "",
    gender: "",
    class_level: "",
    parent_name: "",
    parent_phone: "",
    parent_email: "",
    address: ""
  });

  const classOptions = [
    "Pre-School",
    "Basic 1", "Basic 2", "Basic 3", "Basic 4", "Basic 5", "Basic 6",
    "JSS 1", "JSS 2", "JSS 3",
    "SSS 1", "SSS 2", "SSS 3"
  ];

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await axios.get(`${API}/students`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStudents(response.data);
    } catch (error) {
      toast.error("Failed to fetch students");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/students`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Student added successfully");
      setDialogOpen(false);
      setFormData({
        full_name: "",
        email: "",
        phone: "",
        date_of_birth: "",
        gender: "",
        class_level: "",
        parent_name: "",
        parent_phone: "",
        parent_email: "",
        address: ""
      });
      fetchStudents();
    } catch (error) {
      toast.error(error.response?.data?.detail || "Failed to add student");
    }
  };

  const deleteStudent = async (id) => {
    if (!window.confirm("Are you sure you want to delete this student?")) return;
    try {
      await axios.delete(`${API}/students/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Student deleted");
      fetchStudents();
    } catch (error) {
      toast.error("Failed to delete student");
    }
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          student.student_id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = !classFilter || student.class_level === classFilter;
    return matchesSearch && matchesClass;
  });

  return (
    <div className="min-h-screen bg-cream">
      <AdminSidebar />
      
      <main className="ml-64 p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-ink" data-testid="students-title">
              Students
            </h1>
            <p className="text-muted-foreground">Manage enrolled students</p>
          </div>
          
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="rounded-full" data-testid="add-student-btn">
                <Plus className="w-4 h-4 mr-2" />
                Add Student
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Student</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label>Full Name *</Label>
                    <Input
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleChange}
                      className="mt-2"
                      required
                    />
                  </div>
                  <div>
                    <Label>Email *</Label>
                    <Input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="mt-2"
                      required
                    />
                  </div>
                </div>
                
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label>Phone</Label>
                    <Input
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label>Date of Birth *</Label>
                    <Input
                      name="date_of_birth"
                      type="date"
                      value={formData.date_of_birth}
                      onChange={handleChange}
                      className="mt-2"
                      required
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label>Gender *</Label>
                    <Select onValueChange={(v) => setFormData(prev => ({ ...prev, gender: v }))}>
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Class *</Label>
                    <Select onValueChange={(v) => setFormData(prev => ({ ...prev, class_level: v }))}>
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Select class" />
                      </SelectTrigger>
                      <SelectContent>
                        {classOptions.map((cls) => (
                          <SelectItem key={cls} value={cls}>{cls}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label>Parent Name *</Label>
                    <Input
                      name="parent_name"
                      value={formData.parent_name}
                      onChange={handleChange}
                      className="mt-2"
                      required
                    />
                  </div>
                  <div>
                    <Label>Parent Phone *</Label>
                    <Input
                      name="parent_phone"
                      value={formData.parent_phone}
                      onChange={handleChange}
                      className="mt-2"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label>Parent Email *</Label>
                  <Input
                    name="parent_email"
                    type="email"
                    value={formData.parent_email}
                    onChange={handleChange}
                    className="mt-2"
                    required
                  />
                </div>

                <div>
                  <Label>Address *</Label>
                  <Input
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="mt-2"
                    required
                  />
                </div>

                <div className="flex justify-end gap-4">
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Add Student</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters */}
        <Card className="border-0 shadow-card mb-6">
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    placeholder="Search by name or ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                    data-testid="search-students"
                  />
                </div>
              </div>
              <Select onValueChange={(v) => setClassFilter(v === "all" ? "" : v)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="All Classes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Classes</SelectItem>
                  {classOptions.map((cls) => (
                    <SelectItem key={cls} value={cls}>{cls}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Students Table */}
        <Card className="border-0 shadow-card">
          <CardContent className="p-0">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
              </div>
            ) : filteredStudents.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Parent</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.map((student) => (
                    <TableRow key={student.id} data-testid={`student-row-${student.id}`}>
                      <TableCell className="font-mono text-sm">{student.student_id}</TableCell>
                      <TableCell className="font-medium">{student.full_name}</TableCell>
                      <TableCell>{student.class_level}</TableCell>
                      <TableCell>{student.parent_name}</TableCell>
                      <TableCell>{student.parent_phone}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteStudent(student.id)}
                          data-testid={`delete-student-${student.id}`}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-ink mb-2">No Students Found</h3>
                <p className="text-muted-foreground">Add students or adjust your search filters</p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AdminStudents;
