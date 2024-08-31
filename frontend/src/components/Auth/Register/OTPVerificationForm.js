import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  otpResendService,
  otpVerificationService,
} from "../../../services/authService";
import { Loading } from "../../common";
import { clearTempUser } from "../../../features/tempUser/tempUserSlice";

/**
 * Verifies the OTP and resending the OTP.
 */
const OTPVerificationForm = () => {
  // Initializes an array of 5 empty strings, representing 5 OTP input boxes.
  const [otp, setOtp] = useState(Array(5).fill(""));
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();
  const { email, role } = useSelector((state) => state.tempUser);
  const dispatch = useDispatch();

  useEffect(() => {
    if (email === "") {
      // Redirect to the previous location or default to "/login" if no previous location
      navigate(location.state?.from || "/login");
    }
  }, [email, navigate, location.state?.from]);

  const handleChange = (e, index) => {
    const value = e.target.value;

    // Allow only digits
    if (/^\d$/.test(value) || value === "") {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Move to the next input if available and value is not empty
      if (value && index < otp.length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const otpString = otp.join(""); // Combine OTP values into a single string
    try {
      const response = await otpVerificationService(otpString, email);
      if (response) {
        // If the service returns a successful result
        setLoading(false);
        if (role === "student") {
          navigate("/login");
        } else if (role === "mentor") {
          navigate("/mentor-login");
        }
        dispatch(clearTempUser());
      }
    } catch (error) {
      setLoading(false);
    }
  };

  //Calling resend OTP service function
  const handleResendOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await otpResendService(email);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  };

  return (
    <div
      className={`flex h-screen w-full flex-col items-center justify-center bg-gray-50`}
    >
      {loading ? (
        <Loading />
      ) : (
        <form
          onSubmit={handleSubmit}
          className={`w-full max-w-md rounded-lg bg-white px-8 py-10 shadow-md dark:text-gray-200`}
        >
          <h1 className={`mb-6 text-center text-2xl font-semibold text-black`}>
            Verify your account!
          </h1>
          <p className={`mb-4 text-center text-gray-600`}>
            OTP sent to {email}
          </p>
          <p className={`mb-3 text-center text-xs text-gray-500`}>
            OTP will expire in 10 minutes.
          </p>
          <div className={`my-2 grid grid-cols-5 gap-x-4`}>
            {otp.map((value, index) => (
              <input
                key={index}
                placeholder="0"
                maxLength="1"
                className={`flex aspect-square w-14 items-center justify-center rounded-lg bg-gray-100 text-center text-black`}
                type="text"
                value={value}
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                ref={(el) => (inputRefs.current[index] = el)}
              />
            ))}
          </div>
          <div className={`mb-6 flex flex-col items-center justify-between`}>
            <p className={`text-sm text-gray-600`}>Didn't receive code?</p>
            <div className={`flex items-center space-x-2`}>
              <button
                type="button"
                onClick={(e) => handleResendOTP(e)}
                className={`rounded px-3 py-2 text-center text-sm font-medium text-gray-500 hover:text-blue-500`}
              >
                Request Again
              </button>
            </div>
          </div>
          <button
            type="submit"
            className={`w-full rounded-md border-2 bg-theme-primary px-4 py-2 text-lg font-medium text-white hover:border-theme-primary hover:bg-white hover:text-black`}
          >
            Verify
          </button>
        </form>
      )}
    </div>
  );
};

export default OTPVerificationForm;
