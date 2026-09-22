import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "./components/ui/sonner";

// Public Pages
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import AdmissionPage from "./pages/AdmissionPage";
import NewsPage from "./pages/NewsPage";
import EventsPage from "./pages/EventsPage";
import GalleryPage from "./pages/GalleryPage";
import ContactPage from "./pages/ContactPage";

// Auth Pages
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

// Portal Pages
import PortalDashboard from "./pages/portal/Dashboard";
import PortalResults from "./pages/portal/Results";
import PortalPayments from "./pages/portal/Payments";
import PaymentCallback from "./pages/portal/PaymentCallback";

// Admin Pages
import AdminDashboard from "./pages/admin/Dashboard";
import AdminStudents from "./pages/admin/Students";
import AdminResults from "./pages/admin/Results";
import AdminApplications from "./pages/admin/Applications";
import AdminNews from "./pages/admin/News";
import AdminEvents from "./pages/admin/Events";
import AdminGallery from "./pages/admin/Gallery";
import AdminMessages from "./pages/admin/Messages";
import AdminPayments from "./pages/admin/Payments";
import AdminTeachers from "./pages/admin/Teachers";
import AdminSettings from "./pages/admin/Settings";

// Teacher Pages
import TeacherDashboard from "./pages/teacher/Dashboard";
import TeacherStudents from "./pages/teacher/Students";
import TeacherResults from "./pages/teacher/Results";

// Context
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import "@/App.css";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/admission" element={<AdmissionPage />} />
          <Route path="/news" element={<NewsPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/contact" element={<ContactPage />} />
          
          {/* Auth Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* Portal Routes (Protected) */}
          <Route path="/portal" element={<ProtectedRoute><PortalDashboard /></ProtectedRoute>} />
          <Route path="/portal/results" element={<ProtectedRoute><PortalResults /></ProtectedRoute>} />
          <Route path="/portal/payments" element={<ProtectedRoute><PortalPayments /></ProtectedRoute>} />
          <Route path="/portal/payment-callback" element={<PaymentCallback />} />
          
          {/* Admin Routes (Protected - Admin/Teacher only) */}
          <Route path="/admin" element={<ProtectedRoute roles={["admin", "teacher"]}><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/students" element={<ProtectedRoute roles={["admin", "teacher"]}><AdminStudents /></ProtectedRoute>} />
          <Route path="/admin/teachers" element={<ProtectedRoute roles={["admin"]}><AdminTeachers /></ProtectedRoute>} />
          <Route path="/admin/results" element={<ProtectedRoute roles={["admin", "teacher"]}><AdminResults /></ProtectedRoute>} />
          <Route path="/admin/applications" element={<ProtectedRoute roles={["admin"]}><AdminApplications /></ProtectedRoute>} />
          <Route path="/admin/news" element={<ProtectedRoute roles={["admin"]}><AdminNews /></ProtectedRoute>} />
          <Route path="/admin/events" element={<ProtectedRoute roles={["admin"]}><AdminEvents /></ProtectedRoute>} />
          <Route path="/admin/gallery" element={<ProtectedRoute roles={["admin"]}><AdminGallery /></ProtectedRoute>} />
          <Route path="/admin/messages" element={<ProtectedRoute roles={["admin"]}><AdminMessages /></ProtectedRoute>} />
          <Route path="/admin/payments" element={<ProtectedRoute roles={["admin"]}><AdminPayments /></ProtectedRoute>} />
          <Route path="/admin/settings" element={<ProtectedRoute roles={["admin"]}><AdminSettings /></ProtectedRoute>} />
          
          {/* Teacher Routes (Protected - Teacher only) */}
          <Route path="/teacher" element={<ProtectedRoute roles={["teacher"]}><TeacherDashboard /></ProtectedRoute>} />
          <Route path="/teacher/students" element={<ProtectedRoute roles={["teacher"]}><TeacherStudents /></ProtectedRoute>} />
          <Route path="/teacher/results" element={<ProtectedRoute roles={["teacher"]}><TeacherResults /></ProtectedRoute>} />
        </Routes>
        <Toaster position="top-right" richColors />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
