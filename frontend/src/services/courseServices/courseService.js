import { toast } from "react-toastify";
import {
  privateAxiosInstance,
  publicAxiosInstance,
} from "../../api/axiosInstance";

const getActiveCourses = async (setIsLoading) => {
  try {
    const response = await publicAxiosInstance.get("/courses/");
    if (response.status >= 200 && response.status < 300) {
      return response.data;
    } else {
      toast.error("Error while fetching Courses!");
    }
  } catch (error) {
    handleError(error);
  } finally {
    setIsLoading(false);
  }
};

// Service for creating courses.
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

// Service for fetching Courses.
const getCourses = async (setIsLoading) => {
  try {
    const response = await privateAxiosInstance.get("/course/");
    if (response.status >= 200 && response.status < 300) {
      return response.data;
    } else {
      toast.error("Error while fetching Courses!");
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

const getCoursesForAuthenticatedUser = async (setIsLoading) => {
  try {
    const response = await privateAxiosInstance.get("courses-authenticated/");
    if (response.status >= 200 && response.status < 300) {
      return response.data;
    } else {
      toast.error("Error while fetching Courses!");
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

/**
 * Fetching the course details only for admins and mentors.
 * Contains additional information like suggestion and status.
 * @param {*} id - Id of the course
 */
const getCourseDetails = async (id) => {
  try {
    const response = await privateAxiosInstance.get(`/course/${id}/`);
    // Check if the response indicates a successful retreval
    if (response.status >= 200 && response.status < 300) {
      return response.data; // Return the response data including tokens and user information
    } else {
      toast.error("Unexpected error!");
    }
  } catch (error) {
    handleError(error);
  }
};

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

const getFullLessonData = async (lessonId, courseId) => {
  try {
    const response = await privateAxiosInstance.get(
      `/lesson/${lessonId}?course_id=${courseId}`,
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

const updateCourse = async (id, field, value) => {
  const formData = new FormData();
  formData.append(field, value);

  try {
    const response = privateAxiosInstance.patch(
      `/course-update/${id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
  } catch (error) {}
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

const getEnrolledCourses = async () => {
  const response = await privateAxiosInstance.get("/enrolledcourses/");
  if (response && response.status >= 200 && response.status < 300) {
    return response.data;
  }
};

const filterCourseWithCategoryService = async (category) => {
  const response = await publicAxiosInstance.get(
    `/course/category/filter/?category=${category}`,
  );
  if (response && response.status >= 200 && response.status < 300) {
    return response.data;
  }
};

const searchCourseService = async (queryParams) => {
  const response = await publicAxiosInstance.get(
    `/course/search/?q=${queryParams}`,
  );
  if (response && response.status >= 200 && response.status < 300) {
    return response.data;
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
};
