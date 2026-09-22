import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import PortalSidebar from "../../components/layout/PortalSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { toast } from "sonner";
import axios from "axios";
import { 
  FileText, 
  CreditCard, 
  Bell, 
  ArrowRight,
  Search,
  User
} from "lucide-react";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const PortalDashboard = () => {
  const { user, token } = useAuth();
  const [studentId, setStudentId] = useState("");
  const [studentInfo, setStudentInfo] = useState(null);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const response = await axios.get(`${API}/news`);
      setNews(response.data.slice(0, 3));
    } catch (error) {
      console.error("Failed to fetch news:", error);
    }
  };

  const lookupStudent = async () => {
    if (!studentId.trim()) {
      toast.error("Please enter a student ID");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(`${API}/students/by-student-id/${studentId}`);
      setStudentInfo(response.data);
      localStorage.setItem("linked_student_id", response.data.student_id);
      toast.success("Student found!");
    } catch (error) {
      toast.error("Student not found");
      setStudentInfo(null);
    } finally {
      setLoading(false);
    }
  };

  const savedStudentId = localStorage.getItem("linked_student_id");

  return (
    <div className="min-h-screen bg-cream">
      <PortalSidebar />
      
      <main className="ml-64 p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-ink" data-testid="portal-welcome">
            Welcome, {user?.full_name}
          </h1>
          <p className="text-muted-foreground">Access your results and make payments</p>
        </div>

        {/* Student Lookup */}
        {!studentInfo && !savedStudentId && (
          <Card className="mb-8 border-0 shadow-card" data-testid="student-lookup">
            <CardHeader>
              <CardTitle className="text-lg">Link Your Student Account</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Enter your student ID to access results and payment options.
              </p>
              <div className="flex gap-4">
                <div className="flex-1">
                  <Label htmlFor="student-id">Student ID</Label>
                  <Input
                    id="student-id"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    placeholder="e.g., GLIS2024XXXXXX"
                    className="mt-2"
                    data-testid="input-student-id"
                  />
                </div>
                <Button 
                  onClick={lookupStudent} 
                  disabled={loading}
                  className="mt-8 rounded-full"
                  data-testid="lookup-student-btn"
                >
                  <Search className="w-4 h-4 mr-2" />
                  {loading ? "Searching..." : "Find Student"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Student Info Card */}
        {(studentInfo || savedStudentId) && (
          <Card className="mb-8 border-0 shadow-card bg-primary text-white" data-testid="student-info-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                  <User className="w-8 h-8" />
                </div>
                <div>
                  <p className="text-xl font-bold">{studentInfo?.full_name || "Student"}</p>
                  <p className="text-blue-200">{studentInfo?.student_id || savedStudentId}</p>
                  <p className="text-blue-200 text-sm">{studentInfo?.class_level || "Class"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Link to="/portal/results">
            <Card className="border-0 shadow-card hover:shadow-float transition-shadow duration-300 cursor-pointer group" data-testid="quick-results">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-emerald-100 flex items-center justify-center group-hover:bg-emerald-500 transition-colors duration-300">
                  <FileText className="w-7 h-7 text-emerald-600 group-hover:text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-ink">View Results</h3>
                  <p className="text-muted-foreground text-sm">Check your academic performance</p>
                </div>
                <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-primary" />
              </CardContent>
            </Card>
          </Link>

          <Link to="/portal/payments">
            <Card className="border-0 shadow-card hover:shadow-float transition-shadow duration-300 cursor-pointer group" data-testid="quick-payments">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-sun/20 flex items-center justify-center group-hover:bg-coral transition-colors duration-300">
                  <CreditCard className="w-7 h-7 text-sun group-hover:text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-ink">Make Payment</h3>
                  <p className="text-muted-foreground text-sm">Pay school fees securely online</p>
                </div>
                <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-primary" />
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Recent News */}
        <Card className="border-0 shadow-card" data-testid="portal-news">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Latest Announcements
              </CardTitle>
              <Link to="/news" className="text-primary text-sm font-medium hover:underline">
                View All
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {news.length > 0 ? (
              <div className="space-y-4">
                {news.map((item) => (
                  <div key={item.id} className="flex gap-4 pb-4 border-b border-slate-100 last:border-0 last:pb-0">
                    <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                      <Bell className="w-6 h-6 text-slate-400" />
                    </div>
                    <div>
                      <h4 className="font-medium text-ink">{item.title}</h4>
                      <p className="text-muted-foreground text-sm line-clamp-2">{item.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-4">No announcements yet</p>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default PortalDashboard;
