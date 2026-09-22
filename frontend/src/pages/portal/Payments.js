import { useState, useEffect } from "react";
import PortalSidebar from "../../components/layout/PortalSidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Button } from "../../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { toast } from "sonner";
import axios from "axios";
import { CreditCard, CheckCircle, Clock, AlertCircle, Building, Copy } from "lucide-react";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const PortalPayments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [studentId, setStudentId] = useState(localStorage.getItem("linked_student_id") || "");
  const [bankDetails, setBankDetails] = useState(null);
  const [showBankDetails, setShowBankDetails] = useState(false);
  
  const [paymentForm, setPaymentForm] = useState({
    amount: "",
    description: "School Fees",
    email: ""
  });

  const feeTypes = [
    { label: "School Fees - First Term", amount: 50000 },
    { label: "School Fees - Second Term", amount: 50000 },
    { label: "School Fees - Third Term", amount: 50000 },
    { label: "Uniform Fee", amount: 15000 },
    { label: "Books and Materials", amount: 20000 },
    { label: "Exam Fee", amount: 5000 },
    { label: "Other", amount: 0 }
  ];

  useEffect(() => {
    fetchBankDetails();
    if (studentId) {
      fetchPayments();
    }
  }, [studentId]);

  const fetchBankDetails = async () => {
    try {
      const response = await axios.get(`${API}/bank-details`);
      setBankDetails(response.data);
    } catch (error) {
      console.error("Failed to fetch bank details:", error);
    }
  };

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API}/payments/student/${studentId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      setPayments(response.data);
    } catch (error) {
      console.error("Failed to fetch payments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFeeSelect = (value) => {
    const fee = feeTypes.find(f => f.label === value);
    if (fee) {
      setPaymentForm(prev => ({
        ...prev,
        description: fee.label,
        amount: fee.amount === 0 ? prev.amount : fee.amount
      }));
    }
  };

  const initiatePayment = async () => {
    if (!studentId.trim()) {
      toast.error("Please enter your student ID");
      return;
    }
    if (!paymentForm.email) {
      toast.error("Please enter your email");
      return;
    }
    if (!paymentForm.amount || paymentForm.amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    setProcessingPayment(true);
    try {
      const response = await axios.post(`${API}/payments/initialize`, {
        student_id: studentId,
        amount: parseInt(paymentForm.amount) * 100, // Convert to kobo
        description: paymentForm.description,
        email: paymentForm.email
      });

      if (response.data.payment_method === "paystack") {
        // Redirect to Paystack
        window.location.href = response.data.authorization_url;
      } else {
        // Show bank transfer details
        setShowBankDetails(true);
        toast.info("Please use bank transfer to pay");
      }
    } catch (error) {
      toast.error(error.response?.data?.detail || "Failed to initialize payment");
    } finally {
      setProcessingPayment(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(amount / 100);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-5 h-5 text-emerald-500" />;
      case "pending":
        return <Clock className="w-5 h-5 text-amber-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-red-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-cream">
      <PortalSidebar />
      
      <main className="ml-64 p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-ink" data-testid="payments-title">
            Payments
          </h1>
          <p className="text-muted-foreground">Pay school fees via bank transfer or online</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Payment Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Bank Transfer Card */}
            {bankDetails && (
              <Card className="border-0 shadow-card bg-gradient-to-r from-blue-50 to-indigo-50" data-testid="bank-details-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-primary">
                    <Building className="w-5 h-5" />
                    Bank Transfer Details
                  </CardTitle>
                  <CardDescription>
                    Make payment directly to the school account
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="bg-white rounded-lg p-4">
                      <p className="text-sm text-muted-foreground mb-1">Bank Name</p>
                      <p className="font-semibold text-ink">{bankDetails.bank_name}</p>
                    </div>
                    <div className="bg-white rounded-lg p-4">
                      <p className="text-sm text-muted-foreground mb-1">Account Name</p>
                      <p className="font-semibold text-ink">{bankDetails.account_name}</p>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Account Number</p>
                        <p className="text-2xl font-bold text-primary">{bankDetails.account_number}</p>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => copyToClipboard(bankDetails.account_number)}
                        data-testid="copy-account-btn"
                      >
                        <Copy className="w-4 h-4 mr-1" />
                        Copy
                      </Button>
                    </div>
                  </div>
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <p className="text-amber-800 text-sm">
                      <strong>Important:</strong> {bankDetails.instructions}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Online Payment Form */}
            <Card className="border-0 shadow-card" data-testid="payment-form">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Pay Online (Coming Soon)
                </CardTitle>
                <CardDescription>
                  Online card payment will be available when Paystack is configured
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label>Student ID</Label>
                    <Input
                      value={studentId}
                      onChange={(e) => setStudentId(e.target.value)}
                      placeholder="e.g., GLIS2024XXXXXX"
                      className="mt-2"
                      data-testid="input-payment-student-id"
                    />
                  </div>
                  <div>
                    <Label>Email Address</Label>
                    <Input
                      type="email"
                      value={paymentForm.email}
                      onChange={(e) => setPaymentForm(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="your@email.com"
                      className="mt-2"
                      data-testid="input-payment-email"
                    />
                  </div>
                </div>

                <div>
                  <Label>Payment Type</Label>
                  <Select onValueChange={handleFeeSelect}>
                    <SelectTrigger className="mt-2" data-testid="select-fee-type">
                      <SelectValue placeholder="Select fee type" />
                    </SelectTrigger>
                    <SelectContent>
                      {feeTypes.map((fee) => (
                        <SelectItem key={fee.label} value={fee.label}>
                          {fee.label} {fee.amount > 0 && `- ₦${fee.amount.toLocaleString()}`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Amount (₦)</Label>
                  <Input
                    type="number"
                    value={paymentForm.amount}
                    onChange={(e) => setPaymentForm(prev => ({ ...prev, amount: e.target.value }))}
                    placeholder="Enter amount"
                    className="mt-2"
                    data-testid="input-payment-amount"
                  />
                </div>

                <div className="bg-cream rounded-xl p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Total Amount:</span>
                    <span className="text-2xl font-bold text-ink">
                      ₦{parseInt(paymentForm.amount || 0).toLocaleString()}
                    </span>
                  </div>
                </div>

                <Button 
                  onClick={initiatePayment}
                  disabled={processingPayment}
                  className="w-full rounded-full"
                  size="lg"
                  data-testid="pay-now-btn"
                >
                  <CreditCard className="w-5 h-5 mr-2" />
                  {processingPayment ? "Processing..." : "Pay Now"}
                </Button>

                <p className="text-center text-muted-foreground text-sm">
                  If online payment is unavailable, please use the bank transfer details above.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Payment History */}
          <div>
            <Card className="border-0 shadow-card" data-testid="payment-history">
              <CardHeader>
                <CardTitle className="text-lg">Payment History</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
                  </div>
                ) : payments.length > 0 ? (
                  <div className="space-y-4">
                    {payments.map((payment) => (
                      <div 
                        key={payment.id} 
                        className="flex items-center gap-3 p-3 bg-cream rounded-lg"
                      >
                        {getStatusIcon(payment.status)}
                        <div className="flex-1">
                          <p className="font-medium text-ink text-sm">{payment.description}</p>
                          <p className="text-xs text-muted-foreground">{payment.reference}</p>
                        </div>
                        <span className="font-semibold text-ink">
                          {formatCurrency(payment.amount)}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <CreditCard className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-muted-foreground text-sm">No payment history</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PortalPayments;
