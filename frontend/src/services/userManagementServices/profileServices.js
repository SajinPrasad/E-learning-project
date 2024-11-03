import { toast } from "react-toastify";

import privateAxiosInstance from "../../api/axiosInstance";
import { handleCommonError } from "../commongErrorHandler";

/**
 * Fetches the student profile information based on the provided profile ID.
 *
 * @param {string} profileId - The ID of the student profile to fetch.
 * @returns {Object|null} - The student profile data if the request is successful, otherwise null.
 */
export const fetchStudentProfileInformation = async (profileId) => {
  try {
    const response = await privateAxiosInstance.get(
      `/studentprofile/${profileId}/`,
    );

    if (response.status >= 200 && response.status < 300) {
      return response.data;
    }
  } catch (error) {
    handleCommonError(error);
  }
};

/**
 * Updates a specific field in the student profile with the given value.
 *
 * @param {string} profileId - The ID of the student profile to update.
 * @param {string} field - The name of the field to update.
 * @param {any} value - The new value for the field.
 * @returns {Object|null} - The updated profile data if the request is successful, otherwise null.
 */
export const updateProfileInformation = async (profileId, field, value) => {
  try {
    const formData = new FormData();
    formData.append(field, value);

    const response = await privateAxiosInstance.patch(
      `/studentprofile/${profileId}/`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    if (response.status >= 200 && response.status < 301) {
      toast.success("Successfully updated profile.");
      return response.data;
    }
  } catch (error) {
    // Handle errors based on the status code and provide appropriate toast messages
    if (!error.response) {
      toast.error("Network error. Please check your internet connection.");
    } else if (error.response.status === 404) {
      toast.error("Profile not found.");
    } else if (error.response.status === 500) {
      toast.error("Internal server error. Please try again later.");
    } else {
      const errorMessage =
        error.response.data?.detail || "Failed to update profile.";
      toast.error(`Error: ${errorMessage}`);
    }
  }
  return null;
};

// Function to generate initials for the chat profile avatars based on full names.
export const getInitialsService = (fullName) => {
  if (!fullName) return "";
  const names = fullName.split(" ");
  if (names.length < 2) return fullName.charAt(0); // Use the first character if there's only one name.
  const firstInitial = names[0].charAt(0);
  const lastInitial = names[names.length - 1].charAt(0);
  return `${firstInitial}${lastInitial}`; // Concatenate the first and last initials.
};
