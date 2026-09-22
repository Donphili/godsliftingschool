import { useState, useEffect, useRef } from "react";
import PortalSidebar from "../../components/layout/PortalSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Button } from "../../components/ui/button";
import { Textarea } from "../../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { toast } from "sonner";
import axios from "axios";
import { FileText, Search, Download, Printer, Lock, Upload, CheckCircle, Clock, Building, Copy } from "lucide-react";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const PortalResults = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [studentId, setStudentId] = useState(localStorage.getItem("linked_student_id") || "");
  const [selectedResult, setSelectedResult] = useState(null);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [paymentResult, setPaymentResult] = useState(null);
  const [bankDetails, setBankDetails] = useState(null);
  const [submittingPayment, setSubmittingPayment] = useState(false);
  const printRef = useRef(null);
  
  const [paymentForm, setPaymentForm] = useState({
    bank_reference: "",
    amount_paid: "",
    receipt_url: ""
  });

  const [filters, setFilters] = useState({
    session: "",
    term: ""
  });

  const sessions = ["2024/2025", "2023/2024"];
  const terms = ["First Term", "Second Term", "Third Term"];

  useEffect(() => {
    fetchBankDetails();
  }, []);

  const fetchBankDetails = async () => {
    try {
      const response = await axios.get(`${API}/bank-details`);
      setBankDetails(response.data);
    } catch (error) {
      console.error("Failed to fetch bank details:", error);
    }
  };

  const fetchResults = async () => {
    if (!studentId.trim()) {
      toast.error("Please enter your student ID");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(`${API}/results/student/${studentId}`);
      setResults(response.data);
      localStorage.setItem("linked_student_id", studentId);
      if (response.data.length === 0) {
        toast.info("No results found for this student");
      }
    } catch (error) {
      toast.error("Failed to fetch results");
    } finally {
      setLoading(false);
    }
  };

  const filteredResults = results.filter(result => {
    if (filters.session && result.session !== filters.session) return false;
    if (filters.term && result.term !== filters.term) return false;
    return true;
  });

  const getGradeClass = (grade) => {
    switch (grade) {
      case "A": return "grade-a";
      case "B": return "grade-b";
      case "C": return "grade-c";
      case "D": return "grade-d";
      case "F": return "grade-f";
      default: return "";
    }
  };

  const calculateAverage = (subjects) => {
    if (!subjects || subjects.length === 0) return 0;
    const total = subjects.reduce((sum, s) => sum + (s.total || 0), 0);
    return (total / subjects.length).toFixed(1);
  };

  const openPaymentDialog = (result) => {
    setPaymentResult(result);
    setPaymentDialogOpen(true);
    setPaymentForm({ bank_reference: "", amount_paid: "", receipt_url: "" });
  };

  const submitPaymentReceipt = async () => {
    if (!paymentForm.bank_reference || !paymentForm.amount_paid) {
      toast.error("Please fill in all required fields");
      return;
    }

    setSubmittingPayment(true);
    try {
      await axios.post(`${API}/results/request-access`, {
        student_id: studentId,
        session: paymentResult.session,
        term: paymentResult.term,
        bank_reference: paymentForm.bank_reference,
        amount_paid: parseInt(paymentForm.amount_paid),
        receipt_url: paymentForm.receipt_url
      });
      
      toast.success("Payment submitted! You'll be notified once verified.");
      setPaymentDialogOpen(false);
      fetchResults(); // Refresh to update status
    } catch (error) {
      toast.error(error.response?.data?.detail || "Failed to submit payment");
    } finally {
      setSubmittingPayment(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied!");
  };

  const handlePrint = () => {
    const printContent = printRef.current;
    const originalContents = document.body.innerHTML;
    document.body.innerHTML = printContent.innerHTML;
    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload();
  };

  const handleDownload = () => {
    // Create a simple text-based result for download
    if (!selectedResult) return;
    
    let content = `
GOD'S LIFTING INTERNATIONAL SCHOOL
Academic Result Report
=====================================

Student ID: ${selectedResult.student_id}
Session: ${selectedResult.session}
Term: ${selectedResult.term}

=====================================
SUBJECT SCORES
=====================================
`;
    
    selectedResult.subjects.forEach(subject => {
      content += `
${subject.name}
  CA Score: ${subject.ca_score}
  Exam Score: ${subject.exam_score}
  Total: ${subject.total}
  Grade: ${subject.grade}
`;
    });
    
    content += `
=====================================
AVERAGE SCORE: ${calculateAverage(selectedResult.subjects)}%
=====================================

Generated on: ${new Date().toLocaleDateString()}
God's Lifting International School
10, Alhaji Memudu Balogun Street, Egbe, Lagos
Tel: 08034494498, 09012077546
`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Result_${selectedResult.student_id}_${selectedResult.session}_${selectedResult.term}.txt`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    toast.success("Result downloaded!");
  };

  return (
    <div className="min-h-screen bg-cream">
      <PortalSidebar />
      
      <main className="ml-64 p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-ink" data-testid="results-title">
            My Results
          </h1>
          <p className="text-muted-foreground">View and download your academic results</p>
        </div>

        {/* Search Card */}
        <Card className="mb-8 border-0 shadow-card" data-testid="results-search">
          <CardHeader>
            <CardTitle className="text-lg">Search Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4">
              <div>
                <Label>Student ID</Label>
                <Input
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  placeholder="e.g., GLIS2024XXXXXX"
                  className="mt-2"
                  data-testid="input-result-student-id"
                />
              </div>
              <div>
                <Label>Session</Label>
                <Select onValueChange={(v) => setFilters(prev => ({ ...prev, session: v === "all" ? "" : v }))}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="All Sessions" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sessions</SelectItem>
                    {sessions.map(s => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Term</Label>
                <Select onValueChange={(v) => setFilters(prev => ({ ...prev, term: v === "all" ? "" : v }))}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="All Terms" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Terms</SelectItem>
                    {terms.map(t => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button 
                  onClick={fetchResults} 
                  disabled={loading}
                  className="w-full rounded-full"
                  data-testid="search-results-btn"
                >
                  <Search className="w-4 h-4 mr-2" />
                  {loading ? "Searching..." : "Search"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Info Banner */}
        <Card className="mb-6 border-0 shadow-card bg-amber-50 border-l-4 border-l-amber-500">
          <CardContent className="p-4">
            <p className="text-amber-800 text-sm">
              <strong>Note:</strong> To download or print your result, you must first pay the result checking fee. 
              After payment, submit your receipt and wait for admin verification.
            </p>
          </CardContent>
        </Card>

        {/* Results List */}
        {filteredResults.length > 0 ? (
          <div className="grid gap-6">
            {filteredResults.map((result) => (
              <Card 
                key={result.id} 
                className="border-0 shadow-card"
                data-testid={`result-card-${result.id}`}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
                        <FileText className="w-7 h-7 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-bold text-ink">{result.session}</h3>
                        <p className="text-muted-foreground">{result.term}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="text-right mr-4">
                        <p className="text-sm text-muted-foreground">Average Score</p>
                        <p className="text-2xl font-bold text-primary">{calculateAverage(result.subjects)}%</p>
                      </div>
                      
                      {result.download_unlocked ? (
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setSelectedResult(result)}
                            data-testid={`view-result-${result.id}`}
                          >
                            <FileText className="w-4 h-4 mr-1" />
                            View
                          </Button>
                        </div>
                      ) : (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => openPaymentDialog(result)}
                          className="border-amber-500 text-sun hover:bg-amber-50"
                          data-testid={`pay-for-result-${result.id}`}
                        >
                          <Lock className="w-4 h-4 mr-1" />
                          Pay to Unlock
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : results.length > 0 ? (
          <Card className="border-0 shadow-card">
            <CardContent className="py-12 text-center">
              <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-ink mb-2">No Results Match Your Filter</h3>
              <p className="text-muted-foreground">Try selecting different session or term</p>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-0 shadow-card">
            <CardContent className="py-12 text-center">
              <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-ink mb-2">No Results Yet</h3>
              <p className="text-muted-foreground">Enter your student ID and search to view your results</p>
            </CardContent>
          </Card>
        )}

        {/* Result Detail Modal (for unlocked results) */}
        {selectedResult && selectedResult.download_unlocked && (
          <div 
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedResult(null)}
          >
            <Card 
              className="max-w-3xl w-full max-h-[90vh] overflow-y-auto animate-scale-in"
              onClick={(e) => e.stopPropagation()}
              data-testid="result-detail-modal"
            >
              <div ref={printRef}>
                <CardHeader className="border-b bg-primary text-white">
                  <div className="text-center">
                    <h2 className="text-xl font-bold">GOD'S LIFTING INTERNATIONAL SCHOOL</h2>
                    <p className="text-white/80 text-sm">10, Alhaji Memudu Balogun Street, Egbe, Lagos</p>
                    <p className="text-white/80 text-sm">Tel: 08034494498, 09012077546</p>
                  </div>
                </CardHeader>
                <CardHeader className="border-b">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>{selectedResult.session} - {selectedResult.term}</CardTitle>
                      <p className="text-muted-foreground mt-1">Student ID: {selectedResult.student_id}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Average</p>
                      <p className="text-3xl font-bold text-primary">{calculateAverage(selectedResult.subjects)}%</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Subject</TableHead>
                        <TableHead className="text-center">CA Score</TableHead>
                        <TableHead className="text-center">Exam Score</TableHead>
                        <TableHead className="text-center">Total</TableHead>
                        <TableHead className="text-center">Grade</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedResult.subjects.map((subject, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{subject.name}</TableCell>
                          <TableCell className="text-center">{subject.ca_score}</TableCell>
                          <TableCell className="text-center">{subject.exam_score}</TableCell>
                          <TableCell className="text-center font-semibold">{subject.total}</TableCell>
                          <TableCell className="text-center">
                            <span className={getGradeClass(subject.grade)}>{subject.grade}</span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </div>
              <div className="p-4 border-t flex justify-between items-center">
                <Button variant="outline" onClick={() => setSelectedResult(null)}>
                  Close
                </Button>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={handlePrint}>
                    <Printer className="w-4 h-4 mr-2" />
                    Print
                  </Button>
                  <Button className="rounded-full" onClick={handleDownload}>
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Payment Dialog */}
        <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Pay for Result Access</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Bank Details */}
              {bankDetails && (
                <div className="bg-blue-50 rounded-xl p-4 space-y-3">
                  <div className="flex items-center gap-2 text-primary font-semibold">
                    <Building className="w-5 h-5" />
                    Bank Transfer Details
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-muted-foreground">Bank Name</p>
                      <p className="font-semibold">{bankDetails.bank_name}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Account Name</p>
                      <p className="font-semibold">{bankDetails.account_name}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between bg-white rounded-lg p-3">
                    <div>
                      <p className="text-muted-foreground text-sm">Account Number</p>
                      <p className="text-xl font-bold text-primary">{bankDetails.account_number}</p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => copyToClipboard(bankDetails.account_number)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Result Info */}
              {paymentResult && (
                <div className="bg-cream rounded-lg p-3">
                  <p className="text-sm text-muted-foreground">Paying for:</p>
                  <p className="font-semibold">{paymentResult.session} - {paymentResult.term}</p>
                </div>
              )}

              {/* Payment Form */}
              <div className="space-y-4">
                <div>
                  <Label>Bank Reference / Teller Number *</Label>
                  <Input
                    value={paymentForm.bank_reference}
                    onChange={(e) => setPaymentForm(prev => ({ ...prev, bank_reference: e.target.value }))}
                    placeholder="Enter your bank reference number"
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label>Amount Paid (₦) *</Label>
                  <Input
                    type="number"
                    value={paymentForm.amount_paid}
                    onChange={(e) => setPaymentForm(prev => ({ ...prev, amount_paid: e.target.value }))}
                    placeholder="Enter amount paid"
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label>Receipt Image URL (Optional)</Label>
                  <Input
                    value={paymentForm.receipt_url}
                    onChange={(e) => setPaymentForm(prev => ({ ...prev, receipt_url: e.target.value }))}
                    placeholder="Paste link to receipt image"
                    className="mt-2"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    You can upload your receipt to a cloud service and paste the link here
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setPaymentDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  className="flex-1 rounded-full"
                  onClick={submitPaymentReceipt}
                  disabled={submittingPayment}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {submittingPayment ? "Submitting..." : "Submit Payment"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default PortalResults;
