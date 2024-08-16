import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import { RegistrationForm } from "../../../components/Auth/Register";

/**
 * User registration page Mentors.
 */
const MentorRegister = () => {
  const { isAuthenticated, role } = useSelector((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    //Redirecting authenticated mentor to dashboard if trying to access the registration page again.
    if (isAuthenticated) {
      if (role === "mentor") {
        navigate("/mentor");
      }
    }
  }, []);

  return (
    <div
      className={`flex min-h-screen content-center items-center justify-center bg-gray-50`}
    >
      <div
        className={`flex w-7/12 flex-col-reverse items-center justify-center rounded bg-white p-4 drop-shadow-xl lg:flex-row`}
      >
        <div
          className={`mb-3 basis-2/5 rounded bg-theme-primary p-4 text-center text-white lg:mb-0`}
        >
          <h1 className={`font-sentinent-bold text-xl`}>Welcome, mentors!</h1>
          <p className={`font-sentinent-light font-normal`}>
            Unlock new opportunities and share your expertise with a global
            audience. Whether you're looking to inspire the next generation or
            earn from your knowledge, our platform connects you with eager
            learners and offers you the chance to turn your passion into profit.{" "}
            <span
              className={`font-sentinent-medium-italic text-sm text-gray-100`}
            >
              #EmpowerAndEarn
            </span>
          </p>
          <div className={`mt-5 flex flex-col items-center justify-between`}>
            <p>
              <strong>Already have an account?</strong>
            </p>
            <button
              className={`mt-3 w-24 rounded border border-black bg-black hover:bg-slate-700`}
              onClick={(e) => navigate("/mentor-login")}
            >
              SignIn
            </button>
          </div>
        </div>
        <div className={`basis-3/5 text-sm`}>
          <div className={`basis-3/5 text-center text-sm`}>
            <div
              className={`m-auto w-6/12 font-sentinent-bold text-xl font-bold text-theme-primary md:text-3xl`}
            >
              BrainBridge
            </div>
            <h3 className={`mx-auto mt-3 font-sentinent-bold`}>
              Create Account as Mentor
            </h3>
          </div>
          <RegistrationForm role={"mentor"} />
        </div>
      </div>
    </div>
  );
};

export default MentorRegister;
