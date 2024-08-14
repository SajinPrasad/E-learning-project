import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";

import { loginService } from "../../../services/authService";
import styles from "./Form.module.css";
import { setUserInfo } from "../../../features/tempUser/userSlice";
import { Loading } from "../../common";

// Validation schema for Formik
const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "*Enter valid email")
    .required("*Required"),
  password: Yup.string().required("*Password is required"),
});

/**
 * Alert fuction to show the alert using sweet alert when user request for
 * login using un authorized login page.
 * @param {*} navigate Function to navigate to appropreate login page
 * @param {*} role Role of the requesting user to display
 */
function showUnauthorizedAlert(navigate, role) {
  Swal.fire({
    title: "Access Denied!",
    text: "You are not authorized to access this page. Please login with the correct role.",
    icon: "warning",
    showConfirmButton: true,
    showCancelButton: true,
    confirmButtonText: `Go to ${role} login`,
    cancelButtonText: "Back to Login",
    background: "#fffff",
    customClass: {
      title: "text-black",
      popup: "my-popup-class",
      confirmButton: `${styles.confirmbutton}`,
      cancelButton: `${styles.cancelbutton}`,
    },
  }).then((result) => {
    if (result.isConfirmed) {
      if (role === "mentor") {
        navigate("/mentor-login");
      } else {
        navigate("/login");
      }
    }
  });
}

/**
 * Renders a login form for users.
 */
const LoginForm = ({ role }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  // Function to set user state and tokens
  const handleSetUserState = (user) => {
    dispatch(
      setUserInfo({
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        role: user.role,
        isAuthenticated: true,
      }),
    );
  };

  return (
    <div className={`flex justify-center`}>
      {loading ? (
        <Loading />
      ) : (
        <Formik
          initialValues={{
            email: "",
            password: "",
          }}
          validationSchema={LoginSchema}
          onSubmit={async (values, { setSubmitting }) => {
            setLoading(true);
            try {
              const response = await loginService(values);
              if (response.user.role === "student" && role === "student") {
                handleSetUserState(response.user);
                setLoading(false);
                navigate("/");
              } else if (response.user.role === "mentor" && role === "mentor") {
                handleSetUserState(response.user);
                setLoading(false);
                navigate("/mentor");
              } else if (
                response.user.role === "student" &&
                role === "mentor"
              ) {
                setLoading(false);
                showUnauthorizedAlert(navigate, response.user.role);
              } else if (
                response.user.role === "mentor" &&
                role === "student"
              ) {
                setLoading(false);
                showUnauthorizedAlert(navigate, response.user.role);
              }
            } catch (error) {
              setLoading(false);
              throw error;
            }

            setSubmitting(false);
          }}
        >
          {({ isSubmitting }) => (
            <Form className={`flex flex-wrap justify-center p-2 hover:z-10`}>
              <div className={`basis-3/4 text-center`}>
                {/* Input field for email */}
                <Field
                  type="email"
                  name="email"
                  placeholder="Email"
                  className={`font-sentinent-extralight-italic peer mt-4 h-8 w-full transform rounded border border-gray-400 p-1 text-sm italic drop-shadow transition-transform duration-300 hover:scale-105 hover:border-theme-primary focus:border-blue-500 focus:outline-none lg:h-9`}
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className={styles.errormessage}
                />
              </div>

              <div className={`basis-3/4 text-center`}>
                {/* Input field for password */}
                <Field
                  type="password"
                  name="password"
                  placeholder="Password"
                  className={`font-sentinent-extralight-italic peer mt-4 h-8 w-full transform rounded border border-gray-400 p-1 text-sm italic drop-shadow transition-transform duration-300 hover:scale-105 hover:border-theme-primary focus:border-blue-500 focus:outline-none lg:h-9`}
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className={styles.errormessage}
                />
              </div>

              <div className={`basis-full text-center`}>
                {/* Submit button */}
                <button
                  type="submit"
                  className={`mt-3 h-7 w-24 rounded border border-gray-400 text-sm drop-shadow hover:border-theme-primary hover:bg-theme-primary hover:text-white`}
                  disabled={isSubmitting}
                >
                  Sign In
                </button>
              </div>
            </Form>
          )}
        </Formik>
      )}
    </div>
  );
};

export default LoginForm;
