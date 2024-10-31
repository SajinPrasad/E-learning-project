import { toast } from "react-toastify";
import {
  privateAxiosInstance,
  publicAxiosInstance,
} from "../../api/axiosInstance";

/**
 * Fetching the active courses for students
 * @param {function} setIsLoading - State for handling loading
 * @returns List - Active Courses
 */
const getActiveCourses = async (setIsLoading, page = 1) => {
  try {
    const response = await publicAxiosInstance.get(`/courses/?page=${page}`);
    if (response.status === 200) {
      return response.data.results;
    }
  } catch (error) {
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
        toast.error("Courses not found");
        break;

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
    console.error("Error fetching courses:", {
      status,
      message: errorMessage,
      error: error,
    });

    return null;
  } finally {
    setIsLoading(false);
  }
};

/**
 * Calling the endpoint to create the course. Passing the necessary data.
 * @param {object} courseData - Object with necessary course data
 * @returns - Created course object
 */
const createCourse = async (courseData) => {
  const {
    courseTitle,
    courseDescription,
    previewImage,
    courseCategory,
    coursePrice,
    courseRequirement,
    lessons,
  } = courseData;

  const formData = new FormData();
  formData.append("title", courseTitle);
  formData.append("description", courseDescription);
  formData.append("category", courseCategory);
  formData.append("preview_image", previewImage);
  formData.append("price_amount", coursePrice);

  formData.append(
    "requirements",
    JSON.stringify({ description: courseRequirement }),
  );

  // Append lessons data, but serialize non-file fields to JSON
  lessons.forEach((lesson, index) => {
    formData.append(`lessons[${index}][title]`, lesson.lessonTitle);
    formData.append(`lessons[${index}][content]`, lesson.lessonContent);
    formData.append(`lessons[${index}][order]`, index + 1);
    formData.append(`lessons[${index}][video_file]`, lesson.lessonVideo);
  });

  try {
    const response = await privateAxiosInstance.post("/course/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (response.status >= 200 && response.status < 300) {
      return response.data; // Return the response data including tokens and user information
    } else {
      toast.error("Unexpected error!");
    }
  } catch (error) {
    if (error.response) {
      if (error.response.data.non_field_errors) {
        toast.error(error.response.data.non_field_errors[0]);
      }
    } else if (error.request) {
      toast.error("An error occurred during course creation.");
    } else {
      console.log(error);
    }
    throw error;
  }
};

/**
 * Fetching the courses for admin and mentor
 * @param {function} setIsLoading - Handling the loading status
 * @returns - Array of fetched courses
 */
const getCourses = async (setIsLoading) => {
  try {
    const response = await privateAxiosInstance.get("/course/");
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
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
        toast.error("Courses not found");
        break;

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
    console.error("Error fetching courses:", {
      status,
      message: errorMessage,
      error: error,
    });

    return null;
  } finally {
    setIsLoading(false);
  }
};

/**
 * Fetching the courses of authenticated users.
 * Avoiding the enrolled courses and fetching rest of the courses.
 * (Enrolled courses are fetched seperately)
 * @param {function} setIsLoading - Handling the loading status
 * @returns - Array of fetched courses
 */
const getCoursesForAuthenticatedUser = async (setIsLoading, page) => {
  try {
    const response = await privateAxiosInstance.get(`/courses-authenticated/?page=${page}`);
    if (response.status === 200) {
      return response.data.results;
    }
  } catch (error) {
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
        toast.error("Courses not found");
        break;

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
    console.error("Error fetching courses:", {
      status,
      message: errorMessage,
      error: error,
    });

    return null;
  } finally {
    setIsLoading(false);
  }
};

/**
 * Fetching the course details only for admins and mentors.
 * Contains additional information like suggestion and status.
 * @param {number} id - Id of the course
 */
const getCourseDetails = async (id) => {
  try {
    const response = await privateAxiosInstance.get(`/course/${id}/`);
    // Check if the response indicates a successful retreval
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
          toast.error(errorMessage || "Invalid search query");
        }
        break;

      case 404:
        toast.error("No courses found matching your search");
        break;

      case 500:
        toast.error("Internal server error. Please try again later.");
        break;

      default:
        if (status >= 500) {
          toast.error("Something went wrong. Please try again later.");
        }
    }

    console.error("Error searching courses:", {
      status,
      message: errorMessage,
      error: error,
    });

    return null;
  }
};

/**
 * Function for validating video.
 * @param {file} file - Video file for validation
 * @param {function} setIsLoading - Function to handle loading status
 */
const validateVideoFile = ({ file, setIsLoading }) => {
  return new Promise((resolve, reject) => {
    setIsLoading(true);

    // Check if file exists
    if (!file) {
      toast.error("No file selected.");
      setIsLoading(false);
      reject("No file selected");
      return;
    }

    // Check file type (MIME type)
    const allowedTypes = ["video/mp4"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Invalid file type. Please select an MP4 video.");
      setIsLoading(false);
      reject("Invalid file type");
      return;
    }

    // Check file size (example: between 100KB and 20MB)
    const minSize = 100 * 1024; // 100KB in bytes
    const maxSize = 20 * 1024 * 1024; // 20MB in bytes
    if (file.size < minSize || file.size > maxSize) {
      toast.error(
        `File size must be between ${minSize / (1024 * 1024)}MB and ${maxSize / (1024 * 1024)}MB.`,
      );
      setIsLoading(false);
      reject("File size out of range");
      return;
    }

    // FileReader to check the file's magic number (first few bytes)
    const reader = new FileReader();
    reader.onloadend = (e) => {
      const arr = new Uint8Array(e.target.result).subarray(0, 8); // Read more bytes for better signature checks
      let header = "";
      for (let i = 0; i < arr.length; i++) {
        header += arr[i].toString(16).padStart(2, "0"); // Ensure hex is padded correctly
      }

      // Validate against known MP4 signatures
      const mp4Signatures = [
        "0000001866747970", // ftyp (18-byte offset)
        "0000002066747970", // ftyp (32-byte offset)
        "66747970", // 'ftyp' box (default)
        // Add more signatures if needed
      ];

      const isValid = mp4Signatures.some((signature) =>
        header.startsWith(signature),
      );
      if (isValid) {
        resolve(file);
      } else {
        reject("Invalid file format");
      }
      setIsLoading(false); // Set loading state to false after validation
    };

    reader.onerror = () => {
      setIsLoading(false);
      reject("Error reading file");
    };

    // Read the first few bytes of the file to check the signature
    reader.readAsArrayBuffer(file.slice(0, 8)); // Read more bytes for better signature checks
  });
};

const getLessonContent = async (lessonId, courseId) => {
  try {
    const response = await privateAxiosInstance.get(
      `/lesson-content/${lessonId}?course_id=${courseId}`,
    );
    // Check if the response indicates a successful retreval
    if (response.status >= 200 && response.status < 300) {
      return response.data; // Return the response data
    } else {
      toast.error("Unexpected error!");
    }
  } catch (error) {
    handleError(error);
  }
};

/**
 * Fetching the complete lesson data, including the video
 * @param {number} lessonId
 * @param {number} courseId
 * @returns - Object with the lesson data
 */
const getFullLessonData = async (lessonId, courseId) => {
  try {
    const response = await privateAxiosInstance.get(
      `/lesson/${lessonId}?course_id=${courseId}`,
    );
    // Check if the response indicates a successful retreval
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
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
        toast.error("Courses not found");
        break;

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
    console.error("Error fetching courses:", {
      status,
      message: errorMessage,
      error: error,
    });

    return null;
  }
};

const updateLessonCompletionStatus = async (courseId, lessonId, status) => {
  try {
    const response = await privateAxiosInstance.patch(
      `/lesson-completion/${lessonId}/?course_id=${courseId}`,
      {
        completed: status,
      },
    );
    if (response.status >= 200 && response.status < 300) {
      return response.data;
    } else {
      return null;
    }
  } catch (error) {
    // Handle specific error cases
    if (error.response) {
      // Server responded with a status other than 2xx
      console.error("error:", error.response.data);
      toast.error(
        `Error: ${error.response.data.detail || "Something went wrong."}`,
      );
    } else if (error.request) {
      toast.error("No response received from server.");
    } else {
      toast.error(`Request error: ${error.message}`);
    }

    return null;
  }
};

/**
 * Sending the necessary data to the endpoint for updating the course.
 * @param {number} id - Course id
 * @param {string} field - Field for updating the course
 * @param {*} value - Can be string or preview image (Any updated data)
 * @returns Updated course object
 */
const updateCourse = async (id, field, value) => {
  const formData = new FormData();
  formData.append(field, value);

  try {
    const response = await privateAxiosInstance.patch(
      `/course-update/${id}/`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    if (response.status >= 200 && response.status < 301) {
      toast.success("Course updated");
      return response.data;
    }
  } catch (error) {}
};

/**
 *Sending the Updated lesson data to the endpoint.
 * @param {number} courseId
 * @param {number} lessonId
 * @param {string} field - Field which is updating eng: contnet, video_file
 * @param {*} value - Updated value of the field
 * @returns - Object with updated lesson
 */
const updateLessonService = async (courseId, lessonId, field, value) => {
  const formData = new FormData();
  formData.append(field, value);

  try {
    const response = await privateAxiosInstance.patch(
      `/lesson/${lessonId}/?course_id=${courseId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    if (response.status >= 200 && response.status < 301) {
      return response.data;
    }
  } catch (error) {
    // Handle errors from the backend or network issues
    if (error.response) {
      // Check for validation errors
      const errors = error.response.data;
      if (errors) {
        // Print all validation error messages
        Object.keys(errors).forEach((key) => {
          errors[key].forEach((errMessage) => {
            toast.error(errMessage);
          });
        });
      } else {
        toast.error(
          error.response.data.detail ||
            "An error occurred while updating the lesson",
        );
      }
    } else if (error.request) {
      // The request was made but no response was received
      toast.error("Network error, please try again later.");
    } else {
      // Something happened in setting up the request
      toast.error("Error: " + error.message);
    }
  }
};

/**
 * Sending new lessons to the endpint for adding new lessons to a course.
 * @param {number} courseId
 * @param {Array} lessons  - Array with newly adding lessons
 * @returns
 */
const addNewLessonsService = async (courseId, lessons) => {
  const formData = new FormData();
  formData.append("course_id", courseId);

  // Appending the lessons to the formdata seperately
  lessons.forEach((lesson, index) => {
    formData.append(`lessons[${index}][title]`, lesson.title);
    formData.append(`lessons[${index}][content]`, lesson.content);
    formData.append(`lessons[${index}][video_file]`, lesson.video_file);
  });

  try {
    const response = await privateAxiosInstance.post(
      `/create-lessons/`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    if (response.status >= 200 && response.status < 301) {
      toast.success("New lessons added");
      return response.data;
    }
  } catch (error) {
    // Check if it's a network error
    if (!error.response) {
      toast.error("Network error: Please check your connection.");
    } else {
      // Backend error
      const backendErrors = error.response.data;

      // Loop through the error object to display each message
      if (backendErrors) {
        for (const [field, messages] of Object.entries(backendErrors)) {
          if (Array.isArray(messages)) {
            messages.forEach((msg) => {
              toast.error(`${field}: ${msg}`);
            });
          } else {
            toast.error(`${field}: ${backendErrors[field]}`);
          }
        }
      } else {
        toast.error("An unexpected error occurred.");
      }
    }
  }
};

/**
 * Function for Updating course status.
 * @param {*} id - Course ID
 * @param {*} newStatus - Updated status of the course (pending, approved, rejected)
 * @returns - Promise
 */
const updateCourseStatus = async (id, newStatus) => {
  const formData = new FormData();
  formData.append("status", newStatus);

  try {
    const response = await privateAxiosInstance.patch(
      `/course-update/${id}/`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    if (response.status >= 200 && response.status < 300) {
      return response.data;
    } else {
      toast.error("Error while updating status!");
      return null;
    }
  } catch (error) {
    console.error("Error in updateCourseStatus:", error);

    // Handle specific error cases
    if (error.response) {
      // Server responded with a status other than 2xx
      console.error("Server responded with error:", error.response.data);
      toast.error(
        `Error: ${error.response.data.detail || "Something went wrong."}`,
      );
    } else if (error.request) {
      // Request was made but no response received
      console.error("No response received:", error.request);
      toast.error("No response received from server.");
    } else {
      // Something else happened in setting up the request
      console.error("Error setting up request:", error.message);
      toast.error(`Request error: ${error.message}`);
    }

    return null;
  }
};

/**
 * Function ot create and update the course suggestions.
 * Only accessed by admins.
 * @param {*} method - The method to execute (put / post)
 * @param {*} suggestion - Object with suggestion data
 * @param {*} courseId - Course ID
 * @returns
 */
const updateCreateCourseSuggestion = async (method, suggestion, courseId) => {
  try {
    let response;

    if (method === "post") {
      response = await privateAxiosInstance.post("/course/suggestions/", {
        suggestion_text: suggestion.suggestion_text,
        course: courseId,
      });
    } else if (method === "put") {
      response = await privateAxiosInstance.put(
        `/course/suggestions/${suggestion.id}/`,
        {
          suggestion_text: suggestion.suggestion_text,
          is_done: suggestion.is_done,
          course: courseId,
        },
      );
    }

    if (response && response.status >= 200 && response.status < 300) {
      toast.success("Successfully updated suggesstion.");
      return response.data;
    } else {
      toast.error("Error while updating suggestion!");
      return null;
    }
  } catch (error) {
    handleError(error);
    return null;
  }
};

/**
 * Function for changing the status of the suggestion.
 * Only accessed by mentors.
 * @param {*} suggestion - Object with suggestion data.
 * @returns
 */
const mentorChangingSuggestionStatus = async (suggestion) => {
  const { id, is_done } = suggestion;
  console.log("Recieved in service: ", suggestion);
  const formData = new FormData();
  formData.append("is_done", is_done.toString());

  if (id) {
    try {
      const response = await privateAxiosInstance.patch(
        `/course/suggestion/${id}/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      if (response && response.status >= 200 && response.status < 300) {
        console.log(response.data);
        if (response.data.is_done) {
          toast.success("Successfully marked the suggestions as done.");
        } else {
          toast.success("Successfully marked the suggestions as not done.");
        }

        return response.data;
      } else {
        toast.error("Error while updating suggestion!");
        return null;
      }
    } catch (error) {
      console.error(
        "Error:",
        error.response ? error.response.data : error.message,
      );
      handleError(error);
      return null;
    }
  } else {
    return;
  }
};

/**
 * Fetching enrolled courses for loginned users.
 * @returns Array of enrolled courses
 */
const getEnrolledCourses = async () => {
  try {
    const response = await privateAxiosInstance.get("/enrolledcourses/");
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

    console.error("Error fetching enrolled courses:", {
      status,
      message: errorMessage,
      error: error,
    });

    return null;
  }
};

/**
 * Sending the selected category to the endpoint to filter the courses based on that
 * @param {string} category - Selected category to filter the courses
 * @returns - Array of filtered courses
 */
const filterCourseWithCategoryService = async (category) => {
  try {
    const response = await publicAxiosInstance.get(
      `/course/category/filter/?category=${category}`,
    );
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
          toast.error(errorMessage || "Invalid category filter");
        }
        break;

      case 404:
        toast.error("No courses found for this category");
        break;

      case 500:
        toast.error("Internal server error. Please try again later.");
        break;

      default:
        if (status >= 500) {
          toast.error("Something went wrong. Please try again later.");
        }
    }

    console.error("Error filtering courses by category:", {
      status,
      message: errorMessage,
      error: error,
      category,
    });

    return null;
  }
};

/**
 * Sending the query params to the endpoint to filter courses based on that
 * @param {string} queryParams
 * @returns - Array of filtered courses based on the queryparams.
 */
const searchCourseService = async (queryParams) => {
  try {
    const response = await publicAxiosInstance.get(
      `/course/search/?q=${queryParams}`,
    );
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
          toast.error(errorMessage || "Invalid search query");
        }
        break;

      case 404:
        toast.error("No courses found matching your search");
        break;

      case 500:
        toast.error("Internal server error. Please try again later.");
        break;

      default:
        if (status >= 500) {
          toast.error("Something went wrong. Please try again later.");
        }
    }

    console.error("Error searching courses:", {
      status,
      message: errorMessage,
      error: error,
      queryParams,
    });

    return null;
  }
};

/**
 * Deleting the course
 * @param {string} courseId
 */
const courseDeleteService = async (courseId) => {
  try {
    const response = await privateAxiosInstance.patch(
      `course-update/${courseId}/`,
      { is_deleted: true },
    );
    if (response.status === 200) {
      toast.success("Course deleted successfully");
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
        toast.error("You don't have permission to delete this course");
        break;

      case 404:
        toast.error("Course not found");
        break;

      case 500:
        toast.error("Internal server error. Please try again later.");
        break;

      default:
        if (status >= 500) {
          toast.error("Something went wrong. Please try again later.");
        }
    }

    console.error("Error deleting course:", {
      status,
      message: errorMessage,
      error: error,
      courseId,
    });

    return null;
  }
};

/**
 * Fetching enrolled courses for loginned users.
 * @returns Array of enrolled courses
 */
const getPopularCourses = async () => {
  try {
    const response = await publicAxiosInstance.get("/popular-courses/");
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

    console.error("Error fetching enrolled courses:", {
      status,
      message: errorMessage,
      error: error,
    });

    return null;
  }
};

// Separate function to handle different error cases
const handleError = (error) => {
  if (error.response) {
    // Server responded with a status other than 2xx
    console.log("Error Response Data: ", error.response.data);
    toast.error(
      error.response.data.detail || "Something went wrong with the request!",
    );
  } else if (error.request) {
    // Request was made, but no response was received
    console.log("Error Request: ", error.request);
    toast.error("No response from the server. Please try again later.");
  } else {
    // Something else happened while setting up the request
    console.log("Error Message: ", error.message);
    toast.error("An unexpected error occurred: " + error.message);
  }
};

export {
  createCourse,
  getCourses,
  getCourseDetails,
  validateVideoFile,
  getLessonContent,
  updateLessonCompletionStatus,
  updateCourse,
  updateCourseStatus,
  updateCreateCourseSuggestion,
  mentorChangingSuggestionStatus,
  getActiveCourses,
  getFullLessonData,
  getEnrolledCourses,
  getCoursesForAuthenticatedUser,
  filterCourseWithCategoryService,
  searchCourseService,
  courseDeleteService,
  updateLessonService,
  addNewLessonsService,
  getPopularCourses,
};
