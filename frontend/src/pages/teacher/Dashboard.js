import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import TeacherSidebar from "../../components/layout/TeacherSidebar";
import { Card, CardContent } from "../../components/ui/card";
import { Link } from "react-router-dom";
import { Users, FileText, BookOpen } from "lucide-react";
import axios from "axios";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const TeacherDashboard = () => {
  const { token } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await axios.get(`${API}/teachers/portal/dashboard`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setData(res.data);
      } catch {
        // fallback
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, [token]);

  const stats = data?.stats || {};
  const teacher = data?.teacher || {};

  return (
    <div className="min-h-screen bg-cream">
      <TeacherSidebar />
      <main className="ml-64 p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-ink" data-testid="teacher-dashboard-title">
            Welcome, {teacher.full_name || "Teacher"}
          </h1>
          <p className="text-muted-foreground">Manage your classes and student results</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin h-8 w-8 border-4 border-emerald-500 border-t-transparent rounded-full"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Link to="/teacher/students" data-testid="stat-students">
                <Card className="border-0 shadow-card hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-sky/20 rounded-xl flex items-center justify-center">
                        <Users className="w-6 h-6 text-violet" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-ink">{stats.total_students || 0}</p>
                        <p className="text-sm text-muted-foreground">My Students</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>

              <Link to="/teacher/results" data-testid="stat-results">
                <Card className="border-0 shadow-card hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                        <FileText className="w-6 h-6 text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-ink">{stats.total_results_uploaded || 0}</p>
                        <p className="text-sm text-muted-foreground">Results Uploaded</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>

              <Card className="border-0 shadow-card">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-sun/20 rounded-xl flex items-center justify-center">
                      <BookOpen className="w-6 h-6 text-sun" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-ink">{stats.assigned_classes_count || 0}</p>
                      <p className="text-sm text-muted-foreground">Assigned Classes</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {teacher.assigned_classes?.length > 0 && (
              <Card className="border-0 shadow-card">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-ink mb-4">Your Assigned Classes</h3>
                  <div className="flex flex-wrap gap-2">
                    {teacher.assigned_classes.map((cls) => (
                      <span key={cls} className="px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-sm font-medium">
                        {cls}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default TeacherDashboard;
