import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";

import { Loading } from "../../common";
import { formStyles } from ".";
import { resetPasswordService } from "../../../services/userManagementServices/authService";

// Validation schema for Formik
const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "*Enter valid email")
    .required("*Required"),
  password: Yup.string()
    .min(6, "*Password is too short")
    .matches(
      /(?=.*[a-z])/,
      "*Password must contain at least one lowercase letter",
    )
    .matches(
      /(?=.*[A-Z])/,
      "*Password must contain at least one uppercase letter",
    )
    .matches(/(?=.*[0-9])/, "*Password must contain at least one digit")
    .required("*Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "*Passwords must match")
    .required("*Password is required"),
});

/**
 * @returns Form for resetting password.
 */
const ResetPasswordForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  return (
    <div className={`flex justify-center`}>
      {loading ? (
        <Loading />
      ) : (
        <Formik
          initialValues={{
            email: "",
            password: "",
            confirmPassword: "",
          }}
          validationSchema={LoginSchema}
          onSubmit={async (values, { setSubmitting }) => {
            setLoading(true);
            try {
              const response = await resetPasswordService(values);

              // Navigating according to the role.
              if (response.role === "student") {
                setLoading(false);
                navigate("/login");
              } else if (response.role === "mentor") {
                setLoading(false);
                navigate("/mentor-login");
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
                  placeholder="New Password"
                  className={`font-sentinent-extralight-italic peer mt-4 h-8 w-full rounded border p-1 px-3 text-sm text-gray-700 shadow transition-transform duration-300 hover:scale-105 hover:border-theme-primary focus:border-blue-500 focus:outline-none lg:h-9 dark:border-gray-600`}
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className={formStyles.errormessage}
                />
              </div>

              <div className={`basis-3/4 text-center`}>
                {/* Input field for confirm password */}
                <Field
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  className={`font-sentinent-extralight-italic peer mt-4 h-8 w-full rounded border p-1 px-3 text-sm text-gray-700 shadow transition-transform duration-300 hover:scale-105 hover:border-theme-primary focus:border-blue-500 focus:outline-none lg:h-9 dark:border-gray-600`}
                />
                <ErrorMessage
                  name="confirmPassword"
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
                  Submit
                </button>
              </div>
            </Form>
          )}
        </Formik>
      )}
    </div>
  );
};

export default ResetPasswordForm;
