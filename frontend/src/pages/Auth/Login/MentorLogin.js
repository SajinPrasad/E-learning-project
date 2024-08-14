import React from "react";
import { LoginForm } from "../../../components/Auth/Register";
import { useNavigate } from "react-router-dom";

/**
 * Login page Mentor
 */
const MentorLogin = () => {
  const navigate = useNavigate();

  return (
    <div
      className={`flex min-h-screen content-center items-center justify-center bg-gray-50`}
    >
      <div
        className={`flex w-7/12 flex-col-reverse items-center justify-center rounded bg-white p-4 drop-shadow-xl lg:flex-row-reverse`}
      >
        <div
          className={`bg-theme-primary mb-3 basis-2/5 rounded p-4 text-center text-white lg:mb-0`}
        >
          <h1 className={`font-sentinent-bold text-xl`}>Welcome, mentors!</h1>
          <p className={`font-sentinent-light font-normal`}>
            Sign in to continue your journey with Brain Bridge. Share your
            expertise, connect with eager learners, and earn while making a
            lasting impact. Your next opportunity is just a login away.
          </p>
          <div className={`mt-5 flex flex-col items-center justify-between`}>
            <p>
              <strong>Don't have an account?</strong>
            </p>
            <button
              className={`mt-3 w-24 rounded border border-black bg-black p-1 text-sm hover:bg-stone-700`}
              onClick={(e) => navigate("/mentor-register")}
            >
              Sign Up
            </button>
          </div>
        </div>
        <div className={`basis-3/5 text-center text-sm`}>
          <div
            className={`text-theme-primary m-auto w-6/12 font-sentinent-bold text-xl font-bold md:text-3xl`}
          >
            BrainBridge
          </div>
          <LoginForm role={"mentor"} />
          <div
            onClick={() => navigate("/login ")}
            className={`mt-2 cursor-pointer bg-gray-50 p-1`}
          >
            <p className={`font-serif text-gray-800`}>Login as Student</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorLogin;