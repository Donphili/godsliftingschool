import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../ui/button";
import { Menu, X, GraduationCap, User, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, user, logout, isAdminOrTeacher } = useAuth();
  const location = useLocation();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Admission", path: "/admission" },
    { name: "News", path: "/news" },
    { name: "Events", path: "/events" },
    { name: "Gallery", path: "/gallery" },
    { name: "Contact", path: "/contact" },
  ];

  const isActive = (path) => location.pathname === path;

  const getDashboardLink = () => {
    if (user?.role === "admin") return "/admin";
    if (user?.role === "teacher") return "/teacher";
    return "/portal";
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-cream/85 backdrop-blur-md border-b-2 border-ink/5">
      <div className="container-custom">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3" data-testid="navbar-logo">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-violet to-coral flex items-center justify-center rotate-3">
              <GraduationCap className="w-6 h-6 text-white -rotate-3" />
            </div>
            <div className="hidden sm:block">
              <h1 className="font-display font-bold text-lg text-ink leading-tight">God's Lifting</h1>
              <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground font-semibold">International School</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                data-testid={`nav-link-${link.name.toLowerCase()}`}
                className={`text-sm font-medium transition-colors duration-200 ${
                  isActive(link.path) 
                    ? "text-primary" 
                    : "text-muted-foreground hover:text-primary"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden lg:flex items-center gap-4">
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="rounded-full gap-2"
                    data-testid="user-menu-trigger"
                  >
                    <User className="w-4 h-4" />
                    {user?.full_name?.split(' ')[0]}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link to={getDashboardLink()} className="cursor-pointer" data-testid="dashboard-link">
                      {user?.role === "teacher" ? "Teacher Portal" : user?.role === "admin" ? "Admin Panel" : "Dashboard"}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={logout} 
                    className="text-red-600 cursor-pointer"
                    data-testid="logout-btn"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" className="rounded-full" data-testid="login-btn">
                    Login
                  </Button>
                </Link>
                <Link to="/admission">
                  <Button className="rounded-full bg-coral hover:bg-coral/90 text-white font-bold shadow-[0_6px_0_0_theme(colors.ink)] hover:-translate-y-0.5 transition-transform" data-testid="apply-btn">
                    Apply Now
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-slate-100"
            data-testid="mobile-menu-btn"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-slate-200 py-4 animate-fade-in">
          <div className="container-custom flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-3 rounded-lg font-medium ${
                  isActive(link.path) 
                    ? "bg-primary/10 text-primary" 
                    : "text-muted-foreground hover:bg-cream"
                }`}
              >
                {link.name}
              </Link>
            ))}
            <div className="border-t border-slate-200 mt-2 pt-4 flex flex-col gap-2">
              {isAuthenticated ? (
                <>
                  <Link
                    to={getDashboardLink()}
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-3 rounded-lg font-medium text-primary bg-primary/10"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => { logout(); setMobileMenuOpen(false); }}
                    className="px-4 py-3 rounded-lg font-medium text-red-600 hover:bg-red-50 text-left"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-3 rounded-lg font-medium text-muted-foreground hover:bg-cream"
                  >
                    Login
                  </Link>
                  <Link
                    to="/admission"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-3 rounded-lg font-medium text-white bg-primary text-center"
                  >
                    Apply Now
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
