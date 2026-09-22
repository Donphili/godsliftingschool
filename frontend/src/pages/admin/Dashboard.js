import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import AdminSidebar from "../../components/layout/AdminSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import axios from "axios";
import { 
  Users, 
  FileText, 
  ClipboardList, 
  CreditCard, 
  MessageSquare,
  TrendingUp,
  ArrowRight
} from "lucide-react";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const AdminDashboard = () => {
  const { user, token } = useAuth();
  const [stats, setStats] = useState({
    total_students: 0,
    total_applications: 0,
    pending_applications: 0,
    completed_payments: 0,
    unread_messages: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${API}/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(response.data);
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: "Total Students",
      value: stats.total_students,
      icon: Users,
      color: "bg-blue-500",
      link: "/admin/students"
    },
    {
      title: "Applications",
      value: stats.total_applications,
      icon: ClipboardList,
      color: "bg-coral",
      link: "/admin/applications",
      subtext: `${stats.pending_applications} pending`
    },
    {
      title: "Payments",
      value: stats.completed_payments,
      icon: CreditCard,
      color: "bg-emerald-500",
      link: "/admin/payments"
    },
    {
      title: "Messages",
      value: stats.unread_messages,
      icon: MessageSquare,
      color: "bg-purple-500",
      link: "/admin/messages",
      subtext: "unread"
    }
  ];

  const quickActions = [
    { title: "Add Student", link: "/admin/students", icon: Users },
    { title: "Upload Results", link: "/admin/results", icon: FileText },
    { title: "Post News", link: "/admin/news", icon: TrendingUp },
    { title: "Add Event", link: "/admin/events", icon: ClipboardList }
  ];

  return (
    <div className="min-h-screen bg-cream">
      <AdminSidebar />
      
      <main className="ml-64 p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-ink" data-testid="admin-welcome">
            Welcome, {user?.full_name}
          </h1>
          <p className="text-muted-foreground">Here's what's happening at your school</p>
        </div>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Link key={index} to={stat.link}>
                <Card 
                  className="border-0 shadow-card hover:shadow-float transition-all duration-300 cursor-pointer"
                  data-testid={`stat-card-${index}`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <ArrowRight className="w-5 h-5 text-slate-300" />
                    </div>
                    <h3 className="text-3xl font-bold text-ink">
                      {loading ? "..." : stat.value}
                    </h3>
                    <p className="text-muted-foreground text-sm">{stat.title}</p>
                    {stat.subtext && (
                      <p className="text-xs text-slate-400 mt-1">{stat.subtext}</p>
                    )}
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Quick Actions */}
        <Card className="border-0 shadow-card mb-8" data-testid="quick-actions">
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <Link key={index} to={action.link}>
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-cream hover:bg-slate-100 transition-colors duration-200">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <span className="font-medium text-ink/80">{action.title}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity Placeholder */}
        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="border-0 shadow-card">
            <CardHeader>
              <CardTitle className="text-lg">Recent Applications</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center py-8">
                View all applications in the Applications section
              </p>
              <Link to="/admin/applications" className="block text-center text-primary font-medium hover:underline">
                View Applications →
              </Link>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-card">
            <CardHeader>
              <CardTitle className="text-lg">Recent Payments</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center py-8">
                View all payments in the Payments section
              </p>
              <Link to="/admin/payments" className="block text-center text-primary font-medium hover:underline">
                View Payments →
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
