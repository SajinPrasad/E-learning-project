import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import styles from "./Form.module.css";
import { Loading } from "../../common";
import { setTempUser } from "../../../features/tempUser/tempUserSlice";
import { registerService } from "../../../services/userManagementServices/authService";

// Validation schema for Formik
const SignUpSchema = Yup.object().shape({
  firstName: Yup.string()
    .min(1, "*Should be at least one character")
    .max(100, "*Should not exceed 100 characters")
    .required("*Required"),
  lastName: Yup.string()
    .min(1, "*Should be at least one character")
    .max(100, "*Should not exceed 100 characters")
    .required("*Required"),
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
  role: Yup.string(),
});

const RegistrationForm = ({ role }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const handleSetTempUserState = (email, role) => {
    dispatch(setTempUser({ email: email, role: role }));
  };

  return (
    <div className={`flex justify-center`}>
      {loading ? (
        <Loading />
      ) : (
        <Formik
          initialValues={{
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            confirmPassword: "",
            role: role, //Setting the role of the user
          }}
          validationSchema={SignUpSchema}
          onSubmit={async (values, { setSubmitting }) => {
            setLoading(true);
            try {
              const response = await registerService(values);
              //Setting the eamil of registered user in state for OTP verification.
              handleSetTempUserState(response.email);
              navigate("/verification");
            } catch (error) {
              setLoading(false);
            } finally {
              setSubmitting(false);
              setLoading(false); // Hide loading page
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form className={`flex flex-wrap justify-between p-2 hover:z-10`}>
              <div className={`w-full ${styles.item}`}>
                {/* Input field for first name */}
                <Field
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  className={`font-sentinent-extralight-italic peer mt-4 h-8 w-full rounded border p-1 px-3 text-sm text-gray-700 shadow transition-transform duration-300 hover:scale-105 hover:border-theme-primary focus:border-blue-500 focus:outline-none lg:h-9 dark:border-gray-600`}
                />
                <ErrorMessage
                  name="firstName"
                  component="div"
                  className={styles.errormessage}
                />
              </div>
              <div className={`w-full ${styles.item}`}>
                {/* Input field for last name */}
                <Field
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  className={`font-sentinent-extralight-italic peer mt-4 h-8 w-full rounded border p-1 px-3 text-sm text-gray-700 shadow transition-transform duration-300 hover:scale-105 hover:border-theme-primary focus:border-blue-500 focus:outline-none lg:h-9 dark:border-gray-600`}
                />
                <ErrorMessage
                  name="lastName"
                  component="div"
                  className={styles.errormessage}
                />
              </div>
              <div className={`basis-full text-center`}>
                {/* Input field for email */}
                <Field
                  type="email"
                  name="email"
                  placeholder="Email"
                  className={`font-sentinent-extralight-italic peer mt-4 h-8 w-full transform rounded border border-gray-700 p-1 text-sm drop-shadow transition-transform duration-300 hover:scale-105 hover:border-theme-primary focus:border-blue-500 focus:outline-none lg:h-9`}
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className={styles.errormessage}
                />
              </div>
              <div className={`w-full ${styles.item}`}>
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
                  className={styles.errormessage}
                />
              </div>
              <div className={`w-full ${styles.item}`}>
                {/* Input field for confirming password */}
                <Field
                  type="password"
                  name="confirmPassword"
                  placeholder="Repeat Password"
                  className={`font-sentinent-extralight-italic peer mt-4 h-8 w-full rounded border p-1 px-3 text-sm text-gray-700 shadow transition-transform duration-300 hover:scale-105 hover:border-theme-primary focus:border-blue-500 focus:outline-none lg:h-9 dark:border-gray-600`}
                />
                <ErrorMessage
                  name="confirmPassword"
                  component="div"
                  className={styles.errormessage}
                />
              </div>
              <div className={`basis-full text-center`}>
                {/* Submit button */}
                <button
                  type="submit"
                  className={`mt-3 h-7 w-24 rounded border border-gray-600 text-sm drop-shadow hover:border-theme-primary hover:bg-theme-primary hover:text-white`}
                  disabled={isSubmitting}
                >
                  Sign Up
                </button>
              </div>
            </Form>
          )}
        </Formik>
      )}
    </div>
  );
};

export default RegistrationForm;
