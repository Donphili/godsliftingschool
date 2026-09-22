import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import TeacherSidebar from "../../components/layout/TeacherSidebar";
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
import { Plus, FileText, Trash2 } from "lucide-react";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const TeacherResults = () => {
  const { token } = useAuth();
  const [results, setResults] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [session, setSession] = useState("2024/2025");
  const [term, setTerm] = useState("");
  const [subjects, setSubjects] = useState([
    { name: "", ca_score: 0, exam_score: 0 }
  ]);

  useEffect(() => {
    fetchData();
  }, [token]);

  const fetchData = async () => {
    try {
      const [resultsRes, studentsRes] = await Promise.all([
        axios.get(`${API}/teachers/portal/results`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API}/teachers/portal/students`, { headers: { Authorization: `Bearer ${token}` } })
      ]);
      setResults(resultsRes.data);
      setStudents(studentsRes.data);
    } catch {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const addSubject = () => {
    setSubjects([...subjects, { name: "", ca_score: 0, exam_score: 0 }]);
  };

  const removeSubject = (index) => {
    setSubjects(subjects.filter((_, i) => i !== index));
  };

  const updateSubject = (index, field, value) => {
    const updated = [...subjects];
    updated[index][field] = field === "name" ? value : parseInt(value) || 0;
    setSubjects(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedStudent || !term || subjects.some(s => !s.name)) {
      toast.error("Please fill all required fields");
      return;
    }
    try {
      await axios.post(`${API}/teachers/portal/results`, {
        student_id: selectedStudent,
        session,
        term,
        subjects
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Result uploaded successfully");
      setDialogOpen(false);
      setSubjects([{ name: "", ca_score: 0, exam_score: 0 }]);
      setSelectedStudent("");
      setTerm("");
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.detail || "Failed to upload result");
    }
  };

  const deleteResult = async (id) => {
    if (!window.confirm("Delete this result?")) return;
    try {
      await axios.delete(`${API}/teachers/portal/results/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Result deleted");
      fetchData();
    } catch {
      toast.error("Failed to delete result");
    }
  };

  const termOptions = ["First Term", "Second Term", "Third Term"];
  const sessionOptions = ["2023/2024", "2024/2025", "2025/2026"];

  return (
    <div className="min-h-screen bg-cream">
      <TeacherSidebar />
      <main className="ml-64 p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-ink" data-testid="teacher-results-title">Results Management</h1>
            <p className="text-muted-foreground">Upload and manage student results</p>
          </div>

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="rounded-full" data-testid="upload-result-btn">
                <Plus className="w-4 h-4 mr-2" />
                Upload Result
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Upload Student Result</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-3 gap-4">
                  <div>
                    <Label>Student *</Label>
                    <Select onValueChange={setSelectedStudent}>
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Select student" />
                      </SelectTrigger>
                      <SelectContent>
                        {students.map(s => (
                          <SelectItem key={s.student_id} value={s.student_id}>
                            {s.full_name} ({s.student_id})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Session *</Label>
                    <Select value={session} onValueChange={setSession}>
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {sessionOptions.map(s => (
                          <SelectItem key={s} value={s}>{s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Term *</Label>
                    <Select onValueChange={setTerm}>
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Select term" />
                      </SelectTrigger>
                      <SelectContent>
                        {termOptions.map(t => (
                          <SelectItem key={t} value={t}>{t}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label>Subjects</Label>
                    <Button type="button" variant="outline" size="sm" onClick={addSubject}>
                      <Plus className="w-3 h-3 mr-1" /> Add Subject
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {subjects.map((sub, i) => (
                      <div key={i} className="flex gap-2 items-center">
                        <Input
                          placeholder="Subject name"
                          value={sub.name}
                          onChange={e => updateSubject(i, "name", e.target.value)}
                          className="flex-1"
                        />
                        <Input
                          type="number"
                          placeholder="CA"
                          value={sub.ca_score || ""}
                          onChange={e => updateSubject(i, "ca_score", e.target.value)}
                          className="w-20"
                          min="0"
                          max="40"
                        />
                        <Input
                          type="number"
                          placeholder="Exam"
                          value={sub.exam_score || ""}
                          onChange={e => updateSubject(i, "exam_score", e.target.value)}
                          className="w-20"
                          min="0"
                          max="60"
                        />
                        {subjects.length > 1 && (
                          <Button type="button" variant="ghost" size="sm" onClick={() => removeSubject(i)}>
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-4">
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                  <Button type="submit" data-testid="submit-result-btn">Upload Result</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card className="border-0 shadow-card">
          <CardContent className="p-0">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin h-8 w-8 border-4 border-emerald-500 border-t-transparent rounded-full mx-auto"></div>
              </div>
            ) : results.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student ID</TableHead>
                    <TableHead>Session</TableHead>
                    <TableHead>Term</TableHead>
                    <TableHead>Subjects</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {results.map((r) => (
                    <TableRow key={r.id} data-testid={`result-row-${r.id}`}>
                      <TableCell className="font-mono text-sm">{r.student_id}</TableCell>
                      <TableCell>{r.session}</TableCell>
                      <TableCell>{r.term}</TableCell>
                      <TableCell>{r.subjects?.length || 0} subjects</TableCell>
                      <TableCell>{new Date(r.created_at).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteResult(r.id)}
                          data-testid={`delete-result-${r.id}`}
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
                <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-ink mb-2">No Results Yet</h3>
                <p className="text-muted-foreground">Upload results for students in your classes</p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default TeacherResults;
