import { toast } from "react-toastify";

import privateAxiosInstance from "../api/axiosInstance";

/**
 * Adding items to cart
 * @param {number} courseId
 * @returns Object of added course cart item
 */
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
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    if (!error.response) {
      toast.error(
        "Unable to connect to server. Please check your internet connection.",
      );
      return null;
    }

    const status = error.response?.status;
    const errorMessage =
      error.response?.data?.message || error.response?.data?.error;

    switch (status) {
      case 400:
        if (errorMessage && !errorMessage.includes("token")) {
          toast.error(errorMessage || "Invalid request");
        }
        break;

      case 403:
        toast.error("You don't have permission to view enrolled courses");
        break;

      case 404:
        toast.error("No enrolled courses found");
        break;

      case 500:
        toast.error("Internal server error. Please try again later.");
        break;

      default:
        if (status >= 500) {
          toast.error("Something went wrong. Please try again later.");
        }
    }

    console.error("Error fetching enrolled courses");

    return null;
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

const checkoutService = async (cartItems) => {
  const course_ids = cartItems.map((cartItem) => cartItem.course.id);

  // Prepare data as JSON (if backend expects JSON)
  const orderData = {
    course_ids: course_ids, // Include course IDs as an array property
  };

  try {
    const response = await privateAxiosInstance.post(
      "order-create/",
      JSON.stringify(orderData), // Send data as JSON
    );

    if (response.status >= 200 && response.status < 300) {
      return response;
    } else {
      throw new Error(`Order creation failed with status: ${response.status}`); // Handle non-2xx responses as errors
    }
  } catch (error) {
    handleError(error);
  }
};

// Separate function to handle different error cases
const handleError = (error) => {
  if (error.response) {
    // Server responded with a status code outside the range of 2xx
    // Handle specific status codes
    if (error.response.status === 400) {
      // Validation errors or bad request
      toast.error(
        error.response.data.non_field_errors
          ? error.response.data.non_field_errors[0]
          : "Validation error. Please check your input.",
      );
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
    toast.error("No response from the server. Please check your network.");
  } else {
    // Something else happened while setting up the request
    toast.error("An unexpected error occurred: " + error.message);
  }
};

export { getCartItems, createCartItems, removeCartItem, checkoutService };
