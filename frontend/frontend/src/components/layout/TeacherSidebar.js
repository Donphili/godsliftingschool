import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import ThemeToggle from "../ThemeToggle";
import {
  LayoutDashboard,
  Users,
  FileText,
  LogOut,
  GraduationCap,
  Home,
  Menu,
  X
} from "lucide-react";

const TeacherSidebar = () => {
  const { pathname } = useLocation();
  const { logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    { to: "/teacher", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/teacher/students", icon: Users, label: "My Students" },
    { to: "/teacher/results", icon: FileText, label: "Results" },
  ];

  return (
    <>
      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 h-16 bg-ink border-b border-white/10 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <GraduationCap className="w-6 h-6 text-sky" />
          <span className="font-display font-bold text-sm text-white">God's Lifting</span>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="text-white p-2"
          aria-label="Toggle menu"
          data-testid="teacher-mobile-menu-toggle"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-ink text-white flex flex-col z-50 transition-transform duration-300 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
        data-testid="teacher-sidebar"
      >
        <div className="hidden md:flex p-6 border-b border-white/10 items-center justify-between gap-2">
          <div className="flex items-center gap-3 min-w-0">
            <GraduationCap className="w-8 h-8 text-sky shrink-0" />
            <div className="min-w-0">
              <h2 className="font-display font-bold text-sm truncate">God's Lifting</h2>
              <p className="text-xs text-white/50">Teacher Portal</p>
            </div>
          </div>
          <ThemeToggle className="!border-white/20 !bg-white/10 shrink-0" />
        </div>

        <div className="pt-16 md:pt-0 flex flex-col flex-1 overflow-y-auto">
          <nav className="flex-1 py-4">
            {links.map(({ to, icon: Icon, label }) => {
              const active = pathname === to;
              return (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setMobileOpen(false)}
                  data-testid={`teacher-nav-${label.toLowerCase().replace(/\s+/g, '-')}`}
                  className={`flex items-center gap-3 px-6 py-3 text-sm transition-colors ${
                    active
                      ? "bg-sky/20 text-sky border-r-2 border-sky"
                      : "text-white/60 hover:bg-card/10 hover:text-white"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-white/10 space-y-1">
            <Link
              to="/"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 px-2 py-2 text-sm text-white/60 hover:text-white transition-colors w-full"
              data-testid="teacher-back-to-site"
            >
              <Home className="w-4 h-4" />
              Back to Site
            </Link>
            <button
              onClick={logout}
              data-testid="teacher-logout-btn"
              className="flex items-center gap-3 px-2 py-2 text-sm text-white/60 hover:text-coral transition-colors w-full"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default TeacherSidebar;
