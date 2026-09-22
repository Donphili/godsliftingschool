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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import { toast } from "sonner";
import axios from "axios";
import { Plus, FileText, Trash2, CheckCircle, XCircle, Clock, Unlock } from "lucide-react";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const AdminResults = () => {
  const { token } = useAuth();
  const [results, setResults] = useState([]);
  const [accessRequests, setAccessRequests] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("results");
  
  const [formData, setFormData] = useState({
    student_id: "",
    session: "2024/2025",
    term: "First Term",
    subjects: [
      { name: "English Language", ca_score: 0, exam_score: 0 },
      { name: "Mathematics", ca_score: 0, exam_score: 0 },
      { name: "Basic Science", ca_score: 0, exam_score: 0 },
      { name: "Social Studies", ca_score: 0, exam_score: 0 },
      { name: "Civic Education", ca_score: 0, exam_score: 0 }
    ]
  });

  const sessions = ["2024/2025", "2023/2024"];
  const terms = ["First Term", "Second Term", "Third Term"];
  
  const defaultSubjects = [
    "English Language", "Mathematics", "Basic Science", "Social Studies", 
    "Civic Education", "Agricultural Science", "Home Economics", 
    "Physical and Health Education", "Computer Studies", "Christian Religious Studies"
  ];

  useEffect(() => {
    fetchResults();
    fetchStudents();
    fetchAccessRequests();
  }, []);

  const fetchResults = async () => {
    try {
      const response = await axios.get(`${API}/results`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setResults(response.data);
    } catch (error) {
      console.error("Failed to fetch results:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await axios.get(`${API}/students`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStudents(response.data);
    } catch (error) {
      console.error("Failed to fetch students:", error);
    }
  };

  const fetchAccessRequests = async () => {
    try {
      const response = await axios.get(`${API}/results/access-requests`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAccessRequests(response.data);
    } catch (error) {
      console.error("Failed to fetch access requests:", error);
    }
  };

  const handleSubjectChange = (index, field, value) => {
    const newSubjects = [...formData.subjects];
    newSubjects[index][field] = field === "name" ? value : parseInt(value) || 0;
    setFormData(prev => ({ ...prev, subjects: newSubjects }));
  };

  const addSubject = () => {
    setFormData(prev => ({
      ...prev,
      subjects: [...prev.subjects, { name: "", ca_score: 0, exam_score: 0 }]
    }));
  };

  const removeSubject = (index) => {
    setFormData(prev => ({
      ...prev,
      subjects: prev.subjects.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.student_id) {
      toast.error("Please select a student");
      return;
    }

    try {
      await axios.post(`${API}/results`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Result uploaded successfully");
      setDialogOpen(false);
      fetchResults();
    } catch (error) {
      toast.error(error.response?.data?.detail || "Failed to upload result");
    }
  };

  const deleteResult = async (id) => {
    if (!window.confirm("Are you sure you want to delete this result?")) return;
    
    try {
      await axios.delete(`${API}/results/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Result deleted");
      fetchResults();
    } catch (error) {
      toast.error("Failed to delete result");
    }
  };

  const approveAccess = async (requestId) => {
    try {
      await axios.put(`${API}/results/access/${requestId}/approve`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Access approved! Student has been notified.");
      fetchAccessRequests();
    } catch (error) {
      toast.error("Failed to approve access");
    }
  };

  const rejectAccess = async (requestId) => {
    if (!window.confirm("Are you sure you want to reject this request?")) return;
    
    try {
      await axios.put(`${API}/results/access/${requestId}/reject`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Access rejected");
      fetchAccessRequests();
    } catch (error) {
      toast.error("Failed to reject access");
    }
  };

  const calculateAverage = (subjects) => {
    if (!subjects || subjects.length === 0) return 0;
    const total = subjects.reduce((sum, s) => sum + (s.total || s.ca_score + s.exam_score), 0);
    return (total / subjects.length).toFixed(1);
  };

  const pendingRequests = accessRequests.filter(r => r.status === "pending");

  return (
    <div className="min-h-screen bg-cream">
      <AdminSidebar />
      
      <main className="ml-64 p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-ink" data-testid="results-admin-title">
              Results Management
            </h1>
            <p className="text-muted-foreground">Upload results and manage download access</p>
          </div>
          
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="rounded-full" data-testid="upload-result-btn">
                <Plus className="w-4 h-4 mr-2" />
                Upload Result
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Upload Student Result</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-3 gap-4">
                  <div>
                    <Label>Student *</Label>
                    <Select onValueChange={(v) => setFormData(prev => ({ ...prev, student_id: v }))}>
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Select student" />
                      </SelectTrigger>
                      <SelectContent>
                        {students.map((student) => (
                          <SelectItem key={student.id} value={student.student_id}>
                            {student.full_name} ({student.student_id})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Session *</Label>
                    <Select 
                      value={formData.session}
                      onValueChange={(v) => setFormData(prev => ({ ...prev, session: v }))}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {sessions.map((s) => (
                          <SelectItem key={s} value={s}>{s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Term *</Label>
                    <Select 
                      value={formData.term}
                      onValueChange={(v) => setFormData(prev => ({ ...prev, term: v }))}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {terms.map((t) => (
                          <SelectItem key={t} value={t}>{t}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Subjects */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <Label>Subjects</Label>
                    <Button type="button" variant="outline" size="sm" onClick={addSubject}>
                      <Plus className="w-4 h-4 mr-1" />
                      Add Subject
                    </Button>
                  </div>
                  
                  <div className="space-y-3">
                    {formData.subjects.map((subject, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-cream rounded-lg">
                        <div className="flex-1">
                          <Select 
                            value={subject.name}
                            onValueChange={(v) => handleSubjectChange(index, "name", v)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select subject" />
                            </SelectTrigger>
                            <SelectContent>
                              {defaultSubjects.map((s) => (
                                <SelectItem key={s} value={s}>{s}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="w-24">
                          <Input
                            type="number"
                            placeholder="CA"
                            value={subject.ca_score || ""}
                            onChange={(e) => handleSubjectChange(index, "ca_score", e.target.value)}
                            max={40}
                          />
                        </div>
                        <div className="w-24">
                          <Input
                            type="number"
                            placeholder="Exam"
                            value={subject.exam_score || ""}
                            onChange={(e) => handleSubjectChange(index, "exam_score", e.target.value)}
                            max={60}
                          />
                        </div>
                        <div className="w-16 text-center font-semibold">
                          {subject.ca_score + subject.exam_score}
                        </div>
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="sm"
                          onClick={() => removeSubject(index)}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-4">
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Upload Result</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList>
            <TabsTrigger value="results">All Results</TabsTrigger>
            <TabsTrigger value="access" className="relative">
              Access Requests
              {pendingRequests.length > 0 && (
                <span className="ml-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {pendingRequests.length}
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          {/* Results Tab */}
          <TabsContent value="results">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
              </div>
            ) : results.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.map((result) => (
                  <Card 
                    key={result.id} 
                    className="border-0 shadow-card"
                    data-testid={`result-card-${result.id}`}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <FileText className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <CardTitle className="text-base">{result.student_id}</CardTitle>
                            <p className="text-sm text-muted-foreground">{result.session}</p>
                          </div>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => deleteResult(result.id)}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">{result.term}</span>
                        <div className="text-right">
                          <span className="text-sm text-muted-foreground">Average</span>
                          <p className="text-xl font-bold text-primary">{calculateAverage(result.subjects)}%</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="border-0 shadow-card">
                <CardContent className="py-12 text-center">
                  <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-ink mb-2">No Results Yet</h3>
                  <p className="text-muted-foreground">Upload your first student result</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Access Requests Tab */}
          <TabsContent value="access">
            <Card className="border-0 shadow-card">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Unlock className="w-5 h-5" />
                  Result Download Requests
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {accessRequests.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Student ID</TableHead>
                        <TableHead>Session / Term</TableHead>
                        <TableHead>Bank Reference</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {accessRequests.map((request) => (
                        <TableRow key={request.id}>
                          <TableCell className="font-mono">{request.student_id}</TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">{request.session}</p>
                              <p className="text-sm text-muted-foreground">{request.term}</p>
                            </div>
                          </TableCell>
                          <TableCell>{request.bank_reference}</TableCell>
                          <TableCell>₦{request.amount_paid?.toLocaleString()}</TableCell>
                          <TableCell>
                            {request.status === "approved" && (
                              <span className="flex items-center gap-1 text-emerald-600">
                                <CheckCircle className="w-4 h-4" />
                                Approved
                              </span>
                            )}
                            {request.status === "pending" && (
                              <span className="flex items-center gap-1 text-sun">
                                <Clock className="w-4 h-4" />
                                Pending
                              </span>
                            )}
                            {request.status === "rejected" && (
                              <span className="flex items-center gap-1 text-red-600">
                                <XCircle className="w-4 h-4" />
                                Rejected
                              </span>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            {request.status === "pending" && (
                              <div className="flex justify-end gap-2">
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  className="text-emerald-600 border-emerald-200 hover:bg-emerald-50"
                                  onClick={() => approveAccess(request.id)}
                                >
                                  <CheckCircle className="w-4 h-4 mr-1" />
                                  Approve
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  className="text-red-600 border-red-200 hover:bg-red-50"
                                  onClick={() => rejectAccess(request.id)}
                                >
                                  <XCircle className="w-4 h-4 mr-1" />
                                  Reject
                                </Button>
                              </div>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-12">
                    <Unlock className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-ink mb-2">No Access Requests</h3>
                    <p className="text-muted-foreground">When students pay and submit receipts, they will appear here</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminResults;
