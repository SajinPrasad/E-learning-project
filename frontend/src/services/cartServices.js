import { toast } from "react-toastify";

import privateAxiosInstance from "../api/axiosInstance";

const createCartItems = async (courseId) => {
  try {
    const response = await privateAxiosInstance.post(`/cartitems/`, {
      course_id: courseId,
    });
    if (response.status >= 200 && response.status < 300) {
      toast.success("Course Sucessfully added to cart");
      return response.data; // Return the response data
    } else {
      toast.error("Unexpected error while adding item into cart!");
    }
  } catch (error) {
    handleError(error);
  }
};

const getCartItems = async () => {
  try {
    const response = await privateAxiosInstance.get("/cartitems/");
    if (response.status >= 200 && response.status < 300) {
      return response.data; // Return the response data
    } else {
      toast.error("Unexpected error!");
    }
  } catch (error) {
    if (error.response.status === 401) {
      // Unauthorized access
      toast.error("Unauthorized.");
    } else if (error.response.status === 403) {
      // Forbidden access
      toast.error("You do not have permission to perform this action.");
    } else if (error.response.status === 404) {
      // Resource not found
      toast.error("The requested resource was not found.");
    } else if (error.response.status === 500) {
      // Internal server error
      toast.error("Server error. Please try again later.");
    }
  }
};

const removeCartItem = async (id) => {
  try {
    const response = await privateAxiosInstance.delete(`/cartitems/${id}`);
    if (response.status >= 200 && response.status < 300) {
      toast.success("Course deleted from cart");
    } else {
      toast.error("Unexpected error!");
    }
  } catch (error) {
    handleError(error);
  }
};

// Separate function to handle different error cases
const handleError = (error) => {
  if (error.response) {
    // Server responded with a status code outside the range of 2xx
    console.error("Error Response:", {
      status: error.response.status,
      headers: error.response.headers,
      data: error.response.data,
    });

    // Handle specific status codes
    if (error.response.status === 400) {
      // Validation errors or bad request
      toast.error(
        error.response.data.non_field_errors
          ? error.response.data.non_field_errors[0]
          : "Validation error. Please check your input.",
      );
    } else if (error.response.status === 401) {
      // Unauthorized access
      toast.error("Unauthorized.");
    } else if (error.response.status === 403) {
      // Forbidden access
      toast.error("You do not have permission to perform this action.");
    } else if (error.response.status === 404) {
      // Resource not found
      toast.error("The requested resource was not found.");
    } else if (error.response.status === 500) {
      // Internal server error
      toast.error("Server error. Please try again later.");
    } else {
      // Generic error message for other status codes
      toast.error(
        error.response.data?.detail || "An error occurred. Please try again.",
      );
    }
  } else if (error.request) {
    // Request was made but no response received
    console.error("Error Request:", error.request);
    toast.error("No response from the server. Please check your network.");
  } else {
    // Something else happened while setting up the request
    console.error("Error Message:", error.message);
    toast.error("An unexpected error occurred: " + error.message);
  }
};

export { getCartItems, createCartItems, removeCartItem };
