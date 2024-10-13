import React, { useEffect, useRef, useState } from "react";

import { checkoutService } from "../../services/cartServices";
import privateAxiosInstance from "../../api/axiosInstance";
import { useDispatch } from "react-redux";
import { clearCartItems } from "../../features/cartItem/cartItemSlice";
import PaypalButtonSkeleton from "./PaypalButtonSkeleton";

const PAYPAL_CLIENT_ID = process.env.REACT_APP_PAYPAL_CLIENT_ID;

const executePayment = async (paymentId, PayerID) => {
  try {
    const response = await privateAxiosInstance.get(
      `payment/execute/?paymentId=${paymentId}&PayerID=${PayerID}`,
    );

    return response.data;
  } catch (error) {
    console.error("Error executing payment:", error);
    throw error;
  }
};

const PayPalButton = ({ cartItems }) => {
  const paypalRef = useRef(null);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const [sdkReady, setSdkReady] = useState(false);

  useEffect(() => {
    const loadPayPalScript = () => {
      const script = document.createElement("script");
      script.src = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}`;
      script.async = true;
      script.onload = () => setSdkReady(true);
      script.onerror = () => {
        throw new Error("PayPal SDK could not be loaded.");
      };
      document.body.appendChild(script);
    };

    if (!window.paypal) {
      loadPayPalScript();
    } else {
      setSdkReady(true);
    }
  }, []);

  useEffect(() => {
    if (sdkReady && paypalRef.current && !paypalRef.current.hasChildNodes()) {
      window.paypal
        .Buttons({
          createOrder: async () => {
            try {
              setError(null);
              const response = await checkoutService(cartItems);

              const result = response.data;
              if (result.approval_url) {
                const token = new URL(result.approval_url).searchParams.get(
                  "token",
                );
                if (!token) {
                  throw new Error(
                    "Failed to extract PayPal token from approval URL.",
                  );
                }
                return token;
              } else {
                throw new Error("Failed to retrieve approval URL from server.");
              }
            } catch (err) {
              setError(err.message);
              throw err;
            }
          },
          onApprove: async (data, actions) => {
            try {
              setError(null);
              console.log("Payment approved:", data);

              const result = await executePayment(data.paymentID, data.payerID);
              console.log("Payment execution result:", result);

              dispatch(clearCartItems());
              window.location.href = "/enrolled-courses";
            } catch (err) {
              console.error("Error finalizing payment:", err);
              setError("An error occurred while finalizing the payment.");
            }
          },
          onError: (err) => {
            console.error("PayPal error:", err);
            setError("An error occurred while processing the payment.");
          },
        })
        .render(paypalRef.current)
        .catch((renderError) => {
          console.error("Error rendering PayPal buttons:", renderError);
          setError("Failed to render PayPal buttons.");
        });
    }
  }, [sdkReady, cartItems, dispatch]);

  return (
    <div>
      {!sdkReady ? (
        <PaypalButtonSkeleton />
      ) : (
        <>
          <div ref={paypalRef} />
          {error && <div className="mt-2 text-red-500">{error}</div>}
        </>
      )}
    </div>
  );
};

export default PayPalButton;
