import { toast } from "react-toastify";

export const handleCommonError = (error) => {
  // Handle different types of errors appropriately
  if (!error.response) {
    // Network error (no response received)
    toast.error(
      "Unable to connect to server. Please check your internet connection.",
    );
    return null;
  }

  // Get status code and error details from response
  const status = error.response?.status;
  const errorMessage =
    error.response?.data?.message || error.response?.data?.error;

  // Handle specific status codes
  switch (status) {
    case 400:
      // Bad request - only show if it's a validation error
      if (errorMessage && !errorMessage.includes("token")) {
        toast.error(errorMessage || "Invalid request");
      }
      break;

    case 403:
      // Forbidden
      toast.error("You don't have permission to access this resource");
      break;

    case 404:
      // Not Found
      return false;

    case 500:
      // Server error
      toast.error("Internal server error. Please try again later.");
      break;

    default:
      // Only show generic error for unknown error cases
      if (status >= 500) {
        toast.error("Something went wrong. Please try again later.");
      }
  }

  // Log error for debugging
  console.error("Error fetching courses");

  return null;
};
