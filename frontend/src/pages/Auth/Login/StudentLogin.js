import React, { useEffect } from "react";
import { LoginForm } from "../../../components/Auth/Register";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

/**
 * Login page student.
 */
const StudentLogin = () => {
  const { isAuthenticated, role } = useSelector((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    //Redirecting authenticated user to home if trying to access the login page again.
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
        className={`flex w-7/12 flex-col-reverse items-center justify-center rounded bg-white p-4 drop-shadow-xl lg:flex-row-reverse`}
      >
        <div
          className={`mb-3 basis-2/5 rounded bg-theme-primary p-4 text-center text-white lg:mb-0`}
        >
          <h1 className={`font-sentinent-bold text-xl`}>Welcome!</h1>
          <p className={`font-sentinent-light font-normal`}>
            Sign in to continue your journey with Brain Bridge. Access a world
            of knowledge and connect with fellow learners. Your next achievement
            is just a login away.
          </p>
          <div className={`mt-5 flex flex-col items-center justify-between`}>
            <p>
              <strong>Don't have an account?</strong>
            </p>
            <button
              className={`mt-3 w-24 rounded border border-black bg-black p-1 text-sm hover:bg-stone-700`}
              onClick={(e) => navigate("/register")}
            >
              Sign Up
            </button>
          </div>
        </div>
        <div className={`basis-3/5 text-center text-sm`}>
          <div
            className={`m-auto w-6/12 font-sentinent-bold text-xl font-bold text-theme-primary md:text-3xl`}
          >
            BrainBridge
          </div>
          <LoginForm role={"student"} />
          <div
            onClick={() => navigate("/mentor-login ")}
            className={`mx-auto mt-2 cursor-pointer bg-gray-50 p-1`}
          >
            <p className={`font-serif text-gray-800`}>Login as Mentor</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentLogin;
