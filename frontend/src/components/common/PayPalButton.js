import React, { useEffect, useRef, useState } from "react";
import { checkoutService } from "../../services/cartServices";
import privateAxiosInstance from "../../api/axiosInstance";
import { useDispatch } from "react-redux";
import { clearCartItems } from "../../features/cartItem/cartItemSlice";

const executePayment = async (paymentId, PayerID) => {
  try {
    const response = await privateAxiosInstance.get(
      `payment/execute/?paymentId=${paymentId}&PayerID=${PayerID}`,
    );
    console.log("Execute payment response:", response);
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

  useEffect(() => {
    const loadPayPalScript = () => {
      const script = document.createElement("script");
      script.src =
        "https://www.paypal.com/sdk/js?client-id=AegV4jdwpguvPZaGFthgRFbNKZ-F7SsYAm0MomkehiL-BLyaOdEiZfbPw0dUxTn0tGs1gIQ8gKQJXv8x";
      script.addEventListener("load", initializePayPalButtons);
      document.body.appendChild(script);
    };

    const initializePayPalButtons = () => {
      if (window.paypal && paypalRef.current) {
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
                  throw new Error(
                    "Failed to retrieve approval URL from server.",
                  );
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

                // Execute the payment
                const result = await executePayment(
                  data.paymentID,
                  data.payerID,
                );
                console.log("Payment execution result:", result);

                // Close the PayPal popup and redirect to a success page on the main window
                dispatch(clearCartItems());
                window.location.href = "/enrolled-courses"; // Change this to the URL of your success page
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
          .render(paypalRef.current);
      }
    };

    if (!window.paypal) {
      loadPayPalScript();
    } else {
      initializePayPalButtons();
    }

    return () => {
      if (paypalRef.current) {
        paypalRef.current.innerHTML = "";
      }
    };
  }, [cartItems]);

  return (
    <div>
      <div ref={paypalRef} />
      {error && <div className="mt-2 text-red-500">{error}</div>}
    </div>
  );
};

export default PayPalButton;
