import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";

import { loginService } from "../../../services/authService";
import { formStyles } from ".";
import { setUserInfo } from "../../../features/tempUser/userSlice";
import { Loading } from "../../common";
import { setToken } from "../../../features/auth/authSlice";

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
      confirmButton: `${formStyles.confirmbutton}`,
      cancelButton: `${formStyles.cancelbutton}`,
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
  const handleSetUserState = (response) => {
    dispatch(
      setUserInfo({
        firstName: response.user.first_name,
        lastName: response.user.last_name,
        email: response.user.email,
        role: response.user.role,
        isAuthenticated: true,
      }),
    );

    dispatch(
      setToken({
        accessToken: response.access,
        refreshToken: response.refresh,
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
                handleSetUserState(response);
                setLoading(false);
                navigate("/");
              } else if (response.user.role === "mentor" && role === "mentor") {
                handleSetUserState(response);
                setLoading(false);
                navigate("/mentor");
              } else if (response.user.role === "admin" && role === "admin") {
                handleSetUserState(response);
                setLoading(false);
                navigate("/admin/dashboard");
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
              } else if (
                response.user.role === "student" ||
                (response.user.role === "mentor" && role === "admin")
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
                  className={`font-sentinent-extralight-italic peer mt-4 h-8 w-full rounded border p-1 px-3 text-sm text-gray-700 shadow transition-transform duration-300 hover:scale-105 hover:border-theme-primary focus:border-blue-500 focus:outline-none lg:h-9 dark:border-gray-600`}
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className={formStyles.errormessage}
                />
              </div>

              <div className={`basis-3/4 text-center`}>
                {/* Input field for password */}
                <Field
                  type="password"
                  name="password"
                  placeholder="Password"
                  className={`font-sentinent-extralight-italic peer mt-4 h-8 w-full rounded border p-1 px-3 text-sm text-gray-700 shadow transition-transform duration-300 hover:scale-105 hover:border-theme-primary focus:border-blue-500 focus:outline-none lg:h-9 dark:border-gray-600`}
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className={formStyles.errormessage}
                />
              </div>

              <div className={`basis-full text-center`}>
                {/* Submit button */}
                <button
                  type="submit"
                  className={`mt-3 h-7 w-24 rounded border border-gray-600 text-sm drop-shadow hover:border-theme-primary hover:bg-theme-primary hover:text-white`}
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
