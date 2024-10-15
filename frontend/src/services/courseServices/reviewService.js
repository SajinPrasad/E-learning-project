import { toast } from "react-toastify";
import privateAxiosInstance from "../../api/axiosInstance";

/**
 * Creates a new review for a specified course.
 *
 * @param {number} courseId - The ID of the course to which the review belongs.
 * @param {number} reviewRating - The rating assigned to the review (e.g., 1-5 stars).
 * @param {string} reviewText - The textual content of the review.
 *
 * @returns {Promise<object>} A promise that resolves with the newly created review object.
 */
export const createReviewService = async ({
  courseId,
  reviewRating,
  reviewText,
}) => {
  try {
    const response = await privateAxiosInstance.post(
      `/reviews/?course_id=${courseId}`,
      { review_text: reviewText, rating: reviewRating, course: courseId },
    );

    if (response.status >= 200 && response.status <= 301) {
      toast.success("Added new review");
      return response.data;
    }
  } catch (error) {
    // Handle specific errors based on status codes and error messages
    if (error.response) {
      const statusCode = error.response.status;
      const errorMessage =
        error.response.data?.detail ||
        "Something went wrong. Please try again.";

      if (statusCode === 400) {
        toast.error("Invalid input. Please check your review details.");
      } else if (statusCode === 404) {
        toast.error("Course not found.");
      } else if (statusCode === 403) {
        toast.error("You are not enrolled in this course.");
      } else if (statusCode === 500) {
        toast.error("Internal server error. Please try again later.");
      } else {
        toast.error(errorMessage);
      }
    } else if (error.request) {
      toast.error("Network error. Please check your internet connection.");
    } else {
      toast.error("An unexpected error occurred. Please try again.");
    }
    console.log(error); // For logging the complete error object to the console
  }
};

export const getOwnersReviewService = async (courseId) => {
  try {
    const response = await privateAxiosInstance.get(
      `/reviews/?course_id=${courseId}`,
    );

    if (response.status >= 200 && response.status < 300) {
      return response.data;
    }
  } catch (error) {
    // Check if the error is a response from the server
    if (error.response) {
      const statusCode = error.response.status;
      const backendMessage = error.response.data?.detail;

      // Handle errors based on status code
      if (statusCode === 500) {
        toast.error("Internal Server Error. Please try again later.");
      } else {
        // Display backend message if available
        toast.error(backendMessage || "An error occurred. Please try again.");
      }
    } else if (error.request) {
      // If the error is related to network issues
      toast.error("Please check your internet connection.");
    }

    console.error("Error fetching review:", error); // Log the error for debugging
  }
};

/**
 * Updates an existing review.
 *
 * @param {number} reviewId - The ID of the review to be updated.
 * @param {number} courseId - The ID of the course associated with the review.
 * @param {number} reviewRating - The updated review rating (e.g., 1-5 stars).
 * @param {string} reviewText - The updated review text.
 *
 * @returns {Promise<void>} A promise that resolves when the review is successfully updated.
 */
export const updateReviewService = async ({
  reviewId,
  courseId,
  reviewRating,
  reviewText,
}) => {
  try {
    const response = await privateAxiosInstance.patch(
      `/reviews/${reviewId}/?course_id=${courseId}`,
      { review_text: reviewText, rating: reviewRating, course: courseId },
    );

    console.log("Update response: ", response);

    if (response.status >= 200 && response.status <= 301) {
      toast.success("Review updated");
      return response.data;
    }
  } catch (error) {
    // Handle specific errors based on status codes and backend messages
    if (error.response) {
      const statusCode = error.response.status;
      const errorMessage =
        error.response.data?.detail ||
        "Something went wrong. Please try again.";

      if (statusCode === 400) {
        toast.error("Invalid data. Please review your inputs.");
      } else if (statusCode === 404) {
        toast.error("Review or course not found.");
      } else if (statusCode === 403) {
        toast.error("You are not authorized to update this review.");
      } else if (statusCode === 500) {
        toast.error("Internal server error. Please try again later.");
      } else {
        toast.error(errorMessage);
      }
    } else if (error.request) {
      toast.error("Network error. Please check your internet connection.");
    } else {
      toast.error("An unexpected error occurred. Please try again.");
    }

    console.log(error); // Log the error for debugging purposes
  }
};

/**
 * Function to fetch and return the course rating.
 * @param {*} courseId
 * @returns Course rating
 */
export const getAverageCourseRatingService = async (courseId) => {
  try {
    const response = await privateAxiosInstance.get(
      `/review-stats/?course_id=${courseId}`,
    );

    if (response.status >= 200 && response.status < 300) {
      return response.data;
    }
  } catch (error) {
    // Check if the error is a response from the server
    if (error.response) {
      const statusCode = error.response.status;
      const backendMessage = error.response.data?.detail;

      // Handle errors based on status code
      if (statusCode === 500) {
        toast.error("Internal Server Error. Please try again later.");
      } else {
        // Display backend message if available
        toast.error(backendMessage || "An error occurred. Please try again.");
      }
    } else if (error.request) {
      // If the error is related to network issues
      toast.error("Please check your internet connection.");
    }

    console.error("Error fetching review:", error); // Log the error for debugging
  }
};

export const getReviewListService = async (courseId) => {
  try {
    const response = await privateAxiosInstance.get(
      `/review-list/?course_id=${courseId}`,
    );

    if (response.status >= 200 && response.status < 300) {
      return response.data;
    }
  } catch (error) {
    // Check if the error is a response from the server
    if (error.response) {
      const statusCode = error.response.status;
      const backendMessage = error.response.data?.detail;

      // Handle errors based on status code
      if (statusCode === 500) {
        toast.error("Internal Server Error. Please try again later.");
      } else {
        // Display backend message if available
        toast.error(backendMessage || "An error occurred. Please try again.");
      }
    } else if (error.request) {
      // If the error is related to network issues
      toast.error("Please check your internet connection.");
    }

    console.error("Error fetching review:", error); // Log the error for debugging
  }
};
