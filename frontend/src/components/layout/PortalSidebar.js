import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  LayoutDashboard,
  FileText,
  CreditCard,
  LogOut,
  GraduationCap,
  Home,
  User
} from "lucide-react";

const PortalSidebar = () => {
  const location = useLocation();
  const { user, logout } = useAuth();

  const menuItems = [
    { name: "Dashboard", path: "/portal", icon: LayoutDashboard },
    { name: "My Results", path: "/portal/results", icon: FileText },
    { name: "Payments", path: "/portal/payments", icon: CreditCard },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="w-64 bg-white border-r border-ink/10 min-h-screen fixed left-0 top-0 z-40">
      <div className="p-6">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 mb-8" data-testid="portal-logo">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet to-sky flex items-center justify-center rotate-3">
            <GraduationCap className="w-6 h-6 text-white -rotate-3" />
          </div>
          <div>
            <h1 className="font-display font-bold text-sm text-ink">God's Lifting</h1>
            <p className="text-xs text-muted-foreground">Student Portal</p>
          </div>
        </Link>

        {/* User Info */}
        <div className="bg-cream rounded-xl p-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-ink text-sm">{user?.full_name}</p>
              <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                data-testid={`portal-nav-${item.name.toLowerCase().replace(' ', '-')}`}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-colors duration-200 ${
                  isActive(item.path)
                    ? "bg-primary text-white"
                    : "text-muted-foreground hover:bg-cream hover:text-primary"
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="absolute bottom-6 left-6 right-6 space-y-2">
          <Link
            to="/"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-cream font-medium text-sm"
            data-testid="portal-back-to-site"
          >
            <Home className="w-5 h-5" />
            Back to Site
          </Link>
          <button
            onClick={logout}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 font-medium text-sm w-full"
            data-testid="portal-logout"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
};

export default PortalSidebar;
