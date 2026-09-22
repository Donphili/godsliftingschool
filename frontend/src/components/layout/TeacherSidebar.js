import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  LayoutDashboard,
  Users,
  FileText,
  LogOut,
  GraduationCap
} from "lucide-react";

const TeacherSidebar = () => {
  const { pathname } = useLocation();
  const { logout } = useAuth();

  const links = [
    { to: "/teacher", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/teacher/students", icon: Users, label: "My Students" },
    { to: "/teacher/results", icon: FileText, label: "Results" },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-ink text-white flex flex-col z-50" data-testid="teacher-sidebar">
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <GraduationCap className="w-8 h-8 text-sky" />
          <div>
            <h2 className="font-display font-bold text-sm">God's Lifting</h2>
            <p className="text-xs text-white/50">Teacher Portal</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 py-4">
        {links.map(({ to, icon: Icon, label }) => {
          const active = pathname === to;
          return (
            <Link
              key={to}
              to={to}
              data-testid={`teacher-nav-${label.toLowerCase().replace(/\s+/g, '-')}`}
              className={`flex items-center gap-3 px-6 py-3 text-sm transition-colors ${
                active
                  ? "bg-sky/20 text-sky border-r-2 border-sky"
                  : "text-white/60 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/10">
        <button
          onClick={logout}
          data-testid="teacher-logout-btn"
          className="flex items-center gap-3 px-2 py-2 text-sm text-white/60 hover:text-red-400 transition-colors w-full"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default TeacherSidebar;
