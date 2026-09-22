import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import AdminSidebar from "../../components/layout/AdminSidebar";
import { Card, CardContent } from "../../components/ui/card";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { toast } from "sonner";
import axios from "axios";
import { Plus, UserCheck, Trash2 } from "lucide-react";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const classOptions = [
  "Pre-School",
  "Basic 1", "Basic 2", "Basic 3", "Basic 4", "Basic 5", "Basic 6",
  "JSS 1", "JSS 2", "JSS 3",
  "SSS 1", "SSS 2", "SSS 3"
];

const AdminTeachers = () => {
  const { token } = useAuth();
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "", email: "", phone: "", password: "",
    assigned_classes: [], subjects: ""
  });

  useEffect(() => { fetchTeachers(); }, []);

  const fetchTeachers = async () => {
    try {
      const res = await axios.get(`${API}/teachers`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTeachers(res.data);
    } catch { toast.error("Failed to fetch teachers"); }
    finally { setLoading(false); }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const toggleClass = (cls) => {
    setFormData(prev => ({
      ...prev,
      assigned_classes: prev.assigned_classes.includes(cls)
        ? prev.assigned_classes.filter(c => c !== cls)
        : [...prev.assigned_classes, cls]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/teachers`, {
        ...formData,
        subjects: formData.subjects.split(",").map(s => s.trim()).filter(Boolean)
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Teacher created successfully");
      setDialogOpen(false);
      setFormData({ full_name: "", email: "", phone: "", password: "", assigned_classes: [], subjects: "" });
      fetchTeachers();
    } catch (error) {
      toast.error(error.response?.data?.detail || "Failed to create teacher");
    }
  };

  const deleteTeacher = async (id) => {
    if (!window.confirm("Are you sure you want to delete this teacher?")) return;
    try {
      await axios.delete(`${API}/teachers/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Teacher deleted");
      fetchTeachers();
    } catch { toast.error("Failed to delete teacher"); }
  };

  return (
    <div className="min-h-screen bg-cream">
      <AdminSidebar />
      <main className="ml-64 p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-ink" data-testid="teachers-title">Teachers</h1>
            <p className="text-muted-foreground">Manage teacher accounts and class assignments</p>
          </div>

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="rounded-full" data-testid="add-teacher-btn">
                <Plus className="w-4 h-4 mr-2" /> Add Teacher
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Teacher</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label>Full Name *</Label>
                    <Input name="full_name" value={formData.full_name} onChange={handleChange} className="mt-2" required />
                  </div>
                  <div>
                    <Label>Email *</Label>
                    <Input name="email" type="email" value={formData.email} onChange={handleChange} className="mt-2" required />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label>Phone</Label>
                    <Input name="phone" value={formData.phone} onChange={handleChange} className="mt-2" />
                  </div>
                  <div>
                    <Label>Password *</Label>
                    <Input name="password" type="password" value={formData.password} onChange={handleChange} className="mt-2" required />
                  </div>
                </div>
                <div>
                  <Label>Subjects (comma separated)</Label>
                  <Input name="subjects" value={formData.subjects} onChange={handleChange} className="mt-2" placeholder="e.g. Mathematics, English Language, Basic Science" />
                </div>
                <div>
                  <Label className="mb-2 block">Assigned Classes</Label>
                  <div className="flex flex-wrap gap-2">
                    {classOptions.map(cls => (
                      <button
                        key={cls}
                        type="button"
                        onClick={() => toggleClass(cls)}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                          formData.assigned_classes.includes(cls)
                            ? "bg-primary text-white"
                            : "bg-slate-100 text-muted-foreground hover:bg-slate-200"
                        }`}
                      >
                        {cls}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex justify-end gap-4">
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                  <Button type="submit" data-testid="submit-teacher-btn">Add Teacher</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card className="border-0 shadow-card">
          <CardContent className="p-0">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
              </div>
            ) : teachers.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Classes</TableHead>
                    <TableHead>Subjects</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teachers.map(t => (
                    <TableRow key={t.id} data-testid={`teacher-row-${t.id}`}>
                      <TableCell className="font-medium">{t.full_name}</TableCell>
                      <TableCell>{t.email}</TableCell>
                      <TableCell>{t.phone || "-"}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {(t.assigned_classes || []).map(c => (
                            <span key={c} className="px-2 py-0.5 bg-blue-50 text-violet rounded text-xs">{c}</span>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {(t.subjects || []).map(s => (
                            <span key={s} className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded text-xs">{s}</span>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" onClick={() => deleteTeacher(t.id)} data-testid={`delete-teacher-${t.id}`}>
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-12">
                <UserCheck className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-ink mb-2">No Teachers Yet</h3>
                <p className="text-muted-foreground">Add teachers and assign them to classes</p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AdminTeachers;
