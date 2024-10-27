import { toast } from "react-toastify";
import privateAxiosInstance from "../../api/axiosInstance";

/**
 * Getting User information and profiles for admins
 * @returns Array of user informations.
 */
export const getUsersAndProfileService = async () => {
  try {
    const response = await privateAxiosInstance.get("/users/");

    if (response.status >= 200 && response.status < 301) {
      return response.data; // Success, return the response data
    }

    // Handle Internal Server Error (status 500)
    if (response.status === 500) {
      toast.error("Internal Server Error");
    }

    // Handle other status codes
    return response.status;
  } catch (error) {
    // Network Error (e.g., no internet, connection refused)
    if (!error.response) {
      toast.error("Network Error");
    }

    // Handle specific HTTP status codes like 502, 503, etc.
    if (error.response.status >= 500) {
      toast.error(`Server Error: ${error.response.status}`);
    }

    // Generic error handler
    toast.error(`Error: ${error.message}`);
  }
};

export const retreiveUserAandProfileService = async (userId) => {
  try {
    const response = await privateAxiosInstance.get(`/users/${userId}/`);

    if (response.status >= 200 && response.status < 301) {
      return response.data; // Success, return the response data
    }

    // Handle Internal Server Error (status 500)
    if (response.status === 500) {
      toast.error("Internal Server Error");
    }

    // Handle other status codes
    return response.status;
  } catch (error) {
    // Network Error (e.g., no internet, connection refused)
    if (!error.response) {
      toast.error("Network Error");
    }

    // Handle specific HTTP status codes like 502, 503, etc.
    if (error.response.status >= 500) {
      toast.error(`Server Error: ${error.response.status}`);
    }

    // Generic error handler
    toast.error(`Error: ${error.message}`);
  }
};

export const updateUserActive = async (userId, value) => {
  try {
    const response = await privateAxiosInstance.patch(`/users/${userId}/`, {
      is_blocked: value,
    });
    if (response.status >= 200 && response.status < 300) {
      toast.success(`User ${value ? "blocked" : "unblocked"} sucessfully`);
      return response.data;
    }
  } catch (error) {
    // Network Error (e.g., no internet, connection refused)
    if (!error.response) {
      toast.error("Network Error");
    }

    // Handle specific HTTP status codes like 502, 503, etc.
    if (error.response.status >= 500) {
      toast.error(`Server Error: ${error.response.status}`);
    }

    // Generic error handler
    toast.error(`Error: ${error.message}`);
  }
};

export const userSearchService = async (keyword) => {
  try {
    const response = await privateAxiosInstance.get(`/user-search/?q=${keyword}`);

    if (response.status >= 200 && response.status < 301) {
      return response.data; // Success, return the response data
    }

    // Handle Internal Server Error (status 500)
    if (response.status === 500) {
      toast.error("Internal Server Error");
    }

    // Handle other status codes
    return response.status;
  } catch (error) {
    // Network Error (e.g., no internet, connection refused)
    if (!error.response) {
      toast.error("Network Error");
    }

    // Handle specific HTTP status codes like 502, 503, etc.
    if (error.response.status >= 500) {
      toast.error(`Server Error: ${error.response.status}`);
    }

    // Generic error handler
    toast.error(`Error: ${error.message}`);
  }
};
