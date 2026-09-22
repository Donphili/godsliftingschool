import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import axios from "axios";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const PaymentCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("verifying");
  const [message, setMessage] = useState("Verifying your payment...");

  useEffect(() => {
    const verifyPayment = async () => {
      const reference = searchParams.get("reference");

      if (!reference) {
        setStatus("error");
        setMessage("No payment reference found");
        return;
      }

      try {
        const response = await axios.get(`${API}/payments/verify/${reference}`);
        
        if (response.data.status === "success") {
          setStatus("success");
          setMessage("Payment completed successfully!");
        } else {
          setStatus("error");
          setMessage("Payment verification failed");
        }
      } catch (error) {
        setStatus("error");
        setMessage(error.response?.data?.detail || "Verification failed");
      }
    };

    verifyPayment();
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-ink via-violet to-ink flex items-center justify-center p-4">
      <Card className="max-w-md w-full border-0 shadow-2xl" data-testid="payment-callback">
        <CardHeader className="text-center pb-2">
          <div className="mb-4">
            {status === "verifying" && (
              <Loader2 className="w-16 h-16 text-primary mx-auto animate-spin" />
            )}
            {status === "success" && (
              <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto">
                <CheckCircle className="w-10 h-10 text-emerald-600" />
              </div>
            )}
            {status === "error" && (
              <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mx-auto">
                <XCircle className="w-10 h-10 text-red-600" />
              </div>
            )}
          </div>
          <CardTitle className="text-2xl">
            {status === "verifying" && "Verifying Payment"}
            {status === "success" && "Payment Successful!"}
            {status === "error" && "Payment Failed"}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-muted-foreground mb-6">{message}</p>
          
          {status !== "verifying" && (
            <div className="flex flex-col gap-3">
              <Button 
                onClick={() => navigate("/portal/payments")}
                className="rounded-full"
                data-testid="back-to-payments"
              >
                Back to Payments
              </Button>
              <Button 
                variant="outline"
                onClick={() => navigate("/portal")}
                className="rounded-full"
              >
                Go to Dashboard
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentCallback;
