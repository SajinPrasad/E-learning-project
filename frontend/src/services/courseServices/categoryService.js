import { toast } from "react-toastify";
import privateAxiosInstance from "../../api/axiosInstance";

const createCategory = async (name, description) => {
  try {
    const response = await privateAxiosInstance.post("/categories/", {
      name,
      description,
    });
    // Check if the response indicates a successful creation
    if (response.status >= 200 && response.status < 300) {
      toast.success("Category created successfully");
      return response.data;
    } else {
      toast.error("Error occurred while verifying");
      throw new Error("Failed to create new category."); // Explicitly throw an error
    }
  } catch (error) {
    if (error.response) {
      // Display the error message from the server
      if (error.response.data.non_field_errors) {
        toast.error(error.response.data.non_field_errors[0]);
      } else {
        toast.error("An error occurred during creation");
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

const createSubCategory = async (name, description, parentCategoryID) => {
  try {
    const response = await privateAxiosInstance.post("/subcategories/", {
      name,
      description,
      parent: parentCategoryID,
    });
    // Check if the response indicates a successful creation
    if (response.status >= 200 && response.status < 300) {
      toast.success("Category created successfully");
      return response.data;
    } else {
      toast.error("Error occurred while verifying");
      throw new Error("Failed to create new category."); // Explicitly throw an error
    }
  } catch (error) {
    if (error.response) {
      // Display the error message from the server
      if (error.response.data.non_field_errors) {
        toast.error(error.response.data.non_field_errors[0]);
      } else {
        toast.error("An error occurred during creation");
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

const getCategories = async () => {
  try {
    const response = await privateAxiosInstance.get("/categories/");
    if (response.status >= 200 && response.status < 300) {
      return response.data;
    } else {
      toast.error("Error while fetching categories!");
    }
  } catch (error) {
    if (error.response) {
      // Handle client or server errors
      const statusCode = error.response.status;
      if (statusCode >= 400 && statusCode < 500) {
        toast.error("Request error. Please check your permissions.");
      } else if (statusCode >= 500) {
        toast.error("Server error. Please try again later.");
      }
    } else if (error.request) {
      // Handle no response from server
      toast.error(
        "No response received from server. Please check your network connection.",
      );
    } else {
      // Handle unexpected errors (e.g., network issues, etc.)
      toast.error("An unexpected error occurred. Please try again.");
    }
    throw error; // Rethrow the error to be handled by the calling code if necessary
  }
};

const deleteCategory = async (categoryID) => {
  try {
    // Make a DELETE request to the endpoint with the category ID
    const response = await privateAxiosInstance.delete(`/categories/${categoryID}/`);

    // Check if the response status indicates success
    if (response.status >= 200 && response.status < 300) {
      toast.success("Successfully deleted Category.")
    } else {
      toast.error("Error while deleting category!");
    }
  } catch (error) {
    if (error.response) {
      // Handle errors returned by the server
      const statusCode = error.response.status;
      if (statusCode >= 400) {
        // Client-side errors
        toast.error("Request error. Please check your permissions.");
      } else if (statusCode >= 500) {
        // Server-side errors
        toast.error("Server error. Please try again later.");
      }
    } else if (error.request) {
      // Handle cases where no response was received from the server
      toast.error(
        "No response received from server. Please check your network connection.",
      );
    } else {
      // Handle unexpected errors (e.g., network issues)
      toast.error("An unexpected error occurred. Please try again.");
    }
    throw error; // Rethrow error for further handling if needed
  }
};

export { createCategory, getCategories, createSubCategory, deleteCategory };
