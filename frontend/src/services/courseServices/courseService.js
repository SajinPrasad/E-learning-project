import { toast } from "react-toastify";
import { privateAxiosInstance } from "../../api/axiosInstance";

// Service for creating courses.
const createCourse = async (courseData) => {
  const {
    courseTitle,
    courseDescription,
    previewImage,
    courseCategory,
    lessons,
    courseRequirement,
    coursePrice,
  } = courseData;

  const formData = new FormData();
  formData.append("title", courseTitle);
  formData.append("description", courseDescription);
  formData.append("category", courseCategory);
  formData.append("preview_image", previewImage);
  formData.append("price_amount", coursePrice);

  // Append lessons as a JSON string
  const lessonsData = lessons.map((lesson, index) => ({
    title: lesson.lessonTitle,
    content: lesson.lessonContent,
    video_url: lesson.lessonVideo,
    order: index + 1,
  }));
  formData.append("lessons", JSON.stringify(lessonsData));

  // Append requirements as a JSON string
  formData.append(
    "requirements",
    JSON.stringify({ description: courseRequirement }),
  );

  console.log("Formdata: ", [...formData.entries()]);

  try {
    const response = await privateAxiosInstance.post("/courses/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    // Check if the response indicates a successful creation of course
    if (response.status >= 200 && response.status < 300) {
      return response.data; // Return the response data including tokens and user information
    } else {
      toast.error("Unexpected error!");
    }
  } catch (error) {
    // Handle errors returned from the server
    if (error.response) {
      if (error.response.data.non_field_errors) {
        toast.error(error.response.data.non_field_errors[0]);
      }
    } else if (error.request) {
      // Handle errors where the server did not respond
      toast.error("An error occurred during course creation.");
    } else {
      console.log(error);
    }
    throw error;
  }
};

// Service for fetching Courses.
const getCourses = async () => {
  try {
    const response = await privateAxiosInstance.get("/courses/");
    if (response.status >= 200 && response.status < 300) {
      return response.data;
    } else {
      toast.error("Error while fetching Courses!");
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

export { createCourse, getCourses };
