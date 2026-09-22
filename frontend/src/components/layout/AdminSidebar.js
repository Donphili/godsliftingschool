import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  LayoutDashboard,
  Users,
  FileText,
  ClipboardList,
  Newspaper,
  Calendar,
  Image,
  MessageSquare,
  CreditCard,
  LogOut,
  GraduationCap,
  Home,
  UserCheck,
  Settings
} from "lucide-react";

const AdminSidebar = () => {
  const location = useLocation();
  const { user, logout, isAdmin } = useAuth();

  const menuItems = [
    { name: "Dashboard", path: "/admin", icon: LayoutDashboard },
    { name: "Students", path: "/admin/students", icon: Users },
    { name: "Teachers", path: "/admin/teachers", icon: UserCheck, adminOnly: true },
    { name: "Results", path: "/admin/results", icon: FileText },
    { name: "Applications", path: "/admin/applications", icon: ClipboardList, adminOnly: true },
    { name: "News", path: "/admin/news", icon: Newspaper, adminOnly: true },
    { name: "Events", path: "/admin/events", icon: Calendar, adminOnly: true },
    { name: "Gallery", path: "/admin/gallery", icon: Image, adminOnly: true },
    { name: "Messages", path: "/admin/messages", icon: MessageSquare, adminOnly: true },
    { name: "Payments", path: "/admin/payments", icon: CreditCard, adminOnly: true },
    { name: "Settings", path: "/admin/settings", icon: Settings, adminOnly: true },
  ];

  const filteredMenuItems = menuItems.filter(item => !item.adminOnly || isAdmin);

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="w-64 bg-ink border-r-4 border-ink min-h-screen fixed left-0 top-0 z-40">
      <div className="flex flex-col h-screen p-6 overflow-y-auto">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 mb-8" data-testid="admin-logo">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet to-coral flex items-center justify-center rotate-3">
            <GraduationCap className="w-6 h-6 text-white -rotate-3" />
          </div>
          <div>
            <h1 className="font-display font-bold text-sm text-white">God's Lifting</h1>
            <p className="text-xs text-white/50">Admin Panel</p>
          </div>
        </Link>

        {/* User Info */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-6">
          <p className="font-semibold text-white text-sm">{user?.full_name}</p>
          <p className="text-xs text-sun capitalize font-semibold">{user?.role}</p>
        </div>

        {/* Navigation */}
        <nav className="space-y-1">
          {filteredMenuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                data-testid={`admin-nav-${item.name.toLowerCase().replace(' ', '-')}`}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-colors duration-200 ${
                  isActive(item.path)
                    ? "bg-sun text-ink"
                    : "text-white/60 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="mt-auto border-t border-white/10 pt-4 px-0 pb-2 space-y-1">
          <Link
            to="/"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/60 hover:bg-white/10 hover:text-white font-semibold text-sm"
            data-testid="back-to-site"
          >
            <Home className="w-5 h-5" />
            Back to Site
          </Link>
          <button
            onClick={logout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-coral hover:bg-coral/10 font-semibold text-sm w-full"
            data-testid="admin-logout"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;
