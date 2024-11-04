import { toast } from "react-toastify";
import privateAxiosInstance, {
  publicAxiosInstance,
} from "../../api/axiosInstance";

const createParentCategories = async (name, description) => {
  try {
    const response = await privateAxiosInstance.post("/parent-categories/", {
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

const getParentCategories = async (setIsLoading) => {
  try {
    const response = await publicAxiosInstance.get("/parent-categories/");
    if (response.status >= 200 && response.status < 300) {
      return response.data;
    } else {
      toast.error("Error while fetching categories!");
      setIsLoading(false);
    }
  } catch (error) {
    if (error.response) {
      // Handle client or server errors
      const statusCode = error.response.status;
      if (statusCode >= 400 && statusCode < 500) {
        toast.error("Request error. Please check your permissions.");
        setIsLoading(false);
      } else if (statusCode >= 500) {
        toast.error("Server error. Please try again later.");
        setIsLoading(false);
      }
    } else if (error.request) {
      // Handle no response from server
      toast.error(
        "No response received from server. Please check your network connection.",
      );
      setIsLoading(false);
    } else {
      // Handle unexpected errors (e.g., network issues, etc.)
      toast.error("An unexpected error occurred. Please try again.");
      setIsLoading(false);
    }
    throw error; // Rethrow the error to be handled by the calling code if necessary
  }
};

const getSubCategoriesOfAParent = async (parentCategoryID) => {
  try {
    const response = await publicAxiosInstance.get(
      `/parent-categories/${parentCategoryID}/`,
    );
    if (response.status >= 200 && response.status < 300) {
      return response.data.sub_categories;
    } else {
      toast.error("Error while fetching subcategories!");
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

const getSubCategories = async (setIsLoading) => {
  try {
    const response = await publicAxiosInstance.get("/subcategories/");
    if (response.status >= 200 && response.status < 300) {
      return response.data;
    } else {
      toast.error("Error while fetching categories!");
      setIsLoading(false);
    }
  } catch (error) {
    if (error.response) {
      // Handle client or server errors
      const statusCode = error.response.status;
      if (statusCode >= 400 && statusCode < 500) {
        toast.error("Request error. Please check your permissions.");
        setIsLoading(false);
      } else if (statusCode >= 500) {
        toast.error("Server error. Please try again later.");
        setIsLoading(false);
      }
    } else if (error.request) {
      // Handle no response from server
      toast.error(
        "No response received from server. Please check your network connection.",
      );
      setIsLoading(false);
    } else {
      // Handle unexpected errors (e.g., network issues, etc.)
      toast.error("An unexpected error occurred. Please try again.");
      setIsLoading(false);
    }
    throw error; // Rethrow the error to be handled by the calling code if necessary
  }
};

const updateCategory = async ({ categoryId, field, value, url }) => {
  try {
    // Create a dynamic object using computed property names
    const payload = { [field]: value };

    const response = await privateAxiosInstance.patch(
      `/${url}/${categoryId}/`,
      payload,
    );
    if (response.status >= 200 && response.status < 300) {
      toast.success("Successfully updated category");
      return response.data;
    } else {
      toast.error("Error while updating subcategories!");
    }
  } catch (error) {
    if (error.response) {
      const statusCode = error.response.status;
      if (statusCode >= 400 && statusCode < 500) {
        toast.error("Request error. Please check your permissions.");
      } else if (statusCode >= 500) {
        toast.error("Server error. Please try again later.");
      }
    } else if (error.request) {
      toast.error(
        "No response received from server. Please check your network connection.",
      );
    } else {
      toast.error("An unexpected error occurred. Please try again.");
    }
    throw error;
  }
};

export {
  createParentCategories,
  getParentCategories,
  createSubCategory,
  getSubCategoriesOfAParent,
  updateCategory,
  getSubCategories,
};
