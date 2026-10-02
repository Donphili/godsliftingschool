import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import ThemeToggle from "../ThemeToggle";
import {
  LayoutDashboard,
  FileText,
  CreditCard,
  LogOut,
  GraduationCap,
  Home,
  User,
  Menu,
  X
} from "lucide-react";

const PortalSidebar = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const menuItems = [
    { name: "Dashboard", path: "/portal", icon: LayoutDashboard },
    { name: "My Results", path: "/portal/results", icon: FileText },
    { name: "Payments", path: "/portal/payments", icon: CreditCard },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 h-16 bg-card border-b border-sticker/10 flex items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2" data-testid="portal-logo-mobile">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet to-sky flex items-center justify-center rotate-3">
            <GraduationCap className="w-5 h-5 text-white -rotate-3" />
          </div>
          <span className="font-display font-bold text-sm text-foreground">God's Lifting</span>
        </Link>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="text-foreground p-2"
          aria-label="Toggle menu"
          data-testid="portal-mobile-menu-toggle"
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
        className={`w-64 bg-card border-r border-sticker/10 min-h-screen fixed left-0 top-0 z-40 transition-transform duration-300 overflow-y-auto ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
      <div className="p-6 pt-20 md:pt-6">
        {/* Logo */}
        <Link to="/" className="hidden md:flex items-center gap-3 mb-8" data-testid="portal-logo">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet to-sky flex items-center justify-center rotate-3">
            <GraduationCap className="w-6 h-6 text-white -rotate-3" />
          </div>
          <div>
            <h1 className="font-display font-bold text-sm text-foreground">God's Lifting</h1>
            <p className="text-xs text-muted-foreground">Student Portal</p>
          </div>
        </Link>

        {/* User Info */}
        <div className="bg-background rounded-xl p-4 mb-6 flex items-center justify-between gap-2">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <User className="w-5 h-5 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-foreground text-sm truncate">{user?.full_name}</p>
              <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
            </div>
          </div>
          <ThemeToggle className="shrink-0" />
        </div>

        {/* Navigation */}
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                data-testid={`portal-nav-${item.name.toLowerCase().replace(' ', '-')}`}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-colors duration-200 ${
                  isActive(item.path)
                    ? "bg-primary text-white"
                    : "text-muted-foreground hover:bg-background hover:text-primary"
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="mt-6 pt-6 border-t border-sticker/10 space-y-2">
          <Link
            to="/"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-background font-medium text-sm"
            data-testid="portal-back-to-site"
          >
            <Home className="w-5 h-5" />
            Back to Site
          </Link>
          <button
            onClick={logout}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-coral hover:bg-coral/10 font-medium text-sm w-full"
            data-testid="portal-logout"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </div>
      </aside>
    </>
  );
};

export default PortalSidebar;
