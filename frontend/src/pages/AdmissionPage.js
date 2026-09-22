import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { toast } from "sonner";
import axios from "axios";
import { Upload, CheckCircle, FileText, Search } from "lucide-react";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const AdmissionPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [applicationNumber, setApplicationNumber] = useState("");
  const [checkingStatus, setCheckingStatus] = useState(false);
  const [statusResult, setStatusResult] = useState(null);
  
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    date_of_birth: "",
    gender: "",
    class_applying_for: "",
    parent_name: "",
    parent_phone: "",
    parent_email: "",
    address: "",
    previous_school: "",
    birth_certificate_url: "",
    passport_photo_url: ""
  });

  const classOptions = [
    "Pre-School",
    "Basic 1", "Basic 2", "Basic 3", "Basic 4", "Basic 5", "Basic 6",
    "JSS 1", "JSS 2", "JSS 3",
    "SSS 1", "SSS 2", "SSS 3"
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = async (e, field) => {
    const file = e.target.files[0];
    if (!file) return;

    const formDataFile = new FormData();
    formDataFile.append("file", file);

    try {
      const response = await axios.post(`${API}/upload`, formDataFile, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setFormData(prev => ({ ...prev, [field]: response.data.file_id }));
      toast.success(`${field === "passport_photo_url" ? "Photo" : "Certificate"} uploaded successfully`);
    } catch (error) {
      toast.error("Failed to upload file");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(`${API}/applications`, formData);
      setApplicationNumber(response.data.application_number);
      setStep(3);
      toast.success("Application submitted successfully!");
    } catch (error) {
      toast.error(error.response?.data?.detail || "Failed to submit application");
    } finally {
      setLoading(false);
    }
  };

  const checkApplicationStatus = async () => {
    if (!applicationNumber.trim()) {
      toast.error("Please enter your application number");
      return;
    }
    
    setCheckingStatus(true);
    try {
      const response = await axios.get(`${API}/applications/check/${applicationNumber}`);
      setStatusResult(response.data);
    } catch (error) {
      toast.error("Application not found");
      setStatusResult(null);
    } finally {
      setCheckingStatus(false);
    }
  };

  const nextStep = () => {
    if (step === 1) {
      if (!formData.full_name || !formData.email || !formData.phone || !formData.date_of_birth || !formData.gender || !formData.class_applying_for) {
        toast.error("Please fill all required fields");
        return;
      }
    }
    setStep(step + 1);
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-20">
        <div className="relative overflow-hidden bg-gradient-to-br from-ink via-violet to-ink py-20"><div className="blob w-72 h-72 bg-coral/40 -top-10 -right-10"></div><div className="blob w-56 h-56 bg-sky/30 bottom-0 left-1/3"></div>
          <div className="container-custom relative z-10">
            <div className="max-w-3xl">
              <p className="text-sun font-semibold mb-4">Admissions</p>
              <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6" data-testid="admission-title">
                Join Our School Family
              </h1>
              <p className="text-xl text-white/80">
                Start your child's journey to excellence. Apply online today!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Application Form Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2">
              <Card className="border-0 shadow-card">
                <CardHeader>
                  <CardTitle>Application Form</CardTitle>
                  <CardDescription>
                    {step === 1 && "Step 1: Student Information"}
                    {step === 2 && "Step 2: Parent/Guardian Information"}
                    {step === 3 && "Application Submitted"}
                  </CardDescription>
                  
                  {/* Progress Steps */}
                  {step < 3 && (
                    <div className="flex items-center gap-4 mt-4">
                      <div className={`flex items-center gap-2 ${step >= 1 ? "text-primary" : "text-slate-400"}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? "bg-primary text-white" : "bg-slate-200"}`}>
                          1
                        </div>
                        <span className="text-sm font-medium hidden sm:block">Student</span>
                      </div>
                      <div className="flex-1 h-0.5 bg-slate-200">
                        <div className={`h-full bg-primary transition-all ${step >= 2 ? "w-full" : "w-0"}`} />
                      </div>
                      <div className={`flex items-center gap-2 ${step >= 2 ? "text-primary" : "text-slate-400"}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? "bg-primary text-white" : "bg-slate-200"}`}>
                          2
                        </div>
                        <span className="text-sm font-medium hidden sm:block">Parent</span>
                      </div>
                    </div>
                  )}
                </CardHeader>
                
                <CardContent>
                  {step === 1 && (
                    <form className="space-y-6">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="full_name">Full Name *</Label>
                          <Input
                            id="full_name"
                            name="full_name"
                            value={formData.full_name}
                            onChange={handleChange}
                            placeholder="Enter student's full name"
                            className="mt-2"
                            data-testid="input-full-name"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">Email *</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter email address"
                            className="mt-2"
                            data-testid="input-email"
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="phone">Phone Number *</Label>
                          <Input
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="e.g., 08012345678"
                            className="mt-2"
                            data-testid="input-phone"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="date_of_birth">Date of Birth *</Label>
                          <Input
                            id="date_of_birth"
                            name="date_of_birth"
                            type="date"
                            value={formData.date_of_birth}
                            onChange={handleChange}
                            className="mt-2"
                            data-testid="input-dob"
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <Label>Gender *</Label>
                          <Select onValueChange={(value) => handleSelectChange("gender", value)}>
                            <SelectTrigger className="mt-2" data-testid="select-gender">
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="male">Male</SelectItem>
                              <SelectItem value="female">Female</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Class Applying For *</Label>
                          <Select onValueChange={(value) => handleSelectChange("class_applying_for", value)}>
                            <SelectTrigger className="mt-2" data-testid="select-class">
                              <SelectValue placeholder="Select class" />
                            </SelectTrigger>
                            <SelectContent>
                              {classOptions.map((cls) => (
                                <SelectItem key={cls} value={cls}>{cls}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="previous_school">Previous School (Optional)</Label>
                        <Input
                          id="previous_school"
                          name="previous_school"
                          value={formData.previous_school}
                          onChange={handleChange}
                          placeholder="Name of previous school"
                          className="mt-2"
                          data-testid="input-previous-school"
                        />
                      </div>
                      
                      <Button type="button" onClick={nextStep} className="rounded-full" data-testid="next-step-btn">
                        Next Step
                      </Button>
                    </form>
                  )}
                  
                  {step === 2 && (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="parent_name">Parent/Guardian Name *</Label>
                          <Input
                            id="parent_name"
                            name="parent_name"
                            value={formData.parent_name}
                            onChange={handleChange}
                            placeholder="Enter parent's full name"
                            className="mt-2"
                            data-testid="input-parent-name"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="parent_phone">Parent Phone *</Label>
                          <Input
                            id="parent_phone"
                            name="parent_phone"
                            value={formData.parent_phone}
                            onChange={handleChange}
                            placeholder="e.g., 08012345678"
                            className="mt-2"
                            data-testid="input-parent-phone"
                            required
                          />
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="parent_email">Parent Email *</Label>
                        <Input
                          id="parent_email"
                          name="parent_email"
                          type="email"
                          value={formData.parent_email}
                          onChange={handleChange}
                          placeholder="Enter parent's email"
                          className="mt-2"
                          data-testid="input-parent-email"
                          required
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="address">Home Address *</Label>
                        <Textarea
                          id="address"
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                          placeholder="Enter complete home address"
                          className="mt-2"
                          data-testid="input-address"
                          required
                        />
                      </div>

                      {/* Document Uploads */}
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <Label>Passport Photo</Label>
                          <div className="mt-2 border-2 border-dashed border-slate-200 rounded-lg p-4 text-center hover:border-primary transition-colors">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleFileUpload(e, "passport_photo_url")}
                              className="hidden"
                              id="passport-upload"
                              data-testid="upload-passport"
                            />
                            <label htmlFor="passport-upload" className="cursor-pointer">
                              <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                              <p className="text-sm text-muted-foreground">
                                {formData.passport_photo_url ? "Photo uploaded ✓" : "Click to upload"}
                              </p>
                            </label>
                          </div>
                        </div>
                        <div>
                          <Label>Birth Certificate</Label>
                          <div className="mt-2 border-2 border-dashed border-slate-200 rounded-lg p-4 text-center hover:border-primary transition-colors">
                            <input
                              type="file"
                              accept="image/*,.pdf"
                              onChange={(e) => handleFileUpload(e, "birth_certificate_url")}
                              className="hidden"
                              id="certificate-upload"
                              data-testid="upload-certificate"
                            />
                            <label htmlFor="certificate-upload" className="cursor-pointer">
                              <FileText className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                              <p className="text-sm text-muted-foreground">
                                {formData.birth_certificate_url ? "Certificate uploaded ✓" : "Click to upload"}
                              </p>
                            </label>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-4">
                        <Button type="button" variant="outline" onClick={() => setStep(1)} className="rounded-full">
                          Previous
                        </Button>
                        <Button type="submit" disabled={loading} className="rounded-full" data-testid="submit-application-btn">
                          {loading ? "Submitting..." : "Submit Application"}
                        </Button>
                      </div>
                    </form>
                  )}
                  
                  {step === 3 && (
                    <div className="text-center py-8">
                      <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-10 h-10 text-emerald-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-ink mb-2">Application Submitted!</h3>
                      <p className="text-muted-foreground mb-6">Your application has been received successfully.</p>
                      <div className="bg-cream rounded-xl p-6 max-w-sm mx-auto">
                        <p className="text-sm text-muted-foreground mb-2">Your Application Number</p>
                        <p className="text-2xl font-bold text-primary" data-testid="application-number">{applicationNumber}</p>
                        <p className="text-xs text-muted-foreground mt-2">Please save this number for tracking your application status.</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Check Status Card */}
              <Card className="border-0 shadow-card" data-testid="check-status-card">
                <CardHeader>
                  <CardTitle className="text-lg">Check Application Status</CardTitle>
                  <CardDescription>Already applied? Check your status</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="app-number">Application Number</Label>
                    <Input
                      id="app-number"
                      value={applicationNumber}
                      onChange={(e) => setApplicationNumber(e.target.value)}
                      placeholder="e.g., APP2024XXXXXX"
                      className="mt-2"
                      data-testid="input-app-number"
                    />
                  </div>
                  <Button 
                    onClick={checkApplicationStatus} 
                    disabled={checkingStatus}
                    className="w-full rounded-full"
                    data-testid="check-status-btn"
                  >
                    <Search className="w-4 h-4 mr-2" />
                    {checkingStatus ? "Checking..." : "Check Status"}
                  </Button>
                  
                  {statusResult && (
                    <div className="mt-4 p-4 bg-cream rounded-lg">
                      <p className="font-semibold text-ink">{statusResult.full_name}</p>
                      <p className="text-sm text-muted-foreground">{statusResult.class_applying_for}</p>
                      <div className="mt-2">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          statusResult.status === "approved" ? "bg-emerald-100 text-emerald-700" :
                          statusResult.status === "rejected" ? "bg-red-100 text-red-700" :
                          "bg-sun/20 text-amber-700"
                        }`}>
                          {statusResult.status.charAt(0).toUpperCase() + statusResult.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Requirements Card */}
              <Card className="border-0 shadow-card">
                <CardHeader>
                  <CardTitle className="text-lg">Admission Requirements</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {[
                      "Completed application form",
                      "Birth certificate",
                      "Passport photograph",
                      "Previous school report (if applicable)",
                      "Payment of admission fee"
                    ].map((item, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                        <span className="text-muted-foreground text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Contact Card */}
              <Card className="border-0 shadow-card bg-primary text-white">
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg mb-2">Need Help?</h3>
                  <p className="text-white/80 text-sm mb-4">Contact our admissions office</p>
                  <p className="text-sun font-semibold">08034494498</p>
                  <p className="text-white/80 text-sm">09012077546</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AdmissionPage;
