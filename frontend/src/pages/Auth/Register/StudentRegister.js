import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import { RegistrationForm } from "../../../components/Auth/Register";

/**
 * User registration page Students.
 */
const StudentRegister = () => {
  const navigate = useNavigate();
  const { isAuthenticated, role } = useSelector((state) => state.user);

  useEffect(() => {
    //Redirecting authenticated user to home if trying to access the registration page again.
    if (isAuthenticated) {
      if (role === "student") {
        navigate("/");
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
          <h1 className={`font-sentinent-bold text-xl`}>Welcome!</h1>
          <p className={`font-sentinent-light font-normal`}>
            Unlock your potential and connect with a world of knowledge. Whether
            you're a student, a professional, or a lifelong learner, our
            platform bridges the gap between curiosity and mastery.
          </p>
          <div className={`mt-5 flex flex-col items-center justify-between`}>
            <p>
              <strong>Already have an account?</strong>
            </p>
            <button
              className={`mt-3 w-24 rounded border border-black bg-black hover:bg-slate-700`}
              onClick={(e) => navigate("/login")}
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
              Create Account as Student
            </h3>
          </div>
          <RegistrationForm role={"student"} />
          <div
            onClick={() => navigate("/mentor-register")}
            className={`m-auto mt-2 p-1 text-center`}
          >
            <p className={`font-extralight text-gray-800`}>
              Not a mentor yet? Become a Mentor and start earning!.
            </p>
            <p
              className={`mt-1 cursor-pointer rounded bg-purple-50 font-normal text-gray-600`}
            >
              Click here to register as a Mentor
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentRegister;
