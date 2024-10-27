import { toast } from "react-toastify";
import privateAxiosInstance, {
  publicAxiosInstance,
} from "../../api/axiosInstance";
import { clearToken } from "../../features/auth/authSlice";
import { clearUserInfo } from "../../features/tempUser/userSlice";
import { clearTempUser } from "../../features/tempUser/tempUserSlice";
import { clearCartItems } from "../../features/cartItem/cartItemSlice";
import { clearCategory } from "../../features/course/categorySlice";
import { clearCoursesState } from "../../features/course/courseSlice";
import { clearEnrolledCoursesState } from "../../features/course/enrolledCoursesState";

/**
 * Registers a new user by sending the registration data to the server.
 *
 * @param {Object} formData - The form data containing user registration details
 *        (firstName, lastName, email, password, confirmPassword, role).
 *
 * @returns {Object} - The data returned from the server if registration is successful.
 *
 * @throws {Error} - Throws an error if the registration fails, including validation errors.
 *
 * @example
 *
 * try {
 *   const userData = await registerService({
 *     firstName: 'John',
 *     lastName: 'Doe',
 *     email: 'john.doe@example.com',
 *     role: 'student',
 *     password: 'Password123',
 *     confirmPassword: 'Password123'
 *   });
 *   console.log('User registered:', userData);
 * } catch (error) {
 *   console.error('Registration failed:', error);
 * }
 */
const registerService = async (formData) => {
  const { firstName, lastName, email, role, password, confirmPassword } =
    formData;

  try {
    const response = await publicAxiosInstance.post("/register/", {
      first_name: firstName,
      last_name: lastName,
      email,
      role,
      password,
      password2: confirmPassword,
    });

    if (response.status >= 200 && response.status < 300) {
      toast.success("Account created, pleae verify your account."); // Show success message
      return response.data;
    } else {
      toast.error("An error occurred during registration."); // Show generic error
    }
  } catch (error) {
    if (error.response) {
      // Extracting and displaying the error message
      if (error.response.data.email) {
        toast.error(error.response.data.email[0]); // Display email-related error
      } else if (error.response.data.non_field_errors) {
        toast.error(error.response.data.non_field_errors[0]); // Display non-field errors
      } else {
        toast.error("An error occurred during registration."); // Show generic error
      }
    } else if (error.request) {
      toast.error("No response from the server."); // Show server-related error
    } else {
      toast.error(error.message); // Show the error message
    }
    throw error;
  }
};

/**
 * Verifies the OTP code sent to the user's email for account verification.
 *
 * @param {string} otpCode - The OTP code entered by the user for verification.
 * @param {string} email - The email address associated with the user's account.
 *
 * @returns {void}
 *
 * @throws {Error} - Throws an error if the OTP verification fails, including server errors.
 *
 * @example
 *
 * try {
 *   await otpVerificationService('123456', 'user@example.com');
 *   console.log('OTP verified successfully');
 * } catch (error) {
 *   console.error('OTP verification failed:', error);
 * }
 */
const otpVerificationService = async (otpCode, email) => {
  try {
    // Send a POST request to the OTP verification endpoint with the email and OTP code
    const response = await publicAxiosInstance.post("/otp/verify/", {
      email,
      otp_code: otpCode,
    });

    // Check if the response indicates a successful verification
    if (response.status >= 200 && response.status < 300) {
      toast.success("Account verified successfully");
      return response.data;
    } else {
      toast.error("Error occurred while verifying");
      throw new Error("Verification failed"); // Explicitly throw an error
    }
  } catch (error) {
    if (error.response) {
      // Display the error message from the server
      if (error.response.data.non_field_errors) {
        toast.error(error.response.data.non_field_errors[0]);
      } else {
        toast.error("An error occurred during verification");
      }
    } else if (error.request) {
      // Handle errors where the server did not respond
      toast.error("No response received from server");
    } else {
      // Handle any other errors (e.g., network issues)
      toast.error("An unexpected error occurred");
    }
    throw error; // Rethrow the error to be handled by the calling code
  }
};

/**
 * Logs in the user by sending the login credentials to the server.
 *
 * @param {Object} formData - The form data containing login credentials.
 * @param {string} formData.email - The email address of the user.
 * @param {string} formData.password - The password of the user.
 *
 * @returns {Object} - The data returned from the server if authentication is successful.
 *
 * @throws {Error} - Throws an error if the login fails, including server errors.
 *
 * @example
 *
 * try {
 *   const role = await loginService({ email: 'user@example.com', password: 'password123' });
 *   console.log('User role:', role);
 * } catch (error) {
 *   console.error('Login failed:', error);
 * }
 */
const loginService = async (formData) => {
  const { email, password } = formData;

  try {
    // Send a POST request to the login endpoint with the user's email and password
    const response = await publicAxiosInstance.post("/login/", {
      email,
      password,
    });
    // Check if the response indicates a successful login
    if (response.status >= 200 && response.status < 300) {
      return response.data; // Return the response data including tokens and user information
    } else {
      toast.error("Error occurred while logging in");
    }
  } catch (error) {
    // Handle errors returned from the server
    if (error.response) {
      if (error.response.data.non_field_errors) {
        toast.error(error.response.data.non_field_errors[0]);
      }
    } else if (error.request) {
      // Handle errors where the server did not respond
      toast.error("An error occurred during verification.");
    } else {
      console.log(error);
    }
    throw error;
  }
};

/**
 * Resends the OTP to the user's email address by making a request to the server.
 *
 * @param {string} email - The email address to which the OTP should be resent.
 *
 * @returns {void} - This function does not return any data.
 *
 * @throws {Error} - Throws an error if the OTP resend fails, including server errors.
 *
 * @example
 *
 * try {
 *   await otpResendService('user@example.com');
 *   console.log('OTP has been resent successfully.');
 * } catch (error) {
 *   console.error('OTP resend failed:', error);
 * }
 */
const otpResendService = async (email) => {
  try {
    // Send a POST request to the OTP resend endpoint with the user's email
    const response = await publicAxiosInstance.post("/otp/resend/", { email });

    // Check if the response indicates a successful OTP resend
    if (response.status >= 200 && response.status < 300) {
      toast.success("OTP has been re-sent to your email");
    }
  } catch (error) {
    // Handle errors returned from the server
    if (error.response) {
      if (error.response.data.non_field_errors) {
        toast.error(error.response.data.non_field_errors[0]);
      }
    } else if (error.request) {
      // Handle errors where the server did not respond
      toast.error("An error occurred.");
    } else {
      console.log(error);
    }
    throw error;
  }
};

/**
 * Service for resetting password.
 * @param {Object} formData - Conatining email, new password, confirmation password
 * @returns - Role of the user, for navigating to corresponding login pages.
 */
const resetPasswordService = async (formData) => {
  const { email, password, confirmPassword } = formData;

  try {
    const response = await privateAxiosInstance.post("/reset/password/", {
      email,
      new_password: password,
      confirm_password: confirmPassword,
    });
    if (response.status >= 200 && response.status < 300) {
      toast.success(
        "Password changed successfully, Please login with new password",
      );
      return response.data; // Return the response data
    } else {
      toast.error("Error occurred while resetting the password.");
    }
  } catch (error) {
    // Handle errors returned from the server
    if (error.response) {
      if (error.response.data.non_field_errors) {
        toast.error(error.response.data.non_field_errors[0]);
      } else {
        // Handle other possible errors from the server
        toast.error("An error occurred during password reset.");
      }
    } else if (error.request) {
      // Handle errors where the server did not respond
      toast.error("No response from server. Please try again.");
    } else {
      // Handle any other errors (such as network issues)
      toast.error("An error occurred during password reset.");
      console.log(error);
    }
    throw error; // Optionally re-throw the error if you want to handle it elsewhere
  }
};

/**
 * Logout function.
 * Sends the refresh token to the backend to blacklist the token.
 * @param {string} refreshToken - The user's refresh token
 * @returns {Object | undefined} - Response data if any, or undefined
 */
const userLogoutService = async (refreshToken) => {
  console.log("Executing logout");
  try {
    const response = await privateAxiosInstance.post(`/logout/`, {
      refresh: refreshToken,
    });

    console.log("Response: ", response);

    // No data is expected, but just in case the backend returns a success message
    if (response.status >= 200 && response.status < 301) {
      return response.data;
    }
  } catch (error) {
    if (!error.response) {
      toast.error("Network error: Please check your connection.");
    } else if (error.response.status >= 500) {
      toast.error("Internal server error: ", error.response.statusText);
    } else {
      console.log("Error: ", error.response.data || "Something went wrong.");
    }
  }
};

export {
  registerService,
  otpVerificationService,
  loginService,
  otpResendService,
  resetPasswordService,
  userLogoutService,
};
