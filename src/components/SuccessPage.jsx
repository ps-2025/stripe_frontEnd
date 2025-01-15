import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const Success = () => {
  const location = useLocation();
  const [paymentStatus, setPaymentStatus] = useState(null);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const sessionId = queryParams.get("session_id");

    const fetchPaymentDetails = async () => {
      const response = await fetch(
        `http://localhost:8001/api/payments/payment-status?session_id=${sessionId}`
      );
      const data = await response.json();
      if (data.status === "succeeded") {
        setPaymentStatus("Payment successful!");
      } else {
        setPaymentStatus("Payment failed.");
      }
    };

    if (sessionId) {
      fetchPaymentDetails();
    }
  }, [location]);

  return (
    <div>
      <h1>{paymentStatus}</h1>
      <p>Thank you for your purchase!</p>
    </div>
  );
};

export default Success;
